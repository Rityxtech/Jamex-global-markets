import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

/* ── types ── */
interface PendingTx {
  id: string;
  user_id: string;
  display_name: string;
  amount: number;
  asset: string;
  destination_address: string | null;
  created_at: string;
}

interface FlowBucket {
  label: string;
  depRaw: number;
  witRaw: number;
  depPct: number;
  witPct: number;
}

interface Liquidity {
  totalDeposited: number;
  totalProfit: number;
  pendingWithdrawalAmt: number;
}

/* ── helpers ── */
const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

function build24hBuckets(txs: { type: string; amount: number; created_at: string }[]): FlowBucket[] {
  const now = Date.now();
  const buckets: FlowBucket[] = Array.from({ length: 6 }, (_, i) => {
    const startMs = now - (6 - i) * 4 * 3600_000;
    const h = new Date(startMs).getUTCHours();
    return { label: `${String(h).padStart(2, '0')}:00`, depRaw: 0, witRaw: 0, depPct: 0, witPct: 0 };
  });

  txs.forEach(tx => {
    const age = now - new Date(tx.created_at).getTime();
    const bucket = Math.floor((now - new Date(tx.created_at).getTime()) / (4 * 3600_000));
    const idx = 5 - bucket;
    if (idx < 0 || idx > 5) return;
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'deposit') buckets[idx].depRaw += amt;
    else if (tx.type === 'withdrawal') buckets[idx].witRaw += amt;
  });

  const maxVal = Math.max(...buckets.flatMap(b => [b.depRaw, b.witRaw]), 1);
  buckets.forEach(b => {
    b.depPct = Math.round((b.depRaw / maxVal) * 100);
    b.witPct = Math.round((b.witRaw / maxVal) * 100);
  });
  return buckets;
}

export default function AdminFinancials() {
  const [queue, setQueue] = useState<PendingTx[]>([]);
  const [liquidity, setLiquidity] = useState<Liquidity>({ totalDeposited: 0, totalProfit: 0, pendingWithdrawalAmt: 0 });
  const [chart, setChart] = useState<FlowBucket[]>(build24hBuckets([]));
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const since24h = new Date(Date.now() - 86_400_000).toISOString();

      const [walletRes, pendingRes, flowRes, profileRes] = await Promise.all([
        supabase.from('wallets').select('main_balance, profit_balance'),
        supabase.from('transactions').select('id, user_id, amount, asset, destination_address, created_at')
          .eq('type', 'withdrawal').eq('status', 'pending').order('created_at', { ascending: true }),
        supabase.from('transactions').select('type, amount, created_at')
          .in('type', ['deposit', 'withdrawal']).gte('created_at', since24h),
        supabase.from('profiles').select('id, full_name'),
      ]);

      /* liquidity */
      const wallets = walletRes.data || [];
      const totalDeposited = wallets.reduce((s, w) => s + (Number(w.main_balance) || 0), 0);
      const totalProfit = wallets.reduce((s, w) => s + (Number(w.profit_balance) || 0), 0);
      const pending = pendingRes.data || [];
      const pendingWithdrawalAmt = pending.reduce((s, t) => s + (Number(t.amount) || 0), 0);
      setLiquidity({ totalDeposited, totalProfit, pendingWithdrawalAmt });

      /* chart */
      setChart(build24hBuckets(flowRes.data || []));

      /* withdrawal queue — enrich with profile names */
      const profileMap: Record<string, string> = {};
      (profileRes.data || []).forEach((p: any) => { if (p.id) profileMap[p.id] = p.full_name || ''; });

      setQueue(pending.map(t => ({
        id: t.id,
        user_id: t.user_id,
        display_name: profileMap[t.user_id] || `User ${t.user_id.substring(0, 8)}…`,
        amount: Number(t.amount) || 0,
        asset: t.asset || 'USD',
        destination_address: t.destination_address,
        created_at: t.created_at,
      })));
    } catch (err) {
      console.error('AdminFinancials fetchAll error:', err);
    }
    setLoading(false);
  }, []);

  /* initial fetch + realtime subscription */
  useEffect(() => {
    fetchAll();

    const channel = supabase.channel('financials_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets' }, () => fetchAll())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchAll]);

  /* approve / reject */
  async function handleAction(id: string, action: 'approve' | 'reject') {
    setProcessingId(id);
    const newStatus = action === 'approve' ? 'completed' : 'failed';
    const { error } = await supabase.from('transactions').update({ status: newStatus }).eq('id', id);
    if (error) console.error('handleAction error:', error.message);
    setProcessingId(null);
    /* realtime will trigger fetchAll automatically; also remove optimistically */
    setQueue(q => q.filter(t => t.id !== id));
  }

  const pendingCount = queue.length;

  return (
    <div className="space-y-8 pb-20 md:pb-0">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Financial Monitoring</h1>
          <p className="text-on-surface-variant font-label-md">Withdrawal Oversight & Platform Liquidity</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-sm text-label-sm uppercase text-outline">Live · Realtime</span>
          </div>
        </div>
      </div>

      {/* Liquidity + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Liquidity Overview */}
        <div className="lg:col-span-1 glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="bg-surface-container-high/50 px-6 py-3 flex justify-between items-center border-b border-outline-variant/20">
            <h3 className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Platform Liquidity</h3>
            <span className="material-symbols-outlined text-primary text-[18px]">account_balance</span>
          </div>
          <div className="p-6 space-y-4 flex-1">
            {/* Total Deposited */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
              <div className="flex justify-between items-start mb-2">
                <span className="text-outline font-label-sm">Total User Deposits</span>
                <span className="text-tertiary font-label-sm">Main Wallets</span>
              </div>
              <div className="text-headline-md font-headline-md text-on-surface">
                {loading ? '—' : fmt(liquidity.totalDeposited)}
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-3">
                <div className="bg-primary h-full transition-all" style={{ width: liquidity.totalDeposited > 0 ? '100%' : '0%' }} />
              </div>
            </div>
            {/* Profit Pool */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
              <div className="flex justify-between items-start mb-2">
                <span className="text-outline font-label-sm">Profit Pool Payable</span>
                <span className="text-outline font-label-sm">Profit Wallets</span>
              </div>
              <div className="text-headline-md font-headline-md text-on-surface">
                {loading ? '—' : fmt(liquidity.totalProfit)}
              </div>
            </div>
            {/* Pending Withdrawals */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-error/20">
              <div className="flex justify-between items-start mb-2">
                <span className="text-outline font-label-sm">Pending Withdrawals</span>
                <span className="text-error font-label-sm">{pendingCount} queued</span>
              </div>
              <div className="text-headline-md font-headline-md text-error">
                {loading ? '—' : fmt(liquidity.pendingWithdrawalAmt)}
              </div>
            </div>
          </div>
        </div>

        {/* 24H Flow Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="bg-surface-container-high/50 px-6 py-3 flex justify-between items-center border-b border-outline-variant/20">
            <h3 className="font-label-sm text-label-sm uppercase tracking-wider text-outline">24H Flow Analysis</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-primary rounded-sm"></div>
                <span className="text-[12px] text-outline">Deposits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-tertiary rounded-sm"></div>
                <span className="text-[12px] text-outline">Withdrawals</span>
              </div>
            </div>
          </div>
          <div className="p-6 flex-1 flex items-end justify-between gap-2 min-h-[200px]">
            {chart.map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center gap-1 items-end h-32">
                  <div
                    className="bg-primary/50 hover:bg-primary w-1/3 rounded-t-sm transition-all"
                    style={{ height: `${Math.max(col.depPct, 2)}%` }}
                    title={`Deposits: ${fmt(col.depRaw)}`}
                  />
                  <div
                    className="bg-tertiary/50 hover:bg-tertiary w-1/3 rounded-t-sm transition-all"
                    style={{ height: `${Math.max(col.witPct, 2)}%` }}
                    title={`Withdrawals: ${fmt(col.witRaw)}`}
                  />
                </div>
                <span className="text-[10px] text-outline">{col.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Withdrawals Queue */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="bg-surface-container-high/50 px-6 py-4 flex justify-between items-center border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <h3 className="font-body-lg text-on-surface">Pending Withdrawals Queue</h3>
            {pendingCount > 0 && (
              <span className="bg-error-container text-on-error-container text-[11px] px-2 py-0.5 rounded-full font-bold">
                {pendingCount} ACTION REQUIRED
              </span>
            )}
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-1.5 bg-surface-container-highest text-on-surface-variant px-3 py-1.5 rounded text-label-sm border border-outline-variant/30 hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/30 border-b border-outline-variant/20">
                <th className="px-6 py-4 text-outline font-label-sm uppercase tracking-wider">User</th>
                <th className="px-4 py-4 text-outline font-label-sm uppercase tracking-wider">Amount</th>
                <th className="px-4 py-4 text-outline font-label-sm uppercase tracking-wider">Asset</th>
                <th className="px-4 py-4 text-outline font-label-sm uppercase tracking-wider">Destination</th>
                <th className="px-4 py-4 text-outline font-label-sm uppercase tracking-wider">Submitted</th>
                <th className="px-4 py-4 text-outline font-label-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-10 text-center text-outline font-label-md">Loading…</td></tr>
              ) : queue.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-on-surface-variant font-label-md">No pending withdrawals requiring attention.</td></tr>
              ) : (
                queue.map(row => (
                  <tr
                    key={row.id}
                    className={`border-b border-outline-variant/10 hover:bg-surface-container-high/20 transition-all duration-300 ${processingId === row.id ? 'opacity-40' : 'opacity-100'}`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] text-outline">person</span>
                        </div>
                        <div>
                          <div className="text-on-surface font-label-md">{row.display_name}</div>
                          <div className="text-outline text-[11px] font-tabular-nums">{row.id.substring(0, 8)}…</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className="text-on-surface font-tabular-nums font-bold">{fmt(row.amount)}</span>
                    </td>
                    <td className="px-4 py-5">
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[11px] font-bold border border-outline-variant/20 uppercase">
                        {row.asset}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <span className="text-outline text-[12px] font-tabular-nums">
                        {row.destination_address
                          ? `${row.destination_address.substring(0, 12)}…`
                          : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <span className="text-outline text-[12px]">{fmtDate(row.created_at)}</span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(row.id, 'reject')}
                          disabled={processingId !== null}
                          title="Reject"
                          className="bg-error/20 text-error p-1.5 rounded-lg hover:bg-error/30 transition-all border border-error/30 cursor-pointer disabled:opacity-50 flex items-center justify-center"
                        >
                          <span className={`material-symbols-outlined text-[18px] ${processingId === row.id ? 'animate-spin' : ''}`}>
                            {processingId === row.id ? 'sync' : 'close'}
                          </span>
                        </button>
                        <button
                          onClick={() => handleAction(row.id, 'approve')}
                          disabled={processingId !== null}
                          title="Approve"
                          className="bg-tertiary/20 text-tertiary p-1.5 rounded-lg hover:bg-tertiary/30 transition-all border border-tertiary/30 cursor-pointer disabled:opacity-50 flex items-center justify-center"
                        >
                          <span className={`material-symbols-outlined text-[18px] ${processingId === row.id ? 'animate-spin' : ''}`}>
                            {processingId === row.id ? 'sync' : 'check'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-surface-container-high/30 border-t border-outline-variant/10 text-[11px] text-outline">
          {loading ? 'Loading…' : `Showing all ${pendingCount} pending withdrawal${pendingCount !== 1 ? 's' : ''}`}
        </div>
      </div>

    </div>
  );
}
