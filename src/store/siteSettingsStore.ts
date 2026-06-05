import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const LS_KEY = 'jamex_site_settings';
const DEFAULT_NAME = 'Jamex Global Markets';
const DEFAULT_SHORT = 'Jamex Global';

interface SiteSettings {
  siteName: string;
  siteShortName: string;
  siteLogoUrl: string;
  loading: boolean;
  initialized: boolean;
  setSiteName: (name: string) => void;
  setSiteLogoUrl: (url: string) => void;
  fetchSettings: () => Promise<void>;
  subscribe: () => () => void;
}

function loadFromLocal(): { siteName: string; siteLogoUrl: string } {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        siteName: parsed.siteName || DEFAULT_NAME,
        siteLogoUrl: parsed.siteLogoUrl || '',
      };
    }
  } catch { /* ignore */ }
  return { siteName: DEFAULT_NAME, siteLogoUrl: '' };
}

function saveToLocal(name: string, logo: string) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ siteName: name, siteLogoUrl: logo }));
  } catch { /* ignore */ }
}

function deriveShortName(full: string): string {
  const parts = full.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0]} ${parts[1]}`;
  return full;
}

const initial = loadFromLocal();

export const useSiteSettingsStore = create<SiteSettings>((set, get) => ({
  siteName: initial.siteName,
  siteShortName: deriveShortName(initial.siteName),
  siteLogoUrl: initial.siteLogoUrl,
  loading: false,
  initialized: false,

  setSiteName: (name: string) => {
    const short = deriveShortName(name);
    set({ siteName: name, siteShortName: short });
    saveToLocal(name, get().siteLogoUrl);
  },

  setSiteLogoUrl: (url: string) => {
    set({ siteLogoUrl: url });
    saveToLocal(get().siteName, url);
  },

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('platform_config')
        .select('site_name, site_logo_url')
        .eq('id', 1)
        .single();

      if (data && !error) {
        const name = data.site_name || DEFAULT_NAME;
        const logo = data.site_logo_url || '';
        set({
          siteName: name,
          siteShortName: deriveShortName(name),
          siteLogoUrl: logo,
          loading: false,
          initialized: true,
        });
        saveToLocal(name, logo);
      } else {
        set({ loading: false, initialized: true });
      }
    } catch {
      set({ loading: false, initialized: true });
    }
  },

  subscribe: () => {
    const channel = supabase
      .channel('site_settings_rt')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'platform_config', filter: 'id=eq.1' },
        (payload) => {
          const newRow = payload.new as Record<string, unknown>;
          if (newRow) {
            const name = (newRow.site_name as string) || DEFAULT_NAME;
            const logo = (newRow.site_logo_url as string) || '';
            set({
              siteName: name,
              siteShortName: deriveShortName(name),
              siteLogoUrl: logo,
            });
            saveToLocal(name, logo);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  },
}));
