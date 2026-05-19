import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Invest() {
    const navigate = useNavigate();

    const [amount, setAmount] = useState(10000);
    const [tier, setTier] = useState(0.025); // default Institutional

    const monthlyRoi = amount * tier * 30;
    const yearlyRoi = amount * tier * 365;

    // Timer logic
    const [seconds, setSeconds] = useState(51725);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => (prev > 0 ? prev - 1 : 86400));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="deep-mesh-bg text-on-surface min-h-screen flex flex-col font-body-md text-body-md dark bg-background">
            <Sidebar />

            <main className="md:ml-64 min-h-screen flex flex-col pt-14 md:pt-16 pb-20 md:pb-0">
                <header className="fixed top-0 right-0 left-0 md:left-64 z-30 bg-surface/90 backdrop-blur-xl h-14 md:h-16 border-b border-outline-variant/20 flex items-center justify-between px-4 md:px-margin-desktop shadow-sm transition-all">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl md:text-headline-md font-bold text-primary tracking-tight md:hidden">Jamex</h1>
                        <div className="hidden lg:flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30">
                            <span className="material-symbols-outlined text-on-surface-variant text-body-md mr-2">search</span>
                            <input className="bg-transparent border-none outline-none focus:ring-0 text-label-sm text-on-surface placeholder:text-outline w-48" placeholder="Search markets..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex items-center gap-2 md:gap-3 border-l border-outline-variant/30 pl-3 md:pl-4">
                            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors text-[20px] md:text-[24px]">notifications</span>
                            <span onClick={() => navigate('/wallet')} className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors text-[20px] md:text-[24px] hidden sm:block">account_balance_wallet</span>
                            <div onClick={() => window.innerWidth < 768 ? window.dispatchEvent(new Event('toggle-mobile-menu')) : navigate('/profile')} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant cursor-pointer hover:border-primary transition-colors ml-1">
                                <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ7Xs1UJrHzDog4Wsj4iYIpJCC9JBOnv84z5wAso8C4yrmrmzgxkPNMx4fPKiup-tZBmhh0cluv_nIsB2Q1vkOH6JbDBWQFVXzdGFo-5-lszKl27Cvt6_K7xb6TonO0phkqe8Roy90qbmlMM0ZtOorIyuFWsgKzdN1L4kMtTs0xjmiGPH0pkv4HVmgz71fK_5OkpEtymLXlsh8gpZ70UqHOx7qtQkl4EcyETKUoWrZ5aCL_6ZL8jmcPoJAktGuhsU21w7gLVJK6lkw" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-margin-desktop flex-1 space-y-4 md:space-y-6 max-w-[1600px] mx-auto w-full mb-6">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2 md:mb-8 gap-3 md:gap-4">
                        <div>
                            <h2 className="font-bold text-2xl md:text-headline-lg text-on-surface tracking-tight mb-1">Investment Analytics</h2>
                            <p className="text-[11px] md:text-body-md text-on-surface-variant leading-snug">Institutional portfolio tracking and return forecasting.</p>
                        </div>
                        <div className="flex gap-2 md:gap-4 w-full sm:w-auto">
                            <div className="glass-card p-3 md:px-6 md:py-3 rounded-xl flex flex-col flex-1 min-w-0 md:min-w-[180px] border border-outline-variant/20">
                                <span className="text-[9px] md:text-label-sm text-on-surface-variant uppercase font-bold tracking-wider mb-0.5">Portfolio Value</span>
                                <span className="text-sm md:text-headline-md font-bold font-tabular-nums text-on-surface">$842,500.00</span>
                            </div>
                            <div className="glass-card p-3 md:px-6 md:py-3 rounded-xl flex flex-col flex-1 min-w-0 md:min-w-[180px] border border-outline-variant/20 border-t-tertiary">
                                <span className="text-[9px] md:text-label-sm text-tertiary/80 uppercase font-bold tracking-wider mb-0.5">Total Profit</span>
                                <span className="text-sm md:text-headline-md font-bold font-tabular-nums text-tertiary">+$112,040.12</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-gutter mb-4 md:mb-gutter">
                        <div className="glass-card p-4 md:p-card-padding rounded-xl flex items-center justify-between group hover:border-primary/50 transition-all border border-outline-variant/20 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-0.5 md:mb-1">Next Payout</p>
                                <p className="text-2xl md:text-headline-md font-bold font-tabular-nums text-primary tracking-tight">{formatTime(seconds)}</p>
                                <p className="text-[10px] md:text-label-sm font-bold text-tertiary mt-1 md:mt-1.5 flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span> +$420.50 Est.
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative z-10">
                                <span className="material-symbols-outlined text-[20px] md:text-[24px]">timer</span>
                            </div>
                        </div>
                        <div className="glass-card p-4 md:p-card-padding rounded-xl flex items-center justify-between group hover:border-primary/50 transition-all border border-outline-variant/20">
                            <div>
                                <p className="text-[10px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-0.5 md:mb-1">ROI to Date</p>
                                <p className="text-2xl md:text-headline-md font-bold font-tabular-nums text-on-surface tracking-tight">14.85%</p>
                                <p className="text-[10px] md:text-label-sm font-medium text-on-surface-variant/70 mt-1 md:mt-1.5">Across 12 months</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary">
                                <span className="material-symbols-outlined text-[20px] md:text-[24px]">trending_up</span>
                            </div>
                        </div>
                        <div className="glass-card p-4 md:p-card-padding rounded-xl flex items-center justify-between group hover:border-primary/50 transition-all border border-outline-variant/20">
                            <div>
                                <p className="text-[10px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-0.5 md:mb-1">Active Plans</p>
                                <p className="text-2xl md:text-headline-md font-bold font-tabular-nums text-on-surface tracking-tight">04</p>
                                <p className="text-[10px] md:text-label-sm font-medium text-on-surface-variant/70 mt-1 md:mt-1.5">Diversified in 3 sectors</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary-container/20 border border-secondary/20 flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined text-[20px] md:text-[24px]">layers</span>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Grid: Bento Layout */}
                    <div className="grid grid-cols-12 gap-3 md:gap-gutter mb-4 md:mb-gutter">
                        {/* Profit Growth Chart */}
                        <div className="col-span-12 lg:col-span-8 glass-card rounded-xl overflow-hidden flex flex-col min-h-[300px] md:h-[400px] border border-outline-variant/20">
                            <div className="px-4 py-3 md:px-6 md:py-4 border-b border-outline-variant/10 flex flex-wrap justify-between items-center gap-2 bg-surface-container-high/40">
                                <h3 className="font-bold text-[11px] md:text-label-md text-on-surface flex items-center gap-1.5 md:gap-2 uppercase tracking-wide">
                                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">show_chart</span>
                                    Profit Growth Analysis
                                </h3>
                                <div className="flex gap-1 md:gap-2 bg-surface-container-highest/30 p-1 rounded-lg">
                                    <button className="px-2.5 py-1 rounded bg-primary text-on-primary text-[9px] md:text-label-sm font-bold shadow-sm">1M</button>
                                    <button className="px-2.5 py-1 rounded hover:bg-surface-variant/50 text-on-surface-variant text-[9px] md:text-label-sm font-bold transition-colors">6M</button>
                                    <button className="px-2.5 py-1 rounded hover:bg-surface-variant/50 text-on-surface-variant text-[9px] md:text-label-sm font-bold transition-colors">1Y</button>
                                </div>
                            </div>
                            <div className="flex-1 p-4 md:p-6 relative flex items-end">
                                {/* SVG Chart Mockup */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none p-4 md:p-8" preserveAspectRatio="none" viewBox="0 0 800 300">
                                    <defs>
                                        <linearGradient id="chartGradientInv" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4"></stop>
                                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                    <line stroke="#374151" strokeDasharray="4" strokeWidth="0.5" x1="0" x2="800" y1="50" y2="50"></line>
                                    <line stroke="#374151" strokeDasharray="4" strokeWidth="0.5" x1="0" x2="800" y1="150" y2="150"></line>
                                    <line stroke="#374151" strokeDasharray="4" strokeWidth="0.5" x1="0" x2="800" y1="250" y2="250"></line>
                                    <path d="M0 280 Q 100 260 200 240 T 400 180 T 600 100 T 800 40 L 800 300 L 0 300 Z" fill="url(#chartGradientInv)"></path>
                                    <path className="drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]" d="M0 280 Q 100 260 200 240 T 400 180 T 600 100 T 800 40" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"></path>
                                    <circle cx="200" cy="240" fill="#2563eb" r="4" stroke="#ffffff" strokeWidth="1.5"></circle>
                                    <circle cx="600" cy="100" fill="#2563eb" r="4" stroke="#ffffff" strokeWidth="1.5"></circle>
                                    <circle cx="800" cy="40" fill="#2563eb" r="5" stroke="#ffffff" strokeWidth="2"></circle>
                                </svg>
                                <div className="absolute top-8 right-6 md:top-20 md:right-40 glass-card p-2 md:p-3 rounded-lg shadow-xl border border-primary/30 backdrop-blur-md">
                                    <p className="text-[9px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Jun 12, 2024</p>
                                    <p className="text-[11px] md:text-label-md font-bold text-tertiary">+$12,450.00 Profit</p>
                                </div>
                            </div>
                        </div>

                        {/* Profit Calculator Widget */}
                        <div className="col-span-12 lg:col-span-4 glass-card rounded-xl overflow-hidden flex flex-col md:h-[400px] border border-outline-variant/20">
                            <div className="px-4 py-3 md:px-6 md:py-4 border-b border-outline-variant/10 bg-surface-container-high/40">
                                <h3 className="font-bold text-[11px] md:text-label-md text-on-surface flex items-center gap-1.5 md:gap-2 uppercase tracking-wide">
                                    <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">calculate</span>
                                    Yield Forecaster
                                </h3>
                            </div>
                            <div className="p-4 md:p-6 space-y-3 md:space-y-4 flex-1">
                                <div>
                                    <label className="text-[9px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Investment Amount ($)</label>
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(Number(e.target.value) || 0)}
                                        className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg py-2 md:py-2.5 px-3 focus:ring-primary focus:border-primary font-tabular-nums font-bold text-sm outline-none transition-all" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Contract Tier</label>
                                    <select 
                                        value={tier} 
                                        onChange={(e) => setTier(Number(e.target.value))}
                                        className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg py-2 md:py-2.5 px-3 focus:ring-primary focus:border-primary font-bold text-sm md:text-label-sm outline-none transition-all"
                                    >
                                        <option value={0.012}>Standard (1.2% Daily)</option>
                                        <option value={0.025}>Institutional (2.5% Daily)</option>
                                        <option value={0.048}>Enterprise (4.8% Daily)</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3 md:gap-4 mt-2 md:mt-6">
                                    <div className="p-2.5 md:p-3 bg-surface-container-high/50 rounded-lg border border-outline-variant/20">
                                        <p className="text-[9px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Monthly ROI</p>
                                        <p className="text-base md:text-headline-md font-bold font-tabular-nums text-tertiary">${Math.round(monthlyRoi).toLocaleString()}</p>
                                    </div>
                                    <div className="p-2.5 md:p-3 bg-surface-container-high/50 rounded-lg border border-outline-variant/20">
                                        <p className="text-[9px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Total 1Y</p>
                                        <p className="text-base md:text-headline-md font-bold font-tabular-nums text-on-surface">${Math.round(yearlyRoi).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 pt-0 md:p-6 md:pt-0">
                                <button className="w-full py-3 bg-primary text-on-primary font-bold text-[11px] md:text-sm uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-sm shadow-primary/20">Initiate Contract</button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Container */}
                    <div className="w-full mt-4 md:mt-0">
                        <div className="flex gap-4 md:gap-8 border-b border-outline-variant/20 mb-4 md:mb-6 overflow-x-auto scrollbar-hide pb-1">
                            <button className="pb-2 md:pb-4 text-[11px] md:text-label-md font-bold text-primary border-b-2 border-primary whitespace-nowrap uppercase tracking-wider">Active Contracts</button>
                            <button className="pb-2 md:pb-4 text-[11px] md:text-label-md font-bold text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap uppercase tracking-wider">Performance History</button>
                            <button className="pb-2 md:pb-4 text-[11px] md:text-label-md font-bold text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap uppercase tracking-wider">Risk Disclosures</button>
                        </div>

                        {/* Active Contracts Ledger */}
                        <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                            <div className="overflow-x-auto scrollbar-hide">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="bg-surface-container-highest/20 border-b border-outline-variant/10">
                                            <th className="px-4 py-2.5 md:px-6 md:py-4 text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Contract ID</th>
                                            <th className="px-4 py-2.5 md:px-6 md:py-4 text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Capital</th>
                                            <th className="px-4 py-2.5 md:px-6 md:py-4 text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Daily Yield</th>
                                            <th className="px-4 py-2.5 md:px-6 md:py-4 text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Progress</th>
                                            <th className="px-4 py-2.5 md:px-6 md:py-4 text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/5 text-xs md:text-sm">
                                        <tr className="hover:bg-white/5 transition-colors group">
                                            <td className="px-4 py-3 md:px-6 md:py-4">
                                                <div className="flex items-center gap-2.5 md:gap-3">
                                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                                        <span className="material-symbols-outlined text-[16px] md:text-[18px]">account_balance</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-on-surface text-[11px] md:text-sm">JMX-ALPHA-92</p>
                                                        <p className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">Inst. Arbitrage</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 font-tabular-nums font-bold text-on-surface text-[11px] md:text-sm">$250,000.00</td>
                                            <td className="px-4 py-3 md:px-6 md:py-4">
                                                <span className="text-tertiary font-tabular-nums font-bold text-[11px] md:text-sm">+$6,250.00</span>
                                                <p className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">2.5% Daily</p>
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4">
                                                <div className="w-24 md:w-40">
                                                    <div className="flex justify-between text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1">
                                                        <span className="text-on-surface-variant">Day 45/90</span>
                                                        <span className="text-on-surface">50%</span>
                                                    </div>
                                                    <div className="h-1 md:h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden border border-outline-variant/10">
                                                        <div className="h-full bg-primary rounded-full shadow-[0_0_5px_rgba(37,99,235,0.6)]" style={{width: '50%'}}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                                                <button className="px-3 py-1.5 md:px-4 md:py-1.5 rounded-lg border border-outline-variant/50 bg-surface-container-low hover:border-primary hover:text-primary transition-all text-[9px] md:text-[11px] font-bold uppercase tracking-wider">Manage</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors group">
                                            <td className="px-4 py-3 md:px-6 md:py-4">
                                                <div className="flex items-center gap-2.5 md:gap-3">
                                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                                        <span className="material-symbols-outlined text-[16px] md:text-[18px]">currency_bitcoin</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-on-surface text-[11px] md:text-sm">JMX-DELTA-11</p>
                                                        <p className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">Crypto Market</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 font-tabular-nums font-bold text-on-surface text-[11px] md:text-sm">$120,000.00</td>
                                            <td className="px-4 py-3 md:px-6 md:py-4">
                                                <span className="text-tertiary font-tabular-nums font-bold text-[11px] md:text-sm">+$5,760.00</span>
                                                <p className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">4.8% Daily</p>
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4">
                                                <div className="w-24 md:w-40">
                                                    <div className="flex justify-between text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1">
                                                        <span className="text-on-surface-variant">Day 12/30</span>
                                                        <span className="text-on-surface">40%</span>
                                                    </div>
                                                    <div className="h-1 md:h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden border border-outline-variant/10">
                                                        <div className="h-full bg-primary rounded-full shadow-[0_0_5px_rgba(37,99,235,0.6)]" style={{width: '40%'}}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                                                <button className="px-3 py-1.5 md:px-4 md:py-1.5 rounded-lg border border-outline-variant/50 bg-surface-container-low hover:border-primary hover:text-primary transition-all text-[9px] md:text-[11px] font-bold uppercase tracking-wider">Manage</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom NavBar - 5 sleek items */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full h-[68px] bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20 flex justify-between items-center px-2 z-50 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
                <Link to="/dashboard" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">dashboard</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
                </Link>
                <Link to="/invest" className="flex flex-col items-center justify-center w-full h-full gap-1 text-primary relative">
                    <div className="absolute -top-3 w-10 h-1 bg-primary rounded-b-full"></div>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
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
