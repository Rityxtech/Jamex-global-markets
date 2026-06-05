import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ChatMessage {
  id: string;
  user_id: string | null;
  session_id: string | null;
  sender_type: 'user' | 'admin';
  message: string;
  read_by_admin: boolean;
  read_by_user: boolean;
  created_at: string;
}

interface Conversation {
  key: string;
  user_id: string | null;
  session_id: string | null;
  display_name: string;
  last_message: string;
  last_at: string;
  unread_count: number;
}

const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

function relTime(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminLiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [msgRes, profileRes] = await Promise.all([
        supabase.from('livechat_messages').select('*').order('created_at', { ascending: true }),
        supabase.from('profiles').select('id, full_name'),
      ]);
      if (msgRes.data) setMessages(msgRes.data);
      if (profileRes.data) {
        const pm: Record<string, string> = {};
        profileRes.data.forEach((p: any) => { if (p.id) pm[p.id] = p.full_name || ''; });
        setProfiles(pm);
      }
    } catch (err) { console.error('AdminLiveChat fetch error:', err); }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const ch = supabase.channel('admin_livechat_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'livechat_messages' }, () => fetchAll())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchAll]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selectedKey, messages]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (!selectedKey) return;
    const selectedMsgs = messages.filter(m => convKey(m) === selectedKey && m.sender_type === 'user' && !m.read_by_admin);
    if (selectedMsgs.length > 0) {
      const ids = selectedMsgs.map(m => m.id);
      supabase.from('livechat_messages').update({ read_by_admin: true }).in('id', ids).then(() => fetchAll());
    }
  }, [selectedKey, messages, fetchAll]);

  function convKey(m: ChatMessage): string {
    return m.user_id || m.session_id || 'unknown';
  }

  const conversations = useMemo<Conversation[]>(() => {
    const map = new Map<string, ChatMessage[]>();
    messages.forEach(m => {
      const key = convKey(m);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    });
    return Array.from(map.entries())
      .map(([key, msgs]) => {
        const last = msgs[msgs.length - 1];
        const userMsg = msgs.find(m => m.sender_type === 'user');
        const userId = userMsg?.user_id || null;
        const sessionId = userMsg?.session_id || null;
        const name = userId ? (profiles[userId] || `User ${userId.substring(0, 8)}…`) : (sessionId ? `Guest ${sessionId.substring(0, 8)}…` : 'Unknown');
        return {
          key,
          user_id: userId,
          session_id: sessionId,
          display_name: name,
          last_message: last.message,
          last_at: last.created_at,
          unread_count: msgs.filter(m => m.sender_type === 'user' && !m.read_by_admin).length,
        };
      })
      .sort((a, b) => new Date(b.last_at).getTime() - new Date(a.last_at).getTime());
  }, [messages, profiles]);

  const selectedMsgs = useMemo(() => {
    if (!selectedKey) return [];
    return messages.filter(m => convKey(m) === selectedKey);
  }, [messages, selectedKey]);

  async function handleSend() {
    const text = input.trim();
    if (!text || !selectedKey) return;
    setSending(true);

    const conv = conversations.find(c => c.key === selectedKey);
    if (!conv) { setSending(false); return; }

    const payload: Record<string, unknown> = {
      sender_type: 'admin',
      message: text,
      read_by_admin: true,
      read_by_user: false,
    };
    if (conv.user_id) payload.user_id = conv.user_id;
    else if (conv.session_id) payload.session_id = conv.session_id;

    const { error } = await supabase.from('livechat_messages').insert(payload);
    if (!error) {
      setInput('');
      await fetchAll();
    }
    setSending(false);
  }

  return (
    <div className="h-[calc(100vh-140px)] grid md:grid-cols-3 gap-4 md:gap-6 overflow-hidden pb-4 md:pb-0">
      {/* Left — Conversation list */}
      <section className="flex flex-col overflow-hidden glass-card rounded-xl border border-outline-variant/20">
        <div className="px-4 py-3 border-b border-outline-variant/20 bg-surface-container-high/40 shrink-0">
          <h2 className="font-headline-sm font-bold text-on-surface">Live Conversations</h2>
          <p className="text-[11px] text-on-surface-variant mt-0.5">{conversations.length} active chat{conversations.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 p-2">
          {loading ? (
            <div className="py-12 text-center text-outline font-label-md">Loading…</div>
          ) : conversations.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant font-label-md">No conversations yet.</div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.key}
                onClick={() => setSelectedKey(conv.key)}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  selectedKey === conv.key
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-surface-container-highest/50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label-md text-label-md text-on-surface font-bold truncate">{conv.display_name}</span>
                  <span className="text-[10px] font-tabular-nums text-on-surface-variant shrink-0">{relTime(conv.last_at)}</span>
                </div>
                <p className="text-[12px] text-on-surface-variant line-clamp-1">{conv.last_message}</p>
                {conv.unread_count > 0 && (
                  <span className="inline-flex items-center justify-center mt-1.5 px-1.5 py-0.5 bg-error text-white text-[10px] font-bold rounded-full">
                    {conv.unread_count} unread
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Right — Chat view */}
      <section className="md:col-span-2 glass-card rounded-xl flex flex-col overflow-hidden border border-outline-variant/20">
        {!selectedKey ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl opacity-30">chat</span>
            <p className="font-label-md">Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-outline-variant/20 bg-surface-container-high/40 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm font-bold text-on-surface">
                  {conversations.find(c => c.key === selectedKey)?.display_name || 'Conversation'}
                </h3>
                <p className="text-[10px] text-on-surface-variant">
                  {selectedMsgs.length} message{selectedMsgs.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button onClick={() => setSelectedKey(null)} className="p-1.5 hover:bg-surface-variant/50 rounded-lg text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-surface-container-lowest">
              {selectedMsgs.map((msg, idx) => {
                const showDate = idx === 0 || fmtDate(msg.created_at) !== fmtDate(selectedMsgs[idx - 1].created_at);
                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className="flex items-center gap-4 py-1">
                        <div className="flex-1 h-px bg-outline-variant/20" />
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{fmtDate(msg.created_at)}</span>
                        <div className="flex-1 h-px bg-outline-variant/20" />
                      </div>
                    )}
                    <div className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] space-y-1`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm ${
                            msg.sender_type === 'admin'
                              ? 'bg-primary text-white rounded-br-none'
                              : 'bg-surface-container-highest text-on-surface border border-outline-variant/20 rounded-bl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                        <span className={`text-[10px] text-on-surface-variant ${msg.sender_type === 'admin' ? 'text-right block' : ''}`}>
                          {fmtTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-outline-variant/20 bg-surface-container-low shrink-0">
              <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all px-3 py-2">
                <input
                  className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder-on-surface-variant"
                  placeholder="Type your reply..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !input.trim()}
                  className="bg-primary p-2 rounded-lg text-on-primary hover:brightness-110 disabled:opacity-40 transition-all"
                >
                  <span className={`material-symbols-outlined text-[20px] ${sending ? 'animate-spin' : ''}`}>
                    {sending ? 'sync' : 'send'}
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
