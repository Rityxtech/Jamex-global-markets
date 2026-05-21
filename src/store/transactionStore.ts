import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Transaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'transfer' | 'profit';
    amount: number;
    asset: string;
    status: 'pending' | 'completed' | 'failed';
    destination_address: string | null;
    created_at: string;
}

interface TransactionState {
    transactions: Transaction[];
    isLoading: boolean;
    hasFetched: boolean;
    fetchRecentTransactions: (userId: string) => Promise<void>;
    reset: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [],
    isLoading: false,
    hasFetched: false,

    fetchRecentTransactions: async (userId: string) => {
        // LOW EGRESS ENFORCEMENT: Fetch strictly once per session to save bandwidth
        if (get().hasFetched) return;

        set({ isLoading: true });
        try {
            // EGRESS CONTROL: Limit to last 10 records. Pagination can be added later if needed.
            const { data, error } = await supabase
                .from('transactions')
                .select('id, type, amount, asset, status, destination_address, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                console.error("Error fetching transactions:", error.message);
                set({ isLoading: false });
                return;
            }

            if (data) {
                set({ 
                    transactions: data as Transaction[], 
                    hasFetched: true,
                    isLoading: false
                });
            }
        } catch (err) {
            console.error("Unexpected error fetching transactions", err);
            set({ isLoading: false });
        }
    },

    reset: () => set({ transactions: [], hasFetched: false, isLoading: false })
}));
