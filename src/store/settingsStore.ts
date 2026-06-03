import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface NotificationPreferences {
    market_execution_email: boolean;
    market_execution_push: boolean;
    wallet_email: boolean;
    wallet_push: boolean;
    security_email: boolean;
    security_push: boolean;
}

export interface UserSettings {
    user_id: string;
    two_factor_enabled: boolean;
    withdrawal_whitelist_enabled: boolean;
    base_currency: string;
    timezone: string;
    date_format: string;
    notification_preferences: NotificationPreferences;
}

interface SettingsState {
    settings: UserSettings | null;
    loading: boolean;
    error: string | null;
    fetchSettings: (userId: string) => Promise<void>;
    updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
    updateNotificationPref: (key: keyof NotificationPreferences, value: boolean) => void;
    setupRealtimeSubscriptions: (userId: string) => void;
    unsubscribe: () => void;
    reset: () => void;
}

// Default settings if none exist
const defaultNotifications: NotificationPreferences = {
    market_execution_email: true,
    market_execution_push: true,
    wallet_email: true,
    wallet_push: false,
    security_email: true,
    security_push: true,
};

const defaultSettings: Partial<UserSettings> = {
    two_factor_enabled: false,
    withdrawal_whitelist_enabled: false,
    base_currency: 'USD - US Dollar',
    timezone: '(GMT -05:00) Eastern Time',
    date_format: 'MM/DD/YYYY',
    notification_preferences: defaultNotifications,
};

// Module-level timeout ID for debouncing writes to Supabase
let saveTimeout: NodeJS.Timeout | null = null;

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: null,
    loading: false,
    error: null,

    fetchSettings: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                throw error;
            }

            if (data) {
                // Merge with default notifications in case new keys were added to the schema
                const mergedNotifications = {
                    ...defaultNotifications,
                    ...(data.notification_preferences || {})
                };
                
                set({ 
                    settings: { 
                        ...data, 
                        notification_preferences: mergedNotifications 
                    } as UserSettings, 
                    loading: false 
                });
            } else {
                // If no row exists, we can still load defaults locally.
                // The trigger usually creates this, but fallback is good.
                set({ 
                    settings: { 
                        user_id: userId, 
                        ...defaultSettings 
                    } as UserSettings, 
                    loading: false 
                });
            }
        } catch (err: any) {
            console.error('Error fetching settings:', err);
            set({ error: err.message, loading: false });
        }
    },

    // A debounced function to sync the current local state to Supabase
    // This maintains "low egress" by batching rapid UI toggles.
    _debouncedSaveToSupabase: () => {
        const state = get().settings;
        if (!state || !state.user_id) return;

        if (saveTimeout) clearTimeout(saveTimeout);
        
        saveTimeout = setTimeout(async () => {
            try {
                const { error } = await supabase
                    .from('user_settings')
                    .upsert({
                        user_id: state.user_id,
                        two_factor_enabled: state.two_factor_enabled,
                        withdrawal_whitelist_enabled: state.withdrawal_whitelist_enabled,
                        base_currency: state.base_currency,
                        timezone: state.timezone,
                        date_format: state.date_format,
                        notification_preferences: state.notification_preferences,
                        updated_at: new Date().toISOString()
                    });

                if (error) throw error;
            } catch (err: any) {
                console.error('Failed to sync settings to server:', err);
                // Optionally handle sync error in state
            }
        }, 1500); // 1.5 second debounce delay
    },

    updateSetting: (key, value) => {
        const { settings } = get();
        if (!settings) return;

        // Optimistic UI update
        set({
            settings: {
                ...settings,
                [key]: value,
            }
        });

        // Trigger debounced save
        (get() as any)._debouncedSaveToSupabase();
    },

    updateNotificationPref: (key, value) => {
        const { settings } = get();
        if (!settings) return;

        // Optimistic UI update for nested JSON
        set({
            settings: {
                ...settings,
                notification_preferences: {
                    ...settings.notification_preferences,
                    [key]: value,
                }
            }
        });

        // Trigger debounced save
        (get() as any)._debouncedSaveToSupabase();
    },

    setupRealtimeSubscriptions: (userId: string) => {
        get().unsubscribe();

        const channel = supabase.channel(`user_settings_${userId}`)
            .on(
                'postgres_changes',
                { 
                    event: 'UPDATE', 
                    schema: 'public', 
                    table: 'user_settings', 
                    filter: `user_id=eq.${userId}` 
                },
                (payload) => {
                    // Update state if changed on server (e.g. from another tab)
                    // We only do this if we don't have a pending local save to avoid reverting optimistic updates
                    if (!saveTimeout) {
                        set({
                            settings: {
                                ...(payload.new as UserSettings),
                                notification_preferences: {
                                    ...defaultNotifications,
                                    ...(payload.new.notification_preferences || {})
                                }
                            }
                        });
                    }
                }
            )
            .subscribe();

        (window as any).settingsChannel = channel;
    },

    unsubscribe: () => {
        if ((window as any).settingsChannel) {
            supabase.removeChannel((window as any).settingsChannel);
            delete (window as any).settingsChannel;
        }
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }
    },

    reset: () => {
        get().unsubscribe();
        set({ settings: null, loading: false, error: null });
    }
}));
