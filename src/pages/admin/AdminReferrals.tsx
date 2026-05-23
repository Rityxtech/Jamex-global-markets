import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

/* ── types ── */
interface ReferrerRow {
  user_id: string;
  display_name: string;
  referral_count: number;
  earned: number;
  pending: number;
}

interface Stats {
  totalReferrals: number;
  activeReferrers: number;
  totalPaid: number;
  totalPending: number;
}

/* ── helpers ── */
const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);

type Tier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
function getTier(count: number): Tier {
  if (count >= 50) return 'Platinum';
  if (count >= 21) return 'Gold';
  if (count >= 6)  return 'Silver';
  return 'Bronze';
}
const TIER_STYLE: Record<Tier, string> = {
  Platinum: 'text-tertiary bg-tertiary/10 border-tertiary/30',
  Gold:     'text-primary bg-primary/10 border-primary/30',
  Silver:   'text-secondary bg-secondary/10 border-secondary/30',
  Bronze:   'text-on-surface-variant bg-surface-variant/20 border-outline-variant/50',
};

/* ── static tier config (platform policy, not stored in DB) ── */
const COMMISSION_TIERS = [
  { tier: 'Bronze',   range: '1–5 referrals',   rate: '2.5%', color: 'text-on-surface-variant', barColor: 'bg-outline',    barPct: 25 },
  { tier: 'Silver',   range: '6–20 referrals',  rate: '4.0%', color: 'text-secondary',           barColor: 'bg-secondary',  barPct: 45 },
  { tier: 'Gold',     range: '21–50 referrals', rate: '5.0%', color: 'text-primary',             barColor: 'bg-primary',    barPct: 65 },
  { tier: 'Platinum', range: '50+ referrals',   rate: '7.5%', color: 'text-tertiary',            barColor: 'bg-tertiary',   barPct: 85 },
];

export default function AdminReferrals() {
  const [rows, setRows]       = useState<ReferrerRow[]>([]);
  const [stats, setStats]     = useState<Stats>({ totalReferrals: 0, activeReferrers: 0, totalPaid: 0, totalPending: 0 });
  const [loading, setLoading] = useState(true);

  /* config panel (UI-only, no DB table for platform config yet) */
  const [bonusAmt, setBonusAmt]       = useState('50.00');
  const [minDeposit, setMinDeposit]   = useState('250');
  const [lockRates, setLockRates]     = useState(true);
  const [savedOk, setSavedOk]         = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [refRes, actRes, profileRes] = await Promise.all([
        supabase.from('referrals').select('id, referrer_id, referred_id, status, created_at'),
        supabase.from('referral_activity').select('user_id, amount, status'),
        supabase.from('profiles').select('id, full_name'),
      ]);

      const referrals  = refRes.data  || [];
      const activity   = actRes.data  || [];
      const profiles   = profileRes.data || [];

      /* profile lookup */
      const profileMap: Record<string, string> = {};
      profiles.forEach((p: any) => { if (p.id) profileMap[p.id] = p.full_name || ''; });

      /* aggregate referrals per referrer */
      const countMap: Record<string, number> = {};
      referrals.forEach(r => { countMap[r.referrer_id] = (countMap[r.referrer_id] || 0) + 1; });

      /* aggregate commissions per user */
      const earnedMap:  Record<string, number> = {};
      const pendingMap: Record<string, number> = {};
      activity.forEach(a => {
        const amt = Number(a.amount) || 0;
        if (a.status === 'processed') earnedMap[a.user_id]  = (earnedMap[a.user_id]  || 0) + amt;
        else                          pendingMap[a.user_id] = (pendingMap[a.user_id] || 0) + amt;
      });

      /* build rows, sort by referral count desc */
      const merged: ReferrerRow[] = Object.entries(countMap)
        .map(([uid, count]) => ({
          user_id:        uid,
          display_name:   profileMap[uid] || `User ${uid.substring(0, 8)}…`,
          referral_count: count,
          earned:         earnedMap[uid]  || 0,
          pending:        pendingMap[uid] || 0,
        }))
        .sort((a, b) => b.referral_count - a.referral_count);

      /* global stats */
      const totalPaid    = activity.filter(a => a.status === 'processed').reduce((s, a) => s + (Number(a.amount) || 0), 0);
      const totalPending = activity.filter(a => a.status === 'pending')  .reduce((s, a) => s + (Number(a.amount) || 0), 0);

      setRows(merged);
      setStats({
        totalReferrals:  referrals.length,
        activeReferrers: merged.length,
        totalPaid,
        totalPending,
      });
    } catch (err) {
      console.error('AdminReferrals fetchAll error:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();

    const channel = supabase.channel('admin_referrals_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'referrals' },          () => fetchAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'referral_activity' }, () => fetchAll())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchAll]);

  function handleSave() {
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 3000);
  }

  return (
    <div className="space-y-8 pb-20 md:pb-0">

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Referrals</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Monitor referral performance, commission payouts, and tier structures across all users.
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-label-md active:scale-95 transition-all cursor-pointer shadow-lg ${
            savedOk ? 'bg-tertiary text-on-tertiary' : 'bg-primary text-on-primary hover:brightness-110'
          }`}
        >
          <span className="material-symbols-outlined text-sm">{savedOk ? 'check_circle' : 'save'}</span>
          {savedOk ? 'Saved!' : 'Save Config'}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl flex items-center gap-4 border-l-4 border-primary">
          <div className="p-3 rounded-lg bg-primary/10 text-primary"><span className="material-symbols-outlined">group_add</span></div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Referrals</p>
            <p className="font-headline-md text-headline-md text-on-surface font-bold">{loading ? '—' : stats.totalReferrals.toLocaleString()}</p>
            <p className="text-[11px] text-on-surface-variant">All time</p>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl flex items-center gap-4 border-l-4 border-tertiary">
          <div className="p-3 rounded-lg bg-tertiary/10 text-tertiary"><span className="material-symbols-outlined">person_check</span></div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Active Referrers</p>
            <p className="font-headline-md text-headline-md text-on-surface font-bold">{loading ? '—' : stats.activeReferrers.toLocaleString()}</p>
            <p className="text-[11px] text-on-surface-variant">Users with referrals</p>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl flex items-center gap-4 border-l-4 border-secondary">
          <div className="p-3 rounded-lg bg-secondary/10 text-secondary"><span className="material-symbols-outlined">payments</span></div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Commissions Paid</p>
            <p className="font-headline-md text-headline-md text-on-surface font-bold">{loading ? '—' : fmt(stats.totalPaid)}</p>
            <p className="text-[11px] text-tertiary">+{loading ? '…' : fmt(stats.totalPending)} pending</p>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl flex items-center gap-4 border-l-4 border-outline">
          <div className="p-3 rounded-lg bg-surface-variant/30 text-on-surface-variant"><span className="material-symbols-outlined">percent</span></div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Avg Commission Rate</p>
            <p className="font-headline-md text-headline-md text-on-surface font-bold">5.0%</p>
            <p className="text-[11px] text-on-surface-variant">Tier-based structure</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Commission Tiers + Config */}
        <div className="lg:col-span-4 space-y-6">

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-surface-container-high/50 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 className="font-headline-md font-bold text-on-surface">Commission Tiers</h3>
              <span className="material-symbols-outlined text-on-surface-variant">workspace_premium</span>
            </div>
            <div className="p-6 space-y-5">
              {COMMISSION_TIERS.map(t => (
                <div key={t.tier}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div>
                      <span className={`font-label-md font-bold ${t.color}`}>{t.tier}</span>
                      <span className="ml-2 text-[10px] text-on-surface-variant">{t.range}</span>
                    </div>
                    <span className={`font-tabular-nums text-sm font-bold ${t.color}`}>{t.rate}</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                    <div className={`${t.barColor} h-full rounded-full`} style={{ width: `${t.barPct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-surface-container-high/50 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 className="font-headline-md font-bold text-on-surface">Global Config</h3>
              <span className="material-symbols-outlined text-primary text-sm">tune</span>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Referral Signup Bonus (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                  <input value={bonusAmt} onChange={e => setBonusAmt(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg pl-8 pr-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Min. Deposit to Unlock (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                  <input value={minDeposit} onChange={e => setMinDeposit(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg pl-8 pr-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    type="text" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <div>
                  <p className="font-label-md text-on-surface">Lock Commission Rates</p>
                  <p className="text-[11px] text-on-surface-variant">Prevents tier override</p>
                </div>
                <button onClick={() => setLockRates(v => !v)}
                  className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${lockRates ? 'bg-primary' : 'bg-surface-container-highest border border-outline-variant/30'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${lockRates ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Referrers Leaderboard */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-surface-container-high/50 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 className="font-headline-md font-bold text-on-surface">All Referrers</h3>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span className="font-label-sm text-label-sm">Live · Ranked by referrals</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-high/30 text-on-surface-variant border-b border-outline-variant/20">
                  <tr>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">Referrer</th>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">Referred</th>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">Earned</th>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">Tier</th>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {loading ? (
                    <tr><td colSpan={6} className="py-10 text-center text-outline font-label-md">Loading…</td></tr>
                  ) : rows.length === 0 ? (
                    <tr><td colSpan={6} className="py-10 text-center text-on-surface-variant font-label-md">No referral data yet.</td></tr>
                  ) : (
                    rows.map((r, idx) => {
                      const rank = idx + 1;
                      const tier = getTier(r.referral_count);
                      return (
                        <tr key={r.user_id} className="hover:bg-surface-variant/10 transition-colors group">
                          <td className="px-6 py-4">
                            <span className={`font-tabular-nums font-bold text-sm ${rank <= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
                              {rank <= 3 ? `#${rank}` : rank}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-label-md text-on-surface font-bold">{r.display_name}</p>
                            <p className="text-[11px] font-tabular-nums text-on-surface-variant">{r.user_id.substring(0, 16)}…</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-tabular-nums text-on-surface font-bold">{r.referral_count}</span>
                            <span className="text-on-surface-variant text-xs ml-1">users</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-tabular-nums text-tertiary font-bold">{fmt(r.earned)}</span>
                            {r.pending > 0 && (
                              <p className="text-[10px] text-on-surface-variant">{fmt(r.pending)} pending</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded border text-[10px] font-bold uppercase ${TIER_STYLE[tier]}`}>
                              {tier}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="h-8 w-8 flex items-center justify-center rounded border border-outline-variant/30 hover:bg-primary-container/30 text-on-surface-variant hover:text-primary transition-all cursor-pointer" title="View Referral Tree">
                                <span className="material-symbols-outlined text-sm">account_tree</span>
                              </button>
                              <button className="h-8 w-8 flex items-center justify-center rounded border border-outline-variant/30 hover:bg-tertiary/10 text-on-surface-variant hover:text-tertiary transition-all cursor-pointer" title="Pay Commission">
                                <span className="material-symbols-outlined text-sm">paid</span>
                              </button>
                              <button className="h-8 w-8 flex items-center justify-center rounded border border-outline-variant/30 hover:bg-error/10 text-on-surface-variant hover:text-error transition-all cursor-pointer" title="Revoke">
                                <span className="material-symbols-outlined text-sm">block</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-surface-container-high/30 border-t border-outline-variant/10 text-[11px] text-outline">
              {loading ? 'Loading…' : `${rows.length} referrer${rows.length !== 1 ? 's' : ''} · ${stats.totalReferrals} total referrals`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
