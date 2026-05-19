import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Withdraw() {
    const navigate = useNavigate();
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [isWithdrawn, setIsWithdrawn] = useState(false);

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
                                <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeDjIGTzDeJ9rmuJkg5ob5E-3EaB3V_PxHOZIqIn6SWkjbV2wCx_9F2sIZuubr4swFQmEO196Up08-d2cG4IJZZP-oGpsV_LYSI6KjuC7mG0pyYO7ygdy4EPvbLVZeBkEBxqpRvfR7x6wEkbaa7R-lXfWFPd5kCo-d1fYAJhD1Za5t6l6AAYngGnX8LtrQchSWNhOg0ibxmzq87_myrYspPvJadxmEgUnAW7jLUX3E2xBNvt8Bckn5oJJV7A6hKxvTe5LRjVmX3oCg"/>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-margin-desktop flex-1 space-y-4 md:space-y-6 max-w-[1200px] mx-auto w-full mb-6">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 mt-2 md:mt-4">
                        <div>
                            <h1 className="text-2xl md:text-headline-lg font-bold text-on-surface tracking-tight mb-1">Withdraw Funds</h1>
                            <p className="text-[11px] md:text-body-md text-on-surface-variant leading-snug">Transfer assets securely to external wallets or institutional accounts.</p>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 bg-error/10 border border-error/20 rounded-lg text-error text-[10px] md:text-label-sm animate-pulse font-bold uppercase tracking-wider w-full md:w-auto mt-1 md:mt-0">
                            <span className="material-symbols-outlined text-[16px] md:text-[18px]">verified_user</span>
                            Security Mode Active
                        </div>
                    </div>

                    {/* Bento Layout Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6">
                        {/* Left Column: Withdrawal Form */}
                        <div className="lg:col-span-7 space-y-3 md:space-y-6">
                            {/* Wallet Overview Card */}
                            <div className="glass-card rounded-xl overflow-hidden shadow-xl border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-4 md:px-5 py-3 border-b border-outline-variant/10 flex items-center justify-between">
                                    <span className="text-[10px] md:text-label-md font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px] md:text-[20px]">account_balance_wallet</span>
                                        Balance Overview
                                    </span>
                                    <span className="text-[9px] md:text-label-sm text-on-surface-variant font-bold">Real-time valuation</span>
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-outline-variant/10 p-4 md:p-5">
                                    <div className="pr-3 md:pr-4">
                                        <p className="text-[9px] md:text-label-sm text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Main Account</p>
                                        <p className="text-lg md:text-2xl font-mono text-on-surface font-bold tracking-tight">$1,248,590.00</p>
                                    </div>
                                    <div className="pl-3 md:pl-6">
                                        <p className="text-[9px] md:text-label-sm text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Profit Wallet</p>
                                        <p className="text-lg md:text-2xl font-mono text-tertiary font-bold tracking-tight">$342,120.45</p>
                                    </div>
                                </div>
                            </div>

                            {/* Withdrawal Configuration */}
                            <div className="glass-card rounded-xl p-4 md:p-5 space-y-4 md:space-y-6 border border-outline-variant/20">
                                <div className="space-y-2 md:space-y-4">
                                    <label className="block text-[10px] md:text-label-md font-bold text-on-surface uppercase tracking-wider">Source Account</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                        <button className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-primary/10 border border-primary/50 ring-1 ring-primary/20 shadow-sm transition-all">
                                            <span className="text-primary font-bold text-sm md:text-base">Main Account</span>
                                            <span className="material-symbols-outlined text-primary text-[20px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        </button>
                                        <button className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-surface-container-low border border-outline-variant/50 hover:border-primary/50 transition-all">
                                            <span className="text-on-surface-variant font-bold text-sm md:text-base">Profit Wallet</span>
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-outline-variant/50"></div>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 md:space-y-4 pt-2 md:pt-0">
                                    <div className="flex justify-between items-end">
                                        <label className="block text-[10px] md:text-label-md font-bold text-on-surface uppercase tracking-wider">Amount to Withdraw</label>
                                        <span className="text-[9px] md:text-xs text-on-surface-variant font-bold">Available: $1,248,590.00</span>
                                    </div>
                                    <div className="relative group">
                                        <input className="w-full bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_10px_rgba(37,99,235,0.2)] focus:outline-none rounded-lg px-3 py-3 md:px-4 md:py-4 text-xl md:text-3xl font-mono text-on-surface transition-all font-bold" placeholder="0.00" type="number"/>
                                        <button className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 md:px-3 md:py-1 bg-primary/10 text-primary text-[10px] md:text-xs rounded border border-primary/20 hover:bg-primary hover:text-on-primary transition-all font-bold tracking-wider">MAX</button>
                                        <span className="absolute left-3 -top-2 bg-surface-container-lowest px-1 md:px-2 text-[8px] md:text-[10px] text-primary uppercase tracking-widest font-bold">USD Equivalent</span>
                                    </div>
                                </div>

                                <div className="space-y-2 md:space-y-4 pt-2 md:pt-0">
                                    <label className="block text-[10px] md:text-label-md font-bold text-on-surface uppercase tracking-wider">Destination Wallet</label>
                                    <div className="relative">
                                        <input className="w-full bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_10px_rgba(37,99,235,0.2)] focus:outline-none rounded-lg pl-10 pr-3 py-3 md:pl-12 md:pr-4 md:py-4 text-sm md:text-body-md font-mono font-medium text-on-surface transition-all" placeholder="Enter wallet address (e.g. 0x...)" type="text"/>
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] md:text-[24px]">account_balance_wallet</span>
                                    </div>
                                    <div className="flex items-start gap-2 md:gap-3 p-2.5 md:p-3 bg-error/10 border border-error/20 rounded-lg mt-2 md:mt-3">
                                        <span className="material-symbols-outlined text-error text-[16px] md:text-[20px] shrink-0 mt-0.5">warning</span>
                                        <p className="text-[9px] md:text-xs leading-tight text-error/90 font-bold">Ensure the destination address is accurate. Transfers to incorrect addresses are irreversible and result in permanent loss.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Security & Summary */}
                        <div className="lg:col-span-5 space-y-3 md:space-y-6">
                            {/* 2FA / OTP Verification */}
                            <div className="glass-card rounded-xl p-4 md:p-5 space-y-4 md:space-y-6 relative overflow-hidden border border-primary/20 shadow-[0_0_20px_rgba(37,99,235,0.05)]">
                                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
                                <div className="relative z-10">
                                    <h2 className="text-lg md:text-2xl font-bold text-on-surface mb-1 md:mb-2 tracking-tight">Security Clearance</h2>
                                    <p className="text-[10px] md:text-sm text-on-surface-variant font-medium leading-snug">A 6-digit verification code has been sent to your registered device.</p>
                                </div>
                                <div className="space-y-3 md:space-y-4 relative z-10">
                                    <div className="flex justify-between gap-1.5 md:gap-2">
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <input 
                                                key={index}
                                                id={`otp-${index}`}
                                                className="w-10 sm:w-12 h-12 sm:h-14 bg-surface-container-highest border border-outline-variant/50 rounded-lg text-center text-lg md:text-xl font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all" 
                                                maxLength={1} 
                                                type="text"
                                                onChange={(e) => handleOtpChange(e, index)}
                                                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                            />
                                        ))}
                                    </div>
                                    <button className="w-full text-[10px] md:text-xs font-bold text-primary hover:underline transition-all">Resend OTP (Available in 42s)</button>
                                </div>
                                
                                <div className="pt-4 md:pt-6 border-t border-outline-variant/10 space-y-3 md:space-y-4 relative z-10">
                                    <div className="flex justify-between text-[11px] md:text-sm font-bold items-center">
                                        <span className="text-on-surface-variant uppercase tracking-wider">Processing Fee (0.12%)</span>
                                        <span className="text-on-surface font-mono">$1,498.30</span>
                                    </div>
                                    <div className="flex justify-between text-base md:text-xl font-bold items-center">
                                        <span className="text-on-surface uppercase tracking-wider">Net Disbursement</span>
                                        <span className="text-primary font-mono tracking-tight">$1,247,091.70</span>
                                    </div>
                                    
                                    <button 
                                        onClick={handleWithdraw}
                                        disabled={isWithdrawing || isWithdrawn}
                                        className={`w-full py-3.5 md:py-4 ${isWithdrawing ? 'bg-primary/50 text-white' : isWithdrawn ? 'bg-tertiary text-on-tertiary shadow-[0_0_15px_rgba(78,222,163,0.3)]' : 'bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] shadow-sm shadow-primary/20'} font-bold text-[11px] md:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 group mt-2`}
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
                            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 md:p-4 flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-tertiary text-[20px] md:text-[24px]">verified</span>
                                </div>
                                <div>
                                    <h3 className="text-xs md:text-sm font-bold text-on-surface mb-0.5">Global Insurance Coverage</h3>
                                    <p className="text-[9px] md:text-[10px] text-on-surface-variant leading-relaxed font-medium">Protected by Lloyds of London institutional grade digital asset indemnity up to $50M/tx.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Withdrawal History Section */}
                    <div className="glass-card rounded-xl overflow-hidden mt-4 md:mt-8 border border-outline-variant/20">
                        <div className="bg-surface-container-high/40 px-4 py-3 md:px-5 md:py-4 flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/10">
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
                                        <th className="px-4 py-2.5 md:px-5 md:py-3">Date / ID</th>
                                        <th className="px-4 py-2.5 md:px-5 md:py-3">Destination</th>
                                        <th className="px-4 py-2.5 md:px-5 md:py-3">Asset</th>
                                        <th className="px-4 py-2.5 md:px-5 md:py-3 text-right">Amount (USD)</th>
                                        <th className="px-4 py-2.5 md:px-5 md:py-3 text-center">Status</th>
                                        <th className="px-4 py-2.5 md:px-5 md:py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/5">
                                    {/* Completed Transaction */}
                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="px-4 py-3 md:px-5 md:py-4">
                                            <p className="text-on-surface text-[11px] md:text-sm font-mono font-bold">Oct 12, 2024</p>
                                            <p className="text-[9px] md:text-[10px] text-on-surface-variant font-mono mt-0.5">TXN-4920391203</p>
                                        </td>
                                        <td className="px-4 py-3 md:px-5 md:py-4">
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-[9px] md:text-[10px] text-on-surface font-mono font-bold border border-outline-variant/30">0x</div>
                                                <span className="text-[10px] md:text-xs text-on-surface-variant font-mono font-bold">0x71C...492a</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 md:px-5 md:py-4">
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <span className="material-symbols-outlined text-[16px] md:text-[18px] text-on-surface-variant">monetization_on</span>
                                                <span className="text-[11px] md:text-xs text-on-surface font-bold">USDT-ERC20</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-on-surface font-mono text-[11px] md:text-sm font-bold text-right">
                                            $45,000.00
                                        </td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                                                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                                Completed
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-right">
                                            <button className="text-primary hover:text-primary/70 material-symbols-outlined text-[18px] md:text-[20px] transition-colors p-1 rounded hover:bg-surface-variant/30">receipt_long</button>
                                        </td>
                                    </tr>
                                    {/* Processing Transaction */}
                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="px-4 py-3 md:px-5 md:py-4">
                                            <p className="text-on-surface text-[11px] md:text-sm font-mono font-bold">Oct 14, 2024</p>
                                            <p className="text-[9px] md:text-[10px] text-on-surface-variant font-mono mt-0.5">TXN-4920391552</p>
                                        </td>
                                        <td className="px-4 py-3 md:px-5 md:py-4">
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-[9px] md:text-[10px] text-on-surface font-mono font-bold border border-outline-variant/30">0x</div>
                                                <span className="text-[10px] md:text-xs text-on-surface-variant font-mono font-bold">0x99A...119c</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 md:px-5 md:py-4">
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <span className="material-symbols-outlined text-[16px] md:text-[18px] text-on-surface-variant">currency_bitcoin</span>
                                                <span className="text-[11px] md:text-xs text-on-surface font-bold">BTC (Core)</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-on-surface font-mono text-[11px] md:text-sm font-bold text-right">
                                            $212,400.00
                                        </td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                                Processing
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-right">
                                            <button className="text-primary hover:text-primary/70 material-symbols-outlined text-[18px] md:text-[20px] transition-colors p-1 rounded hover:bg-surface-variant/30">receipt_long</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
                <Link to="/invest" className="flex flex-col items-center justify-center w-full h-full gap-1 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">account_balance</span>
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
                <Link to="/withdraw" className="flex flex-col items-center justify-center w-full h-full gap-1 text-primary relative">
                    <div className="absolute -top-3 w-10 h-1 bg-primary rounded-b-full"></div>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>exit_to_app</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Withdraw</span>
                </Link>
            </nav>
        </div>
    );
}
