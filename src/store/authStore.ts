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
  isAdmin: () => boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,
  isAdmin: () => get().profile?.is_admin || false,
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
    // LOW EGRESS: Clear cache on sign out
    useWalletStore.getState().reset();
    useTransactionStore.getState().reset();
    useInvestmentStore.getState().clearInvestments();
  },
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user || null, loading: false });
    
    // Trigger initial fetch if logged in
    if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        set({ profile });

        useWalletStore.getState().fetchWallet(session.user.id);
        useTransactionStore.getState().fetchRecentTransactions(session.user.id);
        useInvestmentStore.getState().fetchInvestments(session.user.id);
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session, user: session?.user || null, loading: false });
      
      // Handle cache loading and clearing based on auth events
      if (session?.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          set({ profile });

          useWalletStore.getState().fetchWallet(session.user.id);
          useTransactionStore.getState().fetchRecentTransactions(session.user.id);
          useInvestmentStore.getState().fetchInvestments(session.user.id);
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
