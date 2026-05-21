import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function TransactionHistory() {
    const navigate = useNavigate();

    const transactions = [
        {
            date: "Oct 24, 2024",
            time: "14:32:01 UTC",
            refId: "#TXN-8829410",
            category: "Trading Return",
            icon: "trending_up",
            iconColor: "text-tertiary",
            bgIconColor: "bg-tertiary-container/20 border-tertiary/20",
            method: "BTC/USD Linear",
            amount: "+$12,450.00",
            amountColor: "text-tertiary",
            status: "Completed",
            statusColor: "bg-tertiary-container/20 text-tertiary border-tertiary/20"
        },
        {
            date: "Oct 23, 2024",
            time: "09:15:45 UTC",
            refId: "#TXN-8829395",
            category: "Withdrawal",
            icon: "payments",
            iconColor: "text-secondary",
            bgIconColor: "bg-secondary-container/20 border-secondary/20",
            method: "Wire Transfer",
            amount: "-$50,000.00",
            amountColor: "text-error",
            status: "Pending",
            statusColor: "bg-secondary-container/20 text-secondary border-secondary/20"
        },
        {
            date: "Oct 21, 2024",
            time: "18:45:22 UTC",
            refId: "#TXN-8829102",
            category: "Commission",
            icon: "group",
            iconColor: "text-primary",
            bgIconColor: "bg-primary-container/20 border-primary/20",
            method: "Tier 1 Referral",
            amount: "+$850.25",
            amountColor: "text-tertiary",
            status: "Completed",
            statusColor: "bg-tertiary-container/20 text-tertiary border-tertiary/20"
        },
        {
            date: "Oct 20, 2024",
            time: "11:02:18 UTC",
            refId: "#TXN-8828955",
            category: "Deposit",
            icon: "account_balance_wallet",
            iconColor: "text-primary",
            bgIconColor: "bg-primary/10 border-primary/30",
            method: "USDT (ERC-20)",
            amount: "+$250,000.00",
            amountColor: "text-on-surface",
            status: "Completed",
            statusColor: "bg-tertiary-container/20 text-tertiary border-tertiary/20"
        }
    ];

    return (
        <div className="flex-1 p-2.5 md:p-margin-desktop space-y-2.5 md:space-y-6 max-w-[1600px] mx-auto w-full mb-6">


                    {/* Desktop Filters Bento Grid */}
                    <div className="hidden md:grid glass-card rounded-xl p-6 grid-cols-4 gap-6 border border-outline-variant/20">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Transaction Type</label>
                            <select className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2.5 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                                <option>All Activities</option>
                                <option>Deposits</option>
                                <option>Withdrawals</option>
                                <option>Trading Returns</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Date Range</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">calendar_today</span>
                                <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg pl-9 pr-3 py-2.5 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" defaultValue="Oct 01 - Oct 31, 2024" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</label>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all">All</button>
                                <button className="flex-1 py-2 bg-surface-container-lowest border border-outline-variant/50 text-on-surface-variant rounded-lg text-xs font-bold uppercase tracking-wider hover:border-primary transition-all">Pending</button>
                                <button className="flex-1 py-2 bg-surface-container-lowest border border-outline-variant/50 text-on-surface-variant rounded-lg text-xs font-bold uppercase tracking-wider hover:border-primary transition-all">Done</button>
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button className="w-full py-2.5 bg-primary-container text-on-primary-container rounded-lg font-bold text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-sm">
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Mobile Compact Filter UI */}
                    <div className="md:hidden glass-card rounded-lg p-1 flex items-center justify-between gap-1.5 border border-outline-variant/20">
                        {/* Type Selector */}
                        <div className="flex-1 min-w-0 relative">
                            <select className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-2 py-1.5 text-xs font-bold focus:border-primary outline-none transition-all appearance-none pr-5 text-on-surface">
                                <option>All Activities</option>
                                <option>Deposits</option>
                                <option>Withdrawals</option>
                                <option>Returns</option>
                            </select>
                            <span className="material-symbols-outlined text-[14px] absolute right-1.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                        </div>

                        {/* Status Selector */}
                        <div className="flex-1 min-w-0 relative">
                            <select className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-2 py-1.5 text-xs font-bold focus:border-primary outline-none transition-all appearance-none pr-5 text-on-surface">
                                <option>All Status</option>
                                <option>Pending</option>
                                <option>Completed</option>
                            </select>
                            <span className="material-symbols-outlined text-[14px] absolute right-1.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                        </div>

                        {/* Apply Button */}
                        <button className="bg-primary hover:brightness-110 text-on-primary font-bold text-xs uppercase tracking-wider px-2.5 py-1.5 rounded transition-all active:scale-95 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">filter_alt</span>
                            Apply
                        </button>
                    </div>

                    {/* Statistics Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
                        {/* Total Inflow */}
                        <div className="glass-card rounded-xl p-2.5 md:p-5 border border-outline-variant/20 hover:border-primary/50 transition-colors group relative overflow-hidden">
                            {/* Glow background and Shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-surface-container-low/50 to-surface-container-low opacity-60"></div>
                            
                            {/* Sparkline background across the bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-[50%] opacity-20 pointer-events-none">
                                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="inflowSparkGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>
                                    <path 
                                        d="M0,35 Q20,38 40,20 T80,25 T100,10" 
                                        fill="none" 
                                        stroke="#3b82f6" 
                                        strokeWidth="1.5" 
                                        className="animate-spark-draw"
                                    />
                                    <path 
                                        d="M0,35 Q20,38 40,20 T80,25 T100,10 L100,40 L0,40 Z" 
                                        fill="url(#inflowSparkGrad)"
                                    />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Total Inflow</p>
                                <h3 className="text-sm md:text-2xl font-bold font-tabular-nums text-on-surface group-hover:text-primary transition-colors">$1,240,500.00</h3>
                                <p className="text-tertiary text-[9px] md:text-xs font-bold flex items-center gap-0.5 mt-1 md:mt-3">
                                    <span className="material-symbols-outlined text-[12px] md:text-[14px]">arrow_upward</span> +12.5% vs last
                                </p>
                            </div>
                        </div>

                        {/* Total Outflow */}
                        <div className="glass-card rounded-xl p-2.5 md:p-5 border border-outline-variant/20 hover:border-primary/50 transition-colors group relative overflow-hidden">
                            {/* Glow background and Shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-br from-error/5 via-surface-container-low/50 to-surface-container-low opacity-60"></div>
                            
                            {/* Sparkline background across the bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-[50%] opacity-20 pointer-events-none">
                                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="outflowSparkGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f87171" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#f87171" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>
                                    <path 
                                        d="M0,15 Q25,25 50,18 T80,35 T100,32" 
                                        fill="none" 
                                        stroke="#f87171" 
                                        strokeWidth="1.5" 
                                        className="animate-spark-draw"
                                    />
                                    <path 
                                        d="M0,15 Q25,25 50,18 T80,35 T100,32 L100,40 L0,40 Z" 
                                        fill="url(#outflowSparkGrad)"
                                    />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Total Outflow</p>
                                <h3 className="text-sm md:text-2xl font-bold font-tabular-nums text-on-surface">$450,230.12</h3>
                                <p className="text-on-surface-variant text-[9px] md:text-xs font-medium mt-1 md:mt-3 line-clamp-1">
                                    Steady liquidity ratio
                                </p>
                            </div>
                        </div>

                        {/* Net Trading Returns */}
                        <div className="glass-card rounded-xl p-2.5 md:p-5 border border-outline-variant/20 hover:border-tertiary/50 transition-colors group relative overflow-hidden">
                            {/* Glow background and Shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-br from-tertiary/5 via-surface-container-low/50 to-surface-container-low opacity-60"></div>
                            
                            {/* Sparkline background across the bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-[50%] opacity-20 pointer-events-none">
                                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="returnsSparkGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>
                                    <path 
                                        d="M0,35 Q20,28 40,15 T80,18 T100,5" 
                                        fill="none" 
                                        stroke="#10b981" 
                                        strokeWidth="1.5" 
                                        className="animate-spark-draw"
                                    />
                                    <path 
                                        d="M0,35 Q20,28 40,15 T80,18 T100,5 L100,40 L0,40 Z" 
                                        fill="url(#returnsSparkGrad)"
                                    />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Net Trading Returns</p>
                                <h3 className="text-sm md:text-2xl font-bold font-tabular-nums text-tertiary">+$84,122.45</h3>
                                <p className="text-tertiary text-[9px] md:text-xs font-bold flex items-center gap-0.5 mt-1 md:mt-3">
                                    <span className="material-symbols-outlined text-[12px] md:text-[14px]">trending_up</span> 4.2% Alpha
                                </p>
                            </div>
                        </div>

                        {/* Pending */}
                        <div className="glass-card rounded-xl p-2.5 md:p-5 border border-outline-variant/20 border-l-[3px] border-l-primary hover:border-primary/50 transition-colors relative overflow-hidden group">
                            {/* Glow background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-surface-container-low/50 to-surface-container-low opacity-60"></div>
                            
                            {/* Decorative 3D Wireframe Cube Mesh */}
                            <div className="absolute -right-1 -bottom-1 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500 pointer-events-none">
                                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5M2 7v10M12 12v10M22 7v10" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Standard Grid mesh pattern overlay */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none">
                                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="pendingGridHistory" width="8" height="8" patternUnits="userSpaceOnUse">
                                            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#pendingGridHistory)" />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Pending</p>
                                <h3 className="text-sm md:text-2xl font-bold font-tabular-nums text-on-surface">02</h3>
                                <p className="text-on-surface-variant text-[9px] md:text-xs font-medium mt-1 md:mt-3 line-clamp-1">
                                    Action required
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Table */}
                    <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                        <div className="bg-surface-container-high/40 px-2.5 py-2 md:px-6 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/10">
                            <h2 className="text-[11px] md:text-sm font-bold text-on-surface uppercase tracking-widest flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] md:text-[20px]">list_alt</span>
                                Activity Ledger
                            </h2>
                            <span className="text-[9px] md:text-xs font-bold text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded-md border border-outline-variant/20">Showing 1-10 of 2,450 results</span>
                        </div>
                        <div className="hidden md:block overflow-x-auto scrollbar-hide">
                            <table className="w-full text-left min-w-[700px]">
                                <thead>
                                    <tr className="bg-surface-container-highest/20 text-[9px] md:text-[11px] text-on-surface-variant uppercase tracking-widest font-bold border-b border-outline-variant/10">
                                        <th className="px-4 py-2.5 md:px-6 md:py-4">Date & Time</th>
                                        <th className="px-4 py-2.5 md:px-6 md:py-4">Reference ID</th>
                                        <th className="px-4 py-2.5 md:px-6 md:py-4">Category</th>
                                        <th className="px-4 py-2.5 md:px-6 md:py-4">Asset / Method</th>
                                        <th className="px-4 py-2.5 md:px-6 md:py-4 text-right">Amount</th>
                                        <th className="px-4 py-2.5 md:px-6 md:py-4 text-center">Status</th>
                                        <th className="px-4 py-2.5 md:px-6 md:py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/5">
                                    {transactions.map((txn, index) => (
                                        <tr key={index} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-4 py-3 md:px-6 md:py-4">
                                                <p className="text-[11px] md:text-sm font-bold font-tabular-nums text-on-surface">{txn.date}</p>
                                                <p className="text-[9px] md:text-[10px] text-on-surface-variant font-tabular-nums mt-0.5">{txn.time}</p>
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4">
                                                <span className="text-[9px] md:text-xs font-bold font-tabular-nums text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 md:px-2 md:py-1 rounded">{txn.refId}</span>
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border flex items-center justify-center ${txn.bgIconColor}`}>
                                                        <span className={`material-symbols-outlined text-[14px] md:text-[16px] ${txn.iconColor}`}>{txn.icon}</span>
                                                    </div>
                                                    <span className="text-[11px] md:text-sm font-bold text-on-surface">{txn.category}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 text-[11px] md:text-sm font-medium text-on-surface-variant">{txn.method}</td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                                                <p className={`text-[11px] md:text-sm font-bold font-tabular-nums ${txn.amountColor}`}>{txn.amount}</p>
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 text-center">
                                                <span className={`inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider border ${txn.statusColor}`}>{txn.status}</span>
                                            </td>
                                            <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                                                <button className="material-symbols-outlined text-[18px] md:text-[20px] text-outline/50 hover:text-primary transition-colors p-1 rounded hover:bg-surface-variant/30">more_vert</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile List View */}
                        <div className="md:hidden">
                            {transactions.map((txn, index) => (
                                <React.Fragment key={index}>
                                    <div className="p-2.5 flex flex-col gap-2 bg-surface-container-low/20">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center border ${txn.bgIconColor}`}>
                                                    <span className={`material-symbols-outlined text-[14px] ${txn.iconColor}`}>{txn.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-on-surface">{txn.category}</p>
                                                    <p className="text-[9px] text-on-surface-variant font-medium mt-0.5">{txn.date} • {txn.time}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xs font-bold font-mono ${txn.amountColor}`}>{txn.amount}</p>
                                                <span className="text-[9px] font-mono text-on-surface-variant/70">{txn.method}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-1.5 border-t border-outline-variant/5">
                                            <span className="text-[9px] font-bold font-mono text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">{txn.refId}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${txn.statusColor}`}>{txn.status}</span>
                                                <button className="material-symbols-outlined text-[16px] text-outline/50">more_vert</button>
                                            </div>
                                        </div>
                                    </div>
                                    {index < transactions.length - 1 && (
                                        <div className="px-2.5 py-1">
                                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="px-2.5 py-2 md:px-6 md:py-4 bg-surface-container-highest/10 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-2.5">
                            <div className="flex items-center gap-2 md:gap-4">
                                <span className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Rows:</span>
                                <select className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-xs font-bold focus:ring-1 focus:ring-primary outline-none py-1 md:py-1.5 px-2">
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <button className="p-1 md:p-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-variant/30 disabled:opacity-30 text-on-surface-variant transition-colors" disabled>
                                    <span className="material-symbols-outlined text-[16px] md:text-[20px]">chevron_left</span>
                                </button>
                                <div className="flex items-center gap-1">
                                    <button className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-primary text-on-primary text-[10px] md:text-sm font-bold shadow-sm">1</button>
                                    <button className="w-6 h-6 md:w-8 md:h-8 rounded-lg hover:bg-surface-variant/30 text-[10px] md:text-sm font-bold text-on-surface-variant transition-colors">2</button>
                                    <button className="w-6 h-6 md:w-8 md:h-8 rounded-lg hover:bg-surface-variant/30 text-[10px] md:text-sm font-bold text-on-surface-variant transition-colors">3</button>
                                    <span className="px-1 md:px-2 text-on-surface-variant text-xs">...</span>
                                    <button className="w-6 h-6 md:w-8 md:h-8 rounded-lg hover:bg-surface-variant/30 text-[10px] md:text-sm font-bold text-on-surface-variant transition-colors">24</button>
                                </div>
                                <button className="p-1 md:p-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-variant/30 text-on-surface-variant transition-colors">
                                    <span className="material-symbols-outlined text-[16px] md:text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
        </div>
    );
}
