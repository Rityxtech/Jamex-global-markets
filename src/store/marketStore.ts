import { create } from 'zustand';

interface TickerData {
  symbol: string;
  price: number;
  change24h: number; // Percentage change
}

interface MarketState {
  tickers: Record<string, TickerData>;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useMarketStore = create<MarketState>((set, get) => {
  let ws: WebSocket | null = null;

  return {
    tickers: {
      BTCUSDT: { symbol: 'BTCUSDT', price: 64231.50, change24h: 0 },
      ETHUSDT: { symbol: 'ETHUSDT', price: 3452.12, change24h: 0 },
    },
    isConnected: false,

    connect: () => {
      // Prevent multiple connections
      if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
        return;
      }

      // We will track BTC and ETH via Binance's combined stream or individual streams
      ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker/ethusdt@ticker');

      ws.onopen = () => {
        set({ isConnected: true });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Binance individual ticker stream format
          if (data.e === '24hrTicker' && data.s && data.c) {
            set((state) => ({
              tickers: {
                ...state.tickers,
                [data.s]: {
                  symbol: data.s,
                  price: parseFloat(data.c),
                  change24h: parseFloat(data.P) || 0 // P is price change percent
                }
              }
            }));
          }
        } catch (error) {
          console.error("Error parsing websocket message", error);
        }
      };

      ws.onclose = () => {
        set({ isConnected: false });
        ws = null;
        // Reconnect after 5 seconds
        setTimeout(() => get().connect(), 5000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
        ws?.close();
      };
    },

    disconnect: () => {
      if (ws) {
        ws.onclose = null; // Prevent auto-reconnect
        ws.close();
        ws = null;
        set({ isConnected: false });
      }
    }
  };
});
