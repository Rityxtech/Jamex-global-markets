import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Support() {
    const [priority, setPriority] = useState('Normal');
    const navigate = useNavigate();

    return (
        <div className="deep-mesh-bg text-on-surface min-h-screen flex flex-col font-body-md text-body-md dark bg-background">
            <Sidebar />

            <main className="md:ml-64 min-h-screen flex flex-col pt-14 md:pt-16 pb-20 md:pb-0">
                

                <div className="p-4 md:p-margin-desktop max-w-[1400px] mx-auto w-full mb-6">
                    

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-gutter">
                        {/* Left Column: New Ticket & FAQ */}
                        <div className="lg:col-span-8 space-y-3 md:space-y-gutter">
                            {/* New Ticket Interface */}
                            <section className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-3 border-b border-outline-variant/10 flex justify-between items-center">
                                    <h2 className="text-[11px] md:text-label-md font-bold text-primary flex items-center gap-1.5 md:gap-2 uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[16px] md:text-[20px]">add_task</span>
                                        New Request
                                    </h2>
                                    <span className="text-[8px] md:text-[10px] text-tertiary font-bold px-1.5 md:px-2 py-0.5 border border-tertiary/30 rounded bg-tertiary/10 uppercase tracking-wider">Priority Routing</span>
                                </div>
                                <div className="p-4 md:p-card-padding">
                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className="block text-[9px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Subject</label>
                                            <input className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 md:px-4 md:py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm md:text-base font-medium" placeholder="Briefly describe the issue" type="text" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[9px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Category</label>
                                            <select className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 md:px-4 md:py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm md:text-base font-medium">
                                                <option>Trading API & Connectivity</option>
                                                <option>Settlement & Clearing</option>
                                                <option>Account Security</option>
                                                <option>Compliance & Reporting</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[9px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Priority</label>
                                            <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                                                <button 
                                                    onClick={() => setPriority('Normal')}
                                                    className={`py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all ${priority === 'Normal' ? 'bg-primary border border-primary text-on-primary shadow-sm' : 'border border-outline-variant/50 bg-surface-container-low text-on-surface-variant hover:border-primary/50'}`} 
                                                    type="button">Normal</button>
                                                <button 
                                                    onClick={() => setPriority('High')}
                                                    className={`py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all ${priority === 'High' ? 'bg-secondary border border-secondary text-on-secondary shadow-sm' : 'border border-outline-variant/50 bg-surface-container-low text-on-surface-variant hover:border-secondary/50'}`} 
                                                    type="button">High</button>
                                                <button 
                                                    onClick={() => setPriority('Urgent')}
                                                    className={`py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all ${priority === 'Urgent' ? 'bg-error border border-error text-on-error shadow-sm' : 'border border-outline-variant/50 bg-surface-container-low text-on-surface-variant hover:border-error/50'}`} 
                                                    type="button">Urgent</button>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className="block text-[9px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Message Details</label>
                                            <textarea className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-3 py-2 md:px-4 md:py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm md:text-base font-medium resize-none" placeholder="Provide detailed information..." rows={3}></textarea>
                                        </div>
                                        <div className="md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-2 md:gap-3 mt-1 md:mt-2">
                                            <button className="w-full sm:w-auto px-4 py-2.5 md:px-6 md:py-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-all text-[11px] md:text-label-md font-bold uppercase tracking-wider" type="button">Cancel</button>
                                            <button className="w-full sm:w-auto px-4 py-2.5 md:px-8 md:py-2.5 rounded-lg bg-primary text-on-primary hover:brightness-110 active:scale-95 transition-all text-[11px] md:text-label-md font-bold uppercase tracking-wider shadow-sm shadow-primary/20" type="submit">Submit Ticket</button>
                                        </div>
                                    </form>
                                </div>
                            </section>

                            {/* Searchable FAQ Section */}
                            <section className="glass-card rounded-xl border border-outline-variant/20">
                                <div className="p-4 md:p-card-padding border-b border-outline-variant/10">
                                    <h2 className="text-lg md:text-headline-md font-bold text-on-surface mb-3 md:mb-4 tracking-tight">Knowledge Base</h2>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform text-[20px]">search</span>
                                        <input className="w-full bg-surface-container-high/50 border border-outline-variant/50 rounded-full py-2.5 pl-10 pr-4 text-sm md:text-body-md font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all group-focus-within:scale-[1.01]" placeholder="Search documentation & guides..." type="text" />
                                    </div>
                                </div>
                                <div className="divide-y divide-outline-variant/5">
                                    <div className="p-3 md:p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-sm md:text-body-md font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">How do I whitelist a new withdrawal IP for API access?</h4>
                                            <span className="material-symbols-outlined text-outline/50 group-hover:text-primary transition-colors mt-0.5">chevron_right</span>
                                        </div>
                                        <p className="text-[10px] md:text-xs font-medium text-on-surface-variant mt-1.5 line-clamp-1">To ensure institutional security, API whitelisting requires multi-factor authentication...</p>
                                    </div>
                                    <div className="p-3 md:p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-sm md:text-body-md font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">What are the latency expectations for TYO engine?</h4>
                                            <span className="material-symbols-outlined text-outline/50 group-hover:text-primary transition-colors mt-0.5">chevron_right</span>
                                        </div>
                                        <p className="text-[10px] md:text-xs font-medium text-on-surface-variant mt-1.5 line-clamp-1">Under standard market conditions, internal matching latency in our TYO hub is sub-250 ms...</p>
                                    </div>
                                    <div className="p-3 md:p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-sm md:text-body-md font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">Requesting historical audit reports for Q3.</h4>
                                            <span className="material-symbols-outlined text-outline/50 group-hover:text-primary transition-colors mt-0.5">chevron_right</span>
                                        </div>
                                        <p className="text-[10px] md:text-xs font-medium text-on-surface-variant mt-1.5 line-clamp-1">Compliance reports are generated automatically on the 5th of every month...</p>
                                    </div>
                                </div>
                                <div className="p-3 md:p-4 bg-surface-container-highest/20 text-center rounded-b-xl border-t border-outline-variant/10">
                                    <button className="text-primary text-[11px] md:text-label-sm font-bold hover:underline uppercase tracking-wider">View All Documentation</button>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Active Tickets & Service Status */}
                        <div className="lg:col-span-4 space-y-3 md:space-y-gutter">
                            {/* Active Tickets List */}
                            <section className="glass-card rounded-xl border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-4 md:px-card-padding py-3 border-b border-outline-variant/10">
                                    <h3 className="text-[11px] md:text-label-md font-bold text-on-surface uppercase tracking-wide">Active Inquiries</h3>
                                </div>
                                <div className="p-0 divide-y divide-outline-variant/5">
                                    {/* Ticket Item 1 */}
                                    <div className="p-3 md:p-4 hover:bg-white/5 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-1.5 md:mb-2">
                                            <span className="text-[9px] md:text-[10px] font-bold font-tabular-nums text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded border border-outline-variant/20">#TKT-88421</span>
                                            <span className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-tertiary">
                                                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse shadow-[0_0_4px_rgba(78,222,163,0.8)]"></span>
                                                In Progress
                                            </span>
                                        </div>
                                        <h4 className="text-sm md:text-label-md font-bold mb-0.5 text-on-surface leading-tight group-hover:text-primary transition-colors">API Rate Limit Increase</h4>
                                        <p className="text-[10px] md:text-xs font-medium text-on-surface-variant mb-2 md:mb-3 line-clamp-1">Tier 2 Trading Engine request...</p>
                                        <div className="flex justify-between items-center mt-auto">
                                            <div className="flex -space-x-1.5 md:-space-x-2">
                                                <img alt="Staff 1" className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-background shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFd-pcUfuGcyO4kJUHg8MSUTZ-KbRnhTZoUGGobZgI7L6UfZhcg0Xuc16Js4N2oTALSUHIDPtXJv1R3ELJKeskPgar8Y4iRR5etCDkMZnhk4pf_dKJXZD9SZiMJoHSF_etlWMgzK9JKqNA4v_oDQzFdmnpnDLCMH8DGvMBJey90uSGX0qAY3CNFG5xOHx9iJkW_F2wER6hfJDcM2Pa_farjcyKZ7-QgDaVfO4ux0fhhF5ggtLoJ10r7cRl0d6gqlVSvkNPwbxumxnj" />
                                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-secondary-container border border-background flex items-center justify-center text-[7px] md:text-[8px] font-bold text-on-secondary-container shadow-sm">+1</div>
                                            </div>
                                            <span className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Updated 2h ago</span>
                                        </div>
                                    </div>

                                    {/* Ticket Item 2 */}
                                    <div className="p-3 md:p-4 hover:bg-white/5 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-1.5 md:mb-2">
                                            <span className="text-[9px] md:text-[10px] font-bold font-tabular-nums text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded border border-outline-variant/20">#TKT-88390</span>
                                            <span className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-primary">
                                                <span className="material-symbols-outlined text-[12px] md:text-[14px]">hourglass_empty</span>
                                                Waiting Info
                                            </span>
                                        </div>
                                        <h4 className="text-sm md:text-label-md font-bold mb-0.5 text-on-surface leading-tight group-hover:text-primary transition-colors">Corporate Onboarding Scan</h4>
                                        <p className="text-[10px] md:text-xs font-medium text-on-surface-variant mb-2 md:mb-3 line-clamp-1">Awaiting signed documents...</p>
                                        <div className="flex justify-between items-center mt-auto">
                                            <div className="flex -space-x-1.5 md:-space-x-2">
                                                <img alt="Staff 2" className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-background shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXoxAWR3WKNjgXf-LIuNssJVUw1w7Ef_DfB2clwCufO09pARMUqjQFWiDkpDR6lkZ2khhJb5z0xA1xrlIwt8Jm_ktptZab_My1uJotxW732z4SBhPo8idXvK2YQ7lPfn4BBEVp0KyZhIwjnqJ8WVUcAwd_p2AaxmH22Ivkvoowiy1_xC5nsSswzrQK70SOGlCqA63MS4kAFsYtUdpjv_Ve59UeCs1JvoEfF4Yfm2b2tjFIaroKg3WYL76cWsBE-5UzTMWfUlwEWQpu" />
                                            </div>
                                            <span className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Updated 1d ago</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full py-2.5 md:py-3 text-[10px] md:text-xs font-bold text-on-surface-variant hover:text-primary transition-colors border-t border-outline-variant/10 uppercase tracking-wider bg-surface-container-highest/20">View All Tickets</button>
                            </section>

                            {/* Service Status Cards */}
                            <section className="glass-card rounded-xl p-4 md:p-card-padding border border-outline-variant/20">
                                <h3 className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 md:mb-4">Platform Integrity</h3>
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[20px]">check_circle</span>
                                            <span className="text-sm md:text-label-md font-bold text-on-surface">Trading Core</span>
                                        </div>
                                        <span className="text-[9px] md:text-[10px] font-bold text-tertiary uppercase tracking-wider">Operational</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-tertiary text-[18px] md:text-[20px]">check_circle</span>
                                            <span className="text-sm md:text-label-md font-bold text-on-surface">FIX/REST API</span>
                                        </div>
                                        <span className="text-[9px] md:text-[10px] font-bold text-tertiary uppercase tracking-wider">99.99% Uptime</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[18px] md:text-[20px]">sync</span>
                                            <span className="text-sm md:text-label-md font-bold text-on-surface">Bank Wire</span>
                                        </div>
                                        <span className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-wider">Maintenance</span>
                                    </div>
                                </div>
                            </section>

                            {/* Professional Support Visual */}
                            <div className="relative h-32 md:h-48 rounded-xl overflow-hidden shadow-xl group cursor-pointer border border-outline-variant/20">
                                <img alt="Support Center" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs_HDzxEpMZeVKnHgKVFGEjG4_zw2U_-eVyrw9x6c9d30O5qTJ76r0wmo-mFy8Yw3VreXU3Kho1hHseJv68eU2J4XPiZbfFTiZHoViP6Gr_ZwX0VWH9sWM5YpaqzNq2ROM2nkvUkn7fGUnzN8zFfnBRhmnsQCXJHYzLYQZqlTLTEnxL6NjhFNc0yYuZ70_b4qUCfm3I2LOFRakREPuf8L-beqQ-NdDyg2QYuBVVMr_zjQ0RBbZWkFfzgLZL-1zVP07A19IlKQqzJoE" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1322] via-[#0d1322]/60 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
                                    <p className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">24/7 Dedicated Support</p>
                                    <h4 className="text-sm md:text-body-md font-bold text-white tracking-wide">Institutional Concierge</h4>
                                </div>
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
                <Link to="/support" className="flex flex-col items-center justify-center w-full h-full gap-1 text-primary relative">
                    <div className="absolute -top-3 w-10 h-1 bg-primary rounded-b-full"></div>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>headset_mic</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Support</span>
                </Link>
            </nav>
        </div>
    );
}
