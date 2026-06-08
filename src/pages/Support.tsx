import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

interface MyTicket {
    id: string;
    subject: string;
    status: string;
    created_at: string;
    updated_at: string;
}

const STATUS_STYLE: Record<string, string> = {
    open: 'text-primary',
    in_progress: 'text-tertiary',
    resolved: 'text-on-surface-variant',
    closed: 'text-outline',
};

export default function Support() {
    const [priority, setPriority] = useState('Normal');
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('Trading API & Connectivity');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [myTickets, setMyTickets] = useState<MyTicket[]>([]);
    const [allTickets, setAllTickets] = useState<MyTicket[]>([]);
    const [activeTab, setActiveTab] = useState<'new' | 'tickets'>('new');
    const [selectedTicket, setSelectedTicket] = useState<MyTicket | null>(null);

    const fetchMyTickets = async () => {
        if (!user) return;
        const { data } = await supabase.from('support_tickets')
            .select('id, subject, status, created_at, updated_at')
            .eq('user_id', user.id)
            .not('status', 'in', '("resolved","closed")')
            .order('created_at', { ascending: false })
            .limit(5);
        setMyTickets(data || []);
    };

    const fetchAllTickets = async () => {
        if (!user) return;
        const { data } = await supabase.from('support_tickets')
            .select('id, subject, status, created_at, updated_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        setAllTickets(data || []);
    };

    useEffect(() => { fetchMyTickets(); }, [user]);
    useEffect(() => { if (activeTab === 'tickets') fetchAllTickets(); }, [activeTab, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!subject.trim() || !message.trim()) { setSubmitError('Subject and message are required.'); return; }
        setSubmitError('');
        setSubmitting(true);
        const { error } = await supabase.from('support_tickets').insert({
            user_id: user.id,
            subject: subject.trim(),
            message: message.trim(),
            category,
            priority: priority.toLowerCase() as 'low' | 'normal' | 'high' | 'urgent',
            status: 'open',
        });
        if (!error) {
            setSubmitted(true);
            setSubject('');
            setMessage('');
            fetchMyTickets();
            setTimeout(() => setSubmitted(false), 5000);
        } else {
            setSubmitError(error.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="flex-1 p-2.5 md:p-margin-desktop max-w-[1400px] mx-auto w-full mb-6">

                    {/* Mobile Tab Switcher */}
                    <div className="md:hidden flex bg-surface-container-high/60 rounded-xl border border-outline-variant/20 mb-3 p-1">
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                activeTab === 'new'
                                    ? 'bg-primary text-on-primary shadow-sm'
                                    : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            Open Ticket
                        </button>
                        <button
                            onClick={() => setActiveTab('tickets')}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                activeTab === 'tickets'
                                    ? 'bg-primary text-on-primary shadow-sm'
                                    : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            View Tickets
                        </button>
                    </div>

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 md:gap-gutter">
                        {/* Left Column: New Ticket & FAQ */}
                        <div className={`lg:col-span-8 space-y-2.5 md:space-y-gutter ${activeTab === 'tickets' ? 'hidden md:block' : ''}`}>
                            {/* New Ticket Interface */}
                            <section className="glass-card rounded-xl overflow-hidden border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-2.5 md:px-card-padding py-2 md:py-3 border-b border-outline-variant/10 flex justify-between items-center">
                                    <h2 className="text-[10px] md:text-label-md font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[14px] md:text-[20px]">add_task</span>
                                        New Request
                                    </h2>
                                    <span className="text-[8px] md:text-[10px] text-tertiary font-bold px-1.5 md:px-2 py-0.5 border border-tertiary/30 rounded bg-tertiary/10 uppercase tracking-wider">Priority Routing</span>
                                </div>
                                <div className="p-2.5 md:p-card-padding">
                                    {submitted && (
                                    <div className="mb-3 p-3 bg-tertiary/10 border border-tertiary/30 rounded-lg text-tertiary text-sm font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                        Ticket submitted! Our team will respond shortly.
                                    </div>
                                )}
                                {submitError && (
                                    <div className="mb-3 p-3 bg-error/10 border border-error/30 rounded-lg text-error text-xs font-bold">{submitError}</div>
                                )}
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="block text-[8px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Subject</label>
                                            <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-2 py-2.5 md:px-4 md:py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs md:text-base font-medium" placeholder="Briefly describe the issue" type="text" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-[8px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Category</label>
                                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-2 py-2.5 md:px-4 md:py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs md:text-base font-medium">
                                                <option>Trading API & Connectivity</option>
                                                <option>Settlement & Clearing</option>
                                                <option>Account Security</option>
                                                <option>Compliance & Reporting</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-[8px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Priority</label>
                                            <div className="grid grid-cols-3 gap-1 md:gap-2">
                                                <button 
                                                    onClick={() => setPriority('Normal')}
                                                    className={`py-1.5 rounded-lg text-[9px] md:text-xs font-bold uppercase tracking-wider transition-all ${priority === 'Normal' ? 'bg-primary border border-primary text-on-primary shadow-sm' : 'border border-outline-variant/50 bg-surface-container-low text-on-surface-variant hover:border-primary/50'}`} 
                                                    type="button">Normal</button>
                                                <button 
                                                    onClick={() => setPriority('High')}
                                                    className={`py-1.5 rounded-lg text-[9px] md:text-xs font-bold uppercase tracking-wider transition-all ${priority === 'High' ? 'bg-secondary border border-secondary text-on-secondary shadow-sm' : 'border border-outline-variant/50 bg-surface-container-low text-on-surface-variant hover:border-secondary/50'}`} 
                                                    type="button">High</button>
                                                <button 
                                                    onClick={() => setPriority('Urgent')}
                                                    className={`py-1.5 rounded-lg text-[9px] md:text-xs font-bold uppercase tracking-wider transition-all ${priority === 'Urgent' ? 'bg-error border border-error text-on-error shadow-sm' : 'border border-outline-variant/50 bg-surface-container-low text-on-surface-variant hover:border-error/50'}`} 
                                                    type="button">Urgent</button>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="block text-[8px] md:text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Message Details</label>
                                            <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-2 py-2.5 md:px-4 md:py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs md:text-base font-medium resize-none" placeholder="Provide detailed information..." rows={3}></textarea>
                                        </div>
                                        <div className="md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-2 md:gap-3 mt-1">
                                            <button onClick={() => { setSubject(''); setMessage(''); setSubmitError(''); }} className="w-full sm:w-auto px-4 py-2.5 md:px-6 md:py-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-all text-[9px] md:text-label-md font-bold uppercase tracking-wider" type="button">Cancel</button>
                                            <button disabled={submitting} className="w-full sm:w-auto px-4 py-2.5 md:px-8 md:py-2.5 rounded-lg bg-primary text-on-primary hover:brightness-110 active:scale-95 transition-all text-[9px] md:text-label-md font-bold uppercase tracking-wider shadow-sm shadow-primary/20 disabled:opacity-60" type="submit">{submitting ? 'Submitting...' : 'Submit Ticket'}</button>
                                        </div>
                                    </form>
                                </div>
                            </section>

                            {/* Searchable FAQ Section */}
                            <section className="glass-card rounded-xl border border-outline-variant/20">
                                <div className="p-2.5 md:p-card-padding border-b border-outline-variant/10">
                                    <h2 className="text-sm md:text-headline-md font-bold text-on-surface mb-2.5 md:mb-4 tracking-tight">Knowledge Base</h2>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform text-[16px] md:text-[20px]">search</span>
                                        <input className="w-full bg-surface-container-high/50 border border-outline-variant/50 rounded-full py-1.5 pl-8 pr-3 text-xs md:text-body-md font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all group-focus-within:scale-[1.01]" placeholder="Search documentation & guides..." type="text" />
                                    </div>
                                </div>
                                <div className="divide-y divide-outline-variant/5">
                                    <div className="p-2.5 md:p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-xs md:text-body-md font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">How do I whitelist a new withdrawal IP for API access?</h4>
                                            <span className="material-symbols-outlined text-outline/50 group-hover:text-primary transition-colors mt-0.5 text-[16px] md:text-[20px]">chevron_right</span>
                                        </div>
                                        <p className="text-[9px] md:text-xs font-medium text-on-surface-variant mt-1.5 line-clamp-1">To ensure institutional security, API whitelisting requires multi-factor authentication...</p>
                                    </div>
                                    <div className="p-2.5 md:p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-xs md:text-body-md font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">What are the latency expectations for TYO engine?</h4>
                                            <span className="material-symbols-outlined text-outline/50 group-hover:text-primary transition-colors mt-0.5 text-[16px] md:text-[20px]">chevron_right</span>
                                        </div>
                                        <p className="text-[9px] md:text-xs font-medium text-on-surface-variant mt-1.5 line-clamp-1">Under standard market conditions, internal matching latency in our TYO hub is sub-250 ms...</p>
                                    </div>
                                    <div className="p-2.5 md:p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-xs md:text-body-md font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">Requesting historical audit reports for Q3.</h4>
                                            <span className="material-symbols-outlined text-outline/50 group-hover:text-primary transition-colors mt-0.5 text-[16px] md:text-[20px]">chevron_right</span>
                                        </div>
                                        <p className="text-[9px] md:text-xs font-medium text-on-surface-variant mt-1.5 line-clamp-1">Compliance reports are generated automatically on the 5th of every month...</p>
                                    </div>
                                </div>
                                <div className="p-2.5 md:p-4 bg-surface-container-highest/20 text-center rounded-b-xl border-t border-outline-variant/10">
                                    <button className="text-primary text-[10px] md:text-label-sm font-bold hover:underline uppercase tracking-wider">View All Documentation</button>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Active Tickets & Service Status */}
                        <div className="lg:col-span-4 space-y-2.5 md:space-y-gutter hidden md:block">
                            {/* Active Tickets List */}
                            <section className="glass-card rounded-xl border border-outline-variant/20">
                                <div className="bg-surface-container-high/40 px-2.5 md:px-card-padding py-2 md:py-3 border-b border-outline-variant/10">
                                    <h3 className="text-[11px] md:text-label-md font-bold text-on-surface uppercase tracking-wide">Active Inquiries</h3>
                                </div>
                                <div className="p-0 divide-y divide-outline-variant/5">
                                    {myTickets.length === 0 ? (
                                        <div className="p-4 text-center text-on-surface-variant text-xs">No open tickets.</div>
                                    ) : myTickets.map(ticket => (
                                        <div key={ticket.id} className="p-2.5 md:p-4 hover:bg-white/5 transition-all cursor-pointer group">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[8px] md:text-[10px] font-bold font-tabular-nums text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded border border-outline-variant/20">
                                                    #{ticket.id.substring(0, 8).toUpperCase()}
                                                </span>
                                                <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[ticket.status] || 'text-outline'}`}>
                                                    {ticket.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <h4 className="text-xs md:text-label-md font-bold text-on-surface leading-tight group-hover:text-primary transition-colors line-clamp-1">{ticket.subject}</h4>
                                            <span className="text-[8px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                                                Updated {new Date(ticket.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => navigate('/support/chat')} className="w-full py-2 md:py-3 text-[9px] md:text-xs font-bold text-on-surface-variant hover:text-primary transition-colors border-t border-outline-variant/10 uppercase tracking-wider bg-surface-container-highest/20 cursor-pointer">View All Tickets</button>
                            </section>

                            {/* Service Status Cards */}
                            <section className="glass-card rounded-xl p-2.5 md:p-card-padding border border-outline-variant/20">
                                <h3 className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 md:mb-4">Platform Integrity</h3>
                                <div className="grid grid-cols-3 md:grid-cols-1 gap-2 md:gap-0 md:space-y-4">
                                    <div className="flex flex-col md:flex-row justify-between items-center">
                                        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                                            <span className="material-symbols-outlined text-tertiary text-[14px] md:text-[20px]">check_circle</span>
                                            <span className="text-[10px] md:text-label-md font-bold text-on-surface text-center md:text-left leading-none">Trading Core</span>
                                        </div>
                                        <span className="text-[8px] md:text-[10px] font-bold text-tertiary uppercase tracking-wider mt-1 md:mt-0">Operational</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between items-center">
                                        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                                            <span className="material-symbols-outlined text-tertiary text-[14px] md:text-[20px]">check_circle</span>
                                            <span className="text-[10px] md:text-label-md font-bold text-on-surface text-center md:text-left leading-none">FIX/REST API</span>
                                        </div>
                                        <span className="text-[8px] md:text-[10px] font-bold text-tertiary uppercase tracking-wider mt-1 md:mt-0">99.99% Uptime</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between items-center">
                                        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                                            <span className="material-symbols-outlined text-primary text-[14px] md:text-[20px]">sync</span>
                                            <span className="text-[10px] md:text-label-md font-bold text-on-surface text-center md:text-left leading-none">Bank Wire</span>
                                        </div>
                                        <span className="text-[8px] md:text-[10px] font-bold text-primary uppercase tracking-wider mt-1 md:mt-0">Maintenance</span>
                                    </div>
                                </div>
                            </section>

                            {/* Professional Support Visual */}
                            <div className="relative h-24 md:h-48 rounded-xl overflow-hidden shadow-xl group cursor-pointer border border-outline-variant/20">
                                <img alt="Support Center" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs_HDzxEpMZeVKnHgKVFGEjG4_zw2U_-eVyrw9x6c9d30O5qTJ76r0wmo-mFy8Yw3VreXU3Kho1hHseJv68eU2J4XPiZbfFTiZHoViP6Gr_ZwX0VWH9sWM5YpaqzNq2ROM2nkvUkn7fGUnzN8zFfnBRhmnsQCXJHYzLYQZqlTLTEnxL6NjhFNc0yYuZ70_b4qUCfm3I2LOFRakREPuf8L-beqQ-NdDyg2QYuBVVMr_zjQ0RBbZWkFfzgLZL-1zVP07A19IlKQqzJoE" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1322] via-[#0d1322]/60 to-transparent"></div>
                                <div className="absolute bottom-2 left-2.5 md:bottom-4 md:left-4">
                                    <p className="text-[8px] md:text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">24/7 Dedicated Support</p>
                                    <h4 className="text-xs md:text-body-md font-bold text-white tracking-wide">Institutional Concierge</h4>
                                </div>
                            </div>
                        </div>

                        {/* Mobile View Tickets Tab */}
                        {activeTab === 'tickets' && (
                            <div className="md:hidden space-y-3">
                                <section className="glass-card rounded-xl border border-outline-variant/20 overflow-hidden">
                                    <div className="bg-surface-container-high/40 px-3 py-3 border-b border-outline-variant/10">
                                        <h3 className="text-sm font-bold text-on-surface uppercase tracking-wide">My Tickets</h3>
                                    </div>
                                    <div className="divide-y divide-outline-variant/5">
                                        {allTickets.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant/20">
                                                    <span className="material-symbols-outlined text-3xl text-outline">receipt_long</span>
                                                </div>
                                                <h4 className="text-sm font-bold text-on-surface mb-1">No Support History</h4>
                                                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                                                    You haven't opened any tickets or chats yet. Our support team is ready to help.
                                                </p>
                                                <button
                                                    onClick={() => setActiveTab('new')}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold uppercase tracking-wider shadow-sm shadow-primary/20 hover:brightness-110 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">add</span>
                                                    Open a Ticket
                                                </button>
                                            </div>
                                        ) : allTickets.map(ticket => (
                                            <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="p-3 hover:bg-white/5 transition-all cursor-pointer group">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] font-bold font-tabular-nums text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded border border-outline-variant/20">
                                                        #{ticket.id.substring(0, 8).toUpperCase()}
                                                    </span>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[ticket.status] || 'text-outline'}`}>
                                                        {ticket.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <h4 className="text-sm font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">{ticket.subject}</h4>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                                                        Updated {new Date(ticket.updated_at).toLocaleDateString()}
                                                    </span>
                                                    <span className="material-symbols-outlined text-primary text-[16px]">chevron_right</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* Mobile Ticket Detail Drawer */}
                        <div className={`fixed inset-y-0 right-0 w-full bg-surface-container-lowest transform transition-transform duration-300 ease-in-out md:hidden z-[100] flex flex-col ${
                            selectedTicket ? 'translate-x-0' : 'translate-x-full'
                        }`}>
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#2563eb] to-[#b4c5ff] px-4 py-3 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2 min-w-0">
                                    <button onClick={() => setSelectedTicket(null)} className="text-white/80 hover:text-white transition-colors shrink-0">
                                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                                    </button>
                                    <span className="text-white font-bold text-sm truncate">Ticket #{selectedTicket?.id.substring(0, 8).toUpperCase()}</span>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-white`}>
                                    {selectedTicket?.status.replace('_', ' ')}
                                </span>
                            </div>

                            {/* Ticket Info */}
                            <div className="p-4 border-b border-outline-variant/10 bg-surface-container-high/30">
                                <h3 className="text-base font-bold text-on-surface mb-1">{selectedTicket?.subject}</h3>
                                <p className="text-xs text-on-surface-variant">
                                    Opened on {selectedTicket ? new Date(selectedTicket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                                </p>
                            </div>

                            {/* Chat Messages Placeholder */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-lowest">
                                <div className="flex flex-col items-center justify-center text-center py-8 text-on-surface-variant">
                                    <span className="material-symbols-outlined text-4xl opacity-30 mb-2">chat</span>
                                    <p className="text-xs font-medium">Conversation history will appear here.</p>
                                </div>
                            </div>

                            {/* Input */}
                            <div className="p-3 border-t border-outline-variant/20 bg-surface-container-low shrink-0">
                                <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all px-3 py-2">
                                    <input
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder-on-surface-variant"
                                        placeholder="Type a reply..."
                                        type="text"
                                    />
                                    <button className="bg-primary p-1.5 rounded-lg text-on-primary hover:brightness-110 transition-all">
                                        <span className="material-symbols-outlined text-[18px]">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
        </div>
    );
}
