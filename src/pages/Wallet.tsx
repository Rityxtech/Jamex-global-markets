import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Wallet() {
  const navigate = useNavigate();

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
                    <span className="text-2xl sm:text-3xl md:text-display-md font-extrabold text-on-surface tracking-tight font-tabular-nums group-hover/main:text-primary transition-colors">245,680.00</span>
                    <span className="text-sm md:text-headline-sm font-bold text-primary/75">USD</span>
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
                    <span className="text-2xl sm:text-3xl md:text-display-md font-extrabold text-on-surface tracking-tight font-tabular-nums group-hover/profit:text-tertiary transition-colors">12,430.50</span>
                    <span className="text-sm md:text-headline-sm font-bold text-tertiary/75">USD</span>
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
                      <button className="cursor-pointer border border-primary bg-primary/10 rounded-lg py-1.5 flex flex-col items-center gap-1 transition-all">
                        <img alt="BTC" className="w-5 h-5 md:w-6 md:h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWSzDqxX9xuzk5baLDM7Fh5VpFBPjITgGKoYNxbhWRmSP1t41iVePsTLxrVKPEoxEuAPFo5Q54jIjidBRnzogkTMyeek-i0BNBcVA-FvoWrAHAVCjle50noKAFUzhlUUrKpeV2DygAHcaNnPvGctTUxkSt_ruHuvCkLbRVFY3dUiHxzH-mt5Sms6CqRZsVaDMUa0TsV22Aw5hBIONnPSq0h4L-xu951VMAx_JikDapcoNftx8OemuyjosX_kB80NIBOUmY8IjRf4Kf" />
                        <span className="text-[10px] md:text-label-sm font-bold">BTC</span>
                      </button>
                      <button className="cursor-pointer border border-outline-variant hover:border-primary rounded-lg py-1.5 flex flex-col items-center gap-1 transition-all bg-surface-container-low">
                        <img alt="ETH" className="w-5 h-5 md:w-6 md:h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvmpvf1JkYXofTYNBRdN5Mfv7TfGAQtedeyZlPi6O32733-Qz32fC4cJguX2h9nAop_wo9u_6DUyjSigS7K0SacCWNCuz7HFwYYhdSWAS61KoTfrNfJ7vjbOygUjnEysJJKkIGOHDhUlTI9feiKyyxo8x4VZowppUlOwYdTOXmIVS6sXUPcO_V1ViVzHcIZxPRdV_xlj_PRD6Zg7lz42VTFnC-UD7Z5OUh2XNkb7YxESrzZ7T-VYwQcWokcCTQpzPZ0DG1Ux-dvk07" />
                        <span className="text-[10px] md:text-label-sm font-bold">ETH</span>
                      </button>
                      <button className="cursor-pointer border border-outline-variant hover:border-primary rounded-lg py-1.5 flex flex-col items-center gap-1 transition-all bg-surface-container-low">
                        <img alt="USDT" className="w-5 h-5 md:w-6 md:h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkdr_eIehC8H090wsE1OaYFTqDALeFegJpnxFrs6kyPcI82wrcUWoDPJLr3HivsXHiPNKeixPTPJLxhraPSPquFLuhdERigsw8Dv_zwVNMEvD5SqTIdcg7sgmVBDFY15Kh1DOGO5IPM9kz238OCU7HPYCcfx2g2vsTkbk_5zjD1TxggVN5clx9laiW2nnBeLwxxQW5C7RQDLs5vGuBkVmxStrCuAGalKHbu0R0ibbZyYaP1NcIi3Dy6dQXeq7cpLUCOnddW5lXkeq_" />
                        <span className="text-[10px] md:text-label-sm font-bold">USDT</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant mb-1.5 md:mb-2 block uppercase tracking-wide">TXID Hash Submission</label>
                    <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm md:text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Enter transaction hash..." type="text" />
                  </div>
                  <button className="cursor-pointer w-full bg-primary text-on-primary py-2.5 rounded-lg text-sm md:text-label-md font-bold hover:brightness-110 active:scale-[0.98] transition-all mt-1 shadow-sm shadow-primary/20">
                    Confirm Deposit
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center p-1.5 md:p-4 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant mt-1.5 md:mt-0">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <img alt="Deposit Address QR" className="w-20 h-20 md:w-24 md:h-24" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD834f1i3JEie417y4hzdtSZlk40EJjVMNRAxRQgT7RU5JaUri3sfIUacqRQb24oFUp-DWiUsvnpN14mWFFzocJtHYcbhWmE2G6O83h-fVGOL2qQ-GxvqeRwkgXn-fGCv0a2lbW4L4bHKyFNen8ooS6lz59nnlAvLvSbchLNob-UGp7VApWB9A9ZZ6eBuT7HL3bF1zfqaqQWffxXUZv70-inGXWDSCSAfH1lVMT8e0zew4nuMY8y4gLyzl4a9cT3b7PEyzoBXpxODVc" />
                  </div>
                  <p className="text-[10px] md:text-xs font-tabular-nums text-on-surface-variant mt-2 break-all text-center max-w-[140px] bg-surface-container-highest px-2 py-1 rounded">bc1qxy2kgdy6jrsqz7v...</p>
                  <button className="cursor-pointer mt-1.5 text-primary text-[10px] md:text-label-sm font-bold hover:underline">Copy Address</button>
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
                  <tr className="hover:bg-white/5 transition-colors group">
                    <td className="px-2.5 py-2 md:px-card-padding md:py-3 font-tabular-nums text-xs md:text-sm text-on-surface-variant">#TX-882941-BM</td>
                    <td className="px-2.5 py-2 md:px-card-padding md:py-3 text-xs md:text-sm text-on-surface-variant">Oct 24, 2023 14:22</td>
                    <td className="px-2.5 py-2 md:px-card-padding md:py-3">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="material-symbols-outlined text-primary text-[14px] md:text-sm">download</span>
                        <span className="text-xs md:text-sm font-medium text-on-surface">Deposit</span>
                      </div>
                    </td>
                    <td className="px-2.5 py-2 md:px-card-padding md:py-3 text-right font-tabular-nums font-bold text-tertiary text-xs md:text-sm">+15,000.00 USD</td>
                    <td className="px-2.5 py-2 md:px-card-padding md:py-3 text-center">
                      <span className="bg-tertiary-container/20 text-tertiary px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-tertiary/20">Completed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors group">
                    <td className="px-2.5 py-2 md:px-card-padding md:py-3 font-tabular-nums text-xs md:text-sm text-on-surface-variant">#TX-882935-BM</td>
                    <td className="px-2.5 py-2 md:px-card-padding md:py-3 text-xs md:text-sm text-on-surface-variant">Oct 23, 2023 09:15</td>
                    <td className="px-2.5 py-2 md:px-card-padding md:py-3">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="material-symbols-outlined text-error text-[14px] md:text-sm">upload</span>
                        <span className="text-xs md:text-sm font-medium text-on-surface">Withdrawal</span>
                      </div>
                    </td>
                    <td className="px-2.5 py-2 md:px-card-padding md:py-3 text-right font-tabular-nums font-bold text-error text-xs md:text-sm">-2,450.00 USD</td>
                    <td className="px-2.5 py-2 md:px-card-padding md:py-3 text-center">
                      <span className="bg-secondary-container/20 text-secondary px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-secondary/20">Pending</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-2.5 py-2 md:px-card-padding md:py-3 bg-surface-container-lowest/50 border-t border-outline-variant/10 flex justify-between items-center">
              <span className="text-[10px] md:text-xs text-on-surface-variant">Showing 2 of 128 transactions</span>
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
