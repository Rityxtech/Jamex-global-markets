import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, type Variants } from 'motion/react';

/* ─── Reusable scroll-reveal wrappers ─── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

export default function About() {
  const navigate = useNavigate();

  const team = [
    { name: 'Alexander Reed', role: 'Chief Executive Officer', seed: 'alexreed' },
    { name: 'Olivia Chen', role: 'Chief Investment Officer', seed: 'oliviachen' },
    { name: 'James Thornton', role: 'Head of Compliance', seed: 'jamesthornton' },
    { name: 'Sophia Laurent', role: 'Head of Strategy', seed: 'sophialaurent' },
    { name: 'Marcus Webb', role: 'Chief Technology Officer', seed: 'marcuswebb' },
  ];

  const values = [
    { icon: 'rocket_launch', title: 'Our Mission', desc: 'Democratize access to institutional-grade wealth-building tools for investors worldwide.' },
    { icon: 'visibility', title: 'Our Vision', desc: 'Become the most trusted global platform for private and institutional investors.' },
    { icon: 'verified', title: 'Our Values', desc: 'Transparency, Security, Innovation, and a relentless Client-First mindset.' },
  ];

  const stats = [
    { value: '$2.4B+', label: 'Assets Managed' },
    { value: '50K+', label: 'Active Investors' },
    { value: '50+', label: 'Jurisdictions' },
    { value: '99.99%', label: 'Uptime' },
  ];

  const differentiators = [
    { icon: 'lock', title: 'Institutional Security', desc: 'AES-256 encryption, HSM-protected keys, and cold storage for digital assets.' },
    { icon: 'policy', title: 'Regulated & Compliant', desc: 'Licensed across 50+ jurisdictions with full KYC/AML procedures.' },
    { icon: 'trending_up', title: 'Transparent Returns', desc: 'Daily yield payouts with real-time portfolio tracking and reporting.' },
    { icon: 'public', title: 'Global Access', desc: 'Multi-currency support, local payment methods, and 24/7 client assistance.' },
  ];

  const badges = [
    { icon: 'shield', label: 'SOC 2 Type II' },
    { icon: 'security', label: 'ISO 27001' },
    { icon: 'gavel', label: 'FinCEN Registered' },
    { icon: 'verified_user', label: 'SEC Compliant' },
  ];

  return (
    <div className="text-on-surface font-body-md selection:bg-primary/30 min-h-screen">
      <main>
        {/* ─── HERO ─── */}
        <section className="mt-14 md:mt-16 pt-6 md:pt-10 pb-6 md:pb-10 px-4 sm:px-margin-desktop text-center">
          <Reveal>
            <div className="max-w-2xl mx-auto">
              <span className="inline-block text-label-sm font-label-sm text-primary uppercase tracking-widest mb-2">About Jamex Global</span>
              <h1 className="font-display-lg text-display-lg text-on-surface mb-2 md:mb-3 leading-tight">
                Building the Future of<br className="hidden md:block" /> Wealth Management
              </h1>
              <p className="text-body-md font-body-md text-on-surface-variant max-w-lg mx-auto">
                Since 2019, we have empowered investors worldwide with institutional-grade tools, transparent returns, and unwavering security.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ─── OUR STORY ─── */}
        <section className="bg-surface-container py-4 md:py-8 px-4 sm:px-margin-desktop">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center">
            <Reveal className="order-2 lg:order-1">
              <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-1 block">Our Story</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 md:mb-3">From Vision to Global Impact</h2>
              <div className="space-y-2 md:space-y-3 text-body-md font-body-md text-on-surface-variant">
                <p>Jamex Global Markets was founded in 2019 with a clear mission: bridge the gap between everyday investors and institutional-grade wealth management.</p>
                <p>By 2021, we surpassed $1 billion in assets under management, validating our approach to transparent, high-yield investment strategies.</p>
                <p>Today, we serve over 50,000 active investors across 50+ jurisdictions, offering everything from automated investment plans to crypto-backed lending.</p>
              </div>
            </Reveal>
            <Reveal delay={0.15} className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden border border-outline-variant/30 shadow-xl">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80" alt="Office" className="w-full h-48 md:h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── MISSION, VISION & VALUES ─── */}
        <section className="py-4 md:py-8 px-4 sm:px-margin-desktop">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-3 md:mb-5">
              <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-1 block">What Drives Us</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Mission, Vision & Values</h2>
            </Reveal>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-4">
              {values.map((v) => (
                <StaggerItem key={v.title}>
                  <div className="glass-card rounded-xl p-4 md:p-5 h-full">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-[20px] text-primary">{v.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{v.title}</h3>
                    <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">{v.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── BY THE NUMBERS ─── */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 py-4 md:py-6 px-4 sm:px-margin-desktop">
          <div className="max-w-6xl mx-auto">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {stats.map((s) => (
                <StaggerItem key={s.label}>
                  <div className="text-center py-2 md:py-3">
                    <div className="font-display-lg text-display-lg text-primary mb-0.5">{s.value}</div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant">{s.label}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── WHAT SETS US APART ─── */}
        <section className="py-4 md:py-8 px-4 sm:px-margin-desktop">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-3 md:mb-5">
              <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-1 block">Why Choose Us</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">What Sets Us Apart</h2>
            </Reveal>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-4">
              {differentiators.map((d) => (
                <StaggerItem key={d.title}>
                  <div className="glass-card rounded-xl p-4 md:p-5 h-full flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px] text-primary">{d.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-0.5">{d.title}</h3>
                      <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── LEADERSHIP TEAM ─── */}
        <section className="bg-surface-container py-4 md:py-8 px-4 sm:px-margin-desktop">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-3 md:mb-5">
              <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-1 block">Meet The Team</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Leadership</h2>
            </Reveal>
            <StaggerContainer className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
              {team.map((m) => (
                <StaggerItem key={m.name} className="snap-start shrink-0 w-[160px] md:w-[200px]">
                  <div className="glass-card rounded-xl p-3 md:p-4 text-center h-full flex flex-col items-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 ring-2 ring-primary/20">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.seed}`} alt={m.name} className="w-full h-full object-cover bg-surface-container-high" />
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-0.5 truncate w-full">{m.name}</h3>
                    <p className="text-label-sm font-label-sm text-on-surface-variant truncate w-full">{m.role}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── REGULATORY & COMPLIANCE ─── */}
        <section className="py-4 md:py-8 px-4 sm:px-margin-desktop">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-3 md:mb-5">
              <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-1 block">Trust & Safety</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Regulated & Compliant</h2>
            </Reveal>
            <StaggerContainer className="flex flex-wrap justify-center gap-2.5 md:gap-3">
              {badges.map((b) => (
                <StaggerItem key={b.label}>
                  <div className="glass-card rounded-xl px-4 py-2.5 md:px-5 md:py-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] md:text-[20px] text-primary">{b.icon}</span>
                    <span className="text-label-md font-label-md text-on-surface">{b.label}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-4 md:py-8 px-4 sm:px-margin-desktop">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-5 md:p-8 text-center border border-outline-variant/20">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1 md:mb-2">Ready to grow your wealth?</h2>
                <p className="text-body-md font-body-md text-on-surface-variant mb-3 md:mb-5 max-w-md mx-auto">Join 50,000+ investors who trust Jamex Global Markets.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 md:gap-3">
                  <button onClick={() => navigate('/register')} className="w-full sm:w-auto cursor-pointer bg-[#2563eb] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all">
                    Get Started
                  </button>
                  <button onClick={() => navigate('/support')} className="w-full sm:w-auto cursor-pointer glass-card text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm hover:border-primary/50 transition-all">
                    Contact Us
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}
