import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Loans() {
    const navigate = useNavigate();

    const [currentLoan, setCurrentLoan] = useState(125000);
    const [selectedProduct, setSelectedProduct] = useState('JMX-ALPHA-92');
    const [currentDuration, setCurrentDuration] = useState(3);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    
    const principal = currentLoan * 0.8;
    const downPayment = currentLoan * 0.2;
    const monthly = principal / currentDuration;

    const today = new Date();
    const schedule = Array.from({ length: currentDuration }).map((_, i) => {
        const dueDate = new Date(today.getFullYear(), today.getMonth() + i + 1, today.getDate());
        return {
            id: i + 1,
            date: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: monthly,
            principal: monthly * 0.95,
            interest: monthly * 0.05
        };
    });

    const handleSelectPlan = (amount: number, name: string) => {
        setCurrentLoan(amount);
        setSelectedProduct(name);
    };

    return (
        <div className="deep-mesh-bg text-on-surface min-h-screen flex flex-col font-body-md text-body-md dark bg-background">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="md:ml-64 min-h-screen flex flex-col pt-14 md:pt-16 pb-20 md:pb-0">
                {/* TopNavBar */}
                

                <div className="p-4 md:p-margin-desktop flex-1 space-y-4 md:space-y-6 max-w-[1440px] mx-auto w-full">
                    {/* Header Section */}
                    
                    <div className="grid grid-cols-12 gap-3 md:gap-gutter">
                        {/* 1. Investment Funding Selection */}
                        <section className="col-span-12 lg:col-span-8 flex flex-col gap-3 md:gap-gutter">
                            <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-2.5 md:py-3 flex justify-between items-center border-b border-outline-variant/10">
                                    <h2 className="text-[11px] md:text-label-md font-bold text-primary flex items-center gap-1.5 md:gap-2 uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[16px] md:text-[20px]">account_tree</span>
                                        Investment Loans
                                    </h2>
                                    <span className="text-[9px] md:text-xs text-tertiary font-bold px-1.5 md:px-2 py-0.5 bg-tertiary/10 border border-tertiary/20 rounded uppercase">Active Offers</span>
                                </div>
                                <div className="p-4 md:p-card-padding grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    {/* Plan A */}
                                    <div 
                                        className={`group rounded-xl p-3.5 md:p-4 transition-all cursor-pointer ${selectedProduct === 'JMX-ALPHA-92' ? 'bg-primary/5 border border-primary ring-1 ring-primary/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'bg-surface-container-low border border-outline-variant/30 hover:border-primary/50'}`}
                                        onClick={() => handleSelectPlan(125000, 'JMX-ALPHA-92')}
                                    >
                                        <div className="flex justify-between items-start mb-3 md:mb-4">
                                            <div>
                                                <h3 className="text-sm md:text-label-md font-bold text-on-surface tracking-wide">JMX-ALPHA-92</h3>
                                                <p className="text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">High Yield Equity</p>
                                            </div>
                                            <span className={`material-symbols-outlined text-[18px] md:text-[22px] transition-transform ${selectedProduct === 'JMX-ALPHA-92' ? 'text-primary scale-110' : 'text-outline/40 group-hover:text-primary group-hover:scale-110'}`} style={selectedProduct === 'JMX-ALPHA-92' ? {fontVariationSettings: "'FILL' 1"} : {}}>verified</span>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-[9px] md:text-[10px] text-on-surface-variant uppercase font-bold">Funding</p>
                                                <p className="text-xl md:text-headline-md font-bold font-tabular-nums text-on-surface leading-none mt-1">$125,000</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] md:text-[10px] text-tertiary uppercase font-bold">Target ROI</p>
                                                <p className="text-sm md:text-label-md font-bold text-tertiary leading-none mt-1">14.2% p.a.</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Plan B */}
                                    <div 
                                        className={`group rounded-xl p-3.5 md:p-4 transition-all cursor-pointer ${selectedProduct === 'GLB-PRECISION-X' ? 'bg-primary/5 border border-primary ring-1 ring-primary/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'bg-surface-container-low border border-outline-variant/30 hover:border-primary/50'}`}
                                        onClick={() => handleSelectPlan(250000, 'GLB-PRECISION-X')}
                                    >
                                        <div className="flex justify-between items-start mb-3 md:mb-4">
                                            <div>
                                                <h3 className="text-sm md:text-label-md font-bold text-on-surface tracking-wide">GLB-PRECISION</h3>
                                                <p className="text-[9px] md:text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">Global Multi-Asset</p>
                                            </div>
                                            <span className={`material-symbols-outlined text-[18px] md:text-[22px] transition-transform ${selectedProduct === 'GLB-PRECISION-X' ? 'text-primary scale-110' : 'text-outline/40 group-hover:text-primary group-hover:scale-110'}`} style={selectedProduct === 'GLB-PRECISION-X' ? {fontVariationSettings: "'FILL' 1"} : {}}>verified</span>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-[9px] md:text-[10px] text-on-surface-variant uppercase font-bold">Funding</p>
                                                <p className="text-xl md:text-headline-md font-bold font-tabular-nums text-on-surface leading-none mt-1">$250,000</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] md:text-[10px] text-tertiary uppercase font-bold">Target ROI</p>
                                                <p className="text-sm md:text-label-md font-bold text-tertiary leading-none mt-1">11.8% p.a.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Land Feature & Collateral */}
                            <div className="glass-card rounded-xl overflow-hidden relative border border-outline-variant/20 flex flex-col sm:flex-row">
                                <div className="sm:w-2/5 relative h-40 sm:h-auto">
                                    <img className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-7vlTD62fAp7gGhERxfPDYtOPy9dqZ-CseGXRyJXHvM2ZymY1KFTCO7k-F8koZcgSudnoy06oyiau1vQIxZtLYy-gHzqTG_SdsLeqJq3sTmaUHBRLI_VIL62CvijVixd1xLhpQZdKW4TCvSk0XyosA49_kggxPvpJgNf4OxeFm0TceP4lyFAlouTmxUlUxBkvPelsdc_Y60d7LRQWVYbtlA9sWd74V3s0X9zChESOaUR2lMIMi0neyVK0nauN8-B4kK98YbM4eYI2" alt="Land Collateral" />
                                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#0d1322] via-[#0d1322]/80 to-transparent"></div>
                                </div>
                                <div className="sm:w-3/5 p-4 md:p-6 flex flex-col justify-center relative z-10 bg-[#0d1322]/50 sm:bg-transparent -mt-8 sm:mt-0">
                                    <div className="bg-primary/10 border border-primary/20 px-2.5 py-0.5 inline-block rounded w-max mb-3 backdrop-blur-sm">
                                        <span className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-wider">Asset-Backed Security</span>
                                    </div>
                                    <h2 className="text-xl md:text-headline-sm font-bold text-on-surface mb-1.5 md:mb-2 tracking-tight">Land-Backed Collateral</h2>
                                    <p className="text-[11px] md:text-sm text-on-surface-variant mb-4 md:mb-6 leading-relaxed">Utilize real estate holdings as 0% margin collateral for higher-tier loans. Live institutional appraisal LTV.</p>
                                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                                        <div className="bg-surface-container-high/60 p-2.5 md:p-3 rounded-lg border border-outline-variant/10 backdrop-blur-md">
                                            <p className="text-[9px] md:text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Max LTV</p>
                                            <p className="text-sm md:text-label-md font-bold text-on-surface mt-0.5">75.00%</p>
                                        </div>
                                        <div className="bg-surface-container-high/60 p-2.5 md:p-3 rounded-lg border border-outline-variant/10 backdrop-blur-md">
                                            <p className="text-[9px] md:text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Valuation</p>
                                            <p className="text-sm md:text-label-md font-bold text-on-surface mt-0.5 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Live Feed
                                            </p>
                                        </div>
                                    </div>
                                    <button className="w-full sm:w-auto border border-primary/50 text-primary px-4 py-2.5 md:py-2 rounded-lg text-[11px] md:text-label-md font-bold hover:bg-primary/10 hover:border-primary transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-[16px] md:text-[18px]">add_location</span>
                                        REGISTER LAND
                                    </button>
                                </div>
                            </div>

                            {/* Repayment Schedule */}
                            <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-2.5 md:py-3 flex flex-wrap items-center justify-between border-b border-outline-variant/10 gap-2">
                                    <h2 className="text-[11px] md:text-label-md font-bold text-primary flex items-center gap-1.5 md:gap-2 uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[16px] md:text-[20px]">event_repeat</span>
                                        Repayment Schedule
                                    </h2>
                                    <div className="flex items-center gap-3 text-[9px] md:text-label-sm font-bold text-on-surface-variant uppercase">
                                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_4px_rgba(78,222,163,0.8)]"></span> Scheduled</span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto scrollbar-hide">
                                    <table className="w-full text-left border-collapse min-w-[500px]">
                                        <thead className="bg-surface-container-highest/20 border-b border-outline-variant/10">
                                            <tr>
                                                <th className="px-4 py-2.5 md:px-card-padding md:py-3 text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">No.</th>
                                                <th className="px-4 py-2.5 md:px-card-padding md:py-3 text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
                                                <th className="px-4 py-2.5 md:px-card-padding md:py-3 text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Amount</th>
                                                <th className="px-4 py-2.5 md:px-card-padding md:py-3 text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Principal</th>
                                                <th className="px-4 py-2.5 md:px-card-padding md:py-3 text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Interest</th>
                                                <th className="px-4 py-2.5 md:px-card-padding md:py-3 text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Auto-Pay</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/5 text-xs md:text-sm">
                                            {schedule.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-4 py-3 md:px-card-padding font-tabular-nums text-on-surface font-bold text-[11px] md:text-sm">#{item.id.toString().padStart(2, '0')}</td>
                                                    <td className="px-4 py-3 md:px-card-padding text-tabular-nums text-on-surface-variant text-[11px] md:text-sm">{item.date}</td>
                                                    <td className="px-4 py-3 md:px-card-padding text-tabular-nums text-on-surface font-bold text-[11px] md:text-sm">{formatter.format(item.amount)}</td>
                                                    <td className="px-4 py-3 md:px-card-padding text-tabular-nums text-on-surface-variant text-[11px] md:text-sm hidden sm:table-cell">{formatter.format(item.principal)}</td>
                                                    <td className="px-4 py-3 md:px-card-padding text-tabular-nums text-on-surface-variant text-[11px] md:text-sm hidden sm:table-cell">{formatter.format(item.interest)}</td>
                                                    <td className="px-4 py-3 md:px-card-padding text-right">
                                                        <button className="text-primary text-[9px] md:text-[10px] font-bold border border-primary/30 bg-primary/5 px-2 py-1 md:px-3 md:py-1 rounded hover:bg-primary hover:text-on-primary transition-all uppercase tracking-wider">ON</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                        
                        {/* 2. Installment Calculator */}
                        <aside className="col-span-12 lg:col-span-4">
                            <div className="glass-card rounded-xl border border-outline-variant/20 overflow-hidden lg:sticky lg:top-24 flex flex-col">
                                <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-2.5 md:py-3 border-b border-outline-variant/10">
                                    <h2 className="text-[11px] md:text-label-md font-bold text-primary flex items-center gap-1.5 md:gap-2 uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[16px] md:text-[20px]">calculate</span>
                                        Calculator
                                    </h2>
                                </div>
                                <div className="p-4 md:p-card-padding space-y-4 md:space-y-6">
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div className="col-span-2">
                                            <p className="text-[9px] md:text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-1">Selected</p>
                                            <p className="text-sm md:text-base font-bold text-on-surface bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/20">{selectedProduct}</p>
                                        </div>
                                        <div className="bg-surface-container-low p-2.5 md:p-3 rounded-lg border border-outline-variant/10">
                                            <p className="text-[9px] md:text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-0.5">Loan Amount</p>
                                            <p className="text-base md:text-lg font-bold font-tabular-nums text-on-surface">{formatter.format(currentLoan)}</p>
                                        </div>
                                        <div className="bg-tertiary/5 p-2.5 md:p-3 rounded-lg border border-tertiary/10">
                                            <p className="text-[9px] md:text-[10px] text-tertiary/80 uppercase font-bold tracking-wider mb-0.5">Down (20%)</p>
                                            <p className="text-base md:text-lg font-bold font-tabular-nums text-tertiary">{formatter.format(downPayment)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] md:text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block mb-2">Duration</label>
                                        <div className="grid grid-cols-3 gap-1.5 md:gap-2 p-1 bg-surface-container-low rounded-lg border border-outline-variant/20">
                                            <button 
                                                className={`py-1.5 md:py-2 rounded-md text-[10px] md:text-xs font-bold transition-all uppercase tracking-wide ${currentDuration === 3 ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                                                onClick={() => setCurrentDuration(3)}
                                            >3 Mo</button>
                                            <button 
                                                className={`py-1.5 md:py-2 rounded-md text-[10px] md:text-xs font-bold transition-all uppercase tracking-wide ${currentDuration === 6 ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                                                onClick={() => setCurrentDuration(6)}
                                            >6 Mo</button>
                                            <button 
                                                className={`py-1.5 md:py-2 rounded-md text-[10px] md:text-xs font-bold transition-all uppercase tracking-wide ${currentDuration === 12 ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                                                onClick={() => setCurrentDuration(12)}
                                            >12 Mo</button>
                                        </div>
                                    </div>
                                    <div className="bg-primary/5 p-3 md:p-4 rounded-xl border border-primary/20 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
                                        <p className="text-[9px] md:text-xs text-primary uppercase font-bold tracking-wider mb-0.5 relative z-10">Monthly Payment</p>
                                        <div className="flex items-baseline gap-1 relative z-10">
                                            <span className="text-2xl md:text-3xl font-bold font-tabular-nums text-primary tracking-tight">{formatter.format(monthly)}</span>
                                            <span className="text-[10px] md:text-sm font-bold text-primary/60">/mo</span>
                                        </div>
                                    </div>
                                    
                                    {/* Legal & Terms */}
                                    <div className="space-y-3 md:space-y-4">
                                        <div className="h-24 md:h-32 bg-surface-container-lowest p-2.5 md:p-3 rounded-lg border border-outline-variant/30 overflow-y-auto text-[9px] md:text-[10px] text-on-surface-variant leading-relaxed custom-scrollbar shadow-inner">
                                            <p className="font-bold text-on-surface mb-1 uppercase tracking-wider">Institutional Agreement v4.2</p>
                                            <p className="mb-1">1. Contract governs the funding for selected product.</p>
                                            <p className="mb-1">2. Fixed APR applies per institutional rating.</p>
                                            <p className="mb-1">3. Failure to meet installments within 48h triggers liquidation.</p>
                                            <p className="mb-1">4. Real Estate: Primary lien applies to land collateral.</p>
                                            <p>5. Confidentiality under NDA standard.</p>
                                        </div>
                                        <label className="flex items-start gap-2.5 cursor-pointer group bg-surface-container-low/50 p-2 rounded-lg border border-transparent hover:border-outline-variant/30 transition-colors">
                                            <input 
                                                type="checkbox" 
                                                className="mt-0.5 w-3.5 h-3.5 md:w-4 md:h-4 rounded bg-surface-container-lowest border-outline-variant text-primary focus:ring-primary ring-offset-background"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                            />
                                            <span className="text-[9px] md:text-xs font-medium text-on-surface-variant group-hover:text-on-surface transition-colors leading-tight">I accept the terms and authorize the 20% down payment from wallet balance.</span>
                                        </label>
                                        <button 
                                            disabled={!termsAccepted}
                                            className={`w-full py-3 md:py-3.5 rounded-xl text-[11px] md:text-sm font-bold uppercase tracking-wider transition-all shadow-sm ${termsAccepted ? 'bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] shadow-primary/20' : 'bg-surface-container-high text-outline/50 cursor-not-allowed'}`}
                                        >
                                            Sign & Initiate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom NavBar */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full h-[68px] bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20 flex justify-between items-center px-2 z-50 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
                <Link to="/dashboard" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">dashboard</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
                </Link>
                <Link to="/invest" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">account_balance</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Invest</span>
                </Link>
                <Link to="/loans" className="flex flex-col items-center justify-center w-full h-full gap-1 text-primary relative">
                    <div className="absolute -top-3 w-10 h-1 bg-primary rounded-b-full"></div>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>real_estate_agent</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Loans</span>
                </Link>
                <Link to="/wallet" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Wallet</span>
                </Link>
                <Link to="/settings" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">menu</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Menu</span>
                </Link>
            </nav>
        </div>
    );
}
