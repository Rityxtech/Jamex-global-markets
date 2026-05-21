import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Loan {
  id: string;
  user_id: string;
  product_name: string;
  principal: number;
  duration_months: number;
  down_payment: number;
  status: 'pending' | 'active' | 'completed' | 'defaulted';
  created_at: string;
}

export interface LoanRepayment {
  id: string;
  loan_id: string;
  user_id: string;
  due_date: string;
  amount: number;
  principal_part: number;
  interest_part: number;
  status: 'pending' | 'paid';
  auto_pay_enabled: boolean;
}

interface LoanState {
  loans: Loan[];
  repayments: LoanRepayment[];
  loading: boolean;
  error: string | null;
  fetchLoans: (userId: string) => Promise<void>;
  applyForLoan: (userId: string, loanData: Omit<Loan, 'id' | 'user_id' | 'status' | 'created_at'>, repaymentsData: Omit<LoanRepayment, 'id' | 'loan_id' | 'user_id' | 'status' | 'auto_pay_enabled'>[]) => Promise<boolean>;
  toggleAutoPay: (repaymentId: string, currentState: boolean) => Promise<void>;
  clearLoans: () => void;
}

export const useLoanStore = create<LoanState>((set, get) => ({
  loans: [],
  repayments: [],
  loading: false,
  error: null,

  fetchLoans: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data: loansData, error: loansError } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (loansError) throw loansError;

      const { data: repaymentsData, error: repaymentsError } = await supabase
        .from('loan_repayments')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      if (repaymentsError) throw repaymentsError;
      
      set({ loans: loansData as Loan[], repayments: repaymentsData as LoanRepayment[], loading: false });
    } catch (err: any) {
      console.error('Error fetching loans:', err);
      // We will gracefully fail if the table doesn't exist yet by just returning empty
      set({ error: err.message, loading: false });
    }
  },

  applyForLoan: async (userId, loanData, repaymentsData) => {
    set({ loading: true, error: null });
    try {
      const { data: newLoan, error: loanError } = await supabase
        .from('loans')
        .insert([{ ...loanData, user_id: userId, status: 'pending' }])
        .select()
        .single();

      if (loanError) throw loanError;

      const scheduleToInsert = repaymentsData.map(rep => ({
        ...rep,
        loan_id: newLoan.id,
        user_id: userId,
        status: 'pending',
        auto_pay_enabled: false
      }));

      const { error: repError } = await supabase
        .from('loan_repayments')
        .insert(scheduleToInsert);

      if (repError) throw repError;

      // Reload
      await get().fetchLoans(userId);
      return true;
    } catch (err: any) {
      console.error('Error applying for loan:', err);
      set({ error: err.message, loading: false });
      return false;
    }
  },

  toggleAutoPay: async (repaymentId, currentState) => {
    try {
      const { error } = await supabase
        .from('loan_repayments')
        .update({ auto_pay_enabled: !currentState })
        .eq('id', repaymentId);

      if (error) throw error;
      
      // Update local state
      set((state) => ({
        repayments: state.repayments.map(r => 
          r.id === repaymentId ? { ...r, auto_pay_enabled: !currentState } : r
        )
      }));
    } catch (err: any) {
      console.error('Error toggling auto pay:', err);
      set({ error: err.message });
    }
  },

  clearLoans: () => set({ loans: [], repayments: [], error: null, loading: false }),
}));
