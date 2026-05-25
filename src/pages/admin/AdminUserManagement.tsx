import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

/* ── types ── */
interface AdminUser {
  user_id: string;
  display_name: string;
  kyc_status: 'approved' | 'pending' | 'rejected' | 'none';
  main_balance: number;
  profit_balance: number;
  country: string | null;
  kyc_date: string | null;
}

interface Stats {
  total: number;
  verified: number;
  pending: number;
  avgPortfolio: number;
}

/* ── helpers ── */
function fmtMoney(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ── sub-components ── */
function KycBadge({ status }: { status: AdminUser['kyc_status'] }) {
  if (status === 'approved') return (
    <div className="flex items-center text-tertiary">
      <span className="material-symbols-outlined text-sm mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      <span className="font-label-sm text-label-sm">Approved</span>
    </div>
  );
  if (status === 'pending') return (
    <div className="flex items-center text-primary">
      <span className="material-symbols-outlined text-sm mr-1">history</span>
      <span className="font-label-sm text-label-sm">Pending</span>
    </div>
  );
  if (status === 'rejected') return (
    <div className="flex items-center text-error">
      <span className="material-symbols-outlined text-sm mr-1">cancel</span>
      <span className="font-label-sm text-label-sm">Rejected</span>
    </div>
  );
  return (
    <div className="flex items-center text-outline">
      <span className="material-symbols-outlined text-sm mr-1">person_off</span>
      <span className="font-label-sm text-label-sm">No KYC</span>
    </div>
  );
}

const PAGE_SIZE = 10;

export default function AdminUserManagement() {
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, verified: 0, pending: 0, avgPortfolio: 0 });
  const [loading, setLoading] = useState(true);

  /* filters */
  const [kycFilter, setKycFilter] = useState('all');
  const [minBalance, setMinBalance] = useState('');
  const [maxBalance, setMaxBalance] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [kycDateFrom, setKycDateFrom] = useState('');

  /* pagination */
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [profileRes, kycRes, walletRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name'),
        supabase.from('kyc_submissions').select('user_id, first_name, last_name, status, country, submitted_at'),
        supabase.from('wallets').select('user_id, main_balance, profit_balance'),
      ]);

      const profiles = profileRes.data || [];
      const kycs = kycRes.data || [];
      const wallets = walletRes.data || [];

      /* build lookup maps */
      const profileMap: Record<string, string> = {};
      profiles.forEach(p => { if (p.id && p.full_name) profileMap[p.id] = p.full_name; });

      const kycMap: Record<string, typeof kycs[0]> = {};
      kycs.forEach(k => { kycMap[k.user_id] = k; });

      const walletMap: Record<string, typeof wallets[0]> = {};
      wallets.forEach(w => { walletMap[w.user_id] = w; });

      /* union all known user IDs from every source */
      const allIds = new Set<string>([
        ...profiles.map(p => p.id),
        ...kycs.map(k => k.user_id),
        ...wallets.map(w => w.user_id),
      ]);

      /* merge into AdminUser[] */
      const merged: AdminUser[] = Array.from(allIds).map(uid => {
        const kyc = kycMap[uid];
        const wallet = walletMap[uid];
        let display_name = profileMap[uid] || '';
        if (!display_name && kyc) display_name = `${kyc.first_name} ${kyc.last_name}`.trim();
        if (!display_name) display_name = `User ${uid.substring(0, 8)}…`;

        return {
          user_id: uid,
          display_name,
          kyc_status: (kyc?.status as AdminUser['kyc_status']) || 'none',
          main_balance: Number(wallet?.main_balance) || 0,
          profit_balance: Number(wallet?.profit_balance) || 0,
          country: kyc?.country || null,
          kyc_date: kyc?.submitted_at || null,
        };
      });

      /* compute stats */
      const verified = merged.filter(u => u.kyc_status === 'approved').length;
      const pending = merged.filter(u => u.kyc_status === 'pending').length;
      const totalPortfolio = merged.reduce((s, u) => s + u.main_balance + u.profit_balance, 0);
      const avgPortfolio = merged.length > 0 ? totalPortfolio / merged.length : 0;

      setAllUsers(merged);
      setStats({ total: merged.length, verified, pending, avgPortfolio });
    } catch (err) {
      console.error('fetchData error:', err);
    }
    setLoading(false);
  }

  function resetFilters() {
    setKycFilter('all');
    setMinBalance('');
    setMaxBalance('');
    setCountryFilter('');
    setKycDateFrom('');
    setPage(1);
  }

  /* ── filtered + paginated ── */
  const filtered = useMemo(() => {
    return allUsers.filter(u => {
      if (kycFilter !== 'all' && u.kyc_status !== kycFilter) return false;
      const total = u.main_balance + u.profit_balance;
      if (minBalance !== '' && total < Number(minBalance)) return false;
      if (maxBalance !== '' && total > Number(maxBalance)) return false;
      if (countryFilter.trim() && !(u.country || '').toLowerCase().includes(countryFilter.toLowerCase())) return false;
      if (kycDateFrom && u.kyc_date && u.kyc_date < kycDateFrom) return false;
      return true;
    });
  }, [allUsers, kycFilter, minBalance, maxBalance, countryFilter, kycDateFrom]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageUsers = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-8 pb-20 md:pb-0">

      {/* ── Stats Header ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-1">User Directory</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {loading ? 'Loading…' : `Managing ${stats.total.toLocaleString()} registered user${stats.total !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-xl flex items-center space-x-4 border-l-4 border-tertiary">
            <div className="bg-tertiary/10 p-3 rounded-lg text-tertiary">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Verified Users</p>
              <p className="font-headline-md text-headline-md text-on-surface font-bold">
                {loading ? '—' : stats.verified.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl flex items-center space-x-4 border-l-4 border-error">
            <div className="bg-error/10 p-3 rounded-lg text-error">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">KYC Pending</p>
              <p className="font-headline-md text-headline-md text-on-surface font-bold">
                {loading ? '—' : stats.pending.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl flex items-center space-x-4 border-l-4 border-primary">
            <div className="bg-primary/10 p-3 rounded-lg text-primary">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Avg. Portfolio</p>
              <p className="font-headline-md text-headline-md text-on-surface font-bold">
                {loading ? '—' : fmtMoney(stats.avgPortfolio)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <section className="glass-card rounded-xl overflow-hidden">
        <div className="px-6 py-3 flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-high/50">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-primary text-xl">filter_list</span>
            <span className="font-label-md text-label-md font-bold text-on-surface">Filters</span>
          </div>
          <button onClick={resetFilters} className="text-primary font-label-sm text-label-sm hover:underline cursor-pointer">
            Reset All
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* KYC Status */}
          <div className="space-y-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">KYC Status</label>
            <select
              value={kycFilter}
              onChange={e => { setKycFilter(e.target.value); setPage(1); }}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none text-on-surface"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="none">No KYC</option>
            </select>
          </div>
          {/* Country */}
          <div className="space-y-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Country</label>
            <input
              value={countryFilter}
              onChange={e => { setCountryFilter(e.target.value); setPage(1); }}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 text-sm outline-none text-on-surface focus:border-primary transition-colors"
              placeholder="e.g. Nigeria"
              type="text"
            />
          </div>
          {/* Balance Range */}
          <div className="space-y-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Balance Range (USD)</label>
            <div className="flex items-center space-x-2">
              <input
                value={minBalance}
                onChange={e => { setMinBalance(e.target.value); setPage(1); }}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 text-xs outline-none text-on-surface focus:border-primary transition-colors"
                placeholder="Min"
                type="number"
                min="0"
              />
              <span className="text-on-surface-variant shrink-0">—</span>
              <input
                value={maxBalance}
                onChange={e => { setMaxBalance(e.target.value); setPage(1); }}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 text-xs outline-none text-on-surface focus:border-primary transition-colors"
                placeholder="Max"
                type="number"
                min="0"
              />
            </div>
          </div>
          {/* KYC Submitted From */}
          <div className="space-y-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">KYC Date From</label>
            <input
              value={kycDateFrom}
              onChange={e => { setKycDateFrom(e.target.value); setPage(1); }}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 text-xs outline-none text-on-surface focus:border-primary transition-colors"
              type="date"
            />
          </div>
        </div>
      </section>

      {/* ── User Table ── */}
      <section className="glass-card rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-surface-container-high/80 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant/20">User</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant/20">Country</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant/20">KYC Status</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant/20">Wallet Balance</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant/20">KYC Date</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant/20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-outline font-label-md">Loading users…</td>
                </tr>
              ) : pageUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant font-label-md">No users match the current filters</td>
                </tr>
              ) : (
                pageUsers.map(user => (
                  <tr
                    key={user.user_id}
                    onClick={() => navigate(`/admin/users/${user.user_id}`)}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary">person</span>
                        </div>
                        <div>
                          <p className="font-label-md text-label-md text-on-surface font-bold">{user.display_name}</p>
                          <p className="text-[11px] font-tabular-nums text-on-surface-variant">{user.user_id.substring(0, 16)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{user.country || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <KycBadge status={user.kyc_status} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-tabular-nums text-label-md text-on-surface">{fmtMoney(user.main_balance + user.profit_balance)}</p>
                      <p className="text-[10px] text-on-surface-variant opacity-60">
                        Main: {fmtMoney(user.main_balance)} · Profit: {fmtMoney(user.profit_balance)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{fmtDate(user.kyc_date)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/admin/users/${user.user_id}`); }}
                          className="h-8 w-8 flex items-center justify-center rounded border border-outline-variant/30 hover:bg-primary-container text-on-surface-variant hover:text-on-primary-container transition-all active:scale-95 cursor-pointer"
                          title="View KYC"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                        <button
                          onClick={e => e.stopPropagation()}
                          className="h-8 w-8 flex items-center justify-center rounded border border-outline-variant/30 hover:bg-tertiary-container text-on-surface-variant hover:text-on-tertiary-container transition-all active:scale-95 cursor-pointer"
                          title="Adjust Balance"
                        >
                          <span className="material-symbols-outlined text-lg">currency_exchange</span>
                        </button>
                        <button
                          onClick={e => e.stopPropagation()}
                          className="h-8 w-8 flex items-center justify-center rounded border border-outline-variant/30 hover:bg-error/20 text-on-surface-variant hover:text-error transition-all active:scale-95 cursor-pointer"
                          title="Suspend"
                        >
                          <span className="material-symbols-outlined text-lg">block</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Footer ── */}
        <div className="px-6 py-4 bg-surface-container-highest/20 border-t border-outline-variant/20 flex items-center justify-between flex-wrap gap-3">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            {loading ? 'Loading…' : `Showing ${filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length} user${filtered.length !== 1 ? 's' : ''}`}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-3 py-1 border border-outline-variant/30 rounded text-on-surface-variant hover:bg-surface-variant/20 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-default"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
              .reduce<(number | '…')[]>((acc, n, i, arr) => {
                if (i > 0 && (n as number) - (arr[i - 1] as number) > 1) acc.push('…');
                acc.push(n);
                return acc;
              }, [])
              .map((n, i) =>
                n === '…' ? (
                  <span key={`ellipsis-${i}`} className="text-on-surface-variant px-1">…</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setPage(n as number)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                      safePage === n
                        ? 'bg-primary text-on-primary'
                        : 'border border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant/20'
                    }`}
                  >
                    {n}
                  </button>
                )
              )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-3 py-1 border border-outline-variant/30 rounded text-on-surface-variant hover:bg-surface-variant/20 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-default"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
