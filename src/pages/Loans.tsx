import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWalletStore } from '../store/walletStore';
import { useLoanStore } from '../store/loanStore';
import { useAuthStore } from '../store/authStore';

export default function Loans() {
    const navigate = useNavigate();
    
    const { user } = useAuthStore();
    const { mainBalance } = useWalletStore();
    const { loans, repayments, fetchLoans, applyForLoan, toggleAutoPay, loading } = useLoanStore();

    useEffect(() => {
        if (user) {
            fetchLoans(user.id);
        }
    }, [user, fetchLoans]);

    const [currentLoan, setCurrentLoan] = useState(1000);
    const [loanAmountInput, setLoanAmountInput] = useState('1000');
    const [loanAmountError, setLoanAmountError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('JMX-ALPHA-92');
    const [currentDuration, setCurrentDuration] = useState(3);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [applyError, setApplyError] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [loanSubmitted, setLoanSubmitted] = useState(false);

    const planMinAmount: Record<string, number> = {
        'JMX-ALPHA-92': 1000,
        'GLB-PRECISION-X': 10000,
    };

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    
    const principal = currentLoan * 0.9;
    const downPayment = currentLoan * 0.1;
    const monthly = principal / currentDuration;

    // Use backend schedule if available (for the first active/pending loan)
    // If no active loan, we use the calculator schedule
    const activeLoan = loans.find(l => l.status === 'active' || l.status === 'pending');
    const pendingLoan = loans.find(l => l.status === 'pending');
    const approvedActiveLoan = loans.find(l => l.status === 'active');
    
    const today = new Date();
    const calculatorSchedule = Array.from({ length: currentDuration }).map((_, i) => {
        const dueDate = new Date(today.getFullYear(), today.getMonth() + i + 1, today.getDate());
        return {
            id: `calc-${i + 1}`,
            date: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: monthly,
            principal: monthly * 0.95,
            interest: monthly * 0.05,
            auto_pay_enabled: false,
            isBackend: false
        };
    });

    const displaySchedule = activeLoan && repayments.length > 0 
        ? repayments.map((rep, i) => ({
            id: rep.id,
            displayId: i + 1,
            date: new Date(rep.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: rep.amount,
            principal: rep.principal_part,
            interest: rep.interest_part,
            auto_pay_enabled: rep.auto_pay_enabled,
            isBackend: true
        }))
        : calculatorSchedule.map((item, i) => ({ ...item, displayId: i + 1 }));

    const handleSelectPlan = (name: string) => {
        const minAmount = planMinAmount[name];
        setSelectedProduct(name);
        setCurrentLoan(minAmount);
        setLoanAmountInput(minAmount.toString());
        setLoanAmountError('');
        setApplyError('');
    };

    const handleLoanAmountChange = (value: string) => {
        setLoanAmountInput(value);
        const numVal = parseFloat(value);
        const minAmount = planMinAmount[selectedProduct];
        if (!value || isNaN(numVal) || numVal < minAmount) {
            setLoanAmountError(`Minimum is ${formatter.format(minAmount)}`);
            if (!isNaN(numVal) && numVal > 0) setCurrentLoan(numVal);
        } else {
            setLoanAmountError('');
            setCurrentLoan(numVal);
        }
    };

    const handleInitiate = async () => {
        setApplyError('');
        if (!user) return;

        const minAmount = planMinAmount[selectedProduct];
        if (currentLoan < minAmount) {
            setApplyError(`Minimum loan amount for this plan is ${formatter.format(minAmount)}.`);
            return;
        }
        
        if (mainBalance < downPayment) {
            setApplyError('Insufficient wallet balance for 10% down payment.');
            return;
        }

        setIsApplying(true);

        const loanData = {
            product_name: selectedProduct,
            principal: currentLoan,
            duration_months: currentDuration,
            down_payment: downPayment,
        };

        const repaymentsData = calculatorSchedule.map(item => ({
            due_date: new Date(today.getFullYear(), today.getMonth() + parseInt(item.id.split('-')[1]), today.getDate()).toISOString(),
            amount: item.amount,
            principal_part: item.principal,
            interest_part: item.interest,
        }));

        const success = await applyForLoan(user.id, loanData, repaymentsData);
        if (success) {
            setTermsAccepted(false);
            setLoanSubmitted(true);
        } else {
            setApplyError('Failed to apply for loan. Please try again.');
        }
        setIsApplying(false);
    };

    return (
        <div className="flex-1 p-2.5 md:p-margin-desktop space-y-2.5 md:space-y-6 max-w-[1440px] mx-auto w-full">
                    {/* Header Section */}
                    
                    <div className="grid grid-cols-12 gap-2.5 md:gap-gutter">
                        {/* 1. Investment Funding Selection */}
                        <section className="col-span-12 lg:col-span-8 flex flex-col gap-2.5 md:gap-gutter">
                            <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-2.5 md:px-card-padding py-2 md:py-3 flex justify-between items-center border-b border-outline-variant/10">
                                    <h2 className="text-xs md:text-label-md font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[14px] md:text-[20px]">account_tree</span>
                                        Investment Loans
                                    </h2>
                                    <span className="text-[10px] md:text-xs text-tertiary font-bold px-1.5 md:px-2 py-0.5 bg-tertiary/10 border border-tertiary/20 rounded uppercase">
                                        {activeLoan ? 'Active Contract' : 'Active Offers'}
                                    </span>
                                </div>
                                <div className="p-2.5 md:p-card-padding grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
                                    {/* Plan A */}
                                    <div 
                                        className={`group rounded-xl p-2.5 md:p-4 transition-all cursor-pointer ${selectedProduct === 'JMX-ALPHA-92' ? 'bg-primary/5 border border-primary ring-1 ring-primary/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'bg-surface-container-low border border-outline-variant/30 hover:border-primary/50'}`}
                                        onClick={() => handleSelectPlan('JMX-ALPHA-92')}
                                    >
                                        <div className="flex justify-between items-start mb-2 md:mb-4">
                                            <div>
                                                <h3 className="text-sm md:text-label-md font-bold text-on-surface tracking-wide">JMX-ALPHA-92</h3>
                                                <p className="text-[10px] md:text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">High Yield Equity</p>
                                            </div>
                                            <span className={`material-symbols-outlined text-[16px] md:text-[22px] transition-transform ${selectedProduct === 'JMX-ALPHA-92' ? 'text-primary scale-110' : 'text-outline/40 group-hover:text-primary group-hover:scale-110'}`} style={selectedProduct === 'JMX-ALPHA-92' ? {fontVariationSettings: "'FILL' 1"} : {}}>verified</span>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-[10px] md:text-[10px] text-on-surface-variant uppercase font-bold">Min. Funding</p>
                                                <p className="text-lg md:text-headline-md font-bold font-tabular-nums text-on-surface leading-none mt-1">$1,000</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] md:text-[10px] text-tertiary uppercase font-bold">Target ROI</p>
                                                <p className="text-sm md:text-label-md font-bold text-tertiary leading-none mt-1">14.2% p.a.</p>
                                            </div>
                                        </div>
                                        {selectedProduct === 'JMX-ALPHA-92' && (
                                            <div className="mt-2.5" onClick={(e) => e.stopPropagation()}>
                                                <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block mb-1">Your Amount (Min. $1,000)</label>
                                                <input
                                                    type="number"
                                                    min={1000}
                                                    value={loanAmountInput}
                                                    onChange={(e) => handleLoanAmountChange(e.target.value)}
                                                    className="w-full bg-surface-container-lowest border border-primary/30 rounded-lg px-2.5 py-1.5 text-sm font-bold text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                                    placeholder="Min. $1,000"
                                                />
                                                {loanAmountError && <p className="text-error text-[10px] mt-0.5">{loanAmountError}</p>}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Plan B */}
                                    <div 
                                        className={`group rounded-xl p-2.5 md:p-4 transition-all cursor-pointer ${selectedProduct === 'GLB-PRECISION-X' ? 'bg-primary/5 border border-primary ring-1 ring-primary/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'bg-surface-container-low border border-outline-variant/30 hover:border-primary/50'}`}
                                        onClick={() => handleSelectPlan('GLB-PRECISION-X')}
                                    >
                                        <div className="flex justify-between items-start mb-2 md:mb-4">
                                            <div>
                                                <h3 className="text-sm md:text-label-md font-bold text-on-surface tracking-wide">GLB-PRECISION</h3>
                                                <p className="text-[10px] md:text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">Global Multi-Asset</p>
                                            </div>
                                            <span className={`material-symbols-outlined text-[16px] md:text-[22px] transition-transform ${selectedProduct === 'GLB-PRECISION-X' ? 'text-primary scale-110' : 'text-outline/40 group-hover:text-primary group-hover:scale-110'}`} style={selectedProduct === 'GLB-PRECISION-X' ? {fontVariationSettings: "'FILL' 1"} : {}}>verified</span>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-[10px] md:text-[10px] text-on-surface-variant uppercase font-bold">Min. Funding</p>
                                                <p className="text-lg md:text-headline-md font-bold font-tabular-nums text-on-surface leading-none mt-1">$10,000</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] md:text-[10px] text-tertiary uppercase font-bold">Target ROI</p>
                                                <p className="text-sm md:text-label-md font-bold text-tertiary leading-none mt-1">11.8% p.a.</p>
                                            </div>
                                        </div>
                                        {selectedProduct === 'GLB-PRECISION-X' && (
                                            <div className="mt-2.5" onClick={(e) => e.stopPropagation()}>
                                                <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block mb-1">Your Amount (Min. $10,000)</label>
                                                <input
                                                    type="number"
                                                    min={10000}
                                                    value={loanAmountInput}
                                                    onChange={(e) => handleLoanAmountChange(e.target.value)}
                                                    className="w-full bg-surface-container-lowest border border-primary/30 rounded-lg px-2.5 py-1.5 text-sm font-bold text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                                    placeholder="Min. $10,000"
                                                />
                                                {loanAmountError && <p className="text-error text-[10px] mt-0.5">{loanAmountError}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Land Feature & Collateral */}
                            <div className="glass-card rounded-xl overflow-hidden relative border border-outline-variant/20 hidden md:flex flex-col sm:flex-row">
                                <div className="sm:w-2/5 relative h-28 sm:h-auto">
                                    <img className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-7vlTD62fAp7gGhERxfPDYtOPy9dqZ-CseGXRyJXHvM2ZymY1KFTCO7k-F8koZcgSudnoy06oyiau1vQIxZtLYy-gHzqTG_SdsLeqJq3sTmaUHBRLI_VIL62CvijVixd1xLhpQZdKW4TCvSk0XyosA49_kggxPvpJgNf4OxeFm0TceP4lyFAlouTmxUlUxBkvPelsdc_Y60d7LRQWVYbtlA9sWd74V3s0X9zChESOaUR2lMIMi0neyVK0nauN8-B4kK98YbM4eYI2" alt="Land Collateral" />
                                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#0d1322] via-[#0d1322]/80 to-transparent"></div>
                                </div>
                                <div className="sm:w-3/5 p-2.5 md:p-6 flex flex-col justify-center relative z-10 bg-[#0d1322]/50 sm:bg-transparent -mt-3 sm:mt-0">
                                    <div className="bg-primary/10 border border-primary/20 px-2.5 py-0.5 inline-block rounded w-max mb-2 backdrop-blur-sm">
                                        <span className="text-[10px] md:text-[10px] font-bold text-primary uppercase tracking-wider">Asset-Backed Security</span>
                                    </div>
                                    <h2 className="text-base md:text-headline-sm font-bold text-on-surface mb-1 md:mb-2 tracking-tight">Land-Backed Collateral</h2>
                                    <p className="text-sm md:text-sm text-on-surface-variant mb-2.5 md:mb-6 leading-relaxed">Utilize real estate holdings as 0% margin collateral for higher-tier loans. Live institutional appraisal LTV.</p>
                                    <div className="grid grid-cols-2 gap-2 md:gap-4 mb-2.5 md:mb-6">
                                        <div className="bg-surface-container-high/60 p-2 md:p-3 rounded-lg border border-outline-variant/10 backdrop-blur-md">
                                            <p className="text-[10px] md:text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Max LTV</p>
                                            <p className="text-sm md:text-label-md font-bold text-on-surface mt-0.5">75.00%</p>
                                        </div>
                                        <div className="bg-surface-container-high/60 p-2 md:p-3 rounded-lg border border-outline-variant/10 backdrop-blur-md">
                                            <p className="text-[10px] md:text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Valuation</p>
                                            <p className="text-sm md:text-label-md font-bold text-on-surface mt-0.5 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Live Feed
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/settings')}
                                        className="w-full sm:w-auto border border-primary/50 text-primary px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-label-md font-bold hover:bg-primary/10 hover:border-primary transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[14px] md:text-[18px]">add_location</span>
                                        REGISTER LAND
                                    </button>
                                </div>
                            </div>

                            {/* Repayment Schedule */}
                            <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-2.5 md:px-card-padding py-2 md:py-3 flex flex-wrap items-center justify-between border-b border-outline-variant/10 gap-2">
                                    <h2 className="text-xs md:text-label-md font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[14px] md:text-[20px]">event_repeat</span>
                                        {activeLoan ? 'Active Repayment Schedule' : 'Repayment Schedule (Preview)'}
                                    </h2>
                                    <div className="flex items-center gap-2 text-[10px] md:text-label-sm font-bold text-on-surface-variant uppercase">
                                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_4px_rgba(78,222,163,0.8)]"></span> Scheduled</span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto scrollbar-hide">
                                    <table className="w-full text-left border-collapse min-w-0">
                                        <thead className="bg-surface-container-highest/20 border-b border-outline-variant/10">
                                            <tr>
                                                <th className="px-1.5 py-1 md:px-card-padding md:py-3 text-[10px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">No.</th>
                                                <th className="px-1.5 py-1 md:px-card-padding md:py-3 text-[10px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
                                                <th className="px-1.5 py-1 md:px-card-padding md:py-3 text-[10px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Amount</th>
                                                <th className="px-1.5 py-1 md:px-card-padding md:py-3 text-[10px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Principal</th>
                                                <th className="px-1.5 py-1 md:px-card-padding md:py-3 text-[10px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Interest</th>
                                                <th className="px-1.5 py-1 md:px-card-padding md:py-3 text-[10px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Auto-Pay</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/5 text-sm md:text-sm">
                                            {displaySchedule.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-1.5 py-1 md:px-card-padding font-tabular-nums text-on-surface font-bold text-xs md:text-sm">#{item.displayId.toString().padStart(2, '0')}</td>
                                                    <td className="px-1.5 py-1 md:px-card-padding text-tabular-nums text-on-surface-variant text-xs md:text-sm">{item.date}</td>
                                                    <td className="px-1.5 py-1 md:px-card-padding text-tabular-nums text-on-surface font-bold text-xs md:text-sm">{formatter.format(item.amount)}</td>
                                                    <td className="px-1.5 py-1 md:px-card-padding text-tabular-nums text-on-surface-variant text-xs md:text-sm hidden sm:table-cell">{formatter.format(item.principal)}</td>
                                                    <td className="px-1.5 py-1 md:px-card-padding text-tabular-nums text-on-surface-variant text-xs md:text-sm hidden sm:table-cell">{formatter.format(item.interest)}</td>
                                                    <td className="px-1.5 py-1 md:px-card-padding text-right">
                                                        <button 
                                                            disabled={!item.isBackend}
                                                            onClick={() => item.isBackend && toggleAutoPay(item.id, item.auto_pay_enabled)}
                                                            className={`text-[10px] md:text-[10px] font-bold border px-1.5 py-0.5 md:px-3 md:py-1 rounded transition-all uppercase tracking-wider ${
                                                                !item.isBackend ? 'bg-surface-container-high text-outline/50 border-outline-variant/20 cursor-not-allowed' :
                                                                item.auto_pay_enabled 
                                                                    ? 'text-on-primary bg-primary border-primary/30 hover:bg-primary/80' 
                                                                    : 'text-primary bg-primary/5 border-primary/30 hover:bg-primary/20'
                                                            }`}
                                                        >
                                                            {item.auto_pay_enabled ? 'ON' : 'OFF'}
                                                        </button>
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
                                <div className="bg-surface-container-high/40 px-2.5 md:px-card-padding py-2 md:py-3 border-b border-outline-variant/10">
                                    <h2 className="text-xs md:text-label-md font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[14px] md:text-[20px]">calculate</span>
                                        Calculator
                                    </h2>
                                </div>
                                <div className="p-2.5 md:p-card-padding space-y-2.5 md:space-y-6">
                                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                                        <div className="col-span-2">
                                            <p className="text-[10px] md:text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-1">Selected</p>
                                            <p className="text-sm md:text-base font-bold text-on-surface bg-surface-container-low px-2 py-1.5 rounded-lg border border-outline-variant/20">{selectedProduct}</p>
                                        </div>
                                        <div className="bg-surface-container-low p-2 md:p-3 rounded-lg border border-outline-variant/10">
                                            <p className="text-[10px] md:text-[10px] text-on-surface-variant uppercase font-bold tracking-wider mb-0.5">Loan Amount</p>
                                            <p className="text-base md:text-lg font-bold font-tabular-nums text-on-surface">{formatter.format(currentLoan)}</p>
                                        </div>
                                        <div className="bg-tertiary/5 p-2 md:p-3 rounded-lg border border-tertiary/10">
                                            <p className="text-[10px] md:text-[10px] text-tertiary/80 uppercase font-bold tracking-wider mb-0.5">Down (10%)</p>
                                            <p className="text-base md:text-lg font-bold font-tabular-nums text-tertiary">{formatter.format(downPayment)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] md:text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block mb-1.5">Duration</label>
                                        <div className="grid grid-cols-3 gap-1 md:gap-2 p-0.5 bg-surface-container-low rounded-lg border border-outline-variant/20">
                                            <button 
                                                className={`py-1 md:py-2 rounded-md text-[11px] md:text-xs font-bold transition-all uppercase tracking-wide ${currentDuration === 3 ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                                                onClick={() => setCurrentDuration(3)}
                                            >3 Mo</button>
                                            <button 
                                                className={`py-1 md:py-2 rounded-md text-[11px] md:text-xs font-bold transition-all uppercase tracking-wide ${currentDuration === 6 ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                                                onClick={() => setCurrentDuration(6)}
                                            >6 Mo</button>
                                            <button 
                                                className={`py-1 md:py-2 rounded-md text-[11px] md:text-xs font-bold transition-all uppercase tracking-wide ${currentDuration === 12 ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                                                onClick={() => setCurrentDuration(12)}
                                            >12 Mo</button>
                                        </div>
                                    </div>
                                    <div className="bg-primary/5 p-2.5 md:p-4 rounded-lg border border-primary/20 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
                                        <p className="text-[10px] md:text-xs text-primary uppercase font-bold tracking-wider mb-0.5 relative z-10">Monthly Payment</p>
                                        <div className="flex items-baseline gap-1 relative z-10">
                                            <span className="text-xl md:text-3xl font-bold font-tabular-nums text-primary tracking-tight">{formatter.format(monthly)}</span>
                                            <span className="text-[10px] md:text-sm font-bold text-primary/60">/mo</span>
                                        </div>
                                    </div>
                                    
                                    {/* Legal & Terms */}
                                    <div className="space-y-2.5 md:space-y-4">
                                        <div className="h-auto md:h-32 bg-surface-container-lowest p-2.5 md:p-3 rounded-lg border border-outline-variant/30 overflow-y-visible md:overflow-y-auto text-sm md:text-[10px] text-on-surface-variant leading-relaxed custom-scrollbar shadow-inner">
                                            <p className="font-bold text-on-surface mb-1 uppercase tracking-wider text-sm md:text-[10px]">Institutional Agreement v4.2</p>
                                            <p className="mb-1">1. Contract governs the funding for selected product.</p>
                                            <p className="mb-1">2. Fixed APR applies per institutional rating.</p>
                                            <p className="mb-1">3. Failure to meet installments within 48h triggers liquidation.</p>
                                            <p className="mb-1">4. Real Estate: Primary lien applies to land collateral.</p>
                                            <p>5. Confidentiality under NDA standard.</p>
                                        </div>
                                        <label className="flex items-start gap-1.5 cursor-pointer group bg-surface-container-low/50 p-1.5 rounded-lg border border-transparent hover:border-outline-variant/30 transition-colors">
                                            <input 
                                                type="checkbox" 
                                                className="mt-0.5 w-3.5 h-3.5 md:w-4 md:h-4 rounded bg-surface-container-lowest border-outline-variant text-primary focus:ring-primary ring-offset-background"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                            />
                                            <span className="text-sm md:text-xs font-medium text-on-surface-variant group-hover:text-on-surface transition-colors leading-tight">I accept the terms and authorize the 10% down payment from wallet balance.</span>
                                        </label>
                                        
                                        {loanSubmitted && (
                                            <div className="text-xs font-medium bg-tertiary/10 p-2.5 rounded-lg border border-tertiary/20 text-tertiary flex items-start gap-2">
                                                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">check_circle</span>
                                                <span>Your loan request has been submitted for approval. You will be notified once it's approved.</span>
                                            </div>
                                        )}

                                        {pendingLoan && !loanSubmitted && (
                                            <div className="text-xs font-medium bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-amber-400 flex items-start gap-2">
                                                <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">pending</span>
                                                <span>Your loan application is pending approval. You will be notified once it's reviewed.</span>
                                            </div>
                                        )}

                                        {applyError && (
                                            <div className="text-error text-xs font-medium bg-error/10 p-2 rounded border border-error/20">
                                                {applyError}
                                            </div>
                                        )}

                                        <button 
                                            disabled={!termsAccepted || isApplying || activeLoan !== undefined}
                                            onClick={handleInitiate}
                                            className={`w-full py-2.5 md:py-3.5 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all shadow-sm ${
                                                approvedActiveLoan
                                                ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed'
                                                : pendingLoan
                                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 cursor-not-allowed'
                                                : termsAccepted && !isApplying 
                                                ? 'bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] shadow-primary/20' 
                                                : 'bg-surface-container-high text-outline/50 cursor-not-allowed'
                                            }`}
                                        >
                                            {isApplying ? 'Processing...' : approvedActiveLoan ? 'Loan Active' : pendingLoan ? 'Application Pending Approval' : 'Sign & Initiate'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
        </div>
    );
}
