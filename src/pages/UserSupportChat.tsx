import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../components/TabBar';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface Ticket {
  id: string;
  user_id: string | null;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: string;
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
}

const relTime = (iso: string): string => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

function catStyle(cat: string, pri: string): string {
  if (pri === 'urgent') return 'text-error bg-error-container/30';
  if (pri === 'high') return 'text-yellow-500 bg-yellow-500/10';
  const l = cat.toLowerCase();
  if (l.includes('kyc')) return 'text-tertiary bg-tertiary-container/30';
  if (l.includes('withdrawal') || l.includes('payment')) return 'text-secondary bg-secondary-container/30';
  if (l.includes('security')) return 'text-error bg-error-container/20';
  return 'text-on-surface-variant bg-surface-variant/30';
}

function priStyle(pri: string): string {
  if (pri === 'urgent') return 'text-error bg-error-container/20';
  if (pri === 'high') return 'text-yellow-500 bg-yellow-500/10';
  return 'text-on-surface-variant bg-surface-variant/30';
}

function statusStyle(s: string): string {
  if (s === 'open') return 'text-primary bg-primary/10 border-primary/30';
  if (s === 'in_progress') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
  if (s === 'resolved') return 'text-tertiary bg-tertiary/10 border-tertiary/30';
  return 'text-outline bg-surface-variant/20 border-outline-variant/30';
}

function tabFilter(t: Ticket, tab: string): boolean {
  if (tab === 'All') return true;
  if (tab === 'Active') return ['open', 'in_progress'].includes(t.status);
  if (tab === 'Resolved') return ['resolved', 'closed'].includes(t.status);
  return true;
}

export default function UserSupportChat() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState('All');
  const [inputText, setInputText] = useState('');
  const [replying, setReplying] = useState(false);
  const initialized = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const t = data || [];
      setTickets(t);
      if (!initialized.current && t.length > 0) {
        const first = t.find(tx => ['open','in_progress'].includes(tx.status)) || t[0];
        setSelectedId(first.id);
        initialized.current = true;
      }
    } catch (err) {
      console.error('UserSupport fetch error:', err);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAll();
    if (!user) return;
    const ch = supabase.channel(`support_rt_${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets', filter: `user_id=eq.${user.id}` }, () => fetchAll())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchAll, user]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selectedId]);

  const selected = tickets.find(t => t.id === selectedId) ?? null;
  const displayed = tickets.filter(t => tabFilter(t, tab));

  async function handleReply() {
    if (!inputText.trim() || !selected) return;
    setReplying(true);
    const newMessage = selected.message + '\n\n---\nUpdate: ' + inputText.trim();
    const newStatus = selected.status === 'resolved' || selected.status === 'closed' ? 'open' : selected.status;

    const { error } = await supabase.from('support_tickets')
      .update({ message: newMessage, status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', selected.id)
      .eq('user_id', user!.id);

    if (!error) {
      setInputText('');
      setTickets(prev => prev.map(t => t.id === selected.id
        ? { ...t, message: newMessage, status: newStatus, updated_at: new Date().toISOString() } : t));
    }
    setReplying(false);
  }

  return (
    <div className="flex-1 p-2.5 md:p-margin-desktop max-w-[1400px] mx-auto w-full mb-6 flex flex-col h-[calc(100vh-80px)]">
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <button
          onClick={() => navigate('/support')}
          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center bg-surface-container p-2 rounded-full border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">Support Tickets</h2>
      </div>

      <div className="flex-1 grid md:grid-cols-2 gap-4 md:gap-6 overflow-hidden pb-4 md:pb-0">
        {/* Left — Ticket list */}
        <section className="flex flex-col overflow-hidden glass-card rounded-xl border border-outline-variant/20 p-2 md:p-4">
          <TabBar selectedTab={tab} setSelectedTab={setTab} tabs={['All', 'Active', 'Resolved']} />
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-4 mt-4">
            {loading ? (
              <div className="py-12 text-center text-outline font-label-md">Loading tickets…</div>
            ) : displayed.length === 0 ? (
              <div className="py-12 text-center text-on-surface-variant font-label-md">No tickets found.</div>
            ) : displayed.map(ticket => (
              <div key={ticket.id} onClick={() => setSelectedId(ticket.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all group border ${
                  selectedId === ticket.id ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/50 bg-surface-container-lowest'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${catStyle(ticket.category, ticket.priority)}`}>
                    {ticket.category}
                  </span>
                  <span className="text-[10px] font-tabular-nums text-on-surface-variant">{relTime(ticket.updated_at || ticket.created_at)}</span>
                </div>
                <h4 className="font-label-md text-on-surface mb-0.5 group-hover:text-primary transition-colors line-clamp-1">{ticket.subject}</h4>
                <p className="text-label-sm text-on-surface-variant line-clamp-2 mb-3">"{ticket.message}"</p>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${statusStyle(ticket.status)}`}>
                    {ticket.status.replace('_',' ').toUpperCase()}
                  </span>
                  {(ticket.priority === 'urgent' || ticket.priority === 'high') && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${priStyle(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right — Ticket detail / reply */}
        <aside className="glass-card rounded-xl flex flex-col overflow-hidden shadow-xl border border-outline-variant/20">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-on-surface-variant p-8 text-center">
              <span className="material-symbols-outlined text-5xl opacity-30">support_agent</span>
              <p className="font-label-md">Select a ticket from the list to view the conversation</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-3 bg-surface-container-high/40 border-b border-outline-variant/30 shrink-0">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 pr-2">
                    <h2 className="font-headline-sm font-bold text-on-surface leading-tight truncate">{selected.subject}</h2>
                    <p className="text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-wider">Ticket ID: #{selected.id.substring(0,8).toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${statusStyle(selected.status)}`}>
                      {selected.status.replace('_',' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar bg-surface-container-lowest">
                <div className="flex items-center gap-4 py-1">
                  <div className="flex-1 h-px bg-outline-variant/20" />
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{fmtDate(selected.created_at)}</span>
                  <div className="flex-1 h-px bg-outline-variant/20" />
                </div>

                {/* User message */}
                <div className="flex gap-3 max-w-[90%] ml-auto flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-[10px] font-bold flex-none shadow-md">ME</div>
                  <div className="space-y-1 flex flex-col items-end">
                    <div className="bg-primary-container p-3 rounded-2xl rounded-tr-none shadow-sm border border-primary/10">
                      <p className="text-label-md text-on-primary-container whitespace-pre-wrap">{selected.message}</p>
                    </div>
                    <span className="text-[10px] font-tabular-nums text-on-surface-variant px-1 text-right">
                      {fmtTime(selected.created_at)}
                    </span>
                  </div>
                </div>

                {/* Admin reply */}
                {selected.admin_reply && (
                  <div className="flex gap-3 max-w-[90%]">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary text-[10px] font-bold flex-none shadow-sm border border-outline-variant/30">
                      <span className="material-symbols-outlined text-[16px]">support_agent</span>
                    </div>
                    <div className="space-y-1">
                      <div className="bg-surface-container-highest p-3 rounded-2xl rounded-tl-none border border-outline-variant/20">
                        <p className="text-label-md text-on-surface whitespace-pre-wrap">{selected.admin_reply}</p>
                      </div>
                      <span className="text-[10px] font-tabular-nums text-on-surface-variant px-1">
                        {fmtTime(selected.updated_at)} · Support Team
                      </span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-3 bg-surface-container border-t border-outline-variant/30 shrink-0">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
                    <input
                      className="bg-transparent border-none focus:ring-0 flex-1 text-label-md text-on-surface outline-none px-2"
                      placeholder="Type a new message to update your ticket..."
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); }}}
                    />
                    <button onClick={handleReply} disabled={!inputText.trim() || replying}
                      className="bg-primary p-2 rounded-lg text-on-primary hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                      <span className={`material-symbols-outlined text-[20px] ${replying ? 'animate-spin' : ''}`}>
                        {replying ? 'sync' : 'send'}
                      </span>
                    </button>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/70 text-center">Need to add more details? Send a message to update your ticket.</p>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
