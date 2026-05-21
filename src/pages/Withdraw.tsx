import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWalletStore } from '../store/walletStore';
import { useTransactionStore } from '../store/transactionStore';

export default function Withdraw() {
    const navigate = useNavigate();
    const { mainBalance, profitBalance } = useWalletStore();
    const { transactions } = useTransactionStore();
    const [selectedAccount, setSelectedAccount] = useState<'main' | 'profit'>('main');
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [isWithdrawn, setIsWithdrawn] = useState(false);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    const handleWithdraw = () => {
        setIsWithdrawing(true);
        setTimeout(() => {
            setIsWithdrawing(false);
            setIsWithdrawn(true);
        }, 2000);
    };

    // Helper function for OTP inputs
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.value.length === 1) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };
    
    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    return (
        <div className="flex-1 p-2.5 md:p-margin-desktop space-y-2.5 md:space-y-6 max-w-[1600px] mx-auto w-full mb-6">
                    {/* Bento Layout Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 md:gap-6">
                        {/* Left Column: Withdrawal Form */}
                        <div className="lg:col-span-7 space-y-2.5 md:space-y-6">
                            {/* Wallet Overview Card with Premium Sparklines and Animations */}
                            <div className="glass-card rounded-xl overflow-hidden shadow-xl border border-outline-variant/20 relative group/balance">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-tertiary/5 opacity-40"></div>
                                <div className="bg-surface-container-high/40 px-2.5 py-2 md:px-5 md:py-3.5 border-b border-outline-variant/10 flex items-center justify-between relative z-10">
                                    <span className="text-[10px] md:text-label-md font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px] md:text-[20px] animate-pulse">account_balance_wallet</span>
                                        Balance Overview
                                    </span>
                                    <span className="text-[8px] md:text-label-sm text-tertiary bg-tertiary/10 border border-tertiary/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
                                        Live Valuation
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 divide-x divide-outline-variant/10 relative z-10">
                                    {/* Main Account Column */}
                                    <div className="p-3 md:p-5 relative overflow-hidden group/main">
                                        {/* Sparkline background */}
                                        <div className="absolute inset-0 opacity-15 pointer-events-none -bottom-1">
                                            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                                                    </linearGradient>
                                                </defs>
                                                <path 
                                                    d="M0,35 Q15,30 30,20 T60,25 T90,5 T100,2" 
                                                    fill="none" 
                                                    stroke="#3b82f6" 
                                                    strokeWidth="1.5" 
                                                    className="animate-withdraw-draw"
                                                />
                                                <path 
                                                    d="M0,35 Q15,30 30,20 T60,25 T90,5 T100,2 L100,40 L0,40 Z" 
                                                    fill="url(#mainGrad)"
                                                />
                                            </svg>
                                        </div>
                                        
                                        <div className="relative z-10 flex flex-col justify-between h-full">
                                            <div>
                                                <p className="text-[9px] md:text-label-sm text-on-surface-variant mb-1 font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <span className="w-1 h-1 rounded-full bg-primary"></span>
                                                    Main Account
                                                </p>
                                                <p className="text-sm sm:text-lg md:text-2xl font-mono text-on-surface font-extrabold tracking-tight group-hover/main:text-primary transition-colors">{formatCurrency(mainBalance)}</p>
                                            </div>
                                            <div className="mt-2.5 flex items-center gap-1 text-[8px] md:text-[10px] text-primary/80 font-bold uppercase">
                                                <span className="material-symbols-outlined text-[10px] md:text-[12px] font-bold">trending_up</span>
                                                +4.82% weekly
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profit Wallet Column */}
                                    <div className="p-3 md:p-5 relative overflow-hidden group/profit">
                                        {/* Sparkline background */}
                                        <div className="absolute inset-0 opacity-15 pointer-events-none -bottom-1">
                                            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                                    </linearGradient>
                                                </defs>
                                                <path 
                                                    d="M0,38 Q20,35 40,15 T70,18 T90,2 T100,0" 
                                                    fill="none" 
                                                    stroke="#10b981" 
                                                    strokeWidth="1.5" 
                                                    className="animate-withdraw-draw"
                                                />
                                                <path 
                                                    d="M0,38 Q20,35 40,15 T70,18 T90,2 T100,0 L100,40 L0,40 Z" 
                                                    fill="url(#profitGrad)"
                                                />
                                            </svg>
                                        </div>
                                        
                                        <div className="relative z-10 flex flex-col justify-between h-full">
                                            <div>
                                                <p className="text-[9px] md:text-label-sm text-on-surface-variant mb-1 font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <span className="w-1 h-1 rounded-full bg-tertiary"></span>
                                                    Profit Wallet
                                                </p>
                                                <p className="text-sm sm:text-lg md:text-2xl font-mono text-tertiary font-extrabold tracking-tight group-hover/profit:text-tertiary/80 transition-colors">{formatCurrency(profitBalance)}</p>
                                            </div>
                                            <div className="mt-2.5 flex items-center gap-1 text-[8px] md:text-[10px] text-tertiary/80 font-bold uppercase">
                                                <span className="material-symbols-outlined text-[10px] md:text-[12px] font-bold">payments</span>
                                                Daily yield payout
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Withdrawal Configuration */}
                            <div className="glass-card rounded-xl p-2.5 md:p-5 space-y-2.5 md:space-y-6 border border-outline-variant/20">
                                <div className="space-y-2 md:space-y-4">
                                    <label className="block text-[10px] md:text-label-md font-bold text-on-surface uppercase tracking-wider">Source Account</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-4">
                                        <button 
                                            onClick={() => setSelectedAccount('main')}
                                            className={`flex items-center justify-between p-2.5 md:p-4 rounded-lg transition-all ${selectedAccount === 'main' ? 'bg-primary/10 border border-primary/50 ring-1 ring-primary/20 shadow-sm' : 'bg-surface-container-low border border-outline-variant/50 hover:border-primary/50'}`}>
                                            <span className={`${selectedAccount === 'main' ? 'text-primary' : 'text-on-surface-variant'} font-bold text-xs md:text-base`}>Main Account</span>
                                            {selectedAccount === 'main' ? (
                                                <span className="material-symbols-outlined text-primary text-[18px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                            ) : (
                                                <div className="w-4 h-4 md:w-6 md:h-6 rounded-full border border-outline-variant/50"></div>
                                            )}
                                        </button>
                                        <button 
                                            onClick={() => setSelectedAccount('profit')}
                                            className={`flex items-center justify-between p-2.5 md:p-4 rounded-lg transition-all ${selectedAccount === 'profit' ? 'bg-tertiary/10 border border-tertiary/50 ring-1 ring-tertiary/20 shadow-sm' : 'bg-surface-container-low border border-outline-variant/50 hover:border-primary/50'}`}>
                                            <span className={`${selectedAccount === 'profit' ? 'text-tertiary' : 'text-on-surface-variant'} font-bold text-xs md:text-base`}>Profit Wallet</span>
                                            {selectedAccount === 'profit' ? (
                                                <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                            ) : (
                                                <div className="w-4 h-4 md:w-6 md:h-6 rounded-full border border-outline-variant/50"></div>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 md:space-y-4 pt-1 md:pt-0">
                                    <div className="flex justify-between items-end">
                                        <label className="block text-[10px] md:text-label-md font-bold text-on-surface uppercase tracking-wider">Amount to Withdraw</label>
                                        <span className="text-[9px] md:text-xs text-on-surface-variant font-bold">Available: {formatCurrency(selectedAccount === 'main' ? mainBalance : profitBalance)}</span>
                                    </div>
                                    <div className="relative group">
                                        <input className="w-full bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_10px_rgba(37,99,235,0.2)] focus:outline-none rounded-lg px-2.5 py-2 md:px-4 md:py-3.5 text-lg md:text-3xl font-mono text-on-surface transition-all font-bold" placeholder="0.00" type="number"/>
                                        <button className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 md:px-3 md:py-1 bg-primary/10 text-primary text-[10px] md:text-xs rounded border border-primary/20 hover:bg-primary hover:text-on-primary transition-all font-bold tracking-wider">MAX</button>
                                        <span className="absolute left-2.5 -top-2 bg-surface-container-lowest px-1 md:px-2 text-[8px] md:text-[10px] text-primary uppercase tracking-widest font-bold">USD Equivalent</span>
                                    </div>
                                </div>

                                <div className="space-y-2 md:space-y-4 pt-1 md:pt-0">
                                    <label className="block text-[10px] md:text-label-md font-bold text-on-surface uppercase tracking-wider">Destination Wallet</label>
                                    <div className="relative">
                                        <input className="w-full bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_10px_rgba(37,99,235,0.2)] focus:outline-none rounded-lg pl-9 pr-2.5 py-2 md:pl-12 md:pr-4 md:py-3.5 text-xs md:text-body-md font-mono font-medium text-on-surface transition-all" placeholder="Enter wallet address (e.g. 0x...)" type="text"/>
                                        <span className="material-symbols-outlined absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] md:text-[24px]">account_balance_wallet</span>
                                    </div>
                                    <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-error/10 border border-error/20 rounded-lg mt-2 md:mt-3">
                                        <span className="material-symbols-outlined text-error text-[16px] md:text-[20px] shrink-0 mt-0.5">warning</span>
                                        <p className="text-[9px] md:text-xs leading-tight text-error/90 font-bold">Ensure the destination address is accurate. Transfers to incorrect addresses are irreversible and result in permanent loss.</p>
                                    </div>
                                </div>

                                {/* Mobile-only Execute button */}
                                <div className="md:hidden pt-4 border-t border-outline-variant/10">
                                    <button 
                                        onClick={handleWithdraw}
                                        disabled={isWithdrawing || isWithdrawn}
                                        className={`w-full py-3.5 ${isWithdrawing ? 'bg-primary/50 text-white' : isWithdrawn ? 'bg-tertiary text-on-tertiary shadow-[0_0_15px_rgba(78,222,163,0.3)]' : 'bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] shadow-sm shadow-primary/20'} font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 group`}
                                    >
                                        {isWithdrawing ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Verifying...
                                            </>
                                        ) : isWithdrawn ? (
                                            <>
                                                <span className="material-symbols-outlined text-[18px]">verified</span>
                                                Request Transmitted
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">lock_person</span>
                                                Execute Withdrawal
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
 
                         {/* Right Column: Security & Summary */}
                         <div className="lg:col-span-5 space-y-2.5 md:space-y-6">
                             {/* 2FA / OTP Verification */}
                             <div className="hidden md:block glass-card rounded-xl p-2.5 md:p-5 space-y-2.5 md:space-y-6 relative overflow-hidden border border-primary/20 shadow-[0_0_20px_rgba(37,99,235,0.05)]">
                                 <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
                                 <div className="relative z-10">
                                    <h2 className="text-base md:text-2xl font-bold text-on-surface mb-1 md:mb-2 tracking-tight">Security Clearance</h2>
                                    <p className="text-[10px] md:text-sm text-on-surface-variant font-medium leading-snug">A 6-digit verification code has been sent to your registered device.</p>
                                </div>
                                <div className="space-y-2.5 md:space-y-4 relative z-10">
                                    <div className="flex justify-between gap-1.5 md:gap-2">
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <input 
                                                key={index}
                                                id={`otp-${index}`}
                                                className="w-9 sm:w-12 h-10 sm:h-14 bg-surface-container-highest border border-outline-variant/50 rounded-lg text-center text-sm md:text-xl font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all" 
                                                maxLength={1} 
                                                type="text"
                                                onChange={(e) => handleOtpChange(e, index)}
                                                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                            />
                                        ))}
                                    </div>
                                    <button className="w-full text-[10px] md:text-xs font-bold text-primary hover:underline transition-all">Resend OTP (Available in 42s)</button>
                                </div>
                                
                                <div className="pt-2.5 md:pt-6 border-t border-outline-variant/10 space-y-2.5 md:space-y-4 relative z-10">
                                    <div className="flex justify-between text-[10px] md:text-sm font-bold items-center">
                                        <span className="text-on-surface-variant uppercase tracking-wider">Processing Fee (0.12%)</span>
                                        <span className="text-on-surface font-mono">$1,498.30</span>
                                    </div>
                                    <div className="flex justify-between text-sm md:text-xl font-bold items-center">
                                        <span className="text-on-surface uppercase tracking-wider">Net Disbursement</span>
                                        <span className="text-primary font-mono tracking-tight">$1,247,091.70</span>
                                    </div>
                                    
                                    <button 
                                        onClick={handleWithdraw}
                                        disabled={isWithdrawing || isWithdrawn}
                                        className={`w-full py-2.5 md:py-4 ${isWithdrawing ? 'bg-primary/50 text-white' : isWithdrawn ? 'bg-tertiary text-on-tertiary shadow-[0_0_15px_rgba(78,222,163,0.3)]' : 'bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] shadow-sm shadow-primary/20'} font-bold text-[10px] md:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 group mt-2`}
                                    >
                                        {isWithdrawing ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Verifying...
                                            </>
                                        ) : isWithdrawn ? (
                                            <>
                                                <span className="material-symbols-outlined text-[18px] md:text-[20px]">verified</span>
                                                Request Transmitted
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[18px] md:text-[20px] group-hover:translate-x-1 transition-transform">lock_person</span>
                                                Execute Withdrawal
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Security Badge Card */}
                            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 md:p-4 flex items-center gap-2.5 md:gap-4">
                                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[24px]">verified</span>
                                </div>
                                <div>
                                    <h3 className="text-xs md:text-sm font-bold text-on-surface mb-0.5">Global Insurance Coverage</h3>
                                    <p className="text-[9px] md:text-[10px] text-on-surface-variant leading-relaxed font-medium">Protected by Lloyds of London institutional grade digital asset indemnity up to $50M/tx.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Withdrawal History Section */}
                    <div className="glass-card rounded-xl overflow-hidden mt-2.5 md:mt-8 border border-outline-variant/20">
                        <div className="bg-surface-container-high/40 px-2.5 py-2 md:px-5 md:py-4 flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/10">
                            <h2 className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] md:text-[20px]">history</span>
                                Withdrawal History
                            </h2>
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <button className="p-1 md:p-1.5 rounded-lg border border-outline-variant/50 bg-surface-container-low hover:border-primary transition-all">
                                    <span className="material-symbols-outlined text-[16px] md:text-[20px] text-on-surface-variant">filter_list</span>
                                </button>
                                <button className="p-1 md:p-1.5 rounded-lg border border-outline-variant/50 bg-surface-container-low hover:border-primary transition-all">
                                    <span className="material-symbols-outlined text-[16px] md:text-[20px] text-on-surface-variant">download</span>
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full text-left min-w-[700px]">
                                <thead>
                                    <tr className="bg-surface-container-highest/20 text-[9px] md:text-[11px] text-on-surface-variant uppercase tracking-widest font-bold border-b border-outline-variant/10">
                                        <th className="px-2.5 py-2 md:px-5 md:py-3">Date / ID</th>
                                        <th className="px-2.5 py-2 md:px-5 md:py-3">Destination</th>
                                        <th className="px-2.5 py-2 md:px-5 md:py-3">Asset</th>
                                        <th className="px-2.5 py-2 md:px-5 md:py-3 text-right">Amount (USD)</th>
                                        <th className="px-2.5 py-2 md:px-5 md:py-3 text-center">Status</th>
                                        <th className="px-2.5 py-2 md:px-5 md:py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/5">
                                    {transactions.filter(tx => tx.type === 'withdrawal').length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-2.5 py-4 md:px-5 md:py-8 text-center text-on-surface-variant font-medium text-xs md:text-sm">
                                                No withdrawal history found.
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.filter(tx => tx.type === 'withdrawal').map((tx) => (
                                            <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-2.5 py-2 md:px-5 md:py-4">
                                                    <p className="text-on-surface text-[11px] md:text-sm font-mono font-bold">{new Date(tx.created_at).toLocaleDateString()}</p>
                                                    <p className="text-[9px] md:text-[10px] text-on-surface-variant font-mono mt-0.5">TXN-{tx.id.substring(0, 8).toUpperCase()}</p>
                                                </td>
                                                <td className="px-2.5 py-2 md:px-5 md:py-4">
                                                    <div className="flex items-center gap-1.5 md:gap-2">
                                                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-[9px] md:text-[10px] text-on-surface font-mono font-bold border border-outline-variant/30">0x</div>
                                                        <span className="text-[10px] md:text-xs text-on-surface-variant font-mono font-bold">{tx.destination_address ? `${tx.destination_address.substring(0, 5)}...${tx.destination_address.substring(tx.destination_address.length - 4)}` : 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-2.5 py-2 md:px-5 md:py-4">
                                                    <div className="flex items-center gap-1.5 md:gap-2">
                                                        <span className="material-symbols-outlined text-[16px] md:text-[18px] text-on-surface-variant">monetization_on</span>
                                                        <span className="text-[11px] md:text-xs text-on-surface font-bold">{tx.asset || 'USD'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-2.5 py-2 md:px-5 md:py-4 text-on-surface font-mono text-[11px] md:text-sm font-bold text-right">
                                                    {formatCurrency(tx.amount)}
                                                </td>
                                                <td className="px-2.5 py-2 md:px-5 md:py-4 text-center">
                                                    {tx.status === 'completed' ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                                            Completed
                                                        </span>
                                                    ) : tx.status === 'failed' ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full bg-error/10 border border-error/20 text-error text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                                            Failed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                                            Processing
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-2.5 py-2 md:px-5 md:py-4 text-right">
                                                    <button className="text-primary hover:text-primary/70 material-symbols-outlined text-[18px] md:text-[20px] transition-colors p-1 rounded hover:bg-surface-variant/30">receipt_long</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <style>{`
                        @keyframes withdraw-draw {
                            from { stroke-dashoffset: 100; }
                            to { stroke-dashoffset: 0; }
                        }
                        .animate-withdraw-draw {
                            stroke-dasharray: 100;
                            stroke-dashoffset: 100;
                            animation: withdraw-draw 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                        }
                    `}</style>
        </div>
    );
}
