import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

/* ── helpers ── */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtMoney(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

/* ── types ── */
interface Metrics { aum: number; users: number; vol24h: number; contracts: number; }
interface PendingKyc { id: string; user_id: string; first_name: string; last_name: string; submitted_at: string; }
interface PendingWithdrawal { id: string; user_id: string; amount: number; asset: string; created_at: string; }
interface FeedEvent { id: string; icon: string; color: string; label: string; time: string; sub: string; }
interface WeekDay { label: string; dep: number; wit: number; }
interface GeoEntry { country: string; count: number; }

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({ aum: 0, users: 0, vol24h: 0, contracts: 0 });
  const [metricsLoading, setMetricsLoading] = useState(true);

  const [pendingKycs, setPendingKycs] = useState<PendingKyc[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<PendingWithdrawal[]>([]);
  const [approvalsLoading, setApprovalsLoading] = useState(true);

  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);

  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [geoData, setGeoData] = useState<GeoEntry[]>([]);

  useEffect(() => {
    fetchMetrics();
    fetchApprovals();
    fetchFeed();
    fetchWeekly();
    fetchGeo();
  }, []);

  async function fetchMetrics() {
    setMetricsLoading(true);
    try {
      const since24h = new Date(Date.now() - 86400000).toISOString();
      const [walletRes, depositRes, contractRes, profileRes, kycRes] = await Promise.all([
        supabase.from('wallets').select('main_balance, profit_balance'),
        supabase.from('transactions').select('amount').eq('type', 'deposit').eq('status', 'completed').gte('created_at', since24h),
        supabase.from('investments').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('profiles').select('id'),
        supabase.from('kyc_submissions').select('user_id'),
      ]);

      const wallets = walletRes.data || [];
      const aum = wallets.reduce((s, w) => s + (Number(w.main_balance) || 0) + (Number(w.profit_balance) || 0), 0);
      const vol24h = (depositRes.data || []).reduce((s, d) => s + (Number(d.amount) || 0), 0);

      /* union profiles + kyc user IDs to get the true registered user count */
      const allUserIds = new Set<string>([
        ...(profileRes.data || []).map(p => p.id),
        ...(kycRes.data || []).map(k => k.user_id),
      ]);
      /* fall back to wallets count if neither profile nor kyc returned data */
      const users = allUserIds.size > 0 ? allUserIds.size : wallets.length;

      setMetrics({ aum, users, vol24h, contracts: contractRes.count || 0 });
    } catch (err) {
      console.error('fetchMetrics error:', err);
    }
    setMetricsLoading(false);
  }

  async function fetchApprovals() {
    setApprovalsLoading(true);
    try {
      const [kycRes, witRes] = await Promise.all([
        supabase.from('kyc_submissions').select('id, user_id, first_name, last_name, submitted_at').eq('status', 'pending').order('submitted_at', { ascending: true }).limit(5),
        supabase.from('transactions').select('id, user_id, amount, asset, created_at').eq('type', 'withdrawal').eq('status', 'pending').order('created_at', { ascending: true }).limit(5),
      ]);
      setPendingKycs((kycRes.data as PendingKyc[]) || []);
      setPendingWithdrawals((witRes.data as PendingWithdrawal[]) || []);
    } catch (err) {
      console.error('fetchApprovals error:', err);
    }
    setApprovalsLoading(false);
  }

  async function fetchFeed() {
    setFeedLoading(true);
    try {
      const [kycRes, txRes, invRes] = await Promise.all([
        supabase.from('kyc_submissions').select('id, first_name, last_name, status, submitted_at').order('submitted_at', { ascending: false }).limit(4),
        supabase.from('transactions').select('id, type, amount, asset, status, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('investments').select('id, plan_name, amount, status, created_at').order('created_at', { ascending: false }).limit(3),
      ]);

      const events: FeedEvent[] = [];

      (kycRes.data || []).forEach(k => events.push({
        id: `k-${k.id}`,
        icon: 'badge',
        color: k.status === 'pending' ? 'text-primary' : k.status === 'approved' ? 'text-tertiary' : 'text-error',
        label: `KYC ${k.status === 'pending' ? 'submitted' : k.status} — ${k.first_name} ${k.last_name}`,
        time: k.submitted_at,
        sub: `KYC • ${k.status}`,
      }));

      (txRes.data || []).forEach(t => events.push({
        id: `t-${t.id}`,
        icon: t.type === 'deposit' ? 'call_received' : t.type === 'withdrawal' ? 'output' : 'sync_alt',
        color: t.status === 'pending' ? 'text-outline' : t.type === 'deposit' ? 'text-tertiary' : 'text-primary',
        label: `${t.type.charAt(0).toUpperCase() + t.type.slice(1)} of ${fmtMoney(Number(t.amount))} ${t.asset}`,
        time: t.created_at,
        sub: `${t.type} • ${t.status}`,
      }));

      (invRes.data || []).forEach(i => events.push({
        id: `i-${i.id}`,
        icon: 'rocket_launch',
        color: 'text-secondary',
        label: `Investment in "${i.plan_name}" — ${fmtMoney(Number(i.amount))}`,
        time: i.created_at,
        sub: `investment • ${i.status}`,
      }));

      events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setFeed(events.slice(0, 8));
    } catch (err) {
      console.error('fetchFeed error:', err);
    }
    setFeedLoading(false);
  }

  async function fetchWeekly() {
    try {
      const since = new Date(Date.now() - 7 * 86400000).toISOString();
      const { data: txs } = await supabase.from('transactions').select('type, amount, created_at').gte('created_at', since).in('type', ['deposit', 'withdrawal']);

      const days: WeekDay[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = d.toISOString().split('T')[0];
        const dayTxs = (txs || []).filter(t => t.created_at.substring(0, 10) === dateStr);
        const dep = dayTxs.filter(t => t.type === 'deposit').reduce((s, t) => s + Number(t.amount), 0);
        const wit = dayTxs.filter(t => t.type === 'withdrawal').reduce((s, t) => s + Number(t.amount), 0);
        days.push({ label, dep, wit });
      }
      setWeekDays(days);
    } catch (err) {
      console.error('fetchWeekly error:', err);
    }
  }

  async function fetchGeo() {
    try {
      const { data } = await supabase.from('kyc_submissions').select('country').not('country', 'is', null);
      const map: Record<string, number> = {};
      (data || []).forEach(k => { if (k.country) map[k.country] = (map[k.country] || 0) + 1; });
      const sorted = Object.entries(map).map(([country, count]) => ({ country, count })).sort((a, b) => b.count - a.count).slice(0, 4);
      setGeoData(sorted);
    } catch (err) {
      console.error('fetchGeo error:', err);
    }
  }

  /* ── derived ── */
  const maxBarPx = 192;
  const maxBarVal = Math.max(...weekDays.map(d => Math.max(d.dep, d.wit)), 1);
  const hasChartData = weekDays.some(d => d.dep > 0 || d.wit > 0);
  const totalPending = pendingKycs.length + pendingWithdrawals.length;
  const totalGeoUsers = geoData.reduce((s, e) => s + e.count, 0);

  return (
    <>
      {/* ── Global Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-card-padding rounded-xl">
          <div className="flex justify-between items-start mb-3">
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">account_balance</span>
          </div>
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Total AUM</p>
          <p className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
            {metricsLoading ? <span className="text-outline">—</span> : fmtMoney(metrics.aum)}
          </p>
        </div>
        <div className="glass-card p-card-padding rounded-xl">
          <div className="flex justify-between items-start mb-3">
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">group</span>
          </div>
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Registered Users</p>
          <p className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
            {metricsLoading ? <span className="text-outline">—</span> : metrics.users.toLocaleString()}
          </p>
        </div>
        <div className="glass-card p-card-padding rounded-xl">
          <div className="flex justify-between items-start mb-3">
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">payments</span>
          </div>
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">24h Deposit Vol</p>
          <p className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
            {metricsLoading ? <span className="text-outline">—</span> : fmtMoney(metrics.vol24h)}
          </p>
        </div>
        <div className="glass-card p-card-padding rounded-xl">
          <div className="flex justify-between items-start mb-3">
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">description</span>
          </div>
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Active Contracts</p>
          <p className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
            {metricsLoading ? <span className="text-outline">—</span> : metrics.contracts.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ── 7-Day Chart + User Distribution ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high/50">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">7-Day Transaction Activity</h2>
              <p className="font-label-sm text-label-sm text-outline">Daily deposit & withdrawal volumes</p>
            </div>
            <div className="flex gap-3 text-label-sm text-outline">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary/70"></span>Deposits</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-tertiary/70"></span>Withdrawals</span>
            </div>
          </div>
          <div className="p-6 flex-1 h-[320px] flex flex-col">
            {!hasChartData ? (
              <div className="flex-1 flex items-center justify-center text-outline font-label-md">No transaction data in the last 7 days</div>
            ) : (
              <>
                <div className="flex-1 flex items-end justify-between gap-2">
                  {weekDays.map((d, i) => (
                    <div key={i} className="flex-1 flex items-end justify-center gap-1">
                      <div
                        className="w-3 sm:w-5 bg-primary/50 hover:bg-primary rounded-t-sm transition-colors"
                        style={{ height: `${d.dep > 0 ? Math.max((d.dep / maxBarVal) * maxBarPx, 4) : 0}px` }}
                        title={`Deposits: ${fmtMoney(d.dep)}`}
                      />
                      <div
                        className="w-3 sm:w-5 bg-tertiary/50 hover:bg-tertiary rounded-t-sm transition-colors"
                        style={{ height: `${d.wit > 0 ? Math.max((d.wit / maxBarVal) * maxBarPx, 4) : 0}px` }}
                        title={`Withdrawals: ${fmtMoney(d.wit)}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3">
                  {weekDays.map((d, i) => (
                    <span key={i} className="flex-1 text-center font-label-sm text-label-sm text-outline">{d.label}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* User Distribution */}
        <div className="glass-card rounded-xl flex flex-col">
          <div className="p-6 border-b border-outline-variant/10 bg-surface-container-high/50">
            <h2 className="font-headline-md text-headline-md text-on-surface">User Distribution</h2>
            <p className="font-label-sm text-label-sm text-outline">By KYC registration country</p>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="relative h-32 w-full bg-surface-container-low rounded-lg mb-4 overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#2563eb 2px, transparent 2px)', backgroundSize: '10px 10px' }}></div>
              <div className="absolute top-4 left-1/4 w-3 h-3 bg-primary rounded-full animate-ping"></div>
              <div className="absolute bottom-8 right-1/3 w-2 h-2 bg-primary rounded-full"></div>
              <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-primary/40 rounded-full animate-pulse"></div>
            </div>
            {geoData.length === 0 ? (
              <p className="text-outline font-label-md text-center py-4">No KYC country data yet</p>
            ) : (
              <ul className="space-y-3">
                {geoData.map((entry, i) => {
                  const pct = totalGeoUsers > 0 ? Math.round((entry.count / totalGeoUsers) * 100) : 0;
                  return (
                    <li key={i} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 ${i === 0 ? 'bg-primary' : 'bg-outline'} rounded-full`}></span>
                        <span className="font-label-md text-label-md">{entry.country}</span>
                      </div>
                      <span className="font-tabular-nums text-on-surface font-bold">{pct}%</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── Pending Approvals + System Events Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="glass-card rounded-xl flex flex-col">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high/50">
            <h2 className="font-headline-md text-headline-md text-on-surface">Pending Approvals</h2>
            {!approvalsLoading && totalPending > 0 && (
              <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                {totalPending} Pending
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            {approvalsLoading ? (
              <div className="p-8 text-center text-outline font-label-md">Loading…</div>
            ) : totalPending === 0 ? (
              <div className="p-8 text-center text-on-surface-variant font-label-md">No pending approvals</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-surface-container-low/50">
                  <tr className="text-outline font-label-sm text-label-sm border-b border-outline-variant/10">
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">User / Entity</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="font-label-md text-label-md">
                  {pendingKycs.map(k => (
                    <tr key={k.id} className="zebra-row border-b border-outline-variant/5">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-sm">badge</span>
                          KYC Review
                        </div>
                      </td>
                      <td className="px-6 py-4">{k.first_name} {k.last_name}</td>
                      <td className="px-6 py-4 font-tabular-nums">—</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:underline cursor-pointer">Review</button>
                      </td>
                    </tr>
                  ))}
                  {pendingWithdrawals.map(w => (
                    <tr key={w.id} className="zebra-row border-b border-outline-variant/5">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-sm">output</span>
                          Withdrawal
                        </div>
                      </td>
                      <td className="px-6 py-4 font-tabular-nums text-[11px] text-on-surface-variant">{w.user_id.substring(0, 8)}…</td>
                      <td className="px-6 py-4 font-tabular-nums text-on-surface font-bold">{fmtMoney(Number(w.amount))} {w.asset}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:underline cursor-pointer">Verify</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* System Events Feed */}
        <div className="glass-card rounded-xl flex flex-col">
          <div className="p-6 border-b border-outline-variant/10 bg-surface-container-high/50">
            <h2 className="font-headline-md text-headline-md text-on-surface">System Events Feed</h2>
          </div>
          <div className="p-6 space-y-4 max-h-[360px] overflow-y-auto">
            {feedLoading ? (
              <div className="text-center text-outline font-label-md py-4">Loading…</div>
            ) : feed.length === 0 ? (
              <div className="text-center text-on-surface-variant font-label-md py-4">No system events yet</div>
            ) : (
              feed.map(evt => (
                <div key={evt.id} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                    <span className={`material-symbols-outlined text-sm ${evt.color}`}>{evt.icon}</span>
                  </div>
                  <div>
                    <p className="text-on-surface font-label-md text-label-md">{evt.label}</p>
                    <p className="text-outline text-[11px] font-tabular-nums">{timeAgo(evt.time)} • {evt.sub}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
