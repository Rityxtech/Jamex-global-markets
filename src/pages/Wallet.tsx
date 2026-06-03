import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWalletStore } from '../store/walletStore';
import { useTransactionStore } from '../store/transactionStore';
import { supabase } from '../lib/supabase';

const ASSET_LABEL: Record<string, string> = {
    usdt: 'USDT TRC20',
    eth:  'ETH ERC20',
    btc:  'Bitcoin',
};

export default function Wallet() {
  const navigate = useNavigate();
  const { mainBalance, profitBalance } = useWalletStore();
  const { transactions, fetchRecentTransactions } = useTransactionStore();

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  /* Deposit state */
  const [selectedAsset, setSelectedAsset] = useState('usdt');
  const [addresses, setAddresses] = useState({ usdt: '', eth: '', btc: '' });
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [depositSubmitting, setDepositSubmitting] = useState(false);
  const [depositMessage, setDepositMessage] = useState('');

  useEffect(() => {
    supabase.from('platform_config').select('deposit_address_usdt, deposit_address_eth, deposit_address_btc').eq('id', 1).single().then(({ data }) => {
      if (data) {
        setAddresses({
          usdt: data.deposit_address_usdt || '',
          eth:  data.deposit_address_eth  || '',
          btc:  data.deposit_address_btc  || '',
        });
      }
    });
  }, []);

  const activeAddress = addresses[selectedAsset as 'usdt' | 'eth' | 'btc'];

  function handleCopy() {
    if (!activeAddress) return;
    try { navigator.clipboard.writeText(activeAddress); } catch (e) {
      const ta = document.createElement('textarea'); ta.value = activeAddress; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  async function handleConfirmDeposit() {
    const hash = txHash.trim();
    if (!hash) { setDepositMessage('Please enter the transaction hash.'); return; }
    if (!activeAddress) { setDepositMessage('Deposit address not configured. Contact support.'); return; }
    setDepositSubmitting(true);
    setDepositMessage('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'deposit',
        asset: selectedAsset.toUpperCase(),
        amount: 0,
        status: 'pending',
        destination_address: `TXID: ${hash}`,
      });
      if (error) throw error;
      setDepositMessage('success');
      setTxHash('');
      fetchRecentTransactions(user.id);
      setTimeout(() => setDepositMessage(''), 4000);
    } catch (err: any) {
      setDepositMessage(err.message || 'Failed to submit deposit report.');
    } finally {
      setDepositSubmitting(false);
    }
  }

  return (
    <div className="p-2.5 md:p-margin-desktop space-y-2.5 md:space-y-gutter max-w-[1600px] mx-auto w-full">
          {/* Wallet Split Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 md:gap-gutter">
            {/* Main Wallet */}
            <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/20 relative group/main min-h-[112px] md:min-h-[180px] flex flex-col justify-between">
              {/* Glow background and Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface-container-low/50 to-surface-container-low opacity-60"></div>
              <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12 group-hover/main:animate-shimmer pointer-events-none"></div>
              
              {/* Sparkline background across the bottom */}
              <div className="absolute inset-x-0 bottom-0 h-[60%] opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="mainSparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M0,35 Q15,30 30,20 T60,25 T90,5 T100,2" 
                    fill="none" 
                    stroke="#2563eb" 
                    strokeWidth="1.5" 
                    className="animate-spark-draw"
                  />
                  <path 
                    d="M0,35 Q15,30 30,20 T60,25 T90,5 T100,2 L100,40 L0,40 Z" 
                    fill="url(#mainSparkGrad)"
                  />
                </svg>
              </div>

              {/* Header */}
              <div className="bg-surface-container-high/40 px-2 py-1.5 md:px-card-padding md:py-3.5 border-b border-outline-variant/10 flex justify-between items-center relative z-10">
                <span className="text-[11px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                  Main Wallet Balance
                </span>
                <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              </div>

              {/* Content */}
              <div className="p-2 md:p-card-padding flex-1 flex flex-col justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl md:text-display-md font-extrabold text-on-surface tracking-tight font-tabular-nums group-hover/main:text-primary transition-colors">{formatCurrency(mainBalance)}</span>
                  </div>
                  <p className="text-xs md:text-sm text-on-surface-variant/90 font-semibold leading-relaxed">Available for instant spot trading, margin, and copy allocation.</p>
                </div>
                
                <div className="mt-1.5 flex items-center justify-between border-t border-outline-variant/5 pt-1">
                  <div className="flex items-center gap-1.5 text-tertiary text-[10px] md:text-label-sm font-bold">
                    <span className="material-symbols-outlined text-[14px] md:text-[16px]">trending_up</span>
                    <span>+1.24% today</span>
                  </div>
                  <span className="text-[8px] md:text-[9px] font-mono text-on-surface-variant/60">ID: WM-9402-MAIN</span>
                </div>
              </div>
            </div>

            {/* Profit Wallet */}
            <div className="glass-panel rounded-xl overflow-hidden border border-primary/30 relative group/profit min-h-[112px] md:min-h-[180px] flex flex-col justify-between">
              {/* Glow background and Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-tertiary/10 via-surface-container-low/50 to-surface-container-low opacity-60"></div>
              <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12 group-hover/profit:animate-shimmer pointer-events-none"></div>
              
              {/* Sparkline background across the bottom */}
              <div className="absolute inset-x-0 bottom-0 h-[60%] opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="profitSparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M0,38 Q25,35 50,18 T80,20 T100,5" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="1.5" 
                    className="animate-spark-draw"
                  />
                  <path 
                    d="M0,38 Q25,35 50,18 T80,20 T100,5 L100,40 L0,40 Z" 
                    fill="url(#profitSparkGrad)"
                  />
                </svg>
              </div>

              {/* Header */}
              <div className="bg-primary-container/10 px-2 py-1.5 md:px-card-padding md:py-3.5 border-b border-outline-variant/10 flex justify-between items-center relative z-10">
                <span className="text-[11px] md:text-label-sm font-bold text-tertiary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
                  Profit Wallet Balance
                </span>
                <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              </div>

              {/* Content */}
              <div className="p-2 md:p-card-padding flex-1 flex flex-col justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl md:text-display-md font-extrabold text-on-surface tracking-tight font-tabular-nums group-hover/profit:text-tertiary transition-colors">{formatCurrency(profitBalance)}</span>
                  </div>
                  <p className="text-xs md:text-sm text-on-surface-variant/90 font-semibold leading-relaxed">Accumulated yield payments. Ready to compound or withdraw.</p>
                </div>
                
                <div className="mt-1.5 flex items-center justify-between border-t border-outline-variant/5 pt-1">
                  <div className="flex items-center gap-2 text-on-surface-variant text-[10px] md:text-label-sm font-semibold">
                    <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                    <span>Locked for withdrawal: $0.00</span>
                  </div>
                  <span className="text-[8px] md:text-[9px] font-mono text-on-surface-variant/60">ID: WP-4902-YLD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Interface Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 md:gap-gutter">
            {/* Deposit Interface */}
            <div className="glass-panel rounded-xl flex flex-col border border-outline-variant/20">
              <div className="bg-surface-container-high/40 px-2 py-1.5 md:px-card-padding md:py-3.5 border-b border-outline-variant/10">
                <h3 className="text-sm md:text-label-md text-on-surface font-bold tracking-wide">Deposit Funds</h3>
              </div>
              <div className="p-2 md:p-card-padding flex flex-col md:flex-row gap-2 md:gap-6">
                <div className="space-y-1.5 md:space-y-4 flex-1">
                  <div>
                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant mb-1.5 md:mb-2 block uppercase tracking-wide">Select Asset</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'btc', label: 'BTC', src: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg' },
                        { key: 'eth', label: 'ETH', src: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg' },
                        { key: 'usdt', label: 'USDT', src: 'https://cryptologos.cc/logos/tether-usdt-logo.svg' },
                      ].map(a => {
                        const isActive = selectedAsset === a.key;
                        return (
                          <button
                            key={a.key}
                            onClick={() => setSelectedAsset(a.key)}
                            className={`cursor-pointer rounded-lg py-1.5 flex flex-col items-center gap-1 transition-all ${isActive ? 'border border-primary bg-primary/10' : 'border border-outline-variant hover:border-primary bg-surface-container-low'}`}
                          >
                            <img alt={a.label} className="w-5 h-5 md:w-6 md:h-6" src={a.src} />
                            <span className={`text-[10px] md:text-label-sm font-bold ${isActive ? 'text-primary' : 'text-on-surface'}`}>{a.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant mb-1.5 md:mb-2 block uppercase tracking-wide">TXID Hash Submission</label>
                    <input
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm md:text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Enter transaction hash..."
                      type="text"
                    />
                  </div>
                  {depositMessage === 'success' ? (
                    <div className="bg-tertiary/10 border border-tertiary/20 p-2.5 rounded-lg flex items-start gap-2">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                      <div>
                        <p className="text-xs font-bold text-tertiary">Deposit report submitted!</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">We will confirm the transaction as soon as possible and credit your wallet.</p>
                      </div>
                    </div>
                  ) : depositMessage ? (
                    <div className="bg-error/10 border border-error/20 p-2 rounded-lg text-xs text-error font-medium">{depositMessage}</div>
                  ) : null}
                  <button
                    onClick={handleConfirmDeposit}
                    disabled={depositSubmitting}
                    className="cursor-pointer w-full bg-primary text-on-primary py-2.5 rounded-lg text-sm md:text-label-md font-bold hover:brightness-110 active:scale-[0.98] transition-all mt-1 shadow-sm shadow-primary/20 disabled:opacity-50"
                  >
                    {depositSubmitting ? 'Submitting...' : 'Confirm Deposit'}
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center p-1.5 md:p-4 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant mt-1.5 md:mt-0">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    {activeAddress ? (
                      <img
                        alt="Deposit QR Code"
                        className="w-20 h-20 md:w-24 md:h-24"
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=6&data=${encodeURIComponent(activeAddress)}`}
                      />
                    ) : (
                      <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-outline/40">
                        <span className="material-symbols-outlined text-[32px]">qr_code_2</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] md:text-xs font-tabular-nums text-on-surface-variant mt-2 break-all text-center max-w-[140px] bg-surface-container-highest px-2 py-1 rounded">
                    {activeAddress ? `${activeAddress.substring(0,10)}…${activeAddress.slice(-6)}` : 'Not configured'}
                  </p>
                  <button
                    onClick={handleCopy}
                    disabled={!activeAddress}
                    className="cursor-pointer mt-1.5 text-primary text-[10px] md:text-label-sm font-bold hover:underline disabled:opacity-40 disabled:no-underline"
                  >
                    {copied ? 'Copied!' : 'Copy Address'}
                  </button>
                </div>
              </div>
            </div>

            {/* Withdrawal Interface */}
            <div className="glass-panel rounded-xl flex flex-col border border-outline-variant/20">
              <div className="bg-surface-container-high/40 px-2.5 py-2 md:px-card-padding md:py-3.5 border-b border-outline-variant/10">
                <h3 className="text-sm md:text-label-md text-on-surface font-bold tracking-wide">Secure Withdrawal</h3>
              </div>
              <div className="p-2.5 md:p-card-padding space-y-2.5 md:space-y-4">
                <div className="grid grid-cols-2 gap-2.5 md:gap-4">
                  <div>
                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant mb-1.5 md:mb-2 block uppercase tracking-wide">Amount (USD)</label>
                    <div className="relative">
                      <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg pl-3 pr-10 py-2 text-sm md:text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="0.00" type="number" />
                      <span className="absolute right-2 top-2 md:top-2.5 text-[10px] md:text-label-sm font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded cursor-pointer">MAX</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant mb-1.5 md:mb-2 block uppercase tracking-wide">2FA Prompt</label>
                    <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm md:text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="6-digit code" type="text" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant mb-1.5 md:mb-2 block uppercase tracking-wide">Destination Wallet Address</label>
                  <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm md:text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Paste address here..." type="text" />
                </div>
                <div className="bg-error-container/10 border border-error/20 p-2 md:p-3 rounded-lg flex gap-2 md:gap-3 items-start">
                  <span className="material-symbols-outlined text-error text-[16px] md:text-xl mt-0.5">warning</span>
                  <p className="text-[10px] md:text-xs font-medium text-error/90 leading-tight">Ensure the destination address is correct. Assets sent to wrong addresses cannot be recovered.</p>
                </div>
                <button className="cursor-pointer w-full border border-outline-variant/50 bg-surface-container-low text-on-surface py-2.5 rounded-lg text-sm md:text-label-md font-bold hover:bg-surface-variant/50 active:scale-[0.98] transition-all">
                  Initiate Withdrawal
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transactions Table */}
          <section className="glass-panel rounded-xl overflow-hidden border border-outline-variant/20">
            <div className="bg-surface-container-high/40 px-2.5 py-2 md:px-card-padding md:py-3.5 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-[11px] md:text-label-md text-on-surface font-bold tracking-wide uppercase">Recent Transactions</h3>
              <button className="cursor-pointer text-primary text-[10px] md:text-label-sm font-bold hover:underline">Export CSV</button>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container-highest/20 border-b border-outline-variant/10">
                    <th className="px-2.5 py-2 md:px-card-padding md:py-3 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Transaction ID</th>
                    <th className="px-2.5 py-2 md:px-card-padding md:py-3 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
                    <th className="px-2.5 py-2 md:px-card-padding md:py-3 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Type</th>
                    <th className="px-2.5 py-2 md:px-card-padding md:py-3 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                    <th className="px-2.5 py-2 md:px-card-padding md:py-3 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm md:text-body-md divide-y divide-outline-variant/5">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-2.5 py-4 md:px-card-padding md:py-8 text-center text-on-surface-variant font-medium text-xs md:text-sm">
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    transactions.slice(0, 5).map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-2.5 py-2 md:px-card-padding md:py-3 font-tabular-nums text-xs md:text-sm text-on-surface-variant">#TX-{tx.id.substring(0, 8).toUpperCase()}</td>
                        <td className="px-2.5 py-2 md:px-card-padding md:py-3 text-xs md:text-sm text-on-surface-variant">{new Date(tx.created_at).toLocaleString()}</td>
                        <td className="px-2.5 py-2 md:px-card-padding md:py-3">
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <span className={`material-symbols-outlined text-[14px] md:text-sm ${
                              tx.type === 'deposit' || tx.type === 'profit' ? 'text-tertiary' : 'text-primary'
                            }`}>{tx.type === 'deposit' || tx.type === 'profit' ? 'download' : 'upload'}</span>
                            <span className="text-xs md:text-sm font-medium text-on-surface capitalize">{tx.type}</span>
                          </div>
                        </td>
                        <td className={`px-2.5 py-2 md:px-card-padding md:py-3 text-right font-tabular-nums font-bold text-xs md:text-sm ${
                          tx.type === 'deposit' || tx.type === 'profit' ? 'text-tertiary' : 'text-on-surface'
                        }`}>
                          {tx.type === 'deposit' || tx.type === 'profit' ? '+' : '-'}{formatCurrency(tx.amount)} {tx.asset}
                        </td>
                        <td className="px-2.5 py-2 md:px-card-padding md:py-3 text-center">
                          {tx.status === 'completed' ? (
                            <span className="bg-tertiary-container/20 text-tertiary px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-tertiary/20">Completed</span>
                          ) : tx.status === 'failed' ? (
                            <span className="bg-error-container/20 text-error px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-error/20">Failed</span>
                          ) : (
                            <span className="bg-primary-container/20 text-primary px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-primary/20">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-2.5 py-2 md:px-card-padding md:py-3 bg-surface-container-lowest/50 border-t border-outline-variant/10 flex justify-between items-center">
              <span className="text-[10px] md:text-xs text-on-surface-variant">Showing {Math.min(transactions.length, 5)} of {transactions.length} transactions</span>
              <div className="flex gap-1 md:gap-2">
                <button className="cursor-pointer p-0.5 md:p-1 hover:bg-surface-variant/30 rounded border border-outline-variant/30 disabled:opacity-50 transition-colors" disabled>
                  <span className="material-symbols-outlined text-[16px] md:text-sm">chevron_left</span>
                </button>
                <button className="cursor-pointer p-0.5 md:p-1 hover:bg-surface-variant/30 rounded border border-outline-variant/30 transition-colors">
                  <span className="material-symbols-outlined text-[16px] md:text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
          <style>{`
            @keyframes spark-draw {
              from { stroke-dashoffset: 150; }
              to { stroke-dashoffset: 0; }
            }
            .animate-spark-draw {
              stroke-dasharray: 150;
              stroke-dashoffset: 150;
              animation: spark-draw 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            @keyframes shimmer {
              100% { left: 150%; }
            }
            .animate-shimmer {
              animation: shimmer 1.8s ease-in-out infinite;
            }
          `}</style>
    </div>
  );
}
