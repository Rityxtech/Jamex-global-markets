import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useWalletStore } from './walletStore';
import { useTransactionStore } from './transactionStore';
import { useInvestmentStore } from './investmentStore';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
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
        useWalletStore.getState().fetchWallet(session.user.id);
        useTransactionStore.getState().fetchRecentTransactions(session.user.id);
        useInvestmentStore.getState().fetchInvestments(session.user.id);
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user || null, loading: false });
      
      // Handle cache loading and clearing based on auth events
      if (session?.user) {
          useWalletStore.getState().fetchWallet(session.user.id);
          useTransactionStore.getState().fetchRecentTransactions(session.user.id);
          useInvestmentStore.getState().fetchInvestments(session.user.id);
      } else {
          useWalletStore.getState().reset();
          useTransactionStore.getState().reset();
          useInvestmentStore.getState().clearInvestments();
      }
    });

    return () => subscription.unsubscribe();
  }
}));
