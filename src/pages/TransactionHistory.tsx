import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function TransactionHistory() {
    const navigate = useNavigate();

    return (
        <div className="flex-1 p-4 md:p-margin-desktop space-y-4 md:space-y-6 max-w-[1600px] mx-auto w-full mb-6">


                    {/* Filters Bento Grid */}
                    <div className="glass-card rounded-xl p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 border border-outline-variant/20">
                        <div className="space-y-1.5">
                            <label className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Transaction Type</label>
                            <select className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2.5 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                                <option>All Activities</option>
                                <option>Deposits</option>
                                <option>Withdrawals</option>
                                <option>Trading Returns</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Date Range</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">calendar_today</span>
                                <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg pl-9 pr-3 py-2.5 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" defaultValue="Oct 01 - Oct 31, 2024" />
                            </div>
                        </div>
                        <div className="space-y-1.5 sm:col-span-2 md:col-span-1">
                            <label className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</label>
                            <div className="flex gap-1.5 md:gap-2">
                                <button className="flex-1 py-2 bg-primary text-on-primary rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-sm transition-all">All</button>
                                <button className="flex-1 py-2 bg-surface-container-lowest border border-outline-variant/50 text-on-surface-variant rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider hover:border-primary transition-all">Pending</button>
                                <button className="flex-1 py-2 bg-surface-container-lowest border border-outline-variant/50 text-on-surface-variant rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider hover:border-primary transition-all">Done</button>
                            </div>
                        </div>
                        <div className="flex items-end sm:col-span-2 md:col-span-1 mt-1 sm:mt-0">
                            <button className="w-full py-2.5 bg-primary-container text-on-primary-container rounded-lg font-bold text-[11px] md:text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-sm">
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Statistics Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        <div className="glass-card rounded-xl p-3.5 md:p-5 border border-outline-variant/20 hover:border-primary/50 transition-colors group">
                            <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Inflow</p>
                            <h3 className="text-sm md:text-2xl font-bold font-tabular-nums text-on-surface group-hover:text-primary transition-colors">$1,240,500.00</h3>
                            <p className="text-tertiary text-[9px] md:text-xs font-bold flex items-center gap-0.5 mt-1.5 md:mt-3">
                                <span className="material-symbols-outlined text-[12px] md:text-[14px]">arrow_upward</span> +12.5% vs last
                            </p>
                        </div>
                        <div className="glass-card rounded-xl p-3.5 md:p-5 border border-outline-variant/20 hover:border-primary/50 transition-colors">
                            <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Outflow</p>
                            <h3 className="text-sm md:text-2xl font-bold font-tabular-nums text-on-surface">$450,230.12</h3>
                            <p className="text-on-surface-variant text-[9px] md:text-xs font-medium mt-1.5 md:mt-3 line-clamp-1">
                                Steady liquidity ratio
                            </p>
                        </div>
                        <div className="glass-card rounded-xl p-3.5 md:p-5 border border-outline-variant/20 hover:border-tertiary/50 transition-colors group">
                            <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Net Trading Returns</p>
                            <h3 className="text-sm md:text-2xl font-bold font-tabular-nums text-tertiary">+$84,122.45</h3>
                            <p className="text-tertiary text-[9px] md:text-xs font-bold flex items-center gap-0.5 mt-1.5 md:mt-3">
                                <span className="material-symbols-outlined text-[12px] md:text-[14px]">trending_up</span> 4.2% Alpha
                            </p>
                        </div>
                        <div className="glass-card rounded-xl p-3.5 md:p-5 border border-outline-variant/20 border-l-[3px] border-l-primary hover:border-primary/50 transition-colors">
                            <p className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Pending</p>
                            <h3 className="text-sm md:text-2xl font-bold font-tabular-nums text-on-surface">02</h3>
                            <p className="text-on-surface-variant text-[9px] md:text-xs font-medium mt-1.5 md:mt-3 line-clamp-1">
                                Action required
                            </p>
                        </div>
                    </div>

                    {/* Transaction Table */}
                    <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                        <div className="bg-surface-container-high/40 px-4 py-3 md:px-6 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/10">
                            <h2 className="text-[11px] md:text-sm font-bold text-on-surface uppercase tracking-widest flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] md:text-[20px]">list_alt</span>
                                Activity Ledger
                            </h2>
                            <span className="text-[9px] md:text-xs font-bold text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded-md border border-outline-variant/20">Showing 1-10 of 2,450 results</span>
                        </div>
                        <div className="overflow-x-auto scrollbar-hide">
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
                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <p className="text-[11px] md:text-sm font-bold font-tabular-nums text-on-surface">Oct 24, 2024</p>
                                            <p className="text-[9px] md:text-[10px] text-on-surface-variant font-tabular-nums mt-0.5">14:32:01 UTC</p>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <span className="text-[9px] md:text-xs font-bold font-tabular-nums text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 md:px-2 md:py-1 rounded">#TXN-8829410</span>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-tertiary-container/20 border border-tertiary/20 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[14px] md:text-[16px] text-tertiary">trending_up</span>
                                                </div>
                                                <span className="text-[11px] md:text-sm font-bold text-on-surface">Trading Return</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-[11px] md:text-sm font-medium text-on-surface-variant">BTC/USD Linear</td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                                            <p className="text-[11px] md:text-sm font-bold font-tabular-nums text-tertiary">+$12,450.00</p>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded bg-tertiary-container/20 text-tertiary text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-tertiary/20">Completed</span>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                                            <button className="material-symbols-outlined text-[18px] md:text-[20px] text-outline/50 hover:text-primary transition-colors p-1 rounded hover:bg-surface-variant/30">more_vert</button>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <p className="text-[11px] md:text-sm font-bold font-tabular-nums text-on-surface">Oct 23, 2024</p>
                                            <p className="text-[9px] md:text-[10px] text-on-surface-variant font-tabular-nums mt-0.5">09:15:45 UTC</p>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <span className="text-[9px] md:text-xs font-bold font-tabular-nums text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 md:px-2 md:py-1 rounded">#TXN-8829395</span>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-secondary-container/20 border border-secondary/20 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[14px] md:text-[16px] text-secondary">payments</span>
                                                </div>
                                                <span className="text-[11px] md:text-sm font-bold text-on-surface">Withdrawal</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-[11px] md:text-sm font-medium text-on-surface-variant">Wire Transfer</td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                                            <p className="text-[11px] md:text-sm font-bold font-tabular-nums text-error">-$50,000.00</p>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded bg-secondary-container/20 text-secondary text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-secondary/20">Pending</span>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                                            <button className="material-symbols-outlined text-[18px] md:text-[20px] text-outline/50 hover:text-primary transition-colors p-1 rounded hover:bg-surface-variant/30">more_vert</button>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <p className="text-[11px] md:text-sm font-bold font-tabular-nums text-on-surface">Oct 21, 2024</p>
                                            <p className="text-[9px] md:text-[10px] text-on-surface-variant font-tabular-nums mt-0.5">18:45:22 UTC</p>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <span className="text-[9px] md:text-xs font-bold font-tabular-nums text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 md:px-2 md:py-1 rounded">#TXN-8829102</span>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-container/20 border border-primary/20 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[14px] md:text-[16px] text-primary">group</span>
                                                </div>
                                                <span className="text-[11px] md:text-sm font-bold text-on-surface">Commission</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-[11px] md:text-sm font-medium text-on-surface-variant">Tier 1 Referral</td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                                            <p className="text-[11px] md:text-sm font-bold font-tabular-nums text-tertiary">+$850.25</p>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded bg-tertiary-container/20 text-tertiary text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-tertiary/20">Completed</span>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                                            <button className="material-symbols-outlined text-[18px] md:text-[20px] text-outline/50 hover:text-primary transition-colors p-1 rounded hover:bg-surface-variant/30">more_vert</button>
                                        </td>
                                    </tr>

                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <p className="text-[11px] md:text-sm font-bold font-tabular-nums text-on-surface">Oct 20, 2024</p>
                                            <p className="text-[9px] md:text-[10px] text-on-surface-variant font-tabular-nums mt-0.5">11:02:18 UTC</p>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <span className="text-[9px] md:text-xs font-bold font-tabular-nums text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 md:px-2 md:py-1 rounded">#TXN-8828955</span>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[14px] md:text-[16px] text-primary">account_balance_wallet</span>
                                                </div>
                                                <span className="text-[11px] md:text-sm font-bold text-on-surface">Deposit</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-[11px] md:text-sm font-medium text-on-surface-variant">USDT (ERC-20)</td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                                            <p className="text-[11px] md:text-sm font-bold font-tabular-nums text-on-surface">+$250,000.00</p>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded bg-tertiary-container/20 text-tertiary text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-tertiary/20">Completed</span>
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                                            <button className="material-symbols-outlined text-[18px] md:text-[20px] text-outline/50 hover:text-primary transition-colors p-1 rounded hover:bg-surface-variant/30">more_vert</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="px-4 py-3 md:px-6 md:py-4 bg-surface-container-highest/10 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-3">
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
