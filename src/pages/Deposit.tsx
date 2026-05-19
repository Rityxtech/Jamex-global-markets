import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';

export default function Deposit() {
    const navigate = useNavigate();
    const [selectedAsset, setSelectedAsset] = useState('usdt');

    return (
        <div className="deep-mesh-bg text-on-surface min-h-screen flex flex-col font-body-md text-body-md dark bg-background">
            <Sidebar />

            <main className="md:ml-64 min-h-screen flex flex-col pt-14 md:pt-16 pb-20 md:pb-0">
                

                <div className="p-4 md:p-margin-desktop flex-1 space-y-4 md:space-y-6 max-w-[1400px] mx-auto w-full mb-6">


                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6">
                        {/* Left: Workflow Column */}
                        <div className="lg:col-span-8 flex flex-col gap-3 md:gap-6">
                            {/* Step 1: Select Asset */}
                            <section className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-4 md:px-5 py-3 flex justify-between items-center border-b border-outline-variant/10">
                                    <span className="text-[11px] md:text-label-md font-bold text-primary flex items-center gap-1.5 md:gap-2 uppercase tracking-wide">
                                        <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[9px] md:text-[10px]">1</span>
                                        Select Asset
                                    </span>
                                    <span className="text-[8px] md:text-[10px] font-bold text-tertiary bg-tertiary/10 border border-tertiary/20 px-1.5 md:px-2 py-0.5 rounded uppercase tracking-widest">Network: Live</span>
                                </div>
                                <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                                    <button 
                                        onClick={() => setSelectedAsset('usdt')}
                                        className={`group p-3 md:p-4 rounded-xl transition-all flex items-center gap-3 ${selectedAsset === 'usdt' ? 'border-2 border-primary bg-primary/5 shadow-sm' : 'border border-outline-variant/30 bg-surface-container-low hover:border-primary/50'}`}
                                    >
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary shrink-0">
                                            <span className="material-symbols-outlined text-[20px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <div className="font-bold text-on-surface text-sm md:text-base">USDT</div>
                                            <div className="text-[9px] md:text-[10px] font-medium text-on-surface-variant truncate">TRC20 Network</div>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={() => setSelectedAsset('btc')}
                                        className={`group p-3 md:p-4 rounded-xl transition-all flex items-center gap-3 ${selectedAsset === 'btc' ? 'border-2 border-primary bg-primary/5 shadow-sm' : 'border border-outline-variant/30 bg-surface-container-low hover:border-primary/50'}`}
                                    >
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b] shrink-0">
                                            <span className="material-symbols-outlined text-[20px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>currency_bitcoin</span>
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <div className="font-bold text-on-surface text-sm md:text-base">BTC</div>
                                            <div className="text-[9px] md:text-[10px] font-medium text-on-surface-variant truncate">Bitcoin Network</div>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={() => setSelectedAsset('eth')}
                                        className={`group p-3 md:p-4 rounded-xl transition-all flex items-center gap-3 ${selectedAsset === 'eth' ? 'border-2 border-primary bg-primary/5 shadow-sm' : 'border border-outline-variant/30 bg-surface-container-low hover:border-primary/50'}`}
                                    >
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-[#6366f1] shrink-0">
                                            <span className="material-symbols-outlined text-[20px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>token</span>
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <div className="font-bold text-on-surface text-sm md:text-base">ETH</div>
                                            <div className="text-[9px] md:text-[10px] font-medium text-on-surface-variant truncate">ERC20 Network</div>
                                        </div>
                                    </button>
                                </div>
                            </section>

                            {/* Step 2: Address & QR */}
                            <section className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-4 md:px-5 py-3 border-b border-outline-variant/10">
                                    <span className="text-[11px] md:text-label-md font-bold text-primary flex items-center gap-1.5 md:gap-2 uppercase tracking-wide">
                                        <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[9px] md:text-[10px]">2</span>
                                        Deposit Address
                                    </span>
                                </div>
                                <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-8 items-center">
                                    <div className="w-40 h-40 md:w-48 md:h-48 p-2 md:p-3 bg-white rounded-xl relative group shrink-0 shadow-sm border border-outline-variant/20">
                                        <img alt="Deposit QR Code" className="w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA168hHzJkAI-_HS1sFs6SU_-hQOP3dIGP_j7JbAYddVN6AWyZr04ZBjFVySzBC-wwRJGGZABiJU_J8abpmTHBRbfqSl0Nm3PMLdFGELsWwIMW3-O5x_i6jqfPRqabxhIr6-y-BW9h9dLyp-htZA-5RG63dXkVhTaG_FOuLIQOYjysPnrGgIHf5ofpZA6i98ZTy8V47H5mp2ddwbqX1owJ-YXKiaJFLb14n796Y2gvlLejS0VVFuSAs97aQFYH3mlJ1Gn-SK7zO4V7c" />
                                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                                    </div>
                                    <div className="flex-1 w-full space-y-3 md:space-y-6">
                                        <div className="space-y-1.5 md:space-y-2">
                                            <label className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Your Personal Deposit Wallet</label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-surface-container-lowest border border-outline-variant/50 px-3 py-2.5 md:px-4 md:py-3.5 rounded-lg font-mono text-xs md:text-sm font-bold text-on-surface break-all md:break-normal tracking-wide shadow-inner">
                                                    TPL6n8J9WpX8z7yA6c5V4b3N2m1L0xKz98P
                                                </div>
                                                <button className="px-3 py-2.5 md:px-4 md:py-3.5 bg-primary-container text-on-primary-container rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-sm shrink-0 flex items-center justify-center" title="Copy Address">
                                                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">content_copy</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 md:gap-3 p-3 md:p-4 rounded-lg bg-error/10 border border-error/20 items-start">
                                            <span className="material-symbols-outlined text-error text-[18px] md:text-[20px] shrink-0 mt-0.5">warning</span>
                                            <p className="text-[10px] md:text-xs text-error/90 leading-relaxed font-bold">
                                                Only send <span className="underline uppercase tracking-wider">USDT TRC20</span> to this address. Sending any other asset or network will result in permanent loss.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Step 3: Transaction Hash */}
                            <section className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-4 md:px-5 py-3 border-b border-outline-variant/10">
                                    <span className="text-[11px] md:text-label-md font-bold text-primary flex items-center gap-1.5 md:gap-2 uppercase tracking-wide">
                                        <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[9px] md:text-[10px]">3</span>
                                        Submit Claim
                                    </span>
                                </div>
                                <div className="p-4 md:p-5 space-y-3 md:space-y-5">
                                    <div className="space-y-1.5 md:space-y-2">
                                        <label className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Transaction ID (TXID) / Hash</label>
                                        <input className="w-full bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3 py-3 md:px-4 md:py-3.5 text-xs md:text-sm font-mono font-medium text-on-surface outline-none transition-all" placeholder="Paste the transaction hash..." type="text" />
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 pt-1 md:pt-0">
                                        <p className="text-[10px] md:text-xs font-medium text-on-surface-variant leading-snug w-full sm:max-w-xs">Once submitted, auditors verify the transaction on the block explorer automatically.</p>
                                        <button className="w-full sm:w-auto bg-primary text-on-primary px-6 py-3.5 md:py-3 rounded-xl font-bold text-[11px] md:text-sm uppercase tracking-wider active:scale-[0.98] transition-all shadow-sm shadow-primary/20 whitespace-nowrap hover:brightness-110">
                                            Submit Claim
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right: Account Overview & Details */}
                        <aside className="lg:col-span-4 flex flex-col gap-3 md:gap-6 mt-2 md:mt-0">
                            <section className="glass-card rounded-xl p-4 md:p-5 flex flex-col gap-4 border border-outline-variant/20">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Current Wealth</span>
                                    <span className="text-2xl md:text-3xl font-mono font-bold text-on-surface tracking-tight">$248,592.12</span>
                                </div>
                                <div className="h-px bg-outline-variant/20 w-full"></div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Inst. Fee</span>
                                        <span className="text-[11px] md:text-sm font-mono font-bold text-on-surface">0.00%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Daily Limit</span>
                                        <span className="text-[11px] md:text-sm font-mono font-bold text-on-surface">$500,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">KYC Status</span>
                                        <span className="text-[10px] md:text-xs font-bold text-tertiary flex items-center gap-1 uppercase tracking-wider bg-tertiary/10 px-1.5 py-0.5 rounded border border-tertiary/20">
                                            <span className="material-symbols-outlined text-[14px]">verified</span>
                                            Verified
                                        </span>
                                    </div>
                                </div>
                            </section>
                            
                            <section className="glass-card rounded-xl p-4 md:p-5 bg-primary/5 border border-primary/20">
                                <h3 className="text-[11px] md:text-sm font-bold text-primary mb-1.5 md:mb-2 uppercase tracking-wide">OTC Support Desk</h3>
                                <p className="text-[10px] md:text-xs font-medium text-on-surface-variant leading-relaxed mb-3 md:mb-4">Assistance available for high-volume OTC deposits or corporate fund transfers.</p>
                                <button className="w-full py-2.5 md:py-3 border border-primary/50 text-primary rounded-lg font-bold text-[10px] md:text-xs uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-all">
                                    Contact Desk
                                </button>
                            </section>
                            
                            <div className="glass-card rounded-xl p-4 md:p-5 overflow-hidden relative border border-outline-variant/20 flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-on-surface-variant text-[20px] md:text-[24px]">security</span>
                                </div>
                                <div>
                                    <h3 className="text-[11px] md:text-sm font-bold text-on-surface mb-0.5">Multi-Sig Custody</h3>
                                    <p className="text-[9px] md:text-[10px] font-medium text-on-surface-variant leading-snug">Secured in MPC cold storage with insurance coverage.</p>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Bottom: Deposit History */}
                    <section className="glass-card rounded-xl overflow-hidden mt-4 md:mt-8 border border-outline-variant/20">
                        <div className="bg-surface-container-high/40 px-4 py-3 md:px-5 md:py-4 flex justify-between items-center border-b border-outline-variant/10">
                            <h2 className="text-[11px] md:text-sm font-bold text-on-surface uppercase tracking-wide flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] md:text-[20px]">history</span>
                                Deposit History
                            </h2>
                            <div className="flex gap-1.5 md:gap-2">
                                <button className="text-[9px] md:text-[10px] font-bold bg-surface-container-low border border-outline-variant/50 px-2.5 py-1 md:px-3 md:py-1.5 rounded-md text-on-surface uppercase tracking-wider">All Time</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full text-left min-w-[600px]">
                                <thead>
                                    <tr className="bg-surface-container-highest/20 text-[9px] md:text-[11px] text-on-surface-variant uppercase tracking-widest font-bold border-b border-outline-variant/10">
                                        <th className="px-4 py-2.5 md:px-5 md:py-3">Date &amp; Time</th>
                                        <th className="px-4 py-2.5 md:px-5 md:py-3">Asset</th>
                                        <th className="px-4 py-2.5 md:px-5 md:py-3 text-right">Amount</th>
                                        <th className="px-4 py-2.5 md:px-5 md:py-3">TXID</th>
                                        <th className="px-4 py-2.5 md:px-5 md:py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono text-xs md:text-sm divide-y divide-outline-variant/5">
                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-[10px] md:text-sm font-bold text-on-surface">24-11-21 14:32</td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-tertiary text-[16px] md:text-[20px]">monetization_on</span>
                                            <span className="text-[11px] md:text-sm font-bold">USDT</span>
                                        </td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-[11px] md:text-sm text-on-surface font-bold text-right">12,500.00</td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-[11px] md:text-xs text-primary font-bold hover:underline cursor-pointer">0x7a2...f89c</td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-center">
                                            <span className="inline-block px-2 py-0.5 md:px-2.5 md:py-0.5 rounded bg-tertiary/10 border border-tertiary/20 text-tertiary text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Completed</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-[10px] md:text-sm font-bold text-on-surface">24-11-20 09:15</td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#f59e0b] text-[16px] md:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>currency_bitcoin</span>
                                            <span className="text-[11px] md:text-sm font-bold">BTC</span>
                                        </td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-[11px] md:text-sm text-on-surface font-bold text-right">0.42012</td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-[11px] md:text-xs text-primary font-bold hover:underline cursor-pointer">bc1q9...4p0m</td>
                                        <td className="px-4 py-3 md:px-5 md:py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded bg-secondary/10 border border-secondary/20 text-secondary text-[9px] md:text-[10px] font-bold uppercase tracking-wider w-fit mx-auto">
                                                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> Pending
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-3 md:p-4 border-t border-outline-variant/10 text-center bg-surface-container-highest/10">
                            <button className="text-[10px] md:text-xs font-bold text-primary hover:underline uppercase tracking-wider">View All History</button>
                        </div>
                    </section>
                </div>
            </main>

            <BottomNav />
            
        </div>
    );
}
