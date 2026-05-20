import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ConfirmInvestment() {
    const navigate = useNavigate();
    const [amount, setAmount] = useState<number>(10000);
    const [paymentSource, setPaymentSource] = useState<'main' | 'profit'>('main');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const DAILY_ROI = 0.025; // 2.5%
    const DURATION = 30;

    const dailyProfit = amount * DAILY_ROI;
    const totalProfit = dailyProfit * DURATION;
    const totalReturn = amount + totalProfit;

    const isValidAmount = amount >= 5000 && amount <= 500000;

    const handleConfirm = () => {
        if (!isValidAmount || isProcessing || isConfirmed) return;
        
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsConfirmed(true);
        }, 1500);
    };

    return (
        <div className="flex-1 px-4 md:px-margin-desktop pt-6 md:pt-8 pb-12 max-w-[1200px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 items-start">
                    {/* Left Column: Plan Details */}
                    <div className="lg:col-span-7 space-y-4 md:space-y-6">
                        {/* Hero Plan Card */}
                        <div className="glass-card rounded-xl overflow-hidden shadow-xl relative border border-outline-variant/20">
                            <div className="absolute top-0 right-0 p-3 md:p-4">
                                <span className="bg-primary/20 text-primary px-2 py-0.5 md:px-3 md:py-1 rounded border border-primary/30 text-[9px] md:text-xs font-bold uppercase tracking-wider">Premium Plan</span>
                            </div>
                            <div className="bg-surface-container-high/40 p-4 md:p-5 border-b border-outline-variant/10">
                                <h2 className="text-xl md:text-2xl font-bold text-primary tracking-tight">Sigma Prime</h2>
                                <p className="text-on-surface-variant text-[10px] md:text-sm mt-0.5 md:mt-1 font-medium">Institutional-grade algorithmic trading strategy</p>
                            </div>
                            <div className="p-4 md:p-5 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                                <div className="space-y-0.5 md:space-y-1">
                                    <span className="text-[9px] md:text-xs text-on-surface-variant uppercase font-bold tracking-wider">Daily ROI</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg md:text-2xl font-bold text-tertiary">2.5%</span>
                                        <span className="material-symbols-outlined text-[16px] md:text-[20px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                                    </div>
                                </div>
                                <div className="space-y-0.5 md:space-y-1">
                                    <span className="text-[9px] md:text-xs text-on-surface-variant uppercase font-bold tracking-wider">Duration</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg md:text-2xl font-bold text-on-surface">30 Days</span>
                                    </div>
                                </div>
                                <div className="space-y-0.5 md:space-y-1 col-span-2 md:col-span-1 border-t border-outline-variant/10 pt-3 md:border-t-0 md:pt-0">
                                    <span className="text-[9px] md:text-xs text-on-surface-variant uppercase font-bold tracking-wider">Capital Return</span>
                                    <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                                        <span className="text-[10px] md:text-sm bg-surface-container-highest/50 border border-outline-variant/20 px-2 py-1 rounded font-bold">At Maturity</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 pb-4 md:px-5 md:pb-5">
                                <div className="rounded-lg bg-surface-container-lowest border border-outline-variant/20 p-3 md:p-4 space-y-2 md:space-y-3">
                                    <div className="flex justify-between items-center text-[10px] md:text-sm font-bold">
                                        <span className="text-on-surface-variant uppercase tracking-wider">Min. Investment</span>
                                        <span className="text-on-surface font-tabular-nums">$5,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] md:text-sm font-bold">
                                        <span className="text-on-surface-variant uppercase tracking-wider">Max. Investment</span>
                                        <span className="text-on-surface font-tabular-nums">$500,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] md:text-sm font-bold">
                                        <span className="text-on-surface-variant uppercase tracking-wider">Compounding</span>
                                        <span className="text-on-surface bg-surface-container-high px-1.5 py-0.5 rounded">Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Strategy Insights */}
                        <div className="glass-card rounded-xl p-4 md:p-5 border border-outline-variant/20">
                            <h3 className="text-[11px] md:text-sm font-bold text-primary mb-3 md:mb-4 uppercase tracking-wide flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] md:text-[20px]">insights</span>
                                Strategy Parameters
                            </h3>
                            <div className="space-y-3 md:space-y-4">
                                <div className="flex gap-3 md:gap-4 items-start bg-surface-container-lowest/50 border border-outline-variant/10 p-3 rounded-lg">
                                    <div className="bg-primary/10 border border-primary/20 p-1.5 md:p-2 rounded-lg shrink-0">
                                        <span className="material-symbols-outlined text-primary text-[18px] md:text-[24px]">security</span>
                                    </div>
                                    <div>
                                        <p className="text-on-surface font-bold text-[11px] md:text-sm">Principal Protection</p>
                                        <p className="text-on-surface-variant text-[9px] md:text-xs mt-0.5 md:mt-1 leading-snug font-medium">Funds backed by institutional liquidity providers and cold-storage reserves.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 md:gap-4 items-start bg-surface-container-lowest/50 border border-outline-variant/10 p-3 rounded-lg">
                                    <div className="bg-primary/10 border border-primary/20 p-1.5 md:p-2 rounded-lg shrink-0">
                                        <span className="material-symbols-outlined text-primary text-[18px] md:text-[24px]">monitoring</span>
                                    </div>
                                    <div>
                                        <p className="text-on-surface font-bold text-[11px] md:text-sm">Real-time Accrual</p>
                                        <p className="text-on-surface-variant text-[9px] md:text-xs mt-0.5 md:mt-1 leading-snug font-medium">Profits are calculated every 24 hours and credited to your profit wallet.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form & Confirmation */}
                    <div className="lg:col-span-5">
                        <div className="glass-card rounded-xl shadow-xl p-4 md:p-5 space-y-5 md:space-y-8 sticky top-20 md:top-24 border border-outline-variant/20">
                            {/* Investment Amount */}
                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[10px] md:text-sm font-bold text-on-surface-variant flex justify-between uppercase tracking-wider">
                                    Investment Amount
                                    <span className="text-primary font-tabular-nums">USD</span>
                                </label>
                                <div className="relative group">
                                    <input 
                                        className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-3 md:px-4 md:py-4 text-2xl md:text-3xl font-bold focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-surface outline-none font-tabular-nums focus:shadow-[0_0_10px_rgba(37,99,235,0.2)]" 
                                        type="number" 
                                        value={amount || ''}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        placeholder="0.00"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5 md:gap-2">
                                        <button 
                                            onClick={() => setAmount(5000)}
                                            className="text-[9px] md:text-xs font-bold bg-surface-container-low border border-outline-variant/50 hover:border-primary hover:text-primary px-2 py-1 md:px-2.5 md:py-1 rounded transition-colors"
                                        >
                                            MIN
                                        </button>
                                        <button 
                                            onClick={() => setAmount(50000)}
                                            className="text-[9px] md:text-xs font-bold bg-surface-container-low border border-outline-variant/50 hover:border-primary hover:text-primary px-2 py-1 md:px-2.5 md:py-1 rounded transition-colors"
                                        >
                                            MAX
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Source */}
                            <div className="space-y-2 md:space-y-3">
                                <label className="text-[10px] md:text-sm font-bold text-on-surface-variant uppercase tracking-wider">Select Funding Source</label>
                                <div className="grid grid-cols-1 gap-2 md:gap-3">
                                    {/* Source Option 1 */}
                                    <label className={`relative flex items-center p-3 md:p-4 border rounded-lg cursor-pointer transition-all group ${paymentSource === 'main' ? 'border-primary bg-primary/5 shadow-sm' : 'border-outline-variant/50 hover:border-primary/50 bg-surface-container-lowest'}`}>
                                        <input 
                                            className="hidden" 
                                            name="payment_source" 
                                            type="radio" 
                                            value="main"
                                            checked={paymentSource === 'main'}
                                            onChange={() => setPaymentSource('main')}
                                        />
                                        <div className={`p-1.5 md:p-2 rounded-lg mr-3 md:mr-4 border ${paymentSource === 'main' ? 'bg-primary/20 border-primary/30' : 'bg-surface-container-high border-outline-variant/30'}`}>
                                            <span className={`material-symbols-outlined text-[18px] md:text-[24px] ${paymentSource === 'main' ? 'text-primary' : 'text-on-surface-variant'}`}>account_balance_wallet</span>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="text-on-surface font-bold text-[11px] md:text-sm">Main Wallet</div>
                                            <div className="text-on-surface-variant text-[9px] md:text-xs font-tabular-nums font-medium mt-0.5">$42,500.00 Available</div>
                                        </div>
                                        <div className={`w-4 h-4 md:w-5 md:h-5 border-2 rounded-full flex items-center justify-center shrink-0 ${paymentSource === 'main' ? 'border-primary' : 'border-outline-variant/50'}`}>
                                            <div className={`w-2 h-2 md:w-2.5 md:h-2.5 bg-primary rounded-full transition-opacity ${paymentSource === 'main' ? 'opacity-100' : 'opacity-0'}`}></div>
                                        </div>
                                    </label>
                                    {/* Source Option 2 */}
                                    <label className={`relative flex items-center p-3 md:p-4 border rounded-lg cursor-pointer transition-all group ${paymentSource === 'profit' ? 'border-primary bg-primary/5 shadow-sm' : 'border-outline-variant/50 hover:border-primary/50 bg-surface-container-lowest'}`}>
                                        <input 
                                            className="hidden" 
                                            name="payment_source" 
                                            type="radio" 
                                            value="profit"
                                            checked={paymentSource === 'profit'}
                                            onChange={() => setPaymentSource('profit')}
                                        />
                                        <div className={`p-1.5 md:p-2 rounded-lg mr-3 md:mr-4 border ${paymentSource === 'profit' ? 'bg-tertiary/20 border-tertiary/30' : 'bg-surface-container-high border-outline-variant/30'}`}>
                                            <span className={`material-symbols-outlined text-[18px] md:text-[24px] ${paymentSource === 'profit' ? 'text-tertiary' : 'text-on-surface-variant'}`}>monetization_on</span>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="text-on-surface font-bold text-[11px] md:text-sm">Profit Wallet</div>
                                            <div className="text-on-surface-variant text-[9px] md:text-xs font-tabular-nums font-medium mt-0.5">$3,120.45 Available</div>
                                        </div>
                                        <div className={`w-4 h-4 md:w-5 md:h-5 border-2 rounded-full flex items-center justify-center shrink-0 ${paymentSource === 'profit' ? 'border-primary' : 'border-outline-variant/50'}`}>
                                            <div className={`w-2 h-2 md:w-2.5 md:h-2.5 bg-primary rounded-full transition-opacity ${paymentSource === 'profit' ? 'opacity-100' : 'opacity-0'}`}></div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Return Summary */}
                            <div className="bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl p-4 md:p-5 space-y-3 md:space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] md:text-sm font-bold text-on-surface-variant uppercase tracking-wider">Est. Profits ({DURATION}D)</span>
                                    <span className="text-lg md:text-2xl font-bold text-tertiary font-tabular-nums">
                                        +${totalProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                    </span>
                                </div>
                                <div className="h-px bg-outline-variant/10"></div>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-0.5 md:space-y-1">
                                        <span className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Expected Return</span>
                                        <div className="text-2xl md:text-3xl font-bold text-on-surface font-tabular-nums tracking-tight">
                                            ${totalReturn.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                        </div>
                                    </div>
                                    <div className="text-right text-[8px] md:text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-1">
                                        Incl. Principal
                                    </div>
                                </div>
                            </div>

                            {/* Action Button - Sticky on Mobile */}
                            <div className="fixed md:static bottom-0 left-0 w-full md:w-auto p-4 md:p-0 bg-surface/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-t border-outline-variant/20 md:border-none z-40">
                                <button 
                                    onClick={handleConfirm}
                                    disabled={!isValidAmount || isProcessing || isConfirmed}
                                    className={`w-full py-3.5 md:py-4 rounded-xl font-bold text-[11px] md:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                        !isValidAmount ? 'opacity-50 cursor-not-allowed bg-surface-container-highest text-on-surface-variant' : 
                                        isProcessing ? 'bg-primary text-on-primary brightness-75' :
                                        isConfirmed ? 'bg-tertiary text-on-tertiary shadow-[0_0_15px_rgba(78,222,163,0.3)]' : 
                                        'bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] shadow-sm shadow-primary/20 cursor-pointer'
                                    }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : isConfirmed ? (
                                        <>
                                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">check_circle</span>
                                            Investment Confirmed
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">lock</span>
                                            Confirm Investment
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[9px] md:text-xs font-medium text-on-surface-variant mt-3 md:mt-4 leading-snug">
                                    By confirming, you agree to the <Link to="#" className="text-primary hover:underline font-bold">Plan Agreement</Link> &amp; <Link to="#" className="text-primary hover:underline font-bold">Risk Policy</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}
