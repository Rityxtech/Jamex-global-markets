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
    try {
      // 5-second timeout so a hanging network request doesn't block logout
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('signOut timeout')), 5000)
      );
      await Promise.race([signOutPromise, timeoutPromise]);
    } catch (err) {
      console.warn('supabase.auth.signOut() failed or timed out, clearing local state anyway:', err);
    }
    set({ session: null, user: null, profile: null, authError: null });
    // LOW EGRESS: Clear cache on sign out
    useWalletStore.getState().reset();
    useTransactionStore.getState().reset();
    useInvestmentStore.getState().clearInvestments();
  },
  checkProfileStatus: async (userId: string) => {
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    
    if (!profile) {
      // Auto-create missing profile
      const user = get().user || (await supabase.auth.getUser()).data.user;
      if (!user) return null;
      
      const meta = user.user_metadata || {};
      const newProfile = {
        id: userId,
        email: user.email,
        full_name: meta.full_name || user.email?.split('@')[0] || 'User',
        avatar_url: meta.avatar_url || null,
        referral_code: 'ref-' + userId.replace(/-/g, '').substring(0, 8).toUpperCase(),
        account_status: 'active',
        is_admin: user.email?.toLowerCase() === 'admin@jamexglobalmarkets.com'
      };

      await supabase.from('profiles').upsert([newProfile], { onConflict: 'id' }).select().single();
      await supabase.from('wallets').insert([{ user_id: userId }]).select().maybeSingle();
      await supabase.from('user_settings').insert([{ user_id: userId }]).select().maybeSingle();

      return newProfile;
    }

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
    set({ loading: true });
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user || null });

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
    set({ loading: false });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ loading: true });
      set({ session, user: session?.user || null });

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
      set({ loading: false });
    });

    // We can't return the unsubscribe function directly from an async function in zustand, 
    // it expects Promise<void>. We just rely on the listener staying active for the app lifecycle.
  }
}));
