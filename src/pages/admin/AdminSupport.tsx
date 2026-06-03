import React, { useCallback, useEffect, useRef, useState } from 'react';
import TabBar from '../../components/TabBar';
import { supabase } from '../../lib/supabase';

interface Ticket {
  id: string;
  user_id: string | null;
  display_name: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: string;
  admin_reply: string | null;
  guest_name: string | null;
  guest_email: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_NEXT: Record<string, Ticket['status']> = {
  open: 'in_progress', in_progress: 'resolved', resolved: 'closed', closed: 'open',
};

function relTime(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
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
  if (tab === 'Escalated') return ['urgent', 'high'].includes(t.priority) && !['resolved', 'closed'].includes(t.status);
  if (tab === 'Resolved') return ['resolved', 'closed'].includes(t.status);
  return true;
}

export default function AdminSupport() {
  const [tickets, setTickets]     = useState<Ticket[]>([]);
  const [loading, setLoading]     = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab]             = useState('Active');
  const [inputText, setInputText] = useState('');
  const [replying, setReplying]   = useState(false);
  const initialized               = useRef(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [txRes, profileRes] = await Promise.all([
        supabase.from('support_tickets')
          .select('id,user_id,subject,message,status,priority,category,admin_reply,guest_name,guest_email,created_at,updated_at')
          .order('created_at', { ascending: false }),
        supabase.from('profiles').select('id,full_name'),
      ]);
      const pm: Record<string, string> = {};
      (profileRes.data || []).forEach((p: any) => { if (p.id) pm[p.id] = p.full_name || ''; });
      const merged: Ticket[] = (txRes.data || []).map(t => ({
        ...t,
        display_name: t.user_id
          ? (pm[t.user_id] || `User ${t.user_id.substring(0, 8)}…`)
          : (t.guest_name || 'Guest'),
      }));
      setTickets(merged);
      if (!initialized.current && merged.length > 0) {
        const first = merged.find(t => ['open','in_progress'].includes(t.status)) || merged[0];
        setSelectedId(first.id);
        initialized.current = true;
      }
    } catch (err) { console.error('AdminSupport fetch error:', err); }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const ch = supabase.channel('support_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => fetchAll())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchAll]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selectedId]);

  const selected = tickets.find(t => t.id === selectedId) ?? null;
  const displayed = tickets.filter(t => tabFilter(t, tab));

  async function handleReply() {
    if (!inputText.trim() || !selected) return;
    setReplying(true);
    const newStatus = selected.status === 'open' ? 'in_progress' : selected.status;
    const { error } = await supabase.from('support_tickets')
      .update({ admin_reply: inputText.trim(), status: newStatus }).eq('id', selected.id);
    if (!error) {
      setInputText('');
      setTickets(prev => prev.map(t => t.id === selected.id
        ? { ...t, admin_reply: inputText.trim(), status: newStatus, updated_at: new Date().toISOString() } : t));
    }
    setReplying(false);
  }

  async function cycleStatus(id: string, current: Ticket['status']) {
    const next = STATUS_NEXT[current];
    await supabase.from('support_tickets').update({ status: next }).eq('id', id);
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: next } : t));
  }

  async function setStatus(id: string, s: Ticket['status']) {
    await supabase.from('support_tickets').update({ status: s }).eq('id', id);
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: s } : t));
  }

  return (
    <div className="h-[calc(100vh-140px)] grid md:grid-cols-2 gap-4 md:gap-6 overflow-hidden pb-4 md:pb-0">

      {/* Left — Ticket list */}
      <section className="flex flex-col overflow-hidden">
        <TabBar selectedTab={tab} setSelectedTab={setTab} tabs={['Active', 'Escalated', 'Resolved', 'All']} />
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-4 mt-2">
          {loading ? (
            <div className="py-12 text-center text-outline font-label-md">Loading tickets…</div>
          ) : displayed.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant font-label-md">No tickets here.</div>
          ) : displayed.map(ticket => (
            <div key={ticket.id} onClick={() => setSelectedId(ticket.id)}
              className={`glass-card p-3 rounded-xl cursor-pointer transition-all group ${
                selectedId === ticket.id ? 'border-primary/60 bg-primary/5' : 'hover:border-primary/30'
              }`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${catStyle(ticket.category, ticket.priority)}`}>
                  {ticket.category}
                </span>
                <span className="text-[10px] font-tabular-nums text-on-surface-variant">{relTime(ticket.created_at)}</span>
              </div>
              <h4 className="font-label-md text-on-surface mb-0.5 group-hover:text-primary transition-colors">{ticket.display_name}</h4>
              <p className="text-[12px] font-medium text-primary/80 mb-1 line-clamp-1">{ticket.subject}</p>
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
      <aside className="glass-card rounded-xl flex flex-col overflow-hidden shadow-2xl border-l border-primary/20 bg-surface-container-low/90">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl opacity-30">support_agent</span>
            <p className="font-label-md">Select a ticket to view</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-3 bg-surface-variant/30 border-b border-outline-variant/30 shrink-0">
              <div className="flex justify-between items-start">
                <div className="min-w-0 pr-2">
                  <h2 className="font-headline-md font-bold text-on-surface leading-tight truncate">{selected.display_name}</h2>
                  <p className="text-label-sm text-on-surface-variant truncate">{selected.subject}</p>
                  {selected.guest_email && (
                    <p className="text-[10px] text-primary/80 mt-0.5">{selected.guest_email}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${statusStyle(selected.status)}`}>
                    {selected.status.replace('_',' ').toUpperCase()}
                  </span>
                  <button onClick={() => cycleStatus(selected.id, selected.status)} title="Advance status"
                    className="p-1.5 hover:bg-surface-variant/50 rounded-lg text-on-surface-variant cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-sm">update</span>
                  </button>
                  <button onClick={() => setSelectedId(null)}
                    className="p-1.5 hover:bg-surface-variant/50 rounded-lg text-on-surface-variant cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
              <div className="flex items-center gap-4 py-1">
                <div className="flex-1 h-px bg-outline-variant/20" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{fmtDate(selected.created_at)}</span>
                <div className="flex-1 h-px bg-outline-variant/20" />
              </div>

              {/* User message */}
              <div className="flex gap-3 max-w-[90%]">
                <div className="w-8 h-8 rounded-full flex-none bg-surface-container-highest flex items-center justify-center text-outline text-xs font-bold">
                  {selected.display_name.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <div className="bg-surface-container-highest p-3 rounded-2xl rounded-tl-none border border-outline-variant/20">
                    <p className="text-label-md text-on-surface">{selected.message}</p>
                  </div>
                  <span className="text-[10px] font-tabular-nums text-on-surface-variant px-1">{fmtTime(selected.created_at)}</span>
                </div>
              </div>

              {/* Admin reply */}
              {selected.admin_reply && (
                <div className="flex gap-3 max-w-[90%] ml-auto flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-[10px] font-bold flex-none shadow-md">JG</div>
                  <div className="space-y-1 flex flex-col items-end">
                    <div className="bg-primary-container p-3 rounded-2xl rounded-tr-none shadow-md">
                      <p className="text-label-md text-on-primary-container">{selected.admin_reply}</p>
                    </div>
                    <span className="text-[10px] font-tabular-nums text-on-surface-variant px-1 text-right">
                      {fmtTime(selected.updated_at)} · Delivered
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-2 bg-surface-container-low border-t border-outline-variant/30 shrink-0">
              <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <input
                  className="bg-transparent border-none focus:ring-0 flex-1 text-label-md text-on-surface outline-none"
                  placeholder={selected.admin_reply ? 'Update reply…' : 'Type your response…'}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); }}}
                />
                <button onClick={handleReply} disabled={!inputText.trim() || replying}
                  className="bg-primary p-2 rounded-lg text-on-primary hover:scale-95 transition-transform cursor-pointer disabled:opacity-50">
                  <span className={`material-symbols-outlined text-[20px] ${replying ? 'animate-spin' : ''}`}>
                    {replying ? 'sync' : 'send'}
                  </span>
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-3">
                  <button onClick={() => setStatus(selected.id, 'resolved')}
                    className="text-[10px] font-bold text-tertiary uppercase hover:underline flex items-center gap-1 cursor-pointer">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Resolve
                  </button>
                  <button onClick={() => setStatus(selected.id, 'closed')}
                    className="text-[10px] font-bold text-on-surface-variant uppercase hover:underline flex items-center gap-1 cursor-pointer">
                    <span className="material-symbols-outlined text-[14px]">block</span> Close
                  </button>
                </div>
                <span className="text-[10px] text-on-surface-variant/50">Enter to send</span>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
