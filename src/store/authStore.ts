import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useWalletStore } from './walletStore';
import { useTransactionStore } from './transactionStore';
import { useInvestmentStore } from './investmentStore';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  authError: string | null;
  isAdmin: () => boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  checkProfileStatus: (userId: string) => Promise<any | false>;
  ensureSuperAdmin: (user: User, existingProfile: any) => Promise<any | null>;
  syncOAuthProfile: (user: User, existingProfile: any) => Promise<any | null>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,
  authError: null,
  isAdmin: () => get().profile?.is_admin || false,
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setAuthError: (authError) => set({ authError }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null, authError: null });
    // LOW EGRESS: Clear cache on sign out
    useWalletStore.getState().reset();
    useTransactionStore.getState().reset();
    useInvestmentStore.getState().clearInvestments();
  },
  checkProfileStatus: async (userId: string) => {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (profile && profile.account_status === 'suspended') {
      await supabase.auth.signOut();
      set({ session: null, user: null, profile: null, authError: 'Your account has been suspended. Please contact support.', loading: false });
      return false;
    }
    if (profile && profile.account_status === 'blocked') {
      await supabase.auth.signOut();
      set({ session: null, user: null, profile: null, authError: 'Your account has been permanently blocked. Access denied.', loading: false });
      return false;
    }
    return profile;
  },
  ensureSuperAdmin: async (user: User, existingProfile: any) => {
    if (user.email?.toLowerCase() !== 'admin@jamexglobalmarkets.com') return existingProfile;
    if (existingProfile?.is_admin) return existingProfile;
    const { data: updated, error } = await supabase.from('profiles').update({ is_admin: true }).eq('id', user.id).select().single();
    if (error) { console.error('Super admin enforce failed:', error); return existingProfile; }
    return updated || existingProfile;
  },
  syncOAuthProfile: async (user: User, existingProfile: any) => {
    const meta = user.user_metadata || {};
    const googleName = meta.full_name;
    const googleAvatar = meta.avatar_url;
    if (!googleName && !googleAvatar) return null;

    const updates: any = {};
    if (!existingProfile?.full_name && googleName) updates.full_name = googleName;
    if (!existingProfile?.avatar_url && googleAvatar) updates.avatar_url = googleAvatar;

    if (Object.keys(updates).length === 0) return null;

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to sync OAuth profile:', error);
      return null;
    }
    return updatedProfile;
  },
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user || null, loading: false });

    // Trigger initial fetch if logged in
    if (session?.user) {
      const profile = await get().checkProfileStatus(session.user.id);
      if (profile) {
        const synced = await get().syncOAuthProfile(session.user, profile);
        const enforced = await get().ensureSuperAdmin(session.user, synced || profile);
        set({ profile: enforced });
        useWalletStore.getState().fetchWallet(session.user.id);
        useTransactionStore.getState().fetchRecentTransactions(session.user.id);
        useInvestmentStore.getState().fetchInvestments(session.user.id);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session, user: session?.user || null, loading: false });

      // Handle cache loading and clearing based on auth events
      if (session?.user) {
        const profile = await get().checkProfileStatus(session.user.id);
        if (profile) {
          const synced = await get().syncOAuthProfile(session.user, profile);
          const enforced = await get().ensureSuperAdmin(session.user, synced || profile);
          set({ profile: enforced });
          useWalletStore.getState().fetchWallet(session.user.id);
          useTransactionStore.getState().fetchRecentTransactions(session.user.id);
          useInvestmentStore.getState().fetchInvestments(session.user.id);
        }
      } else {
        set({ profile: null });
        useWalletStore.getState().reset();
        useTransactionStore.getState().reset();
        useInvestmentStore.getState().clearInvestments();
      }
    });

    // We can't return the unsubscribe function directly from an async function in zustand, 
    // it expects Promise<void>. We just rely on the listener staying active for the app lifecycle.
  }
}));
