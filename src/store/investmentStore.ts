import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Investment {
  id: string;
  user_id: string;
  plan_name: string;
  amount: number;
  expected_roi: number;
  status: 'pending' | 'active' | 'completed';
  next_payout_date: string | null;
  created_at: string;
}

interface InvestmentState {
  investments: Investment[];
  loading: boolean;
  error: string | null;
  fetchInvestments: (userId: string) => Promise<void>;
  clearInvestments: () => void;
}

export const useInvestmentStore = create<InvestmentState>((set) => ({
  investments: [],
  loading: false,
  error: null,

  fetchInvestments: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      set({ investments: data as Investment[], loading: false });
    } catch (err: any) {
      console.error('Error fetching investments:', err);
      set({ error: err.message, loading: false });
    }
  },

  clearInvestments: () => set({ investments: [], error: null, loading: false }),
}));
