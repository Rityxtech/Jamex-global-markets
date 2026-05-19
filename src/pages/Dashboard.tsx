import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="deep-mesh-bg text-on-surface selection:bg-primary/30 min-h-screen dark bg-background">
      {/* SideNavBar (Desktop/Tablet) */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen flex flex-col pt-14 md:pt-16 pb-20 md:pb-0">
        {/* TopNavBar */}
        <header className="fixed top-0 right-0 left-0 md:left-64 z-30 bg-surface/90 backdrop-blur-xl h-14 md:h-16 border-b border-outline-variant/20 flex items-center justify-between px-4 md:px-margin-desktop shadow-sm transition-all">
          <div className="flex items-center gap-6">
            <h1 className="text-xl md:text-headline-md font-bold text-primary tracking-tight md:hidden">Jamex</h1>
            <div className="hidden lg:flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant text-body-md mr-2">search</span>
              <input className="bg-transparent border-none outline-none focus:ring-0 text-label-sm text-on-surface placeholder:text-outline w-48" placeholder="Search markets..." type="text" />
            </div>
            <nav className="hidden md:flex gap-6">
              <Link to="/dashboard" className="text-primary font-bold border-b-2 border-primary pb-1 text-label-sm">Dashboard</Link>
              <Link to="/market" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-label-sm">Market</Link>
              <Link to="/invest" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-label-sm">Wealth</Link>
              <Link to="/wallet" className="text-on-surface-variant font-medium hover:text-primary transition-colors text-label-sm">Wallet</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => navigate('/deposit')} className="cursor-pointer bg-primary text-on-primary px-3 py-1 md:px-4 md:py-1.5 rounded-md md:rounded font-bold text-[11px] md:text-label-sm hover:opacity-90 transition-all active:scale-95 shadow-sm shadow-primary/20">
              Deposit
            </button>
            <div className="flex items-center gap-2 md:gap-3 border-l border-outline-variant/30 pl-3 md:pl-4">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors text-[20px] md:text-[24px]">notifications</span>
              <span onClick={() => navigate('/wallet')} className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors text-[20px] md:text-[24px] hidden sm:block">account_balance_wallet</span>
              <div onClick={() => window.innerWidth < 768 ? window.dispatchEvent(new Event('toggle-mobile-menu')) : navigate('/profile')} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant cursor-pointer hover:border-primary transition-colors ml-1">
                <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8rnZBb6DNeNhGDYvtVvvofqp-s6sLQVmilHaqeqKBcD-6Mz-EGcqhvwJDsaBzor3-TNIGY7YLMF0PKALoslp4OYBS5ixeDdkQYPZwrzya2HwHdalEYNUi7f1gTmczAlDEcRC8PzfbFV1QluVYj7k6Jb8PjpIY8nX_QEQeBid_xg-qSOW6ZwEVm9A8u9oAw21hdjZ73UmfRwHrvrtfgOGn_5VQHH_Rg6r93mz6P3L7IbsrKZID-y6mrrW9D7gLWmEF7q3E74C9qzfj" />
              </div>
            </div>
          </div>
        </header>

        {/* Canvas Body */}
        <div className="p-4 md:p-margin-desktop flex-1 space-y-4 md:space-y-6 max-w-[1600px] w-full mx-auto">
          
          {/* Quick Actions & ROI Timer */}
          <div className="flex flex-col lg:flex-row gap-3 md:gap-gutter">
            {/* ROI Timer Widget */}
            <div className="glass-card flex-1 p-4 md:p-card-padding flex flex-row items-center justify-between rounded-xl md:rounded-xl group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
              <div className="flex items-center gap-3 md:gap-4 relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px] md:text-headline-md">schedule</span>
                </div>
                <div>
                  <p className="text-[10px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider md:tracking-widest mb-0.5">Live ROI Countdown</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl md:text-[28px] font-tabular-nums text-primary font-bold tracking-tight">04h 22m 15s</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end relative z-10">
                <p className="text-[10px] md:text-label-sm font-bold text-on-surface-variant">Est. Payout</p>
                <p className="text-lg md:text-[24px] font-tabular-nums text-tertiary font-bold">+$1,402.50</p>
              </div>
            </div>

            {/* Quick Buttons */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 lg:flex">
              <button onClick={() => navigate('/deposit')} className="cursor-pointer lg:w-32 px-2 py-3 md:px-6 md:py-4 glass-card rounded-xl flex flex-col items-center justify-center gap-1 md:gap-2 hover:border-primary/50 transition-all group bg-surface-container-low/50 hover:bg-surface-container-low active:scale-95">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform text-[22px] md:text-[24px]">add_circle</span>
                <span className="text-[10px] md:text-label-sm font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-primary">Deposit</span>
              </button>
              <button onClick={() => navigate('/invest')} className="cursor-pointer lg:w-32 px-2 py-3 md:px-6 md:py-4 bg-primary text-on-primary rounded-xl flex flex-col items-center justify-center gap-1 md:gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[22px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                <span className="text-[10px] md:text-label-sm font-bold uppercase tracking-wider">Invest</span>
              </button>
              <button onClick={() => navigate('/withdraw')} className="cursor-pointer lg:w-32 px-2 py-3 md:px-6 md:py-4 glass-card rounded-xl flex flex-col items-center justify-center gap-1 md:gap-2 hover:border-primary/50 transition-all group bg-surface-container-low/50 hover:bg-surface-container-low active:scale-95">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform text-[22px] md:text-[24px]">payments</span>
                <span className="text-[10px] md:text-label-sm font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-primary">Withdraw</span>
              </button>
            </div>
          </div>

          {/* Bento Grid: Stats and Portfolio Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-gutter">
            {/* Stat Card: Total Net Worth */}
            <div className="glass-card p-4 md:p-card-padding rounded-xl flex flex-col justify-between min-h-[120px] md:h-[140px] relative overflow-hidden">
              <div className="flex justify-between items-start mb-2 md:mb-4 relative z-10">
                <div>
                  <p className="text-[11px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Total Net Worth</p>
                  <h3 className="text-2xl md:text-[32px] font-bold text-on-surface mt-0.5 md:mt-1 leading-tight tracking-tight">$2,842,900.00</h3>
                </div>
                <div className="bg-surface-container-highest p-1.5 md:p-2 rounded-lg border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[24px]">account_balance</span>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10 mt-auto">
                <span className="text-tertiary flex items-center text-[10px] md:text-label-sm font-bold bg-tertiary-container/20 px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[14px] md:text-[16px] mr-0.5">trending_up</span>
                  +12.4%
                </span>
                <span className="text-on-surface-variant text-[10px] md:text-label-sm">vs last month</span>
              </div>
            </div>

            {/* Stat Card: Active Investments */}
            <div className="glass-card p-4 md:p-card-padding rounded-xl flex flex-col justify-between min-h-[120px] md:h-[140px] relative overflow-hidden">
              <div className="flex justify-between items-start mb-2 md:mb-4 relative z-10">
                <div>
                  <p className="text-[11px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Active Investments</p>
                  <h3 className="text-2xl md:text-[32px] font-bold text-on-surface mt-0.5 md:mt-1 leading-tight tracking-tight">14</h3>
                </div>
                <div className="bg-surface-container-highest p-1.5 md:p-2 rounded-lg border border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[18px] md:text-[24px]">analytics</span>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10 mt-auto">
                <span className="text-on-surface text-[10px] md:text-label-sm font-medium">3 Pending Execution</span>
                <div className="flex -space-x-2 ml-auto">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary-container border-2 border-surface"></div>
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-secondary-container border-2 border-surface"></div>
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-tertiary-container border-2 border-surface"></div>
                </div>
              </div>
            </div>

            {/* Stat Card: Total Profit */}
            <div className="glass-card p-4 md:p-card-padding rounded-xl border border-tertiary/20 flex flex-col justify-between min-h-[120px] md:h-[140px] relative overflow-hidden sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-tertiary/5 to-transparent pointer-events-none"></div>
              <div className="flex justify-between items-start mb-2 md:mb-4 relative z-10">
                <div>
                  <p className="text-[11px] md:text-label-sm font-bold text-tertiary/80 uppercase tracking-wider">Total Profit</p>
                  <h3 className="text-2xl md:text-[32px] font-bold text-tertiary mt-0.5 md:mt-1 leading-tight tracking-tight">+$412,850.22</h3>
                </div>
                <div className="bg-tertiary/10 p-1.5 md:p-2 rounded-lg border border-tertiary/20">
                  <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3 relative z-10 mt-auto">
                <div className="flex-1 h-1 md:h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary w-3/4 rounded-full shadow-[0_0_8px_rgba(78,222,163,0.5)]"></div>
                </div>
                <span className="text-tertiary text-[10px] md:text-label-sm font-bold whitespace-nowrap">75% Target</span>
              </div>
            </div>
          </div>

          {/* Performance Chart Section */}
          <div className="glass-card rounded-xl overflow-hidden flex flex-col border border-outline-variant/20">
            <div className="bg-surface-container-high/40 px-4 md:px-margin-desktop py-3 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 border-b border-outline-variant/10">
              <div>
                <h2 className="text-base md:text-headline-md font-bold text-on-surface tracking-tight">Portfolio Performance</h2>
                <p className="text-[11px] md:text-label-sm text-on-surface-variant mt-0.5">Real-time valuation across all assets</p>
              </div>
              <div className="flex gap-1 md:gap-2 bg-surface-container-highest/50 p-1 rounded-lg self-stretch sm:self-auto overflow-x-auto scrollbar-hide">
                <button className="px-3 py-1 text-[11px] md:text-label-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded">1D</button>
                <button className="px-3 py-1 text-[11px] md:text-label-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded">1W</button>
                <button className="px-3 py-1 text-[11px] md:text-label-sm font-bold bg-primary text-on-primary rounded shadow-sm shadow-primary/20">1M</button>
                <button className="px-3 py-1 text-[11px] md:text-label-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded">1Y</button>
                <button className="px-3 py-1 text-[11px] md:text-label-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded">ALL</button>
              </div>
            </div>
            <div className="p-4 md:p-8 h-48 sm:h-64 md:h-80 relative flex items-end gap-1">
              {/* Faux Line Chart Graphic */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none p-4 md:p-12" viewBox="0 0 1000 400" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradientMain" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,350 Q100,340 200,280 T400,220 T600,150 T800,100 T1000,50 V400 H0 Z" fill="url(#chartGradientMain)"></path>
                <path className="drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]" d="M0,350 Q100,340 200,280 T400,220 T600,150 T800,100 T1000,50" fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="4"></path>
                {/* Data Points */}
                <circle cx="200" cy="280" fill="#2563eb" r="4"></circle>
                <circle cx="400" cy="220" fill="#2563eb" r="4"></circle>
                <circle cx="600" cy="150" fill="#2563eb" r="4"></circle>
                <circle cx="800" cy="100" fill="#2563eb" r="4"></circle>
                <circle cx="1000" cy="50" fill="#b4c5ff" r="6" stroke="#2563eb" strokeWidth="2"></circle>
              </svg>
              {/* Y Axis Labels (Hidden on very small screens, visible on md+) */}
              <div className="absolute left-2 md:left-6 top-4 md:top-12 bottom-4 md:bottom-12 flex flex-col justify-between text-[9px] md:text-label-sm font-bold text-outline/40 pointer-events-none">
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
            <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-3 md:py-4 flex justify-between items-center border-b border-outline-variant/10">
              <h2 className="text-[11px] md:text-label-md font-bold text-on-surface-variant uppercase tracking-widest">Recent Market Activities</h2>
              <button onClick={() => navigate('/transactions')} className="text-primary text-[11px] md:text-label-sm font-bold hover:underline cursor-pointer tracking-wide">View All</button>
            </div>
            <div className="flex flex-col divide-y divide-outline-variant/10 bg-surface/30">
              {/* Transaction Item 1 */}
              <div className="flex items-center p-3 md:p-4 justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-tertiary text-[16px] md:text-[20px]">call_received</span>
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-bold text-on-surface leading-tight mb-0.5">Institutional Yield Payout</p>
                    <p className="text-[10px] md:text-xs text-on-surface-variant opacity-80">Fixed Income • BTC-ALPHA</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm md:text-base font-bold font-tabular-nums text-tertiary leading-tight mb-0.5">+$12,400.00</p>
                  <p className="text-[9px] md:text-xs text-on-surface-variant opacity-70">Today, 09:41 AM</p>
                </div>
              </div>
              
              {/* Transaction Item 2 */}
              <div className="flex items-center p-3 md:p-4 justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-primary text-[16px] md:text-[20px]">trending_up</span>
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-bold text-on-surface leading-tight mb-0.5">Asset Acquisition</p>
                    <p className="text-[10px] md:text-xs text-on-surface-variant opacity-80">Equities • Global Tech</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm md:text-base font-bold font-tabular-nums text-on-surface leading-tight mb-0.5">-$250,000.00</p>
                  <p className="text-[9px] md:text-xs text-on-surface-variant opacity-70">Yesterday</p>
                </div>
              </div>

              {/* Transaction Item 3 */}
              <div className="flex items-center p-3 md:p-4 justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-tertiary text-[16px] md:text-[20px]">call_received</span>
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-bold text-on-surface leading-tight mb-0.5">VC Dividend</p>
                    <p className="text-[10px] md:text-xs text-on-surface-variant opacity-80">Private Equity • Series C</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm md:text-base font-bold font-tabular-nums text-tertiary leading-tight mb-0.5">+$5,820.15</p>
                  <p className="text-[9px] md:text-xs text-on-surface-variant opacity-70">Nov 14, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-6 md:py-12 px-4 md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 border-t border-outline-variant/10 bg-surface-container-lowest mt-auto text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-1 md:gap-2">
            <p className="text-sm md:text-headline-md font-bold text-primary">Jamex Global Markets</p>
            <p className="text-[10px] md:text-sm text-on-surface-variant">© 2024 Jamex Global. Institutional Wealth Management.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a className="text-[10px] md:text-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Terms</a>
            <a className="text-[10px] md:text-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Privacy</a>
            <a className="text-[10px] md:text-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Risk</a>
            <a className="text-[10px] md:text-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Security</a>
          </div>
        </footer>
      </main>

      {/* BottomNavBar (Mobile Only) - Refined to 5 compact items */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-[68px] bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20 flex justify-between items-center px-2 z-50 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <Link to="/dashboard" className="flex flex-col items-center justify-center w-full h-full gap-1 text-primary relative">
          <div className="absolute -top-3 w-10 h-1 bg-primary rounded-b-full"></div>
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
        </Link>
        <Link to="/invest" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[24px]">account_balance</span>
          <span className="text-[9px] font-bold uppercase tracking-wider">Invest</span>
        </Link>
        <Link to="/wallet" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          <span className="text-[9px] font-bold uppercase tracking-wider">Wallet</span>
        </Link>
        <Link to="/transactions" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          <span className="text-[9px] font-bold uppercase tracking-wider">History</span>
        </Link>
        <Link to="/settings" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[24px]">menu</span>
          <span className="text-[9px] font-bold uppercase tracking-wider">Menu</span>
        </Link>
      </nav>
    </div>
  );
}
