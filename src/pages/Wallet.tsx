import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Wallet() {
  const navigate = useNavigate();

  return (
    <div className="deep-mesh-bg text-on-surface min-h-screen dark bg-background">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="md:ml-64 flex flex-col min-h-screen pt-14 md:pt-16 pb-20 md:pb-0">
        {/* TopAppBar */}
        <header className="fixed top-0 right-0 left-0 md:left-64 h-14 md:h-16 glass-panel z-40 flex items-center justify-between px-4 md:px-margin-desktop border-b border-outline-variant/20 shadow-sm transition-all">
          <div className="flex items-center gap-6">
            <h2 className="text-xl md:text-headline-md font-bold text-primary tracking-tight">Wallet</h2>
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/dashboard" className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 text-label-sm font-label-sm">Dashboard</Link>
              <Link to="/market" className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 text-label-sm font-label-sm">Market</Link>
              <Link to="/invest" className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 text-label-sm font-label-sm">Wealth</Link>
              <Link to="/wallet" className="text-primary font-bold border-b-2 border-primary pb-1 text-label-sm font-label-sm">Wallet</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <button className="cursor-pointer flex items-center justify-center p-1 md:p-2 text-on-surface-variant hover:text-primary transition-all">
              <span className="material-symbols-outlined text-[20px] md:text-[24px]">notifications</span>
            </button>
            <div className="h-6 md:h-8 w-[1px] bg-outline-variant/30"></div>
            <button className="cursor-pointer bg-primary text-on-primary px-3 py-1.5 md:px-4 md:py-1.5 rounded-md md:rounded-lg text-[11px] md:text-label-sm font-bold active:scale-95 transition-all w-max whitespace-nowrap shadow-sm shadow-primary/20">
              Deposit
            </button>
            <img onClick={() => window.innerWidth < 768 ? window.dispatchEvent(new Event('toggle-mobile-menu')) : navigate('/profile')} alt="User Profile" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-outline-variant/50 cursor-pointer hover:border-primary transition-colors ml-1 md:ml-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4qv5uHrCNfTAzktnUcZd0fxiWOMicaf4jlnCKzpcn-FFIENBEHeID87RF1MJceDgEZ3hdGWp65AOA9UbrMemPCu5H8Jkss2LfCUeHnyPwczYn6f-QijUc3msHEL-VVD4LVs8Pg9cVNJcUjLtm9Tvw8DHJBigqvht2KAgYSXOJD7Oj-9wTX-gkL-zjdtBGh65lKTCgYUdiQNYbW7-vBxfkhxvw0y2MHCkPrfFDLSdK9EQ-Qyuuhe_SHMZI_tEWjmLJYGqkiKm-i3zw" />
          </div>
        </header>

        <div className="p-4 md:p-margin-desktop space-y-4 md:space-y-gutter max-w-[1600px] mx-auto w-full">
          {/* Wallet Split Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-gutter">
            {/* Main Wallet */}
            <div className="glass-panel rounded-xl overflow-hidden border border-outline-variant/20">
              <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-3 border-b border-outline-variant/10 flex justify-between items-center">
                <span className="text-[11px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Main Wallet</span>
                <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              </div>
              <div className="p-4 md:p-card-padding space-y-1 md:space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-display-lg font-bold text-on-surface tracking-tight">245,680.00</span>
                  <span className="text-lg md:text-headline-md font-bold text-primary/70">USD</span>
                </div>
                <div className="flex items-center gap-1.5 text-tertiary">
                  <span className="material-symbols-outlined text-[14px] md:text-[16px]">trending_up</span>
                  <span className="text-[10px] md:text-label-sm font-bold">+1.24% today</span>
                </div>
              </div>
            </div>

            {/* Profit Wallet */}
            <div className="glass-panel rounded-xl overflow-hidden border border-primary/30 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
              <div className="bg-primary-container/10 px-4 md:px-card-padding py-3 border-b border-outline-variant/10 flex justify-between items-center relative z-10">
                <span className="text-[11px] md:text-label-sm font-bold text-primary uppercase tracking-wider">Profit Wallet</span>
                <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              </div>
              <div className="p-4 md:p-card-padding space-y-1 md:space-y-2 relative z-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-display-lg font-bold text-on-surface tracking-tight">12,430.50</span>
                  <span className="text-lg md:text-headline-md font-bold text-tertiary/70">USD</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="text-[10px] md:text-label-sm font-bold">Locked for withdrawal: $0.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Interface Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-gutter">
            {/* Deposit Interface */}
            <div className="glass-panel rounded-xl flex flex-col border border-outline-variant/20">
              <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-3 border-b border-outline-variant/10">
                <h3 className="text-sm md:text-label-md text-on-surface font-bold tracking-wide">Deposit Funds</h3>
              </div>
              <div className="p-4 md:p-card-padding flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="space-y-4 md:space-y-4 flex-1">
                  <div>
                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant mb-1.5 md:mb-2 block uppercase tracking-wide">Select Asset</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button className="cursor-pointer border border-primary bg-primary/10 rounded-lg py-2 flex flex-col items-center gap-1 transition-all">
                        <img alt="BTC" className="w-5 h-5 md:w-6 md:h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWSzDqxX9xuzk5baLDM7Fh5VpFBPjITgGKoYNxbhWRmSP1t41iVePsTLxrVKPEoxEuAPFo5Q54jIjidBRnzogkTMyeek-i0BNBcVA-FvoWrAHAVCjle50noKAFUzhlUUrKpeV2DygAHcaNnPvGctTUxkSt_ruHuvCkLbRVFY3dUiHxzH-mt5Sms6CqRZsVaDMUa0TsV22Aw5hBIONnPSq0h4L-xu951VMAx_JikDapcoNftx8OemuyjosX_kB80NIBOUmY8IjRf4Kf" />
                        <span className="text-[10px] md:text-label-sm font-bold">BTC</span>
                      </button>
                      <button className="cursor-pointer border border-outline-variant hover:border-primary rounded-lg py-2 flex flex-col items-center gap-1 transition-all bg-surface-container-low">
                        <img alt="ETH" className="w-5 h-5 md:w-6 md:h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvmpvf1JkYXofTYNBRdN5Mfv7TfGAQtedeyZlPi6O32733-Qz32fC4cJguX2h9nAop_wo9u_6DUyjSigS7K0SacCWNCuz7HFwYYhdSWAS61KoTfrNfJ7vjbOygUjnEysJJKkIGOHDhUlTI9feiKyyxo8x4VZowppUlOwYdTOXmIVS6sXUPcO_V1ViVzHcIZxPRdV_xlj_PRD6Zg7lz42VTFnC-UD7Z5OUh2XNkb7YxESrzZ7T-VYwQcWokcCTQpzPZ0DG1Ux-dvk07" />
                        <span className="text-[10px] md:text-label-sm font-bold">ETH</span>
                      </button>
                      <button className="cursor-pointer border border-outline-variant hover:border-primary rounded-lg py-2 flex flex-col items-center gap-1 transition-all bg-surface-container-low">
                        <img alt="USDT" className="w-5 h-5 md:w-6 md:h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkdr_eIehC8H090wsE1OaYFTqDALeFegJpnxFrs6kyPcI82wrcUWoDPJLr3HivsXHiPNKeixPTPJLxhraPSPquFLuhdERigsw8Dv_zwVNMEvD5SqTIdcg7sgmVBDFY15Kh1DOGO5IPM9kz238OCU7HPYCcfx2g2vsTkbk_5zjD1TxggVN5clx9laiW2nnBeLwxxQW5C7RQDLs5vGuBkVmxStrCuAGalKHbu0R0ibbZyYaP1NcIi3Dy6dQXeq7cpLUCOnddW5lXkeq_" />
                        <span className="text-[10px] md:text-label-sm font-bold">USDT</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-label-sm font-bold text-on-surface-variant mb-1.5 md:mb-2 block uppercase tracking-wide">TXID Hash Submission</label>
                    <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 text-sm md:text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Enter transaction hash..." type="text" />
                  </div>
                  <button className="cursor-pointer w-full bg-primary text-on-primary py-2.5 rounded-lg text-sm md:text-label-md font-bold hover:brightness-110 active:scale-95 transition-all mt-2 shadow-sm shadow-primary/20">
                    Confirm Deposit
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant mt-2 md:mt-0">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <img alt="Deposit Address QR" className="w-20 h-20 md:w-24 md:h-24" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD834f1i3JEie417y4hzdtSZlk40EJjVMNRAxRQgT7RU5JaUri3sfIUacqRQb24oFUp-DWiUsvnpN14mWFFzocJtHYcbhWmE2G6O83h-fVGOL2qQ-GxvqeRwkgXn-fGCv0a2lbW4L4bHKyFNen8ooS6lz59nnlAvLvSbchLNob-UGp7VApWB9A9ZZ6eBuT7HL3bF1zfqaqQWffxXUZv70-inGXWDSCSAfH1lVMT8e0zew4nuMY8y4gLyzl4a9cT3b7PEyzoBXpxODVc" />
                  </div>
                  <p className="text-[10px] md:text-xs font-tabular-nums text-on-surface-variant mt-3 break-all text-center max-w-[140px] bg-surface-container-highest px-2 py-1 rounded">bc1qxy2kgdy6jrsqz7v...</p>
                  <button className="cursor-pointer mt-2 text-primary text-[10px] md:text-label-sm font-bold hover:underline">Copy Address</button>
                </div>
              </div>
            </div>

            {/* Withdrawal Interface */}
            <div className="glass-panel rounded-xl flex flex-col border border-outline-variant/20">
              <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-3 border-b border-outline-variant/10">
                <h3 className="text-sm md:text-label-md text-on-surface font-bold tracking-wide">Secure Withdrawal</h3>
              </div>
              <div className="p-4 md:p-card-padding space-y-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
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
                <button className="cursor-pointer w-full border border-outline-variant/50 bg-surface-container-low text-on-surface py-2.5 rounded-lg text-sm md:text-label-md font-bold hover:bg-surface-variant/50 active:scale-95 transition-all">
                  Initiate Withdrawal
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transactions Table */}
          <section className="glass-panel rounded-xl overflow-hidden border border-outline-variant/20">
            <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-3 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-[11px] md:text-label-md text-on-surface font-bold tracking-wide uppercase">Recent Transactions</h3>
              <button className="cursor-pointer text-primary text-[10px] md:text-label-sm font-bold hover:underline">Export CSV</button>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container-highest/20 border-b border-outline-variant/10">
                    <th className="px-4 py-2.5 md:px-card-padding md:py-3 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Transaction ID</th>
                    <th className="px-4 py-2.5 md:px-card-padding md:py-3 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2.5 md:px-card-padding md:py-3 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2.5 md:px-card-padding md:py-3 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                    <th className="px-4 py-2.5 md:px-card-padding md:py-3 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm md:text-body-md divide-y divide-outline-variant/5">
                  <tr className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3 md:px-card-padding font-tabular-nums text-xs md:text-sm text-on-surface-variant">#TX-882941-BM</td>
                    <td className="px-4 py-3 md:px-card-padding text-xs md:text-sm text-on-surface-variant">Oct 24, 2023 14:22</td>
                    <td className="px-4 py-3 md:px-card-padding">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="material-symbols-outlined text-primary text-[14px] md:text-sm">download</span>
                        <span className="text-xs md:text-sm font-medium text-on-surface">Deposit</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-card-padding text-right font-tabular-nums font-bold text-tertiary text-xs md:text-sm">+15,000.00 USD</td>
                    <td className="px-4 py-3 md:px-card-padding text-center">
                      <span className="bg-tertiary-container/20 text-tertiary px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-tertiary/20">Completed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3 md:px-card-padding font-tabular-nums text-xs md:text-sm text-on-surface-variant">#TX-882935-BM</td>
                    <td className="px-4 py-3 md:px-card-padding text-xs md:text-sm text-on-surface-variant">Oct 23, 2023 09:15</td>
                    <td className="px-4 py-3 md:px-card-padding">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="material-symbols-outlined text-error text-[14px] md:text-sm">upload</span>
                        <span className="text-xs md:text-sm font-medium text-on-surface">Withdrawal</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-card-padding text-right font-tabular-nums font-bold text-error text-xs md:text-sm">-2,450.00 USD</td>
                    <td className="px-4 py-3 md:px-card-padding text-center">
                      <span className="bg-secondary-container/20 text-secondary px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-secondary/20">Pending</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 md:px-card-padding md:py-3 bg-surface-container-lowest/50 border-t border-outline-variant/10 flex justify-between items-center">
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
        </div>

        {/* Footer */}
        <footer className="w-full py-6 md:py-12 px-4 md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 border-t border-outline-variant/10 bg-surface-container-lowest mt-auto text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-1 md:gap-2">
            <h4 className="text-sm md:text-headline-md font-bold text-primary">Jamex Global</h4>
            <p className="text-[10px] md:text-sm text-on-surface-variant">© 2024 Jamex Global Markets. Institutional Wealth Management.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link to="#" className="text-[10px] md:text-sm text-on-surface-variant hover:text-on-surface transition-colors">Terms</Link>
            <Link to="#" className="text-[10px] md:text-sm text-on-surface-variant hover:text-on-surface transition-colors">Privacy</Link>
            <Link to="#" className="text-[10px] md:text-sm text-on-surface-variant hover:text-on-surface transition-colors">Risk</Link>
            <Link to="#" className="text-[10px] md:text-sm text-on-surface-variant hover:text-on-surface transition-colors">Security</Link>
          </div>
        </footer>
      </main>

      {/* Mobile Bottom NavBar - 5 sleek items */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-[68px] bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20 flex justify-between items-center px-2 z-50 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <Link to="/dashboard" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[24px]">dashboard</span>
          <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
        </Link>
        <Link to="/invest" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[24px]">account_balance</span>
          <span className="text-[9px] font-bold uppercase tracking-wider">Invest</span>
        </Link>
        <Link to="/wallet" className="flex flex-col items-center justify-center w-full h-full gap-1 text-primary relative">
          <div className="absolute -top-3 w-10 h-1 bg-primary rounded-b-full"></div>
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
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
