import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface ReferredUser {
    id: string;
    referred_id: string;
    status: 'pending' | 'active' | 'inactive';
    created_at: string;
    profiles?: {
        full_name?: string;
        avatar_url?: string;
    };
}

export interface ReferralActivity {
    id: string;
    type: string;
    amount: number;
    status: 'pending' | 'processed';
    created_at: string;
    source_user_id: string | null;
    profiles?: {
        full_name?: string;
    };
}

interface ReferralState {
    referralCode: string | null;
    stats: {
        totalReferrals: number;
        activeInvestors: number;
        commissionsTotal: number;
        pendingCommissions: number;
        thisMonth: number;
    };
    downline: ReferredUser[];
    activity: ReferralActivity[];
    loading: boolean;
    error: string | null;
    fetchReferralData: (userId: string) => Promise<void>;
    setupRealtimeSubscriptions: (userId: string) => void;
    unsubscribe: () => void;
    reset: () => void;
}

export const useReferralStore = create<ReferralState>((set, get) => ({
    referralCode: null,
    stats: {
        totalReferrals: 0,
        activeInvestors: 0,
        commissionsTotal: 0,
        pendingCommissions: 0,
        thisMonth: 0,
    },
    downline: [],
    activity: [],
    loading: false,
    error: null,
    
    fetchReferralData: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            // 1. Fetch Referral Code (assuming stored in user meta_data or a profiles table)
            // For this mock up, we'll generate one if not present
            const code = `ref-${userId.substring(0, 8)}`;
            
            // 2. Fetch Downline (Referrals)
            const { data: referralsData, error: referralsError } = await supabase
                .from('referrals')
                .select(`
                    id, 
                    referred_id, 
                    status, 
                    created_at,
                    profiles:referred_id(full_name, avatar_url)
                `)
                .eq('referrer_id', userId)
                .order('created_at', { ascending: false });

            if (referralsError && referralsError.code !== '42P01') {
                console.error("Error fetching referrals:", referralsError);
            }

            // 3. Fetch Activity/Commissions
            const { data: activityData, error: activityError } = await supabase
                .from('referral_activity')
                .select(`
                    id,
                    type,
                    amount,
                    status,
                    created_at,
                    source_user_id,
                    profiles:source_user_id(full_name)
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(20);

            if (activityError && activityError.code !== '42P01') {
                console.error("Error fetching activity:", activityError);
            }

            const downline = (referralsData as unknown as ReferredUser[]) || [];
            const activity = (activityData as unknown as ReferralActivity[]) || [];

            // Calculate Stats
            const totalReferrals = downline.length;
            const activeInvestors = downline.filter(r => r.status === 'active').length;
            
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const thisMonth = downline.filter(r => {
                const date = new Date(r.created_at);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            }).length;

            const commissionsTotal = activity
                .filter(a => a.status === 'processed')
                .reduce((sum, a) => sum + Number(a.amount), 0);

            const pendingCommissions = activity
                .filter(a => a.status === 'pending')
                .reduce((sum, a) => sum + Number(a.amount), 0);

            set({
                referralCode: code,
                downline,
                activity,
                stats: {
                    totalReferrals,
                    activeInvestors,
                    commissionsTotal,
                    pendingCommissions,
                    thisMonth
                },
                loading: false
            });
            
        } catch (err: any) {
            console.error('Error in fetchReferralData:', err);
            set({ error: err.message, loading: false });
        }
    },

    setupRealtimeSubscriptions: (userId: string) => {
        // Cleanup existing subscriptions first
        get().unsubscribe();

        const channel = supabase.channel(`referrals_${userId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'referrals', filter: `referrer_id=eq.${userId}` },
                () => {
                    // Refetch data on change
                    get().fetchReferralData(userId);
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'referral_activity', filter: `user_id=eq.${userId}` },
                () => {
                    // Refetch data on change
                    get().fetchReferralData(userId);
                }
            )
            .subscribe();

        // Store channel on window for unmounting if needed, or we could store in state
        (window as any).referralChannel = channel;
    },

    unsubscribe: () => {
        if ((window as any).referralChannel) {
            supabase.removeChannel((window as any).referralChannel);
            delete (window as any).referralChannel;
        }
    },

    reset: () => {
        get().unsubscribe();
        set({
            referralCode: null,
            stats: { totalReferrals: 0, activeInvestors: 0, commissionsTotal: 0, pendingCommissions: 0, thisMonth: 0 },
            downline: [],
            activity: [],
            loading: false,
            error: null
        });
    }
}));
