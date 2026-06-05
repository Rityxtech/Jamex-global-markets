import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, type Variants } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useInvestmentStore } from '../store/investmentStore';
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

// Define how different plan tiers look visually
const TIER_STYLES: Record<string, any> = {
    'Starter': {
        accentClass: 'text-primary',
        borderClass: 'border-primary/20 group-hover:border-primary/50',
        bgGlow: 'from-primary/10',
        glowColor: 'bg-primary/30',
        buttonClass: 'bg-primary/10 text-primary hover:bg-primary hover:text-on-primary',
        popular: false,
        features: ['Basic Support', 'Standard Execution', 'Monthly Reporting']
    },
    'Standard': {
        accentClass: 'text-secondary',
        borderClass: 'border-secondary/20 group-hover:border-secondary/50',
        bgGlow: 'from-secondary/10',
        glowColor: 'bg-secondary/30',
        buttonClass: 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-on-secondary',
        popular: false,
        features: ['Standard Support', 'Standard Execution', 'Weekly Reporting']
    },
    'Professional': {
        accentClass: 'text-tertiary',
        borderClass: 'border-tertiary/50 shadow-[0_0_20px_rgba(78,222,163,0.15)] group-hover:border-tertiary/80',
        bgGlow: 'from-tertiary/20',
        glowColor: 'bg-tertiary/30',
        buttonClass: 'bg-tertiary text-on-tertiary hover:brightness-110 shadow-lg shadow-tertiary/20',
        popular: true,
        features: ['Priority Support', 'Enhanced Execution', 'Weekly Reporting', 'Dedicated Manager']
    },
    'Executive': {
        accentClass: 'text-[#8b5cf6]',
        borderClass: 'border-[#8b5cf6]/20 group-hover:border-[#8b5cf6]/50',
        bgGlow: 'from-[#8b5cf6]/10',
        glowColor: 'bg-[#8b5cf6]/30',
        buttonClass: 'bg-[#8b5cf6]/10 text-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white',
        popular: false,
        features: ['24/7 VIP Support', 'Institutional Execution', 'Daily Reporting', 'Senior Account Manager', 'Exclusive Webinars']
    },
    'VIP': {
        accentClass: 'text-[#f59e0b]',
        borderClass: 'border-[#f59e0b]/20 group-hover:border-[#f59e0b]/50',
        bgGlow: 'from-[#f59e0b]/10',
        glowColor: 'bg-[#f59e0b]/30',
        buttonClass: 'bg-[#f59e0b]/10 text-[#f59e0b] hover:bg-[#f59e0b] hover:text-[#222]',
        popular: false,
        features: ['Direct Board Access', 'Zero Spread Execution', 'Real-time Analytics', 'Private Events Access', 'Custom Strategies']
    }
};

const STATIC_PLANS = [
    {
        id: 'static-starter',
        name: 'Starter Plan',
        roi: 0.8,
        duration: 30,
        min: 100,
        max: 2999,
        ...TIER_STYLES['Starter']
    },
    {
        id: 'static-growth',
        name: 'Growth Plan',
        roi: 1.5,
        duration: 60,
        min: 3000,
        max: 14999,
        ...TIER_STYLES['Standard']
    },
    {
        id: 'static-pro',
        name: 'Professional Plan',
        roi: 2.8,
        duration: 90,
        min: 15000,
        max: 49999,
        ...TIER_STYLES['Professional']
    },
    {
        id: 'static-exec',
        name: 'Executive Plan',
        roi: 4.2,
        duration: 120,
        min: 50000,
        max: 199999,
        ...TIER_STYLES['Executive']
    },
];

export default function Plans() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { siteName } = useSiteSettingsStore();
    const { investments, fetchInvestments } = useInvestmentStore();
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [calcAmount, setCalcAmount] = useState('1000');
    const [calcPlanId, setCalcPlanId] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        // Logged out: show mock plans immediately — no fetch, no spinner
        if (!user) {
            setPlans(STATIC_PLANS);
            const defaultPlan = STATIC_PLANS.find(p => p.name.includes('Growth')) || STATIC_PLANS[0];
            if (defaultPlan) setCalcPlanId(defaultPlan.id);
            setLoading(false);
            return;
        }

        // Logged in: fetch real plans from Supabase
        let timedOut = false;
        const timeoutId = setTimeout(() => {
            timedOut = true;
            console.warn('Plans fetch timed out — showing static fallback');
            setPlans(STATIC_PLANS);
            const defaultPlan = STATIC_PLANS.find(p => p.name.includes('Growth')) || STATIC_PLANS[0];
            if (defaultPlan) setCalcPlanId(defaultPlan.id);
            setLoading(false);
        }, 3000);

        const fetchPlans = async () => {
            try {
                const { data, error } = await supabase
                    .from('investment_plans')
                    .select('*')
                    .eq('is_active', true)
                    .order('min_amount', { ascending: true });

                if (timedOut) return;

                if (error) {
                    console.error('Error fetching plans:', error);
                    setPlans(STATIC_PLANS);
                    const defaultPlan = STATIC_PLANS.find(p => p.name.includes('Growth')) || STATIC_PLANS[0];
                    if (defaultPlan) setCalcPlanId(defaultPlan.id);
                    return;
                }

                if (data && data.length > 0) {
                    const mappedPlans = data.map(p => {
                        const style = TIER_STYLES[p.tier] || TIER_STYLES['Standard'];
                        return {
                            id: p.id,
                            name: p.name,
                            roi: p.daily_yield,
                            duration: p.duration_days,
                            min: p.min_amount,
                            max: p.max_amount,
                            ...style
                        };
                    });
                    setPlans(mappedPlans);
                    const defaultPlan = mappedPlans.find(p => p.name.includes('Standard')) || mappedPlans[0];
                    if (defaultPlan) setCalcPlanId(defaultPlan.id);
                } else {
                    setPlans(STATIC_PLANS);
                    const defaultPlan = STATIC_PLANS.find(p => p.name.includes('Growth')) || STATIC_PLANS[0];
                    if (defaultPlan) setCalcPlanId(defaultPlan.id);
                }
            } catch (err) {
                if (timedOut) return;
                console.error('Failed to fetch plans:', err);
                setPlans(STATIC_PLANS);
                const defaultPlan = STATIC_PLANS.find(p => p.name.includes('Growth')) || STATIC_PLANS[0];
                if (defaultPlan) setCalcPlanId(defaultPlan.id);
            } finally {
                if (!timedOut) {
                    clearTimeout(timeoutId);
                    setLoading(false);
                }
            }
        };

        fetchPlans();
        return () => clearTimeout(timeoutId);
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchInvestments(user.id);
        }
    }, [user, fetchInvestments]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    const handleSelectPlan = (plan: any) => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/confirm-investment', { state: { plan } });
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-14 md:pt-16 flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            </div>
        );
    }

    const activeInvestments = investments.filter(inv => inv.status === 'active');
    const hasPlans = plans.length > 0;

    const howSteps = [
        { icon: 'diamond', title: 'Choose a Plan', desc: 'Select a tier that matches your goals and budget.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80' },
        { icon: 'account_balance_wallet', title: 'Deposit Funds', desc: 'Fund your wallet via USD, USDT, ETH, or BTC.', img: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&auto=format&fit=crop&q=80' },
        { icon: 'trending_up', title: 'Earn Daily', desc: 'Receive automated daily yield payouts to your wallet.', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&auto=format&fit=crop&q=80' },
        { icon: 'payments', title: 'Withdraw Anytime', desc: 'Withdraw profits instantly with zero hidden fees.', img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&auto=format&fit=crop&q=80' },
    ];

    const planFaqs = [
        { q: 'Are the daily yields guaranteed?', a: 'Yes. Each plan displays a fixed daily yield percentage that is paid out automatically to your wallet every 24 hours.' },
        { q: 'What happens when my plan duration ends?', a: 'Upon maturity, your principal is returned to your wallet along with all accumulated profits. You can then reinvest or withdraw.' },
        { q: 'Can I invest in multiple plans at once?', a: 'Absolutely. There is no limit to how many active investments you can hold across different tiers.' },
    ];

    const testimonials = [
        { name: 'James M.', role: 'Private Investor', text: 'The daily yields are consistent and withdrawals are processed within hours. Best platform I have used.', stars: 5 },
        { name: 'Sarah K.', role: 'Portfolio Manager', text: 'I manage multiple client accounts here. The reporting tools and security are institutional-grade.', stars: 5 },
        { name: 'David O.', role: 'Crypto Trader', text: 'Finally a platform that combines traditional wealth management with crypto flexibility.', stars: 5 },
    ];

    return (
        <div className="text-on-surface font-body-md selection:bg-primary/30 min-h-screen pt-14 md:pt-16">
            <main className="max-w-[1600px] mx-auto w-full px-2 md:px-margin-desktop pb-4 md:pb-8">
                {/* HERO — Different for logged-in vs logged-out */}
                {user ? (
                    /* Logged in: compact dashboard hero */
                    <section className="pt-3 md:pt-5 pb-3 md:pb-5">
                        <Reveal>
                            <div className="glass-card rounded-2xl p-3 md:p-5 border border-outline-variant/30 flex flex-col lg:flex-row items-center justify-between gap-2.5 md:gap-4 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
                                <div className="flex-1 relative z-10 w-full text-left">
                                    <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                                        <div className="bg-primary/10 p-1 md:p-1.5 rounded-lg border border-primary/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-[14px] md:text-[18px]">diamond</span>
                                        </div>
                                        <span className="text-[10px] md:text-label-sm font-label-sm font-bold uppercase tracking-widest text-primary">Your Investment Hub</span>
                                    </div>
                                    <h1 className="text-lg md:text-display-sm font-display-sm font-extrabold text-on-surface tracking-tight leading-tight mb-1.5 md:mb-2">
                                        Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-primary animate-shimmer bg-[length:200%_auto]">Portfolio</span>
                                    </h1>
                                    <p className="text-sm md:text-body-md font-body-md text-on-surface-variant max-w-xl">
                                        View your active investments, track daily yields, and explore new opportunities to grow your wealth.
                                    </p>
                                </div>
                                <div className="hidden lg:flex gap-3 relative z-10 shrink-0">
                                    <div className="bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl p-3 flex flex-col justify-center min-w-[120px] shadow-sm backdrop-blur-md">
                                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Active Plans</span>
                                        <span className="text-base font-bold text-on-surface">{activeInvestments.length}</span>
                                    </div>
                                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col justify-center min-w-[120px] shadow-sm backdrop-blur-md">
                                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider mb-0.5">Max Daily Yield</span>
                                        <span className="text-base font-bold text-primary">Up to 6%</span>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </section>
                ) : (
                    /* Logged out: cinematic full-bleed hero */
                    <section className="relative -mx-2 md:mx-0 md:min-h-[520px] lg:min-h-[580px] flex items-center justify-center overflow-hidden px-4 sm:px-margin-desktop">
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                        </div>
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-tertiary/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

                        <div className="relative z-10 max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center gap-3 md:gap-10 pt-[15px] pb-3.5 md:pt-16 md:pb-12 px-4">
                            <div className="flex-1 text-center lg:text-left">
                                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 glass-card rounded-full mb-2 md:mb-5 border-primary/20">
                                        <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(78,222,163,0.5)]" />
                                        <span className="text-label-sm font-label-sm text-tertiary tracking-wider uppercase">Premium Asset Management</span>
                                    </div>
                                </motion.div>
                                <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="font-display-lg text-headline-lg md:text-display-lg text-on-surface mb-2 md:mb-5 tracking-tight leading-tight">
                                    <span className="md:hidden">Choose Your Wealth Strategy</span>
                                    <span className="hidden md:inline">Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Wealth Strategy</span></span>
                                </motion.h1>
                                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="font-body-md text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-2.5 md:mb-8 leading-relaxed">
                                    <span className="md:hidden">Daily yields with institutional security.</span>
                                    <span className="hidden md:inline">Select a curated investment plan tailored to your financial goals. Enjoy guaranteed daily yields, automated compounding, and institutional-grade security.</span>
                                </motion.p>
                                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.3 }} className="flex flex-row items-center justify-center lg:justify-start gap-2 md:gap-3">
                                    <button onClick={() => navigate('/register')} className="cursor-pointer bg-primary-container text-on-primary-container px-6 md:px-8 py-2.5 md:py-3.5 font-headline-md text-body-md rounded-lg shadow-lg shadow-primary-container/20 hover:opacity-90 active:scale-95 transition-all whitespace-nowrap">
                                        Start Investing
                                    </button>
                                    <button onClick={() => { document.getElementById('available-plans')?.scrollIntoView({ behavior: 'smooth' }); }} className="cursor-pointer glass-card text-on-surface px-6 md:px-8 py-2.5 md:py-3.5 font-headline-md text-body-md rounded-lg hover:border-primary/50 transition-all whitespace-nowrap">
                                        Explore Plans
                                    </button>
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }} className="mt-3 md:mt-10 grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6 max-w-md mx-auto lg:mx-0">
                                    {[
                                        { val: '50K+', lab: 'Investors' },
                                        { val: '$2.4B+', lab: 'Assets Managed' },
                                        { val: 'Up to 6%', lab: 'Daily Yield' },
                                    ].map((s) => (
                                        <div key={s.lab} className="text-center">
                                            <div className="text-headline-md font-headline-md text-primary mb-0.5">{s.val}</div>
                                            <div className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">{s.lab}</div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="hidden lg:block relative flex-1 max-w-md">
                                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-[40px]" />
                                <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80" alt="Wealth Strategy" className="relative w-full aspect-[4/3] rounded-2xl border border-outline-variant/30 shadow-2xl object-cover opacity-90" />
                                <div className="absolute -bottom-4 -left-4 glass-card p-3 rounded-xl border-tertiary/20 shadow-xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center"><span className="material-symbols-outlined text-tertiary text-[16px]">trending_up</span></div>
                                        <div>
                                            <div className="text-label-sm font-label-sm text-on-surface">+24.8%</div>
                                            <div className="text-label-sm font-label-sm text-on-surface-variant">Avg. Monthly</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* LOGGED IN: Active Investments */}
                {user && activeInvestments.length > 0 && (
                    <section className="pb-3 md:pb-5">
                        <Reveal>
                            <div className="flex items-center justify-between mb-2.5 md:mb-4">
                                <div>
                                    <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest">Portfolio</span>
                                    <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">My Active Investments</h2>
                                </div>
                                <button onClick={() => navigate('/invest')} className="text-primary font-label-md text-label-md flex items-center gap-1.5 hover:underline cursor-pointer shrink-0">
                                    View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </button>
                            </div>
                        </Reveal>
                        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-4">
                            {activeInvestments.slice(0, 3).map((inv) => {
                                const dailyProfit = inv.amount * inv.expected_roi;
                                const planStyle = TIER_STYLES[inv.plan_name] || TIER_STYLES['Standard'];
                                return (
                                    <StaggerItem key={inv.id}>
                                        <div className="glass-card rounded-xl p-3 md:p-4 border border-outline-variant/20 relative overflow-hidden">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{inv.plan_name}</span>
                                                <span className="bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full">Active</span>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-on-surface-variant">Invested</span>
                                                    <span className="font-bold text-on-surface">{formatCurrency(inv.amount)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-on-surface-variant">Daily Yield</span>
                                                    <span className={`font-bold ${planStyle.accentClass}`}>{formatCurrency(dailyProfit)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-on-surface-variant">Next Payout</span>
                                                    <span className="font-bold text-on-surface">
                                                        {inv.next_payout_date ? new Date(inv.next_payout_date).toLocaleDateString() : '—'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </StaggerItem>
                                );
                            })}
                        </StaggerContainer>
                    </section>
                )}

                {/* LOGGED IN: No investments prompt */}
                {user && activeInvestments.length === 0 && hasPlans && (
                    <section className="pb-3 md:pb-5">
                        <Reveal>
                            <div className="glass-card rounded-xl p-4 md:p-6 border border-primary/20 text-center">
                                <span className="material-symbols-outlined text-primary text-3xl mb-2">savings</span>
                                <h3 className="font-headline-md text-headline-md text-on-surface mb-1">Start Your First Investment</h3>
                                <p className="text-body-md font-body-md text-on-surface-variant mb-3 max-w-md mx-auto">Choose a plan below and begin earning daily yields immediately.</p>
                                <button onClick={() => { document.getElementById('available-plans')?.scrollIntoView({ behavior: 'smooth' }); }} className="cursor-pointer bg-primary-container text-on-primary-container px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
                                    Browse Plans
                                </button>
                            </div>
                        </Reveal>
                    </section>
                )}

                {/* PLANS GRID */}
                <section id="available-plans" className="pb-3 md:pb-5 relative">
                    {!user && (
                        <>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none z-0" />
                            <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/5 rounded-full blur-[80px] pointer-events-none z-0" />
                        </>
                    )}
                    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 md:gap-4 relative z-10">
                        {plans.map((plan) => (
                            <StaggerItem key={plan.id}>
                                <div className={`relative glass-card bg-surface-container-low/40 backdrop-blur-xl rounded-2xl flex flex-col transition-all duration-500 group hover:-translate-y-1 border ${plan.borderClass} shadow-lg group-hover:shadow-2xl ${plan.popular ? 'lg:-translate-y-2 lg:hover:-translate-y-3' : ''}`}>
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-0 right-0 flex justify-center">
                                            <span className="bg-tertiary text-on-tertiary text-[10px] font-bold uppercase tracking-widest py-0.5 px-3 rounded-full shadow-lg shadow-tertiary/30 border border-tertiary-container flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px]">star</span>
                                                Most Popular
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${plan.bgGlow} via-transparent to-transparent opacity-80`} />
                                        <div className={`absolute -top-16 -right-16 w-32 h-32 ${plan.glowColor} rounded-full blur-[40px] opacity-60 group-hover:scale-150 transition-transform duration-700`} />
                                        <div className={`absolute -bottom-16 -left-16 w-32 h-32 ${plan.glowColor} rounded-full blur-[40px] opacity-40 group-hover:scale-150 transition-transform duration-700`} />
                                        <div className="absolute inset-0 opacity-[0.06] mix-blend-plus-lighter" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                                    </div>
                                    <div className="p-3 md:p-4 flex flex-col flex-1 relative z-10">
                                        <div className="text-center mb-2">
                                            <h3 className="text-sm md:text-headline-sm font-headline-sm font-bold text-on-surface mb-1 tracking-tight">{plan.name}</h3>
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className={`text-2xl md:text-display-sm font-extrabold font-tabular-nums tracking-tighter ${plan.accentClass}`}>{plan.roi}%</span>
                                                <span className="text-[10px] md:text-label-sm font-label-sm font-bold text-on-surface-variant uppercase tracking-wider">/Daily</span>
                                            </div>
                                        </div>
                                        <div className="w-full h-px bg-outline-variant/20 mb-2" />
                                        <div className="space-y-1 mb-2">
                                            <div className="flex justify-between items-center text-xs md:text-sm">
                                                <span className="text-on-surface-variant font-medium">Duration</span>
                                                <span className="text-on-surface font-bold">{plan.duration} Days</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs md:text-sm">
                                                <span className="text-on-surface-variant font-medium">Min Deposit</span>
                                                <span className="text-on-surface font-bold font-tabular-nums">{formatCurrency(plan.min)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs md:text-sm">
                                                <span className="text-on-surface-variant font-medium">Max Deposit</span>
                                                <span className="text-on-surface font-bold font-tabular-nums">{plan.max ? formatCurrency(plan.max) : 'Unlimited'}</span>
                                            </div>
                                        </div>
                                        <div className="w-full h-px bg-outline-variant/20 mb-2" />
                                        <ul className="space-y-1 mb-2 flex-1">
                                            {plan.features.map((feature: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className={`material-symbols-outlined text-[16px] shrink-0 ${plan.accentClass}`}>check_circle</span>
                                                    <span className="text-[11px] md:text-xs text-on-surface-variant font-medium leading-tight">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <button onClick={() => handleSelectPlan(plan)} className={`w-full py-2 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 group/btn ${plan.buttonClass}`}>
                                            Invest Now
                                            <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                    {!hasPlans && (
                        <Reveal>
                            <div className="glass-card rounded-xl p-6 md:p-8 text-center border border-outline-variant/20 relative z-10">
                                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3">inventory_2</span>
                                <h3 className="font-headline-md text-headline-md text-on-surface mb-1">No Plans Available</h3>
                                <p className="text-body-md font-body-md text-on-surface-variant max-w-md mx-auto">Investment plans will appear here once they are configured. Please check back later.</p>
                            </div>
                        </Reveal>
                    )}
                </section>

                {/* ROI CALCULATOR */}
                <section className="pb-3 md:pb-5">
                    <Reveal>
                        <div className="max-w-5xl mx-auto glass-card rounded-2xl p-3 md:p-5 border border-outline-variant/30 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                            <div className="text-center mb-2 md:mb-4 relative z-10">
                                <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-1 block">Estimator</span>
                                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-0.5 md:mb-1 tracking-tight">ROI Calculator</h2>
                                <p className="text-body-md font-body-md text-on-surface-variant">Estimate your potential returns.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4 relative z-10">
                                <div className="space-y-2 md:space-y-3">
                                    <div>
                                        <label className="block text-[10px] md:text-label-sm font-label-sm font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Investment Amount ($)</label>
                                        <input type="number" value={calcAmount} onChange={(e) => setCalcAmount(e.target.value)} className="w-full bg-surface-container-high/50 border border-outline-variant/30 rounded-xl px-3 py-2 md:px-4 md:py-2.5 text-on-surface font-bold focus:outline-none focus:border-primary transition-colors text-sm" placeholder="Enter amount..." />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] md:text-label-sm font-label-sm font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Select Plan</label>
                                        <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                                            {plans.map(p => (
                                                <button key={p.id} onClick={() => setCalcPlanId(p.id)} className={`px-2 py-1.5 md:py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all border ${calcPlanId === p.id ? 'bg-primary/10 border-primary/50 text-primary shadow-sm shadow-primary/20' : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/50 hover:bg-surface-container'}`}>
                                                    {p.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {(() => {
                                    const selectedPlan = plans.find(p => p.id === calcPlanId) || plans[0];
                                    if (!selectedPlan) {
                                        return (
                                            <div className="bg-surface-container-highest/30 rounded-xl p-3 md:p-5 border border-outline-variant/20 flex flex-col justify-center relative overflow-hidden">
                                                <div className="text-center text-on-surface-variant">
                                                    <span className="material-symbols-outlined text-3xl mb-2">calculate</span>
                                                    <p className="text-sm font-medium">No plans available for calculation.</p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    const amount = parseFloat(calcAmount) || 0;
                                    const dailyProfit = amount * (selectedPlan.roi / 100);
                                    const totalProfit = dailyProfit * selectedPlan.duration;
                                    const totalReturn = amount + totalProfit;
                                    return (
                                        <div className="bg-surface-container-highest/30 rounded-xl p-3 md:p-5 border border-outline-variant/20 flex flex-col justify-center relative overflow-hidden">
                                            <div className="absolute right-0 top-0 w-24 h-24 bg-tertiary/10 blur-[40px] rounded-full pointer-events-none" />
                                            <div className="space-y-1.5 md:space-y-3 relative z-10">
                                                <div className="flex justify-between items-center pb-1.5 md:pb-3 border-b border-outline-variant/20">
                                                    <span className="text-[10px] md:text-label-sm font-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Daily Profit</span>
                                                    <span className="font-bold text-tertiary text-sm md:text-lg">{formatCurrency(dailyProfit)}</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-1.5 md:pb-3 border-b border-outline-variant/20">
                                                    <span className="text-[10px] md:text-label-sm font-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Total Profit ({selectedPlan.duration}d)</span>
                                                    <span className="font-bold text-tertiary text-sm md:text-lg">{formatCurrency(totalProfit)}</span>
                                                </div>
                                                <div className="flex justify-between items-end pt-0.5 md:pt-1">
                                                    <span className="text-xs md:text-sm font-bold text-on-surface uppercase tracking-wider">Total Return</span>
                                                    <span className="text-xl md:text-2xl font-extrabold text-primary tracking-tight">{formatCurrency(totalReturn)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* HOW IT WORKS */}
                <section className="bg-surface-container py-3 md:py-5 px-2 md:px-0 -mx-2 md:mx-0 relative overflow-hidden">
                    {!user && (
                        <div className="absolute top-1/2 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
                    )}
                    <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto relative z-10">
                        <Reveal className="text-center mb-2.5 md:mb-4">
                            <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-1 block">Simple Process</span>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface">How Plans Work</h2>
                        </Reveal>
                        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
                            {howSteps.map((s, i) => (
                                <StaggerItem key={s.title}>
                                    {user ? (
                                        <div className="glass-card rounded-xl p-3 md:p-4 text-center h-full">
                                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
                                                <span className="material-symbols-outlined text-[18px] text-primary">{s.icon}</span>
                                            </div>
                                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-0.5">{s.title}</h3>
                                            <p className="text-[11px] md:text-xs text-on-surface-variant leading-relaxed">{s.desc}</p>
                                        </div>
                                    ) : (
                                        <div className="glass-card rounded-xl hover:border-primary/40 transition-all group h-full overflow-hidden">
                                            <div className="h-16 md:h-24 overflow-hidden relative">
                                                <img src={s.img} alt={s.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-glassCard to-transparent" />
                                                <div className="absolute bottom-2 left-4 flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center text-primary">
                                                        <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                                                    </div>
                                                    <span className="text-label-sm font-label-sm text-on-surface-variant">0{i + 1}</span>
                                                </div>
                                            </div>
                                            <div className="p-3 md:p-4 md:pt-3">
                                                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{s.title}</h3>
                                                <p className="text-[11px] md:text-xs text-on-surface-variant leading-relaxed">{s.desc}</p>
                                            </div>
                                        </div>
                                    )}
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-3 md:py-5">
                    <div className="max-w-3xl mx-auto">
                        <Reveal className="text-center mb-2.5 md:mb-4">
                            <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-1 block">Common Questions</span>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface">Plan FAQ</h2>
                        </Reveal>
                        <div className="space-y-1.5 md:space-y-2">
                            {planFaqs.map((faq, i) => (
                                <Reveal key={i} delay={i * 0.05}>
                                    <div className="glass-card rounded-xl overflow-hidden">
                                        <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-3 md:p-4 text-left">
                                            <span className="font-headline-sm text-headline-sm text-on-surface pr-2">{faq.q}</span>
                                            <span className={`material-symbols-outlined text-[20px] text-primary shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>expand_more</span>
                                        </button>
                                        <motion.div initial={false} animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
                                            <p className="px-3 md:px-4 pb-3 md:pb-4 text-body-md font-body-md text-on-surface-variant leading-relaxed">{faq.a}</p>
                                        </motion.div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS — Logged out only */}
                {!user && (
                    <section className="py-3 md:py-5 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/5 rounded-full blur-[80px] pointer-events-none" />
                        <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto relative z-10">
                            <Reveal className="text-center mb-2.5 md:mb-4">
                                <span className="text-label-sm font-label-sm text-primary uppercase tracking-widest mb-1 block">Testimonials</span>
                                <h2 className="font-headline-lg text-headline-lg text-on-surface">Trusted by Investors</h2>
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
                        </div>
                    </section>
                )}

                {/* FINAL CTA */}
                <section className="pb-3 md:pb-5">
                    <div className="max-w-4xl mx-auto">
                        <Reveal>
                            <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-5 md:p-8 text-center border border-outline-variant/20">
                                {user ? (
                                    <>
                                        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1 md:mb-2">Grow Your Portfolio</h2>
                                        <p className="text-body-md font-body-md text-on-surface-variant mb-3 md:mb-5 max-w-md mx-auto">Explore more investment opportunities and diversify your earnings.</p>
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 md:gap-3">
                                            <button onClick={() => navigate('/invest')} className="w-full sm:w-auto cursor-pointer bg-[#2563eb] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all">
                                                New Investment
                                            </button>
                                            <button onClick={() => navigate('/deposit')} className="w-full sm:w-auto cursor-pointer glass-card text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm hover:border-primary/50 transition-all">
                                                Deposit Funds
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1 md:mb-2">Ready to start earning?</h2>
                                        <p className="text-body-md font-body-md text-on-surface-variant mb-3 md:mb-5 max-w-md mx-auto">Join 50,000+ investors building wealth with {siteName}.</p>
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 md:gap-3">
                                            <button onClick={() => navigate('/register')} className="w-full sm:w-auto cursor-pointer bg-[#2563eb] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all">
                                                Get Started
                                            </button>
                                            <button onClick={() => navigate('/login')} className="w-full sm:w-auto cursor-pointer glass-card text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm hover:border-primary/50 transition-all">
                                                Sign In to Invest
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Reveal>
                    </div>
                </section>
            </main>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .animate-shimmer {
                    animation: shimmer 8s linear infinite;
                }
            `}</style>
        </div>
    );
}
