import React, { useState } from 'react';
import TabBar from '../../components/TabBar';

const activeTickets = [
  {
    id: 1,
    tag: 'KYC HELP',
    tagColor: 'text-tertiary-fixed bg-tertiary-container/30',
    time: '2m ago',
    user: 'Marcus Aurelius',
    preview: '"I uploaded my passport twice but the system keeps rejecting it saying blur..."',
    priority: 'HIGH PRIORITY',
    priorityColor: 'text-error bg-error-container/20',
  },
  {
    id: 2,
    tag: 'WITHDRAWAL ISSUE',
    tagColor: 'text-on-secondary-container bg-secondary-container/30',
    time: '15m ago',
    user: 'Seneca Younger',
    preview: '"SEPA transfer initiated 48 hours ago still hasn\'t reflected in my account."',
    priority: 'MEDIUM',
    priorityColor: 'text-on-surface-variant bg-surface-variant/30',
  },
];

const escalatedTickets = [
  {
    id: 3,
    tag: 'SECURITY',
    tagColor: 'text-on-tertiary-container bg-tertiary-container/30',
    time: '1h ago',
    user: 'Epicurus V.',
    preview: '"Suspicious login attempt from unknown IP address. Please freeze account immediately."',
    priority: 'CRITICAL',
    priorityColor: 'text-error bg-error-container/20',
  },
];

const resolvedTickets = [
  {
    id: 4,
    tag: 'APP BUG',
    tagColor: 'text-on-surface-variant bg-surface-variant/30',
    time: '3h ago',
    user: 'Zeno Citium',
    preview: '"Chart not rendering on iOS 17.2 update. Fixed by clearing cache."',
  },
];

export default function AdminSupport() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'user',
      text: "Hello, I'm having issues with the KYC verification. It keeps saying my document is blurry but I've taken the photo in direct sunlight with a 48MP camera. Can someone manually review this?",
      time: '10:42 AM',
    },
    {
      id: 2,
      type: 'note',
      author: 'Admin Sarah',
      text: 'Checked the raw upload logs. The image format is HEIC, might be causing compatibility issues with our legacy OCR engine. Escalating to technical if manual override fails.',
    },
    {
      id: 3,
      type: 'admin',
      text: "Hi Marcus, I'm looking into this now. I can see the files in our system. I'll attempt a manual override for your account verification. Please stay online.",
      time: '10:45 AM',
      delivered: true,
    },
    {
      id: 4,
      type: 'user',
      text: 'Here is the screenshot of the error message I get every time I try to resubmit.',
      time: '10:48 AM',
      hasImage: true,
    },
  ]);
  const [selectedTab, setSelectedTab] = useState('Active');

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        type: 'admin',
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        delivered: true,
      },
    ]);
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-140px)] grid md:grid-cols-2 gap-4 md:gap-6 overflow-hidden pb-4 md:pb-0">
      {/* Ticket Lanes (Multi-column view) */}
      <section className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-2 snap-x">
  <TabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} tabs={['Active', 'Escalated', 'Resolved', 'All']} />
  <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-4">
    {(() => {
      const ticketsMap = {
        Active: activeTickets,
        Escalated: escalatedTickets,
        Resolved: resolvedTickets,
        All: [...activeTickets, ...escalatedTickets, ...resolvedTickets],
      };
      const displayed = ticketsMap[selectedTab] || activeTickets;
      return displayed.map((ticket) => (
        <div key={ticket.id} className="glass-card p-3 rounded-xl hover:border-primary/50 transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-bold uppercase ${ticket.tagColor} px-2 py-0.5 rounded-full`}>{ticket.tag}</span>
            <span className="text-[10px] font-tabular-nums text-on-surface-variant">{ticket.time}</span>
          </div>
          <h4 className="font-label-md text-label-md text-on-surface mb-1 group-hover:text-primary transition-colors">{ticket.user}</h4>
          <p className="text-label-sm font-label-sm text-on-surface-variant line-clamp-2 mb-3">{ticket.preview}</p>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-[10px] text-outline">U</div>
            </div>
            <span className={`text-[10px] font-bold ${ticket.priorityColor} px-1.5 py-0.5 rounded`}>{ticket.priority}</span>
          </div>
        </div>
      ));
    })()}
    </div>
      </section>

      {/* Chat Interface (Detail View) */}
      <aside className="w-full md:w-[450px] shrink-0 glass-card rounded-xl flex flex-col overflow-hidden shadow-2xl relative z-10 border-l border-primary/20 bg-surface-container-low/90">
        {/* Header */}
        <div className="p-2 bg-surface-variant/30 border-b border-outline-variant/30 shrink-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface leading-tight">Marcus Aurelius</h2>
              <p className="text-label-sm font-label-sm text-on-surface-variant">User ID: #7729-JG | VIP Tier 1</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-surface-variant/50 rounded-lg text-on-surface-variant cursor-pointer transition-colors">
                <span className="material-symbols-outlined">person</span>
              </button>
              <button className="p-2 hover:bg-surface-variant/50 rounded-lg text-on-surface-variant cursor-pointer transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">reply</span> Reply
            </button>
            <button className="flex-1 bg-surface-variant/50 text-on-surface-variant font-label-md text-label-md py-2 rounded-lg flex items-center justify-center gap-2 border border-outline-variant/20 hover:bg-surface-variant/80 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">sticky_note_2</span> Note
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 space-y-6 no-scrollbar flex flex-col">
          {/* Timestamp Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-outline-variant/20"></div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">October 24, 2023</span>
            <div className="flex-1 h-px bg-outline-variant/20"></div>
          </div>

          {messages.map((msg) => {
            if (msg.type === 'note') {
              return (
                <div key={msg.id} className="mx-auto w-[90%] bg-tertiary-container/10 border border-tertiary-container/30 rounded-lg p-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-tertiary"></div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-tertiary text-sm">history_edu</span>
                    <span className="text-[10px] font-bold text-tertiary uppercase">Internal Note: {msg.author}</span>
                  </div>
                  <p className="text-[12px] italic text-on-tertiary-container">{msg.text}</p>
                </div>
              );
            }

            if (msg.type === 'admin') {
              return (
                <div key={msg.id} className="flex gap-3 max-w-[90%] ml-auto flex-row-reverse group">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-[10px] font-bold flex-none mt-1 shadow-md">
                    JG
                  </div>
                  <div className="space-y-1 flex flex-col items-end">
                    <div className="bg-primary-container p-3 rounded-2xl rounded-tr-none shadow-md">
                      <p className="text-label-md font-label-md text-on-primary-container">{msg.text}</p>
                    </div>
                    <span className="text-[10px] font-tabular-nums text-on-surface-variant px-1 text-right">
                      {msg.time} {msg.delivered && '• Delivered'}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex gap-3 max-w-[90%] group">
                <div className="w-8 h-8 rounded-full flex-none mt-1 bg-surface-container-highest flex items-center justify-center text-outline text-xs">
                  MA
                </div>
                <div className="space-y-2">
                  <div className="bg-surface-container-highest p-3 rounded-2xl rounded-tl-none border border-outline-variant/20 shadow-sm">
                    <p className="text-label-md font-label-md text-on-surface">{msg.text}</p>
                    {msg.hasImage && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-outline-variant/30 group/img relative cursor-pointer">
                        <div className="w-full h-32 bg-surface-container-low flex items-center justify-center border border-outline-variant/10">
                          <span className="material-symbols-outlined text-outline text-3xl">image</span>
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="material-symbols-outlined text-white">zoom_in</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-tabular-nums text-on-surface-variant px-1">{msg.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Footer */}
        <div className="p-2 bg-surface-container-low border-t border-outline-variant/30 shrink-0">
          <div className="flex items-center gap-3 bg-surface p-2 rounded-xl border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <input
              className="bg-transparent border-none focus:ring-0 flex-1 text-label-md font-label-md text-on-surface outline-none"
              placeholder="Type your response..."
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="bg-primary p-2 rounded-lg text-on-primary hover:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-3">
              <button className="text-[10px] font-bold text-on-surface-variant uppercase hover:text-primary tracking-widest flex items-center gap-1 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[14px]">bolt</span> Canned Response
              </button>
            </div>
            <span className="text-[10px] text-on-surface-variant/50">Enter to send</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
