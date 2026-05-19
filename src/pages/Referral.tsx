import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';

export default function Referral() {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText('https://jamex.global/ref/inst-4492-xk');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="deep-mesh-bg text-on-surface min-h-screen flex flex-col font-body-md text-body-md dark bg-background">
            <Sidebar />

            <main className="md:ml-64 min-h-screen flex flex-col pt-14 md:pt-16 pb-20 md:pb-0">
                {/* Top Navigation */}
                

                <div className="p-4 md:p-margin-desktop flex-1 space-y-4 md:space-y-6 max-w-[1400px] mx-auto w-full mb-6">
                    {/* Referral Center Header */}
                    <div className="flex flex-col mt-2 md:mt-4 w-full">
                        {/* Quick Share Card */}
                        <div className="glass-card p-3 md:p-4 rounded-xl flex flex-col sm:flex-row items-center gap-2 md:gap-4 w-full border border-outline-variant/20">
                            <div className="flex-1 w-full">
                                <p className="text-[9px] md:text-label-sm text-primary mb-1 md:mb-1.5 font-bold uppercase tracking-wider">Your Unique Invite Link</p>
                                <div className="flex bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-1">
                                    <input 
                                        className="bg-transparent border-none focus:ring-0 text-on-surface text-[10px] md:text-sm w-full font-bold px-2 md:px-3 py-1 outline-none font-mono" 
                                        readOnly 
                                        type="text" 
                                        value="https://jamex.global/ref/inst-4492-xk"
                                    />
                                    <button 
                                        onClick={handleCopy}
                                        className={`${copied ? 'bg-tertiary text-on-tertiary' : 'bg-primary text-on-primary'} px-3 py-1.5 md:px-4 md:py-1.5 rounded-md text-[9px] md:text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center justify-center min-w-[70px] md:min-w-[80px] shadow-sm`}
                                    >
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
                        <div className="glass-card rounded-xl p-4 md:p-5 border border-outline-variant/20 hover:border-primary/50 transition-all group">
                            <div className="flex items-center gap-2 mb-2 md:mb-3">
                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-[14px] md:text-[18px]">group</span>
                                </div>
                                <span className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Referrals</span>
                            </div>
                            <div className="text-2xl md:text-4xl font-bold text-on-surface font-tabular-nums">142</div>
                            <div className="flex items-center gap-1 mt-1 md:mt-2">
                                <span className="material-symbols-outlined text-tertiary text-[14px] md:text-[16px]">expand_less</span>
                                <span className="text-[9px] md:text-xs text-tertiary font-bold tracking-wide">+12 this month</span>
                            </div>
                        </div>
                        
                        <div className="glass-card rounded-xl p-4 md:p-5 border border-outline-variant/20 hover:border-primary/50 transition-all group">
                            <div className="flex items-center gap-2 mb-2 md:mb-3">
                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined text-[14px] md:text-[18px]">verified</span>
                                </div>
                                <span className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Investors</span>
                            </div>
                            <div className="text-2xl md:text-4xl font-bold text-on-surface font-tabular-nums">88</div>
                            <div className="flex items-center gap-1 mt-1 md:mt-2">
                                <span className="text-[9px] md:text-xs text-on-surface-variant font-bold tracking-wide">62% conversion rate</span>
                            </div>
                        </div>
                        
                        <div className="glass-card rounded-xl p-4 md:p-5 border border-outline-variant/20 hover:border-primary/50 transition-all group border-t-[3px] border-t-tertiary">
                            <div className="flex items-center gap-2 mb-2 md:mb-3">
                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                                    <span className="material-symbols-outlined text-[14px] md:text-[18px]">payments</span>
                                </div>
                                <span className="text-[9px] md:text-xs font-bold text-tertiary uppercase tracking-wider">Commissions</span>
                            </div>
                            <div className="text-2xl md:text-4xl font-bold text-on-surface font-tabular-nums">$12,450.00</div>
                            <div className="flex items-center gap-1 mt-1 md:mt-2">
                                <span className="material-symbols-outlined text-tertiary text-[14px] md:text-[16px]">expand_less</span>
                                <span className="text-[9px] md:text-xs text-tertiary font-bold tracking-wide">+$1,420.50 pending</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Split Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
                        {/* Downline Network Table */}
                        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col border border-outline-variant/20">
                            <div className="bg-surface-container-high/40 px-4 py-3 md:px-5 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-outline-variant/10">
                                <h3 className="text-[11px] md:text-sm font-bold text-on-surface uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px] md:text-[20px]">account_tree</span>
                                    Downline Network
                                </h3>
                                <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                                    <div className="relative flex items-center w-full sm:w-auto">
                                        <span className="material-symbols-outlined absolute left-2 md:left-3 text-on-surface-variant text-[16px] md:text-[18px]">search</span>
                                        <input 
                                            className="w-full sm:w-48 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-[10px] md:text-sm py-1.5 md:py-2 pl-8 md:pl-9 pr-3 focus:ring-1 focus:ring-primary focus:outline-none text-on-surface font-medium" 
                                            placeholder="Search name..." 
                                            type="text"
                                        />
                                    </div>
                                    <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-1.5 border border-outline-variant/50 rounded-lg bg-surface-container-low text-[18px] md:text-[20px]">filter_list</button>
                                </div>
                            </div>
                            <div className="overflow-x-auto flex-1 scrollbar-hide">
                                <table className="w-full text-left min-w-[500px]">
                                    <thead>
                                        <tr className="bg-surface-container-highest/20 text-[9px] md:text-[11px] text-on-surface-variant uppercase tracking-widest font-bold border-b border-outline-variant/10">
                                            <th className="px-4 py-2.5 md:px-5 md:py-3">Name</th>
                                            <th className="px-4 py-2.5 md:px-5 md:py-3">Join Date</th>
                                            <th className="px-4 py-2.5 md:px-5 md:py-3">Status</th>
                                            <th className="px-4 py-2.5 md:px-5 md:py-3 text-right">Commissions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/5">
                                        <tr className="hover:bg-white/5 transition-colors group">
                                            <td className="px-4 py-3 md:px-5 md:py-4">
                                                <div className="flex items-center gap-2.5 md:gap-3">
                                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 border border-primary/30 text-primary flex items-center justify-center text-[9px] md:text-xs font-bold shrink-0">AM</div>
                                                    <div>
                                                        <div className="text-[11px] md:text-sm font-bold text-on-surface leading-tight">Alex Mercer</div>
                                                        <div className="text-[8px] md:text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">Tier 1 Elite</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 md:px-5 md:py-4 text-[10px] md:text-xs font-mono text-on-surface-variant font-bold">Oct 24, 2023</td>
                                            <td className="px-4 py-3 md:px-5 md:py-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded border border-tertiary/20 bg-tertiary/10 text-tertiary text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                                                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-tertiary"></span> Active
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 md:px-5 md:py-4 text-[11px] md:text-sm font-mono text-tertiary font-bold text-right">+$4,220.50</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors group">
                                            <td className="px-4 py-3 md:px-5 md:py-4">
                                                <div className="flex items-center gap-2.5 md:gap-3">
                                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-[9px] md:text-xs font-bold border border-outline-variant/30 shrink-0">SD</div>
                                                    <div>
                                                        <div className="text-[11px] md:text-sm font-bold text-on-surface leading-tight">Sarah Dransfield</div>
                                                        <div className="text-[8px] md:text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">Tier 2 Plus</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 md:px-5 md:py-4 text-[10px] md:text-xs font-mono text-on-surface-variant font-bold">Nov 12, 2023</td>
                                            <td className="px-4 py-3 md:px-5 md:py-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded border border-tertiary/20 bg-tertiary/10 text-tertiary text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                                                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-tertiary"></span> Active
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 md:px-5 md:py-4 text-[11px] md:text-sm font-mono text-tertiary font-bold text-right">+$2,140.00</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors group">
                                            <td className="px-4 py-3 md:px-5 md:py-4">
                                                <div className="flex items-center gap-2.5 md:gap-3">
                                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-[9px] md:text-xs font-bold border border-outline-variant/30 shrink-0">JL</div>
                                                    <div>
                                                        <div className="text-[11px] md:text-sm font-bold text-on-surface leading-tight">James Lowery</div>
                                                        <div className="text-[8px] md:text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">Tier 1 Elite</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 md:px-5 md:py-4 text-[10px] md:text-xs font-mono text-on-surface-variant font-bold">Dec 01, 2023</td>
                                            <td className="px-4 py-3 md:px-5 md:py-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded border border-outline-variant/30 bg-surface-variant/30 text-on-surface-variant text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                                                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-on-surface-variant"></span> Inactive
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 md:px-5 md:py-4 text-[11px] md:text-sm font-mono text-on-surface font-bold text-right opacity-70">+$850.25</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="border-t border-outline-variant/10 px-4 py-3 md:px-5 md:py-4 text-center bg-surface-container-highest/10">
                                <button className="text-[10px] md:text-xs font-bold text-primary hover:underline uppercase tracking-wider transition-all">View Full Network</button>
                            </div>
                        </div>

                        {/* Recent Earnings */}
                        <div className="glass-card rounded-xl overflow-hidden flex flex-col h-fit border border-outline-variant/20">
                            <div className="bg-surface-container-high/40 px-4 py-3 md:px-5 md:py-4 border-b border-outline-variant/10">
                                <h3 className="text-[11px] md:text-sm font-bold text-on-surface uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px] md:text-[20px]">notifications_active</span>
                                    Recent Activity
                                </h3>
                            </div>
                            <div className="p-3 md:p-5 space-y-2 md:space-y-4">
                                <div className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 md:p-2.5 rounded-lg border border-transparent hover:border-outline-variant/10 transition-colors">
                                    <div className="flex gap-2.5 md:gap-3 items-center">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-tertiary/10 border border-tertiary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-tertiary text-[16px] md:text-[20px]">trending_up</span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] md:text-sm font-bold text-on-surface leading-tight mb-0.5">Level 1 Commission</p>
                                            <p className="text-[9px] md:text-[10px] text-on-surface-variant font-medium">Alex Mercer • 12:44 PM</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] md:text-sm font-bold text-tertiary font-tabular-nums mb-0.5">+$42.50</p>
                                        <p className="text-[8px] md:text-[9px] text-tertiary/80 font-bold uppercase tracking-wider">Processed</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 md:p-2.5 rounded-lg border border-transparent hover:border-outline-variant/10 transition-colors">
                                    <div className="flex gap-2.5 md:gap-3 items-center">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary text-[16px] md:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] md:text-sm font-bold text-on-surface leading-tight mb-0.5">Elite Tier Rebate</p>
                                            <p className="text-[9px] md:text-[10px] text-on-surface-variant font-medium">Global Volume • Yesterday</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] md:text-sm font-bold text-primary font-tabular-nums mb-0.5">+$115.00</p>
                                        <p className="text-[8px] md:text-[9px] text-primary/80 font-bold uppercase tracking-wider animate-pulse">Pending</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 md:p-2.5 rounded-lg border border-transparent hover:border-outline-variant/10 transition-colors">
                                    <div className="flex gap-2.5 md:gap-3 items-center">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-tertiary/10 border border-tertiary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-tertiary text-[16px] md:text-[20px]">trending_up</span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] md:text-sm font-bold text-on-surface leading-tight mb-0.5">Level 2 Bonus</p>
                                            <p className="text-[9px] md:text-[10px] text-on-surface-variant font-medium">Sarah Dransfield • Yesterday</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] md:text-sm font-bold text-tertiary font-tabular-nums mb-0.5">+$18.20</p>
                                        <p className="text-[8px] md:text-[9px] text-tertiary/80 font-bold uppercase tracking-wider">Processed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Promotion Banner */}
                    <div className="mt-4 md:mt-8 relative overflow-hidden rounded-xl h-40 md:h-48 group shadow-xl border border-primary/20">
                        <img alt="Financial Network Growth" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgAQ2OqzcYz61dXs2bP3xuOZHhTbd9qpDHdsUrdfSeq8OeWWnAen5C16r47IEFUTkdoqKMMQAdYmMYJAGeH1_JiJZ3iwohfqn6vOZoDzBTS5Tv5LpDOwnGGfHnvU_dJISpyahPxCHjjVEigpRBEpSlSx5F99bJzt9CZYSb4n5VbTczr5BsdL789a9p1esyqCEIPyJKFljn8cCwU7KllnLM7wIKAA9bXgAkGvqRwDi8d6YTRfKpBXeYItzyNkLgX0GEFsUN-OuZu3v1"/>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1322] via-[#0d1322]/80 to-[#0d1322]/20 flex items-center px-5 md:px-12">
                            <div className="max-w-md">
                                <span className="bg-primary/20 text-primary border border-primary/30 text-[8px] md:text-[10px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded uppercase tracking-widest mb-2 md:mb-4 inline-block">Promo</span>
                                <h2 className="text-lg md:text-2xl font-bold text-white mb-1.5 md:mb-2 leading-tight tracking-tight">Refer a Qualified Investor to Earn a $5,000 Bonus</h2>
                                <p className="text-[10px] md:text-xs font-medium text-white/70 mb-3 md:mb-5 leading-snug">Limited time offer for partners with over $1M in direct referrals.</p>
                                <button className="bg-primary text-on-primary px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all text-[10px] md:text-xs uppercase tracking-wider shadow-sm shadow-primary/30">Claim Terms</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav />
            
        </div>
    );
}
