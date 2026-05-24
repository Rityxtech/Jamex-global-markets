import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMarketStore } from '../store/marketStore';

export default function Home() {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { tickers } = useMarketStore();
  
  const btc = tickers['BTCUSDT'];
  const eth = tickers['ETHUSDT'];
  
  const formatPrice = (val: number | undefined, fallback: string) => {
    if (val === undefined) return fallback;
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  const bgImageUrl = `${(import.meta as any).env.BASE_URL || '/Jamex-global-markets/'}background.jpg`.replace(/\/+/g, '/');

  return (
    <div className="text-on-surface font-body-md selection:bg-primary/30 min-h-screen dark">
      

      <main className="pt-16">
        <section className="relative min-h-[500px] md:min-h-[870px] flex items-center justify-center px-[10px] md:px-margin-desktop py-12 md:py-section-padding-v overflow-hidden bg-surface">
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <img 
              src={bgImageUrl}
              alt="Institutional Wealth Management" 
              className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
            />
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/60 to-surface"></div>
          </div>

          <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          </div>
          
          <div className="relative z-10 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 glass-card rounded-full mb-4 md:mb-6 border-primary/20 scale-90 md:scale-100">
              <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(78,222,163,0.5)]"></span>
              <span className="text-[10px] md:text-label-sm font-label-sm text-tertiary tracking-wider uppercase">Institutional Access Now Live</span>
            </div>
            <h1 className="text-3xl md:text-display-lg font-display-lg text-on-surface mb-4 md:mb-6 tracking-tight leading-tight">
              Institutional Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary block md:inline">Digital Wealth</span> Management
            </h1>
            <p className="text-sm md:text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2 md:px-0">
              Unlocking the future of finance with institutional-grade security, deep liquidity, and professional-grade trading tools for global markets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 w-full px-4 md:px-0">
              <button onClick={() => navigate('/register')} className="w-full sm:w-auto cursor-pointer bg-primary-container text-on-primary-container px-6 md:px-8 py-3 md:py-4 text-sm md:text-body-md font-headline-md rounded-lg shadow-lg shadow-primary-container/20 hover:opacity-90 active:scale-95 transition-all">
                Get Started
              </button>
              <button onClick={() => navigate('/market')} className="w-full sm:w-auto cursor-pointer glass-card text-on-surface px-6 md:px-8 py-3 md:py-4 text-sm md:text-body-md font-headline-md rounded-lg hover:border-primary/50 transition-all">
                View Markets
              </button>
            </div>
            <div className="mt-12 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-2 md:px-0">
              <div className="text-center bg-white/5 md:bg-transparent rounded-lg p-3 md:p-0">
                <div className="text-xl md:text-headline-md font-headline-md text-primary mb-1">$42.8B+</div>
                <div className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">AUM Managed</div>
              </div>
              <div className="text-center bg-white/5 md:bg-transparent rounded-lg p-3 md:p-0">
                <div className="text-xl md:text-headline-md font-headline-md text-primary mb-1">0.01s</div>
                <div className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">Execution Speed</div>
              </div>
              <div className="text-center bg-white/5 md:bg-transparent rounded-lg p-3 md:p-0">
                <div className="text-xl md:text-headline-md font-headline-md text-primary mb-1">24/7</div>
                <div className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">Expert Support</div>
              </div>
              <div className="text-center bg-white/5 md:bg-transparent rounded-lg p-3 md:p-0">
                <div className="text-xl md:text-headline-md font-headline-md text-primary mb-1">150+</div>
                <div className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">Digital Assets</div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-ticker-wrap h-10 md:h-12 border-y border-outline-variant/20 flex items-center">
          <div className="landing-ticker-move flex items-center gap-6 md:gap-12 whitespace-nowrap px-4 md:px-8 scale-90 md:scale-100 origin-left">
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-label-sm text-on-surface">BTC/USD</span>
              <span className={`text-tabular-nums font-tabular-nums ${btc?.change24h < 0 ? 'text-error' : 'text-tertiary'}`}>{formatPrice(btc?.price, '64,231.50')}</span>
              <span className={`material-symbols-outlined text-[14px] ${btc?.change24h < 0 ? 'text-error' : 'text-tertiary'}`}>{btc?.change24h < 0 ? 'south_east' : 'north_east'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-label-sm text-on-surface">ETH/USD</span>
              <span className={`text-tabular-nums font-tabular-nums ${eth?.change24h < 0 ? 'text-error' : 'text-tertiary'}`}>{formatPrice(eth?.price, '3,452.12')}</span>
              <span className={`material-symbols-outlined text-[14px] ${eth?.change24h < 0 ? 'text-error' : 'text-tertiary'}`}>{eth?.change24h < 0 ? 'south_east' : 'north_east'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-label-sm text-on-surface">XAU/USD</span>
              <span className="text-tabular-nums text-error font-tabular-nums">2,341.05</span>
              <span className="material-symbols-outlined text-[14px] text-error" data-icon="south_east">south_east</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-label-sm text-on-surface">USDT/USD</span>
              <span className="text-tabular-nums text-on-surface-variant font-tabular-nums">1.0001</span>
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant" data-icon="horizontal_rule">horizontal_rule</span>
            </div>
            {/* Duplicate for infinite loop effect */}
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-label-sm text-on-surface">BTC/USD</span>
              <span className={`text-tabular-nums font-tabular-nums ${btc?.change24h < 0 ? 'text-error' : 'text-tertiary'}`}>{formatPrice(btc?.price, '64,231.50')}</span>
              <span className={`material-symbols-outlined text-[14px] ${btc?.change24h < 0 ? 'text-error' : 'text-tertiary'}`}>{btc?.change24h < 0 ? 'south_east' : 'north_east'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-label-sm text-on-surface">ETH/USD</span>
              <span className={`text-tabular-nums font-tabular-nums ${eth?.change24h < 0 ? 'text-error' : 'text-tertiary'}`}>{formatPrice(eth?.price, '3,452.12')}</span>
              <span className={`material-symbols-outlined text-[14px] ${eth?.change24h < 0 ? 'text-error' : 'text-tertiary'}`}>{eth?.change24h < 0 ? 'south_east' : 'north_east'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-label-sm text-on-surface">XAU/USD</span>
              <span className="text-tabular-nums text-error font-tabular-nums">2,341.05</span>
              <span className="material-symbols-outlined text-[14px] text-error" data-icon="south_east">south_east</span>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-[10px] md:px-margin-desktop max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-headline-lg font-headline-lg text-on-surface mb-3 md:mb-4">Our Wealth Solutions</h2>
              <p className="text-sm md:text-body-md font-body-md text-on-surface-variant">Sophisticated investment vehicles tailored for high-net-worth individuals and corporate entities.</p>
            </div>
            <button className="text-primary font-label-md text-label-md flex items-center gap-2 hover:underline cursor-pointer text-sm" onClick={() => navigate('/invest')}>
              Explore all solutions <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-gutter">
            <div className="glass-card p-5 md:p-6 rounded-xl hover:border-primary/40 transition-all group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px] md:text-[28px]" data-icon="account_balance">account_balance</span>
              </div>
              <h3 className="text-lg md:text-headline-md font-headline-md text-on-surface mb-2 md:mb-3">Institutional Custody</h3>
              <p className="text-sm md:text-body-md font-body-md text-on-surface-variant mb-4 md:mb-6">Secured vaulting and multi-signature cold storage for digital assets with top-tier insurance coverage.</p>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-center gap-2 text-xs md:text-label-sm font-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-tertiary text-[16px]" data-icon="check_circle">check_circle</span>
                  Cold Storage Architecture
                </li>
                <li className="flex items-center gap-2 text-xs md:text-label-sm font-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-tertiary text-[16px]" data-icon="check_circle">check_circle</span>
                  Insurance Backed
                </li>
              </ul>
            </div>
            <div className="glass-card p-5 md:p-6 rounded-xl hover:border-primary/40 transition-all group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px] md:text-[28px]" data-icon="monitoring">monitoring</span>
              </div>
              <h3 className="text-lg md:text-headline-md font-headline-md text-on-surface mb-2 md:mb-3">Trading Contracts</h3>
              <p className="text-sm md:text-body-md font-body-md text-on-surface-variant mb-4 md:mb-6">Advanced derivative instruments and liquidity solutions for hedging and alpha generation.</p>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-center gap-2 text-xs md:text-label-sm font-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-tertiary text-[16px]" data-icon="check_circle">check_circle</span>
                  Leveraged Exposures
                </li>
                <li className="flex items-center gap-2 text-xs md:text-label-sm font-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-tertiary text-[16px]" data-icon="check_circle">check_circle</span>
                  Real-time Risk Metrics
                </li>
              </ul>
            </div>
            <div className="glass-card p-5 md:p-6 rounded-xl hover:border-primary/40 transition-all group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px] md:text-[28px]" data-icon="diamond">diamond</span>
              </div>
              <h3 className="text-lg md:text-headline-md font-headline-md text-on-surface mb-2 md:mb-3">Private Wealth</h3>
              <p className="text-sm md:text-body-md font-body-md text-on-surface-variant mb-4 md:mb-6">Bespoke portfolio management and personalized advisory services for the digital frontier.</p>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-center gap-2 text-xs md:text-label-sm font-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-tertiary text-[16px]" data-icon="check_circle">check_circle</span>
                  Tax Efficiency Focus
                </li>
                <li className="flex items-center gap-2 text-xs md:text-label-sm font-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-tertiary text-[16px]" data-icon="check_circle">check_circle</span>
                  Dedicated Relationship Lead
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-surface-container py-12 md:py-20 px-[10px] md:px-margin-desktop">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-24 h-24 md:w-40 md:h-40 bg-primary/20 rounded-full blur-[60px] md:blur-[80px]"></div>
              <div className="relative glass-card p-2 md:p-4 rounded-xl md:rounded-2xl">
                <img alt="Security Infrastructure" className="rounded-lg md:rounded-xl w-full aspect-video object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNt_9Oc0JcjbioZaOzFWDqiMucZo12wbDb4XmKJVk9PMKJ5Ecs6g5phxEKJ5UyiDAzkqFhm0zd8h5_iHPs2Y_NRyQsg9arEE_oNOyM3wRVn6FLzQWpzuZVHtIFSXypoxvLgyhlxvpHsQ95H2nu2-WGdNNjTOCDy_z6N15Oi2tWoiJUOAnxzhsxcSieQtNszV5jcO4AvnMD-W0wc3N5zEMtIzACGFK8Nrf1vv1oXwsgM9Fn1hXmaAIStqQF8zRCgxe_yMniJd7LI0Hb" />
                <div className="absolute -bottom-4 md:bottom-8 right-2 md:right-8 glass-card p-4 md:p-6 rounded-lg border-tertiary/20 max-w-[200px] md:max-w-xs shadow-2xl scale-90 md:scale-100 origin-bottom-right">
                  <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                    <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[24px]" data-icon="verified_user" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                    <span className="text-[10px] md:text-label-md font-label-md text-on-surface">SOC2 Type II Certified</span>
                  </div>
                  <p className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant">Our infrastructure meets the highest global standards for financial security.</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-[10px] md:text-label-sm font-label-sm text-primary uppercase tracking-[0.2em] block mb-3 md:mb-4">Security First</span>
              <h2 className="text-2xl md:text-headline-lg font-headline-lg text-on-surface mb-4 md:mb-6">Institutional Grade Security &amp; Compliance</h2>
              <div className="space-y-6 md:space-y-8">
                <div className="flex gap-3 md:gap-4">
                  <div className="mt-1">
                    <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]" data-icon="v_key">key</span>
                  </div>
                  <div>
                    <h4 className="text-base md:text-body-md font-bold text-on-surface mb-1 md:mb-2">Biometric 2FA &amp; Multi-Sig</h4>
                    <p className="text-sm md:text-body-md font-body-md text-on-surface-variant">Every transaction requires multi-factor authentication and multi-signature authorization from geographically dispersed vaults.</p>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4">
                  <div className="mt-1">
                    <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]" data-icon="policy">policy</span>
                  </div>
                  <div>
                    <h4 className="text-base md:text-body-md font-bold text-on-surface mb-1 md:mb-2">Automated KYC/AML</h4>
                    <p className="text-sm md:text-body-md font-body-md text-on-surface-variant">Real-time compliance monitoring using industry-leading forensic tools to ensure a secure ecosystem for all institutional participants.</p>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4">
                  <div className="mt-1">
                    <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]" data-icon="shield">shield</span>
                  </div>
                  <div>
                    <h4 className="text-base md:text-body-md font-bold text-on-surface mb-1 md:mb-2">Advanced Encryption</h4>
                    <p className="text-sm md:text-body-md font-body-md text-on-surface-variant">End-to-end AES-256 bit encryption for all data at rest and in transit, protected by hardware security modules (HSM).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-[10px] md:px-margin-desktop text-center">
          <h2 className="text-2xl md:text-headline-lg font-headline-lg text-on-surface mb-3 md:mb-4">Global Reach, Local Presence</h2>
          <p className="text-sm md:text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8 md:mb-16">Jamex Global Markets serves institutions and private wealth clients across 50+ jurisdictions with local regulatory expertise.</p>
          <div className="relative w-full max-w-5xl mx-auto h-[250px] md:h-[400px] glass-card rounded-2xl md:rounded-3xl overflow-hidden border-outline-variant/30">
            <img alt="Global Network" className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4LgdCbea3Vzl_UuVkRAD-ucOjst_veUgZELvHaoGVURbKre1PDhZuf8oRN_HZ1bfcTIIDV-bwYYvLb3XKu-O4MyGTtfRL2HVzRwrBrRl-woYvprZe2yNhCgkoF4ASOeE72ARHRN8DFS_Ffrepa2WLBrKPi6M__T0UeHXGF58Ton9vqO1-wCSy-ipdRiLQmAAb-6Eas6lu517q4UcqgHf1gFeCB7Eo-bwBlhZt2wLYkT20yrUnEznixk4Y4o0xYubQqfPcIF_KHMCC" />
            <div className="absolute inset-0 flex items-center justify-center p-[10px]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 w-full md:w-auto">
                <div className="p-3 md:p-4 glass-card rounded-xl">
                  <div className="text-xl md:text-headline-md font-headline-md text-on-surface">50+</div>
                  <div className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant">Countries</div>
                </div>
                <div className="p-3 md:p-4 glass-card rounded-xl">
                  <div className="text-xl md:text-headline-md font-headline-md text-on-surface">12</div>
                  <div className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant">Global Offices</div>
                </div>
                <div className="p-3 md:p-4 glass-card rounded-xl">
                  <div className="text-xl md:text-headline-md font-headline-md text-on-surface">24/7</div>
                  <div className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant">Support</div>
                </div>
                <div className="p-3 md:p-4 glass-card rounded-xl">
                  <div className="text-xl md:text-headline-md font-headline-md text-on-surface">1ms</div>
                  <div className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant">Latency</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-[10px] md:px-margin-desktop">
          <div className="max-w-7xl mx-auto bg-primary-container rounded-2xl md:rounded-3xl p-6 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}></div>
            <h2 className="text-2xl md:text-display-lg font-display-lg text-on-primary-container mb-4 md:mb-6 relative z-10">Ready to institutionalize your portfolio?</h2>
            <p className="text-sm md:text-body-lg font-body-lg text-on-primary-container/80 max-w-xl mx-auto mb-6 md:mb-10 relative z-10">Join the world's leading family offices and institutional traders on the most secure wealth platform.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 relative z-10 w-full">
              <button className="w-full sm:w-auto cursor-pointer bg-on-primary-container text-primary-container px-6 md:px-10 py-3 md:py-4 text-sm md:text-body-md font-headline-md rounded-xl hover:opacity-90 transition-all font-bold">Contact Sales</button>
              <button onClick={() => navigate('/register')} className="w-full sm:w-auto cursor-pointer bg-primary-container border-2 border-on-primary-container/30 text-on-primary-container px-6 md:px-10 py-3 md:py-4 text-sm md:text-body-md font-headline-md rounded-xl hover:bg-on-primary-container hover:text-primary-container transition-all">Get Started</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-8 md:py-12 px-[10px] md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant/10">
        <div className="flex flex-col gap-1 md:gap-2 text-center md:text-left">
          <span className="text-xl md:text-headline-md font-headline-md font-bold text-primary">Jamex Global</span>
          <p className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant max-w-sm">© 2024 Jamex Global Markets. Regulated Institutional Wealth Management.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <a className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Terms of Service</a>
          <a className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Privacy Policy</a>
          <a className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Risk Disclosure</a>
          <a className="text-[10px] md:text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Security</a>
        </div>
        <div className="flex gap-4">
          <a className="w-8 h-8 md:w-10 md:h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#">
            <span className="material-symbols-outlined text-[18px] md:text-[24px]" data-icon="public">public</span>
          </a>
          <a className="w-8 h-8 md:w-10 md:h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#">
            <span className="material-symbols-outlined text-[18px] md:text-[24px]" data-icon="support_agent">support_agent</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
