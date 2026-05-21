import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Plans() {
    const navigate = useNavigate();
    
    // Calculator State
    const [calcAmount, setCalcAmount] = useState<string>('1000');
    const [calcPlanId, setCalcPlanId] = useState<string>('professional');

    const plans = [
        {
            id: 'starter',
            name: 'Starter Plan',
            roi: 1.5,
            duration: 30,
            min: 100,
            max: 999,
            features: ['Basic Support', 'Standard Execution', 'Monthly Reporting'],
            accentClass: 'text-primary',
            borderClass: 'border-primary/20 group-hover:border-primary/50',
            bgGlow: 'from-primary/10',
            glowColor: 'bg-primary/30',
            buttonClass: 'bg-primary/10 text-primary hover:bg-primary hover:text-on-primary',
            popular: false,
        },
        {
            id: 'professional',
            name: 'Professional Plan',
            roi: 2.5,
            duration: 60,
            min: 1000,
            max: 4999,
            features: ['Priority Support', 'Enhanced Execution', 'Weekly Reporting', 'Dedicated Manager'],
            accentClass: 'text-secondary',
            borderClass: 'border-secondary/20 group-hover:border-secondary/50',
            bgGlow: 'from-secondary/10',
            glowColor: 'bg-secondary/30',
            buttonClass: 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-on-secondary',
            popular: false,
        },
        {
            id: 'executive',
            name: 'Executive Plan',
            roi: 4.0,
            duration: 90,
            min: 5000,
            max: 19999,
            features: ['24/7 VIP Support', 'Institutional Execution', 'Daily Reporting', 'Senior Account Manager', 'Exclusive Webinars'],
            accentClass: 'text-tertiary',
            borderClass: 'border-tertiary/50 shadow-[0_0_20px_rgba(78,222,163,0.15)] group-hover:border-tertiary/80',
            bgGlow: 'from-tertiary/20',
            glowColor: 'bg-tertiary/30',
            buttonClass: 'bg-tertiary text-on-tertiary hover:brightness-110 shadow-lg shadow-tertiary/20',
            popular: true,
        },
        {
            id: 'vip',
            name: 'VIP Platinum',
            roi: 6.0,
            duration: 120,
            min: 20000,
            max: null,
            features: ['Direct Board Access', 'Zero Spread Execution', 'Real-time Analytics', 'Private Events Access', 'Custom Strategies'],
            accentClass: 'text-[#8b5cf6]',
            borderClass: 'border-[#8b5cf6]/20 group-hover:border-[#8b5cf6]/50',
            bgGlow: 'from-[#8b5cf6]/10',
            glowColor: 'bg-[#8b5cf6]/30',
            buttonClass: 'bg-[#8b5cf6]/10 text-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white',
            popular: false,
        }
    ];

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    const handleSelectPlan = (plan: any) => {
        // Pass plan data in route state to the confirm page
        navigate('/confirm-investment', { state: { plan } });
    };

    return (
        <div className="flex-1 p-2.5 md:p-margin-desktop max-w-[1600px] mx-auto w-full mb-2.5 md:mb-12">
            
            {/* Hero Section */}
            <div className="glass-card rounded-2xl p-2.5 md:p-8 mb-2.5 md:mb-12 border border-outline-variant/30 flex flex-col lg:flex-row items-center justify-between gap-2.5 md:gap-6 relative overflow-hidden group mx-2 md:mx-0">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12 group-hover:animate-shimmer pointer-events-none transition-all duration-1000"></div>
                
                <div className="flex-1 relative z-10 w-full text-left">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-primary/10 p-1.5 md:p-2 rounded-lg border border-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[16px] md:text-[20px]">diamond</span>
                        </div>
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">Premium Asset Management</span>
                    </div>
                    
                    <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight leading-tight mb-2.5 md:mb-3">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-primary animate-shimmer bg-[length:200%_auto]">Wealth Strategy</span>
                    </h1>
                    
                    <p className="text-sm md:text-base text-on-surface-variant font-medium leading-relaxed max-w-xl">
                        <span className="md:hidden">Select a plan tailored to your goals. Enjoy guaranteed daily yields and top-tier security.</span>
                        <span className="hidden md:inline">Select a curated investment plan tailored to your financial goals. Enjoy guaranteed daily yields, automated compounding, and institutional-grade security.</span>
                    </p>
                </div>

                <div className="hidden lg:flex gap-4 relative z-10 shrink-0">
                    <div className="bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-center min-w-[130px] shadow-sm backdrop-blur-md">
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Global Investors</span>
                        <span className="text-lg font-bold text-on-surface">12,450+</span>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col justify-center min-w-[130px] shadow-sm backdrop-blur-md">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider mb-1">Max Daily Yield</span>
                        <span className="text-lg font-bold text-primary">Up to 6.0%</span>
                    </div>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-6 lg:gap-8 px-2 md:px-0 relative">
                
                {/* Background Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

                {plans.map((plan) => (
                    <div 
                        key={plan.id}
                        className={`relative z-10 glass-card bg-surface-container-low/40 backdrop-blur-xl rounded-2xl flex flex-col transition-all duration-500 group hover:-translate-y-2 border ${plan.borderClass} shadow-lg group-hover:shadow-2xl ${plan.popular ? 'lg:-translate-y-4 lg:hover:-translate-y-6' : ''}`}
                    >
                        {/* Popular Badge */}
                        {plan.popular && (
                            <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                <span className="bg-tertiary text-on-tertiary text-[10px] md:text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-lg shadow-tertiary/30 border border-tertiary-container flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">star</span>
                                    Most Popular
                                </span>
                            </div>
                        )}

                        {/* Premium Mesh & Grid Effects */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                            {/* Base Gradient Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${plan.bgGlow} via-transparent to-transparent opacity-80`}></div>
                            
                            {/* Animated Ambient Orbs */}
                            <div className={`absolute -top-24 -right-24 w-48 h-48 ${plan.glowColor} rounded-full blur-[50px] opacity-60 group-hover:scale-150 transition-transform duration-700 ease-out`}></div>
                            <div className={`absolute -bottom-24 -left-24 w-48 h-48 ${plan.glowColor} rounded-full blur-[50px] opacity-40 group-hover:scale-150 transition-transform duration-700 ease-out`}></div>
                            
                            {/* Dotted Mesh Pattern */}
                            <div className="absolute inset-0 opacity-[0.08] mix-blend-plus-lighter" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                            
                            {/* Top Glass Edge Highlight */}
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>
                        </div>

                        <div className="p-2.5 md:p-4 flex flex-col flex-1 relative z-10">
                            {/* Plan Header */}
                            <div className="text-center mb-3">
                                <h3 className="text-base md:text-xl font-bold text-on-surface mb-2 tracking-tight">{plan.name}</h3>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className={`text-3xl md:text-5xl font-extrabold font-tabular-nums tracking-tighter ${plan.accentClass}`}>{plan.roi}%</span>
                                    <span className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-wider">/Daily</span>
                                </div>
                            </div>

                            <div className="w-full h-px bg-outline-variant/20 mb-3"></div>

                            {/* Plan Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center text-sm md:text-base">
                                    <span className="text-on-surface-variant font-medium">Duration</span>
                                    <span className="text-on-surface font-bold">{plan.duration} Days</span>
                                </div>
                                <div className="flex justify-between items-center text-sm md:text-base">
                                    <span className="text-on-surface-variant font-medium">Min Deposit</span>
                                    <span className="text-on-surface font-bold font-tabular-nums">{formatCurrency(plan.min)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm md:text-base">
                                    <span className="text-on-surface-variant font-medium">Max Deposit</span>
                                    <span className="text-on-surface font-bold font-tabular-nums">{plan.max ? formatCurrency(plan.max) : 'Unlimited'}</span>
                                </div>
                            </div>

                            <div className="w-full h-px bg-outline-variant/20 mb-3"></div>

                            {/* Plan Features */}
                            <ul className="space-y-1.5 mb-4 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5">
                                        <span className={`material-symbols-outlined text-[18px] shrink-0 ${plan.accentClass}`}>check_circle</span>
                                        <span className="text-xs md:text-sm text-on-surface-variant font-medium leading-tight">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Action Button */}
                            <button 
                                onClick={() => handleSelectPlan(plan)}
                                className={`w-full py-2 rounded-xl font-bold text-sm md:text-base uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group/btn ${plan.buttonClass}`}
                            >
                                Invest Now
                                <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                ))}

            </div>

            {/* ROI Calculator Section */}
            <div className="mt-4 md:mt-8 max-w-5xl mx-auto glass-card rounded-2xl p-2.5 md:p-10 border border-outline-variant/30 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
                <div className="text-center mb-3 md:mb-8 relative z-10">
                    <h2 className="text-xl md:text-3xl font-bold text-on-surface mb-1 md:mb-2 tracking-tight">Interactive ROI Calculator</h2>
                    <p className="text-xs md:text-base text-on-surface-variant font-medium">Estimate your potential returns based on our premium plans.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-8 relative z-10">
                    {/* Inputs */}
                    <div className="space-y-3 md:space-y-6">
                        <div>
                            <label className="block text-xs md:text-sm font-bold text-on-surface-variant mb-1 md:mb-2 uppercase tracking-wider">Investment Amount ($)</label>
                            <input 
                                type="number" 
                                value={calcAmount}
                                onChange={(e) => setCalcAmount(e.target.value)}
                                className="w-full bg-surface-container-high/50 border border-outline-variant/30 rounded-xl px-2.5 py-1.5 md:px-4 md:py-3 text-on-surface font-bold focus:outline-none focus:border-primary transition-colors"
                                placeholder="Enter amount..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs md:text-sm font-bold text-on-surface-variant mb-1 md:mb-2 uppercase tracking-wider">Select Plan</label>
                            <div className="grid grid-cols-2 gap-2 md:gap-3">
                                {plans.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setCalcPlanId(p.id)}
                                        className={`px-3 py-1.5 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all border ${
                                            calcPlanId === p.id 
                                            ? 'bg-primary/10 border-primary/50 text-primary shadow-sm shadow-primary/20' 
                                            : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/50 hover:bg-surface-container'
                                        }`}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    {(() => {
                        const selectedPlan = plans.find(p => p.id === calcPlanId) || plans[1];
                        const amount = parseFloat(calcAmount) || 0;
                        const dailyProfit = amount * (selectedPlan.roi / 100);
                        const totalProfit = dailyProfit * selectedPlan.duration;
                        const totalReturn = amount + totalProfit;

                        return (
                            <div className="bg-surface-container-highest/30 rounded-xl p-2.5 md:p-6 border border-outline-variant/20 flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-tertiary/10 blur-[50px] rounded-full pointer-events-none"></div>
                                <div className="space-y-2 md:space-y-4 relative z-10">
                                    <div className="flex justify-between items-center pb-2 md:pb-4 border-b border-outline-variant/20">
                                        <span className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-wider">Daily Profit</span>
                                        <span className="font-bold text-tertiary text-lg">{formatCurrency(dailyProfit)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 md:pb-4 border-b border-outline-variant/20">
                                        <span className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-wider">Total Profit ({selectedPlan.duration} Days)</span>
                                        <span className="font-bold text-tertiary text-lg">{formatCurrency(totalProfit)}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-1 md:pt-2">
                                        <span className="text-sm md:text-base font-bold text-on-surface uppercase tracking-wider">Total Return</span>
                                        <span className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">{formatCurrency(totalReturn)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>


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
