import React, { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface ChatMessage {
  id: string;
  sender_type: 'user' | 'admin';
  message: string;
  created_at: string;
  read_by_user: boolean;
}

const LS_SESSION_KEY = 'jamex_livechat_session';

function getOrCreateSession(): string {
  const existing = localStorage.getItem(LS_SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(LS_SESSION_KEY, id);
  return id;
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function LiveChatWidget() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const userId = user?.id || null;
  const sessionId = userId ? null : getOrCreateSession();

  const fetchMessages = useCallback(async () => {
    if (userId) {
      const { data, error } = await supabase
        .from('livechat_messages')
        .select('id, sender_type, message, created_at, read_by_user')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (!error && data) {
        setMessages(data);
        const unreadCount = data.filter(m => m.sender_type === 'admin' && !m.read_by_user).length;
        setUnread(unreadCount);
      }
    } else if (sessionId) {
      const { data, error } = await supabase
        .from('livechat_messages')
        .select('id, sender_type, message, created_at, read_by_user')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      if (!error && data) {
        setMessages(data);
        const unreadCount = data.filter(m => m.sender_type === 'admin' && !m.read_by_user).length;
        setUnread(unreadCount);
      }
    }
  }, [userId, sessionId]);

  useEffect(() => {
    fetchMessages();
    if (!userId && !sessionId) return;

    const filter = userId ? `user_id=eq.${userId}` : `session_id=eq.${sessionId}`;
    const ch = supabase
      .channel('livechat_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'livechat_messages', filter }, () => fetchMessages())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchMessages, userId, sessionId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, open]);

  useEffect(() => {
    if (open && messages.length > 0) {
      const unreadAdmin = messages.filter(m => m.sender_type === 'admin' && !m.read_by_user);
      if (unreadAdmin.length > 0) {
        const ids = unreadAdmin.map(m => m.id);
        supabase.from('livechat_messages').update({ read_by_user: true }).in('id', ids).then(() => setUnread(0));
      }
    }
  }, [open, messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    setLoading(true);

    const payload: Record<string, unknown> = {
      sender_type: 'user',
      message: text,
      read_by_admin: false,
      read_by_user: true,
    };
    if (userId) payload.user_id = userId;
    else payload.session_id = sessionId;

    const { error } = await supabase.from('livechat_messages').insert(payload);
    if (!error) {
      setInput('');
      await fetchMessages();
    }
    setLoading(false);
  }

  if (!initialized.current) {
    initialized.current = true;
  }

  return (
    <div className="fixed bottom-20 right-4 z-[100] flex flex-col items-end md:bottom-4">
      {/* Chat Panel */}
      {open && (
        <div className="mb-3 w-[340px] max-w-[90vw] h-[480px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2563eb] to-[#b4c5ff] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-[20px]">chat</span>
              <span className="text-white font-bold text-sm">Live Support</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-surface-container-lowest">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-on-surface-variant text-center px-4">
                <span className="material-symbols-outlined text-4xl opacity-30 mb-2">support_agent</span>
                <p className="text-xs font-medium">Hi there! How can we help you today?</p>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                      msg.sender_type === 'user'
                        ? 'bg-[#2563eb] text-white rounded-br-none'
                        : 'bg-surface-container-highest text-on-surface border border-outline-variant/20 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                    <span className={`text-[10px] mt-1 block ${msg.sender_type === 'user' ? 'text-white/70' : 'text-on-surface-variant'}`}>
                      {fmtTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-outline-variant/20 bg-surface-container-low shrink-0">
            <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all px-3 py-2">
              <input
                className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder-on-surface-variant"
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-primary p-1.5 rounded-lg text-on-primary hover:brightness-110 disabled:opacity-40 transition-all"
              >
                <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>
                  {loading ? 'sync' : 'send'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2563eb] to-[#b4c5ff] shadow-[0_8px_30px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.6)] hover:scale-105 transition-all flex items-center justify-center relative"
      >
        <span className="material-symbols-outlined text-white text-[28px]">
          {open ? 'close' : 'chat'}
        </span>
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-md">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
