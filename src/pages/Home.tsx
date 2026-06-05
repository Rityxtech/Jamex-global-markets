import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, type Variants } from 'motion/react';
import { useMarketStore } from '../store/marketStore';
import { useSiteSettingsStore } from '../store/siteSettingsStore';

/* ─── Reusable scroll-reveal wrappers ─── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; key?: React.Key }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, delay, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  );
}

function StaggerContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const variants: Variants = { visible: { transition: { staggerChildren: 0.07 } }, hidden: {} };
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string; key?: React.Key }) {
  const v: Variants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };
  return <motion.div variants={v} className={className}>{children}</motion.div>;
}

export default function Home() {
  const navigate = useNavigate();
  const { tickers } = useMarketStore();
  const { siteName, siteShortName } = useSiteSettingsStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const btc = tickers['BTCUSDT'];
  const eth = tickers['ETHUSDT'];

  const fmt = (val: number | undefined, fb: string) => (val === undefined ? fb : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val));

  const plans = [
    { name: 'Starter', tier: 'Standard', yield: 1.2, duration: 30, min: 100, max: 4999, accent: 'text-primary' },
    { name: 'Growth', tier: 'Premium', yield: 2.5, duration: 60, min: 5000, max: 24999, accent: 'text-tertiary' },
    { name: 'Institutional', tier: 'Elite', yield: 4.8, duration: 90, min: 25000, max: 100000, accent: 'text-secondary' },
  ];

  const steps = [
    { icon: 'person_add', title: 'Create Account', desc: 'Sign up and complete KYC verification in minutes.' },
    { icon: 'account_balance_wallet', title: 'Deposit Funds', desc: 'Fund your wallet via USD, USDT, ETH, or BTC.' },
    { icon: 'stack_star', title: 'Choose a Plan', desc: 'Pick an investment plan aligned with your goals.' },
    { icon: 'trending_up', title: 'Earn Daily', desc: 'Track returns and withdraw profits anytime.' },
  ];

  const features = [
    { icon: 'autorenew', title: 'Auto Investing', desc: 'Daily yield payouts with automated plan tracking.' },
    { icon: 'wallet', title: 'Secure Wallet', desc: 'Multi-asset deposits and instant withdrawals.' },
    { icon: 'real_estate_agent', title: 'Crypto Loans', desc: 'Borrow against your portfolio with flexible terms.' },
    { icon: 'group_add', title: 'Referral Rewards', desc: 'Earn bonuses from every invited investor.' },
    { icon: 'verified_user', title: 'KYC Verified', desc: 'Fully compliant and audited security standards.' },
    { icon: 'headset_mic', title: '24/7 Support', desc: 'Live tickets and dedicated assistance always.' },
  ];

  const testimonials = [
    { name: 'Marcus T.', role: 'Family Office, Geneva', text: 'Jamex transformed how we allocate digital assets. The daily yield consistency is unmatched.', stars: 5 },
    { name: 'Sarah K.', role: 'Hedge Fund PM, London', text: 'Institutional-grade custody with the UX of a modern fintech. Exactly what we needed.', stars: 5 },
    { name: 'David O.', role: 'Private Investor, Dubai', text: 'Seamless KYC, fast withdrawals, and transparent reporting. Highly recommended.', stars: 5 },
  ];

  const team = [
    { name: 'Alex Graham', role: 'Chief Executive Officer', seed: 'alexreed', img: 'https://fv5-5.files.fm/thumb_show.php?i=qsym2f6tww&view&v=1&PHPSESSID=e60b40f12ea71cb799f381ec1c9042d931626886' },
    { name: 'Deborah Morrison', role: 'Chief Investment Officer', seed: 'oliviachen', img: 'https://fv5-5.files.fm/thumb_show.php?i=9s9sw9gcgq&view&v=1&PHPSESSID=e60b40f12ea71cb799f381ec1c9042d931626886' },
    { name: 'James Thornton', role: 'Head of Compliance', seed: 'jamesthornton', img: 'https://fv5-5.files.fm/thumb_show.php?i=e4ay2s3hhp&view&v=1&PHPSESSID=e60b40f12ea71cb799f381ec1c9042d931626886' },
    { name: 'Sophia Laurent', role: 'Head of Strategy', seed: 'sophialaurent', img: 'https://fv5-5.files.fm/thumb_show.php?i=y8j7m9gpyt&view&v=1&PHPSESSID=e60b40f12ea71cb799f381ec1c9042d931626886' },
    { name: 'Marcus Webb', role: 'Chief Technology Officer', seed: 'marcuswebb', img: 'https://fv5-5.files.fm/thumb_show.php?i=sfajkg88z4&view&v=1&PHPSESSID=e60b40f12ea71cb799f381ec1c9042d931626886' },
  ];

  const faqs = [
    { q: 'What is the minimum deposit to start investing?', a: 'You can begin with as little as $100 on our Starter plan. Higher tiers unlock increased daily yields and extended durations.' },
    { q: 'How quickly can I withdraw my profits?', a: 'Withdrawal requests are processed within 24 hours. Crypto withdrawals are typically completed within minutes.' },
    { q: 'Is my investment insured or guaranteed?', a: 'While returns are based on market performance, all client funds are held in segregated cold-storage wallets with insurance-backed custody.' },
    { q: 'Do I need to complete KYC before investing?', a: 'Yes. Regulatory compliance requires identity verification. The process is automated and usually takes under 5 minutes.' },
    { q: 'Can I take a loan against my portfolio?', a: 'Absolutely. Our loan product lets you borrow up to 60% of your portfolio value without liquidating your positions.' },
  ];

  const tickerItems = [
    { pair: 'BTC/USD', price: fmt(btc?.price, '64,231.50'), change: btc?.change24h ?? 1 },
    { pair: 'ETH/USD', price: fmt(eth?.price, '3,452.12'), change: eth?.change24h ?? 1 },
    { pair: 'XAU/USD', price: '2,341.05', change: -0.5 },
    { pair: 'USDT/USD', price: '1.0001', change: 0 },
    { pair: 'SOL/USD', price: '142.30', change: 2.3 },
    { pair: 'BNB/USD', price: '598.45', change: -1.2 },
  ];

  return (
    <div className="text-on-surface font-body-md selection:bg-primary/30 min-h-screen">
      <main>
        {/* ─── HERO ─── */}
        <section className="relative mt-14 md:mt-16 md:min-h-[520px] lg:min-h-[580px] flex items-center justify-center mesh-gradient overflow-hidden px-4 sm:px-margin-desktop">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          </div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-tertiary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center gap-3 md:gap-10 pt-[15px] pb-3.5 md:pt-16 md:pb-12 px-4">
            <div className="flex-1 text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 glass-card rounded-full mb-2 md:mb-5 border-primary/20">
                <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(78,222,163,0.5)]" />
                <span className="text-label-sm font-label-sm text-tertiary tracking-wider uppercase">Institutional Access Now Live</span>
              </div>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="font-display-lg text-headline-lg md:text-display-lg text-on-surface mb-2 md:mb-5 tracking-tight leading-tight">
              <span className="md:hidden">Grow Your Wealth With {siteShortName}</span>
              <span className="hidden md:inline">Grow Your Wealth With <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Institutional-Grade</span> Investment Plans</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="font-body-md text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-2.5 md:mb-8 leading-relaxed">
              <span className="md:hidden">Institutional grade security and daily yields for global markets.</span>
              <span className="hidden md:inline">Unlock the future of finance with institutional grade security, deep liquidity, and professional grade trading tools for global markets.</span>
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
              <button onClick={() => navigate('/register')} className="cursor-pointer bg-primary-container text-on-primary-container px-6 md:px-8 py-2.5 md:py-3.5 font-headline-md text-body-md rounded-lg shadow-lg shadow-primary-container/20 hover:opacity-90 active:scale-95 transition-all">
                Start Investing
              </button>
              <button onClick={() => navigate('/plans')} className="cursor-pointer glass-card text-on-surface px-6 md:px-8 py-2.5 md:py-3.5 font-headline-md text-body-md rounded-lg hover:border-primary/50 transition-all">
                View Plans
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }} className="mt-3 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {[
                { val: '$42.8B+', lab: 'AUM Managed' },
                { val: '0.01s', lab: 'Execution Speed' },
                { val: '24/7', lab: 'Expert Support' },
                { val: '150+', lab: 'Digital Assets' },
              ].map((s) => (
                <div key={s.lab} className="text-center px-1">
                  <div className="text-headline-md md:text-headline-lg font-headline-md text-primary mb-0.5">{s.val}</div>
                  <div className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">{s.lab}</div>
                </div>
              ))}
            </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="absolute inset-0 -z-10 -mx-4 sm:-mx-margin-desktop lg:mx-0 lg:static lg:z-auto lg:flex-1 lg:max-w-md">
              <div className="relative h-full lg:h-auto">
                <div className="hidden lg:block absolute inset-0 bg-primary/20 rounded-2xl blur-[40px]" />
                <img src="https://fv5-4.files.fm/thumb_show.php?i=qyx4ppzf7x&view&v=1&PHPSESSID=e60b40f12ea71cb799f381ec1c9042d931626886" alt="Digital Wealth" className="absolute inset-0 w-full h-full object-cover opacity-15 lg:relative lg:w-full lg:aspect-[4/3] lg:h-auto lg:opacity-90 lg:rounded-2xl lg:border lg:border-outline-variant/30 lg:shadow-2xl" />
                <div className="hidden lg:block absolute -bottom-4 -left-4 glass-card p-3 rounded-xl border-tertiary/20 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center"><span className="material-symbols-outlined text-tertiary text-[16px]">trending_up</span></div>
                    <div>
                      <div className="text-label-sm font-label-sm text-on-surface">+24.8%</div>
                      <div className="text-label-sm font-label-sm text-on-surface-variant">This Month</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── TICKER TAPE ─── */}
        <section className="landing-ticker-wrap h-11 border-y border-outline-variant/20 flex items-center overflow-hidden">
          <div className="landing-ticker-move flex items-center gap-10 whitespace-nowrap px-6">
            {[...tickerItems, ...tickerItems].map((t, i) => {
              const up = t.change > 0;
              const down = t.change < 0;
              const color = down ? 'text-error' : up ? 'text-tertiary' : 'text-on-surface-variant';
              return (
                <div key={i} className="flex items-center gap-2 shrink-0">
                  <span className="text-label-sm font-label-sm text-on-surface">{t.pair}</span>
                  <span className={`text-tabular-nums font-tabular-nums ${color}`}>{t.price}</span>
                  <span className={`material-symbols-outlined text-[14px] ${color}`}>{down ? 'south_east' : up ? 'north_east' : 'horizontal_rule'}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="py-4 md:py-10 px-4 sm:px-margin-desktop max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto">
          <Reveal className="text-center mb-4 md:mb-8">
            <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest">Simple Process</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-2">How It Works</h2>
          </Reveal>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
            {steps.map((s, i) => (
              <StaggerItem key={s.title}>
                <div className="glass-card rounded-xl hover:border-primary/40 transition-all group h-full overflow-hidden">
                  <div className="h-16 md:h-24 overflow-hidden relative">
                    <img src={i === 3 ? 'https://picsum.photos/seed/jamexdaily/400/150' : `https://images.unsplash.com/photo-${['1551288049-bebda4e38f71','1460925895917-afdab827c52f','1611974789855-9c2a0a7236a3'][i]}?w=400&auto=format&fit=crop&q=80`} alt={s.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-glassCard to-transparent" />
                    <div className="absolute bottom-2 left-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                      </div>
                      <span className="text-label-sm font-label-sm text-on-surface-variant">0{i + 1}</span>
                    </div>
                  </div>
                  <div className="p-3 md:p-5 md:pt-3">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1.5">{s.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ─── INVESTMENT PLANS PREVIEW ─── */}
        <section className="py-4 md:py-10 px-4 sm:px-margin-desktop max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto">
          <Reveal className="flex flex-col md:flex-row justify-between items-end mb-4 md:mb-8 gap-3 md:gap-4">
            <div>
              <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest">Investment Plans</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-2">Choose Your Growth Path</h2>
            </div>
            <button onClick={() => navigate('/plans')} className="text-primary font-label-md text-label-md flex items-center gap-1.5 hover:underline cursor-pointer shrink-0">
              View all plans <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </Reveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-4">
            {plans.map((p) => (
              <StaggerItem key={p.name}>
                <div className="glass-card rounded-xl hover:border-primary/40 transition-all group relative overflow-hidden h-full flex flex-col">
                  <div className={`h-20 md:h-28 relative overflow-hidden`}>
                    <img src={p.name === 'Starter' ? 'https://picsum.photos/seed/jamexgold/400/150' : `https://images.unsplash.com/photo-${p.name === 'Growth' ? '1551288049-bebda4e38f71' : '1611974789855-9c2a0a7236a3'}?w=400&auto=format&fit=crop&q=80`} alt={p.name} className="w-full h-full object-cover opacity-30 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-glassCard to-transparent" />
                    <div className="absolute top-3 left-5">
                      <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">{p.tier}</span>
                    </div>
                  </div>
                  <div className="p-3 md:p-5 md:pt-3 relative flex-1 flex flex-col">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{p.name}</h3>
                    <div className={`font-display-lg text-display-lg ${p.accent} leading-none mb-1`}>{p.yield}%</div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant mb-2.5 md:mb-4">Daily yield</div>
                    <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-5">
                      <div className="flex justify-between text-label-sm font-label-sm"><span className="text-on-surface-variant">Min</span><span className="text-on-surface">${p.min.toLocaleString()}</span></div>
                      <div className="flex justify-between text-label-sm font-label-sm"><span className="text-on-surface-variant">Max</span><span className="text-on-surface">${p.max.toLocaleString()}</span></div>
                      <div className="flex justify-between text-label-sm font-label-sm"><span className="text-on-surface-variant">Duration</span><span className="text-on-surface">{p.duration} days</span></div>
                    </div>
                    <button onClick={() => navigate('/register')} className="w-full cursor-pointer bg-primary-container text-on-primary-container py-2.5 rounded-lg text-label-md font-label-md hover:opacity-90 active:scale-[0.98] transition-all mt-auto">
                      Get Started
                    </button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ─── PLATFORM FEATURES ─── */}
        <section className="py-4 md:py-10 px-4 sm:px-margin-desktop max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto">
          <Reveal className="text-center mb-4 md:mb-8">
            <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest">Why {siteShortName}</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-2">Everything You Need</h2>
          </Reveal>
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-4 flex-1">
              {features.map((f) => (
                <StaggerItem key={f.title}>
                  <div className="glass-card p-3 md:p-5 rounded-xl hover:border-primary/40 transition-all group h-full">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[22px]">{f.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1.5">{f.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{f.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <Reveal className="hidden lg:block w-56 shrink-0" delay={0.2}>
              <div className="glass-card rounded-2xl p-3 sticky top-24">
                <img src="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=400&auto=format&fit=crop&q=80" alt="Platform" className="rounded-xl w-full aspect-[3/4] object-cover opacity-70" />
                <div className="mt-3 text-center">
                  <div className="text-label-md font-label-md text-on-surface">150+ Assets</div>
                  <div className="text-label-sm font-label-sm text-on-surface-variant">Trade global markets</div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── SECURITY & TRUST ─── */}
        <section className="bg-surface-container py-4 md:py-10 px-4 sm:px-margin-desktop">
          <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-10 items-center">
            <Reveal>
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />
                <div className="relative glass-card p-3 rounded-2xl overflow-hidden">
                  <img src="https://picsum.photos/seed/jamexsecurity/600/340" alt="Security" className="rounded-xl w-full aspect-video object-cover opacity-60" />
                  <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 glass-card p-3 md:p-4 rounded-lg border-tertiary/20 max-w-[200px] shadow-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">verified_user</span>
                      <span className="text-label-sm font-label-sm text-on-surface">SOC2 Type II</span>
                    </div>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">Global standards for financial security.</p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest block mb-2">Security First</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-3 md:mb-5">Institutional Grade Security</h2>
                <div className="space-y-2.5 md:space-y-5">
                  {[
                    { icon: 'key', title: 'Biometric 2FA & Multi-Sig', desc: 'Every transaction requires multi-factor authentication and multi-signature authorization.' },
                    { icon: 'policy', title: 'Automated KYC/AML', desc: 'Real-time compliance monitoring using industry-leading forensic tools.' },
                    { icon: 'shield', title: 'Advanced Encryption', desc: 'End-to-end AES-256 encryption with hardware security modules (HSM).' },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="mt-0.5"><span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span></div>
                      <div>
                        <h4 className="font-headline-md text-body-md font-bold text-on-surface mb-1">{item.title}</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── REFERRAL TEASER ─── */}
        <section className="py-4 md:py-10 px-4 sm:px-margin-desktop max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto">
          <Reveal>
            <div className="glass-card rounded-2xl p-0 flex flex-col md:flex-row items-center gap-0 relative overflow-hidden">
              <div className="relative w-full md:w-64 h-36 md:h-auto md:self-stretch shrink-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80" alt="Referral" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-glassCard" />
              </div>
              <div className="p-4 md:p-8 flex-1 relative z-10">
                <span className="text-label-sm font-label-sm text-tertiary uppercase tracking-widest">Referral Program</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 mb-2">Invite Friends, Earn Rewards</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md leading-relaxed mb-2.5 md:mb-4">Share your unique referral code and earn commission on every investment your referrals make.</p>
                <button onClick={() => navigate('/register')} className="cursor-pointer bg-tertiary-container text-on-tertiary-container px-7 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all">
                  Join & Earn
                </button>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="py-4 md:py-10 px-4 sm:px-margin-desktop max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto">
          <Reveal className="text-center mb-4 md:mb-8">
            <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest">Testimonials</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-2">Trusted by Professionals</h2>
          </Reveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-4">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <div className="glass-card p-3 md:p-5 rounded-xl h-full flex flex-col">
                  <div className="flex items-center gap-2.5 md:gap-3 mb-2 md:mb-3">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${t.name}&backgroundColor=2563eb&textColor=ffffff`} alt={t.name} className="w-10 h-10 rounded-full border border-outline-variant/30" />
                    <div>
                      <div className="font-label-md text-label-md text-on-surface font-semibold">{t.name}</div>
                      <div className="text-label-sm font-label-sm text-on-surface-variant">{t.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2 md:mb-3">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-tertiary text-[16px]">star</span>
                    ))}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed flex-1">"{t.text}"</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ─── TEAM ─── */}
        <section className="py-4 md:py-10 px-4 sm:px-margin-desktop max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto">
          <Reveal className="text-center mb-4 md:mb-8">
            <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest">Our Leadership</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-2">Meet the Team</h2>
          </Reveal>
          <StaggerContainer className="flex md:grid md:grid-cols-5 gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-1 -mx-4 px-4 md:mx-0 md:px-0">
            {team.map((m) => (
              <StaggerItem key={m.name} className="snap-start shrink-0 w-[150px] md:w-auto">
                <div className="glass-card rounded-xl overflow-hidden text-center group">
                  <div className="relative h-36 md:h-48 overflow-hidden">
                    <img src={m.img || `https://picsum.photos/seed/${m.seed}/300/400`} alt={m.name} onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${m.seed}/300/400`; }} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-glassCard via-transparent to-transparent" />
                  </div>
                  <div className="p-3 md:p-4">
                    <div className="font-label-md text-label-md text-on-surface font-semibold truncate">{m.name}</div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant truncate">{m.role}</div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-4 md:py-10 px-4 sm:px-margin-desktop max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto">
          <Reveal className="text-center mb-4 md:mb-8">
            <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest">FAQ</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-2">Frequently Asked Questions</h2>
          </Reveal>
          <div className="flex flex-col lg:flex-row gap-4 md:gap-8 items-start">
            <div className="flex-1 space-y-2 md:space-y-3 max-w-3xl mx-auto w-full">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="glass-card rounded-xl overflow-hidden">
                    <button onClick={() => setOpenFaq(open ? null : i)} className="w-full flex items-center justify-between p-3 md:p-4 text-left cursor-pointer">
                      <span className="font-label-md text-label-md text-on-surface font-semibold pr-4">{faq.q}</span>
                      <span className={`material-symbols-outlined text-on-surface-variant shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
                      <p className="px-3 pb-3 md:px-4 md:pb-4 font-body-md text-body-md text-on-surface-variant leading-relaxed">{faq.a}</p>
                    </motion.div>
                  </div>
                </Reveal>
              );
            })}
            </div>
            <Reveal className="hidden lg:block w-56 shrink-0" delay={0.2}>
              <div className="glass-card rounded-2xl p-3 sticky top-24">
                <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80" alt="FAQ" className="rounded-xl w-full aspect-square object-cover opacity-60" />
                <div className="mt-3 text-center">
                  <div className="text-label-md font-label-md text-on-surface">Still have questions?</div>
                  <div className="text-label-sm font-label-sm text-on-surface-variant">Our team is here to help 24/7</div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-4 md:py-10 px-4 sm:px-margin-desktop">
          <Reveal>
            <div className="max-w-4xl xl:max-w-6xl mx-auto bg-primary-container rounded-2xl p-5 md:p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-on-primary-container/10 rounded-full blur-[80px] pointer-events-none" />
              <h2 className="font-headline-lg text-headline-lg text-on-primary-container mb-2 md:mb-3 relative z-10">Ready to Grow Your Wealth?</h2>
              <p className="font-body-md text-body-md text-on-primary-container/80 max-w-lg mx-auto mb-3 md:mb-6 relative z-10">Join leading investors on the most secure wealth platform. Start earning daily yields today.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
                <button onClick={() => navigate('/register')} className="cursor-pointer bg-on-primary-container text-primary-container px-8 py-3.5 font-label-md text-label-md rounded-xl hover:opacity-90 transition-all font-bold">Create Account</button>
                <button onClick={() => navigate('/contact')} className="cursor-pointer bg-primary-container border-2 border-on-primary-container/30 text-on-primary-container px-8 py-3.5 font-label-md text-label-md rounded-xl hover:bg-on-primary-container hover:text-primary-container transition-all">Contact Support</button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="w-full py-4 md:py-8 px-4 sm:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-2.5 md:gap-4 bg-surface-container-lowest border-t border-outline-variant/10">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="text-headline-md font-headline-md font-bold text-primary">{siteShortName}</span>
          <p className="text-label-sm font-label-sm text-on-surface-variant max-w-sm">&copy; 2024 {siteName}. Regulated Institutional Wealth Management.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 md:gap-5">
          <button onClick={() => navigate('/')} className="text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">About us</button>
          <button onClick={() => navigate('/plans')} className="text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">Plans</button>
          <button onClick={() => navigate('/contact')} className="text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">Contact us</button>
          <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Privacy</a>
          <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Terms</a>
        </div>
        <div className="flex gap-3">
          <span className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined text-[18px]">public</span></span>
          <span className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined text-[18px]">support_agent</span></span>
        </div>
      </footer>
    </div>
  );
}
