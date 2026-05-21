import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface WalletState {
    mainBalance: number;
    profitBalance: number;
    isLoading: boolean;
    hasFetched: boolean; // Flag to prevent multiple fetches
    fetchWallet: (userId: string) => Promise<void>;
    reset: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
    mainBalance: 0,
    profitBalance: 0,
    isLoading: false,
    hasFetched: false,

    fetchWallet: async (userId: string) => {
        // LOW EGRESS ENFORCEMENT: If already fetched, do not hit database again
        if (get().hasFetched) return;

        set({ isLoading: true });
        try {
            // SURGICAL QUERY: Only fetching the exact numeric values needed, no extra columns
            const { data, error } = await supabase
                .from('wallets')
                .select('main_balance, profit_balance')
                .eq('user_id', userId)
                .single();

            if (error) {
                console.error("Error fetching wallet:", error.message);
                set({ isLoading: false });
                return;
            }

            if (data) {
                set({ 
                    mainBalance: Number(data.main_balance) || 0,
                    profitBalance: Number(data.profit_balance) || 0,
                    hasFetched: true,
                    isLoading: false
                });
            }
        } catch (err) {
            console.error("Unexpected error fetching wallet", err);
            set({ isLoading: false });
        }
    },

    reset: () => set({ mainBalance: 0, profitBalance: 0, hasFetched: false, isLoading: false })
}));
