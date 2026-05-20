import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-2.5 md:p-margin-desktop space-y-2.5 md:space-y-6 max-w-[1600px] w-full mx-auto">
          
          {/* Quick Actions & ROI Timer */}
          <div className="flex flex-col lg:flex-row gap-2.5 md:gap-gutter">
            {/* ROI Timer Widget */}
            <div className="glass-card flex-1 px-3 py-3.5 md:p-card-padding flex flex-row items-center justify-between rounded-xl group relative overflow-hidden min-h-[76px] md:min-h-[96px]">
              {/* Shifting background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none animate-pulse"></div>
              {/* Scanline sweep effect */}
              <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-scan pointer-events-none"></div>

              {/* Background Chart Sparkline */}
              <div className="absolute inset-x-0 bottom-0 top-1/2 opacity-25 pointer-events-none z-0">
                <svg className="w-full h-full" viewBox="0 0 400 60" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="roi-spark-glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 50 Q 50 45 100 48 T 200 25 T 300 35 T 400 15 L 400 60 L 0 60 Z" fill="url(#roi-spark-glow)" />
                  <path d="M 0 50 Q 50 45 100 48 T 200 25 T 300 35 T 400 15" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" className="animate-spark-draw" />
                </svg>
              </div>

              <div className="flex items-center gap-2.5 md:gap-4 relative z-10">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center relative overflow-hidden group-hover:border-primary/60 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[16px] md:text-headline-md animate-slow-spin">schedule</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-tertiary"></span>
                    </span>
                    <p className="text-[9px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider md:tracking-widest">Live ROI Countdown</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm sm:text-lg md:text-[28px] font-tabular-nums text-primary font-bold tracking-tight">04h 22m 15s</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end relative z-10">
                <p className="text-[9px] md:text-label-sm font-bold text-on-surface-variant">Est. Payout</p>
                <p className="text-xs sm:text-base md:text-[24px] font-tabular-nums text-tertiary font-bold animate-pulse">+$1,402.50</p>
              </div>
            </div>

            {/* Quick Buttons */}
            <div className="grid grid-cols-3 gap-2.5 md:gap-3 lg:flex">
              <button onClick={() => navigate('/deposit')} className="cursor-pointer lg:w-32 px-1.5 py-1.5 md:px-6 md:py-3 glass-card rounded-xl flex flex-col items-center justify-center gap-1 md:gap-2 hover:border-primary/50 transition-all group bg-surface-container-low/50 hover:bg-surface-container-low active:scale-95">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform text-[18px] md:text-[24px]">add_circle</span>
                <span className="text-[9px] md:text-label-sm font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-primary">Deposit</span>
              </button>
              <button onClick={() => navigate('/invest')} className="cursor-pointer lg:w-32 px-1.5 py-1.5 md:px-6 md:py-3 bg-primary text-on-primary rounded-xl flex flex-col items-center justify-center gap-1 md:gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[18px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                <span className="text-[9px] md:text-label-sm font-bold uppercase tracking-wider">Invest</span>
              </button>
              <button onClick={() => navigate('/withdraw')} className="cursor-pointer lg:w-32 px-1.5 py-1.5 md:px-6 md:py-3 glass-card rounded-xl flex flex-col items-center justify-center gap-1 md:gap-2 hover:border-primary/50 transition-all group bg-surface-container-low/50 hover:bg-surface-container-low active:scale-95">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform text-[18px] md:text-[24px]">payments</span>
                <span className="text-[9px] md:text-label-sm font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-primary">Withdraw</span>
              </button>
            </div>
          </div>

          {/* Bento Grid: Stats and Portfolio Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-gutter">
            {/* Stat Card: Total Net Worth */}
            <div className="glass-card p-2.5 md:p-card-padding rounded-xl flex flex-col justify-between min-h-[90px] md:h-[140px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12 group-hover:animate-shimmer pointer-events-none"></div>
              <div className="flex justify-between items-start mb-1 md:mb-4 relative z-10">
                <div>
                  <p className="text-[9px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Total Net Worth</p>
                  <h3 className="text-lg sm:text-xl md:text-[32px] font-bold text-on-surface mt-0.5 md:mt-1 leading-tight tracking-tight">$2,842,900.00</h3>
                </div>
                <div className="bg-surface-container-highest p-1 md:p-2 rounded-lg border border-outline-variant/30 shrink-0">
                  <span className="material-symbols-outlined text-primary text-[16px] md:text-[24px]">account_balance</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-1.5 md:gap-2 relative z-10 mt-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-tertiary flex items-center text-[9px] md:text-label-sm font-bold bg-tertiary-container/20 px-1.5 py-0.5 rounded">
                    <span className="material-symbols-outlined text-[12px] md:text-[16px] mr-0.5">trending_up</span>
                    +12.4%
                  </span>
                  <span className="text-on-surface-variant text-[9px] md:text-label-sm">vs last month</span>
                </div>
                <div className="w-16 h-8 md:w-20 md:h-10 shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="spark-networth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 35 Q 20 28 40 18 T 80 15 T 100 5 L 100 40 L 0 40 Z" fill="url(#spark-networth)" />
                    <path d="M 0 35 Q 20 28 40 18 T 80 15 T 100 5" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" className="animate-spark-draw" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Stat Card: Active Investments */}
            <div className="glass-card p-2.5 md:p-card-padding rounded-xl flex flex-col justify-between min-h-[90px] md:h-[140px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12 group-hover:animate-shimmer pointer-events-none"></div>
              <div className="flex justify-between items-start mb-1 md:mb-4 relative z-10">
                <div>
                  <p className="text-[9px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Active Investments</p>
                  <h3 className="text-lg sm:text-xl md:text-[32px] font-bold text-on-surface mt-0.5 md:mt-1 leading-tight tracking-tight">14</h3>
                </div>
                <div className="bg-surface-container-highest p-1 md:p-2 rounded-lg border border-outline-variant/30 shrink-0">
                  <span className="material-symbols-outlined text-primary text-[16px] md:text-[24px]">analytics</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-1.5 md:gap-2 relative z-10 mt-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-on-surface text-[9px] md:text-label-sm font-medium">3 Pending</span>
                  <div className="flex -space-x-1.5">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary-container border-2 border-surface"></div>
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-secondary-container border-2 border-surface"></div>
                  </div>
                </div>
                <div className="w-16 h-8 md:w-20 md:h-10 shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="spark-active" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 35 L 20 35 L 20 20 L 50 20 L 50 15 L 75 15 L 75 10 L 100 10 L 100 40 L 0 40 Z" fill="url(#spark-active)" />
                    <path d="M 0 35 L 20 35 L 20 20 L 50 20 L 50 15 L 75 15 L 75 10 L 100 10" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" className="animate-spark-draw" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Stat Card: Total Profit */}
            <div className="glass-card p-2.5 md:p-card-padding rounded-xl border border-tertiary/20 flex flex-col justify-between min-h-[90px] md:h-[140px] relative overflow-hidden sm:col-span-2 lg:col-span-1 group">
              <div className="absolute inset-0 bg-gradient-to-br from-tertiary/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-tertiary/5 to-transparent skew-x-12 group-hover:animate-shimmer pointer-events-none"></div>
              <div className="flex justify-between items-start mb-1 md:mb-4 relative z-10">
                <div>
                  <p className="text-[9px] md:text-label-sm font-bold text-tertiary/80 uppercase tracking-wider">Total Profit</p>
                  <h3 className="text-lg sm:text-xl md:text-[32px] font-bold text-tertiary mt-0.5 md:mt-1 leading-tight tracking-tight">+$412,850.22</h3>
                </div>
                <div className="bg-tertiary/10 p-1 md:p-2 rounded-lg border border-tertiary/20 shrink-0">
                  <span className="material-symbols-outlined text-tertiary text-[16px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                </div>
              </div>
              <div className="space-y-1.5 relative z-10 mt-auto">
                <div className="flex items-center justify-between text-[9px] md:text-label-sm">
                  <span className="text-tertiary font-bold">75% Target</span>
                  <div className="w-12 h-4 shrink-0 overflow-visible relative">
                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="spark-profit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 35 Q 25 32 50 15 T 80 18 T 100 5 L 100 40 L 0 40 Z" fill="url(#spark-profit)" />
                      <path d="M 0 35 Q 25 32 50 15 T 80 18 T 100 5" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" className="animate-spark-draw" />
                    </svg>
                  </div>
                </div>
                <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary w-3/4 rounded-full shadow-[0_0_8px_rgba(78,222,163,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart Section */}
          <div className="glass-card rounded-xl overflow-hidden flex flex-col border border-outline-variant/20">
            <div className="bg-surface-container-high/40 px-2.5 md:px-margin-desktop py-2 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 md:gap-4 border-b border-outline-variant/10">
              <div>
                <h2 className="text-sm md:text-headline-md font-bold text-on-surface tracking-tight">Portfolio Performance</h2>
                <p className="text-[9px] md:text-label-sm text-on-surface-variant mt-0.5">Real-time valuation across all assets</p>
              </div>
              <div className="flex gap-1 bg-surface-container-highest/50 p-1 rounded-lg self-stretch sm:self-auto overflow-x-auto scrollbar-hide">
                <button className="px-2 py-0.5 text-[9px] md:text-label-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded">1D</button>
                <button className="px-2 py-0.5 text-[9px] md:text-label-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded">1W</button>
                <button className="px-2 py-0.5 text-[9px] md:text-label-sm font-bold bg-primary text-on-primary rounded shadow-sm shadow-primary/20">1M</button>
                <button className="px-2 py-0.5 text-[9px] md:text-label-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded">1Y</button>
                <button className="px-2 py-0.5 text-[9px] md:text-label-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded">ALL</button>
              </div>
            </div>
            <div className="p-2.5 md:p-8 h-36 sm:h-64 md:h-80 relative flex items-end gap-1">
              {/* Faux Line Chart Graphic */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none p-2 md:p-12" viewBox="0 0 1000 400" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradientMain" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,350 Q100,340 200,280 T400,220 T600,150 T800,100 T1000,50 V400 H0 Z" fill="url(#chartGradientMain)" className="animate-fade-in"></path>
                <path className="drop-shadow-[0_0_8px_rgba(37,99,235,0.6)] animate-chart-draw" d="M0,350 Q100,340 200,280 T400,220 T600,150 T800,100 T1000,50" fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="4"></path>
                {/* Data Points */}
                <circle cx="200" cy="280" fill="#2563eb" r="4"></circle>
                <circle cx="400" cy="220" fill="#2563eb" r="4"></circle>
                <circle cx="600" cy="150" fill="#2563eb" r="4"></circle>
                <circle cx="800" cy="100" fill="#2563eb" r="4"></circle>
                <circle cx="1000" cy="50" fill="#b4c5ff" r="6" stroke="#2563eb" strokeWidth="2"></circle>
              </svg>
              {/* Y Axis Labels (Hidden on very small screens, visible on md+) */}
              <div className="absolute left-2 md:left-6 top-4 md:top-12 bottom-4 md:bottom-12 flex flex-col justify-between text-[8px] md:text-label-sm font-bold text-outline/40 pointer-events-none">
                <span>$3M</span>
                <span>$2.5M</span>
                <span>$2M</span>
                <span>$1.5M</span>
                <span>$1M</span>
              </div>
            </div>
          </div>

          {/* Transaction History (High Density List) */}
          <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
            <div className="bg-surface-container-high/40 px-2.5 md:px-card-padding py-2 md:py-4 flex justify-between items-center border-b border-outline-variant/10">
              <h2 className="text-[10px] sm:text-[11px] md:text-label-md font-bold text-on-surface-variant uppercase tracking-widest">Recent Market Activities</h2>
              <button onClick={() => navigate('/transactions')} className="text-primary text-[10px] sm:text-[11px] md:text-label-sm font-bold hover:underline cursor-pointer tracking-wide">View All</button>
            </div>
            <div className="flex flex-col divide-y divide-outline-variant/10 bg-surface/30">
              {/* Transaction Item 1 */}
              <div className="flex items-center p-2.5 md:p-4 justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-center gap-2.5 md:gap-4">
                  <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-tertiary text-[14px] md:text-[20px]">call_received</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-on-surface leading-tight mb-0.5">Institutional Yield Payout</p>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-on-surface-variant opacity-80">Fixed Income • BTC-ALPHA</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm md:text-base font-bold font-tabular-nums text-tertiary leading-tight mb-0.5">+$12,400.00</p>
                  <p className="text-[8px] sm:text-[9px] md:text-xs text-on-surface-variant opacity-70">Today, 09:41 AM</p>
                </div>
              </div>
              
              {/* Transaction Item 2 */}
              <div className="flex items-center p-2.5 md:p-4 justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-center gap-2.5 md:gap-4">
                  <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-primary text-[14px] md:text-[20px]">trending_up</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-on-surface leading-tight mb-0.5">Asset Acquisition</p>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-on-surface-variant opacity-80">Equities • Global Tech</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm md:text-base font-bold font-tabular-nums text-on-surface leading-tight mb-0.5">-$250,000.00</p>
                  <p className="text-[8px] sm:text-[9px] md:text-xs text-on-surface-variant opacity-70">Yesterday</p>
                </div>
              </div>

              {/* Transaction Item 3 */}
              <div className="flex items-center p-2.5 md:p-4 justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-center gap-2.5 md:gap-4">
                  <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-tertiary text-[14px] md:text-[20px]">call_received</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-on-surface leading-tight mb-0.5">VC Dividend</p>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-on-surface-variant opacity-80">Private Equity • Series C</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm md:text-base font-bold font-tabular-nums text-tertiary leading-tight mb-0.5">+$5,820.15</p>
                  <p className="text-[8px] sm:text-[9px] md:text-xs text-on-surface-variant opacity-70">Nov 14, 2024</p>
                </div>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes chart-draw {
              from { stroke-dashoffset: 1200; }
              to { stroke-dashoffset: 0; }
            }
            .animate-chart-draw {
              stroke-dasharray: 1200;
              stroke-dashoffset: 1200;
              animation: chart-draw 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
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
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fade-in {
              animation: fade-in 1.5s ease-in-out forwards;
            }
            @keyframes slow-spin {
              100% { transform: rotate(360deg); }
            }
            .animate-slow-spin {
              display: inline-block;
              animation: slow-spin 8s linear infinite;
            }
            @keyframes scan {
              0% { left: -10%; }
              100% { left: 110%; }
            }
            .animate-scan {
              animation: scan 4s linear infinite;
            }
          `}</style>
    </div>
  );
}
