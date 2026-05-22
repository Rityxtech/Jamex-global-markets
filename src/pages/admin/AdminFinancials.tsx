import React, { useState } from 'react';

const withdrawals = [
  {
    id: '8829-0122',
    user: 'Erik.V_99',
    userIcon: 'person',
    userIconBg: 'bg-error-container/30 text-error border-error/20',
    amount: '2.450000 BTC',
    usdValue: '$164,150.00 USD',
    network: 'Bitcoin SegWit',
    networkColor: 'bg-primary',
    riskScore: 94,
    riskLabel: 'CRITICAL RISK',
    riskColor: 'text-error bg-error/10 border-error/30',
  },
  {
    id: '1044-9921',
    user: 'Sarah_Institutional',
    userIcon: 'person',
    userIconBg: 'bg-surface-container-highest text-outline border-outline-variant/20',
    amount: '50,000.00 USDT',
    usdValue: '$50,000.00 USD',
    network: 'TRC-20 (Tron)',
    networkColor: 'bg-tertiary',
    riskScore: 42,
    riskLabel: 'ELEVATED',
    riskColor: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  },
  {
    id: '0021-X99',
    user: 'Apex_Trust_LLC',
    userIcon: 'person',
    userIconBg: 'bg-surface-container-highest text-outline border-outline-variant/20',
    amount: '12.000000 ETH',
    usdValue: '$29,280.00 USD',
    network: 'Ethereum (ERC-20)',
    networkColor: 'bg-secondary',
    riskScore: 8,
    riskLabel: 'NOMINAL',
    riskColor: 'text-tertiary bg-tertiary/10 border-tertiary/30',
  },
  {
    id: '9911-3821',
    user: 'Anonymous_Whale',
    userIcon: 'warning',
    userIconBg: 'bg-error-container/30 text-error border-error/20',
    amount: '450,000.00 USDC',
    usdValue: '$449,982.00 USD',
    network: 'Ethereum (ERC-20)',
    networkColor: 'bg-secondary',
    riskScore: 88,
    riskLabel: 'VELOCITY ALERT',
    riskColor: 'text-error bg-error/10 border-error/30',
  },
];

export default function AdminFinancials() {
  const [rows, setRows] = useState(withdrawals);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setProcessingId(id);
    // Simulate API delay
    setTimeout(() => {
      setRows((current) => current.filter((r) => r.id !== id));
      setProcessingId(null);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Financial Monitoring</h1>
          <p className="text-on-surface-variant font-label-md">Institutional Withdrawal Oversight & Liquidity Management</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-sm text-label-sm uppercase text-outline">Network Status: Nominal</span>
          </div>
        </div>
      </div>

      {/* Dashboard Grid (Liquidity & Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liquidity Overview */}
        <div className="lg:col-span-1 glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="bg-surface-container-high/50 px-card-padding py-3 flex justify-between items-center border-b border-outline-variant/20">
            <h3 className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Platform Liquidity</h3>
            <span className="material-symbols-outlined text-primary text-[18px]">account_balance</span>
          </div>
          <div className="p-card-padding space-y-4 flex-1">
            {/* Hot Wallet */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
              <div className="flex justify-between items-start mb-2">
                <span className="text-outline font-label-sm">Hot Wallet (Ops)</span>
                <span className="text-tertiary font-tabular-nums text-label-md">92% Target</span>
              </div>
              <div className="text-headline-md font-headline-md text-on-surface mb-1">
                $4,821,090.<span className="text-on-surface-variant text-[16px]">45</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-3">
                <div className="bg-primary h-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            {/* Cold Storage */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
              <div className="flex justify-between items-start mb-2">
                <span className="text-outline font-label-sm">Cold Storage (Vault)</span>
                <span className="text-outline font-tabular-nums text-label-md">Secure</span>
              </div>
              <div className="text-headline-md font-headline-md text-on-surface mb-1">
                $212,492,000.<span className="text-on-surface-variant text-[16px]">00</span>
              </div>
              <div className="flex gap-2 mt-3">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-outline border border-outline-variant/20">MULTI-SIG</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-outline border border-outline-variant/20">AIR-GAPPED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Volume Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="bg-surface-container-high/50 px-card-padding py-3 flex justify-between items-center border-b border-outline-variant/20">
            <h3 className="font-label-sm text-label-sm uppercase tracking-wider text-outline">24H Flow Analysis (Deposits vs Withdrawals)</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-sm"></div>
                <span className="text-[12px] text-outline">Deposits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-tertiary rounded-sm"></div>
                <span className="text-[12px] text-outline">Withdrawals</span>
              </div>
            </div>
          </div>
          <div className="p-card-padding flex-1 flex items-end justify-between gap-2 min-h-[200px]">
            {/* Simple CSS Bar Chart */}
            {[
              { time: '00:00', dep: 60, wit: 45, strong: false },
              { time: '04:00', dep: 80, wit: 30, strong: false },
              { time: '08:00', dep: 90, wit: 50, strong: false },
              { time: '12:00', dep: 100, wit: 40, strong: true },
              { time: '16:00', dep: 75, wit: 85, strong: false },
              { time: '20:00', dep: 50, wit: 60, strong: false },
              { time: '23:59', dep: 20, wit: 10, strong: false },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center gap-1 items-end h-32">
                  <div className={`${col.strong ? 'bg-primary' : 'bg-primary/40'} w-1/3 rounded-t-sm transition-all hover:bg-primary`} style={{ height: `${col.dep}%` }}></div>
                  <div className={`${col.strong ? 'bg-tertiary' : 'bg-tertiary/40'} w-1/3 rounded-t-sm transition-all hover:bg-tertiary`} style={{ height: `${col.wit}%` }}></div>
                </div>
                <span className={`text-[10px] ${col.strong ? 'text-outline font-bold' : 'text-outline'}`}>{col.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Withdrawals Queue */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="bg-surface-container-high/50 px-card-padding py-4 flex justify-between items-center border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <h3 className="font-headline-md text-body-lg text-on-surface">Pending Withdrawals Queue</h3>
            <span className="bg-error-container text-on-error-container text-[11px] px-2 py-0.5 rounded-full font-bold">
              {rows.length} ACTION REQUIRED
            </span>
          </div>
          <div className="flex gap-2">
            <button className="bg-surface-container-highest text-on-surface-variant px-3 py-1.5 rounded text-label-sm border border-outline-variant/30 hover:text-on-surface transition-colors cursor-pointer">
              Export CSV
            </button>
            <button className="bg-primary-container text-on-primary-container px-3 py-1.5 rounded text-label-sm hover:brightness-110 transition-all cursor-pointer">
              Bulk Approve
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/30 border-b border-outline-variant/20">
                <th className="px-card-padding py-4 text-outline font-label-sm uppercase tracking-wider">User / ID</th>
                <th className="px-4 py-4 text-outline font-label-sm uppercase tracking-wider">Amount & Asset</th>
                <th className="px-4 py-4 text-outline font-label-sm uppercase tracking-wider">Network</th>
                <th className="px-4 py-4 text-outline font-label-sm uppercase tracking-wider text-center">Risk Score</th>
                <th className="px-4 py-4 text-outline font-label-sm uppercase tracking-wider">Approval Workflow</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-outline-variant/10 hover:bg-surface-container-high/20 transition-all duration-500 ${
                    processingId === row.id ? 'opacity-50 scale-[0.98]' : 'opacity-100'
                  }`}
                >
                  <td className="px-card-padding py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center border ${row.userIconBg}`}>
                        <span className="material-symbols-outlined text-[18px]">{row.userIcon}</span>
                      </div>
                      <div>
                        <div className="text-on-surface font-label-md">{row.user}</div>
                        <div className="text-outline text-[11px] font-tabular-nums">ID: {row.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="text-on-surface font-tabular-nums font-bold">{row.amount}</div>
                    <div className="text-outline text-[11px]">{row.usdValue}</div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${row.networkColor}`}></span>
                      <span className="text-on-surface-variant text-label-sm">{row.network}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex flex-col items-center">
                      <div className={`px-2 py-0.5 rounded border text-[11px] font-bold mb-1 ${row.riskColor}`}>
                        {row.riskScore}/100
                      </div>
                      <div className="text-[9px] text-outline uppercase">{row.riskLabel}</div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2">
                      <input
                        className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-[12px] px-2 py-1.5 w-40 focus:border-primary focus:ring-1 focus:ring-primary/20 text-on-surface outline-none transition-all"
                        placeholder="Internal comment..."
                        type="text"
                      />
                      <button
                        onClick={() => handleAction(row.id, 'reject')}
                        disabled={processingId !== null}
                        className="bg-error/20 text-error p-1.5 rounded-lg hover:bg-error/30 transition-all border border-error/30 cursor-pointer disabled:opacity-50 flex items-center justify-center"
                      >
                        <span className={`material-symbols-outlined text-[18px] ${processingId === row.id ? 'animate-spin' : ''}`}>
                          {processingId === row.id ? 'sync' : 'close'}
                        </span>
                      </button>
                      <button
                        onClick={() => handleAction(row.id, 'approve')}
                        disabled={processingId !== null}
                        className="bg-tertiary/20 text-tertiary p-1.5 rounded-lg hover:bg-tertiary/30 transition-all border border-tertiary/30 cursor-pointer disabled:opacity-50 flex items-center justify-center"
                      >
                        <span className={`material-symbols-outlined text-[18px] ${processingId === row.id ? 'animate-spin' : ''}`}>
                          {processingId === row.id ? 'sync' : 'check'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant font-label-md">
                    No pending withdrawals requiring attention.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-card-padding py-3 bg-surface-container-high/30 flex justify-between items-center text-[11px] text-outline border-t border-outline-variant/10">
          <span>Showing {rows.length} of 128 pending requests</span>
          <div className="flex gap-4">
            <button className="hover:text-primary transition-colors cursor-pointer">Previous</button>
            <span className="text-on-surface">Page 1 of 32</span>
            <button className="hover:text-primary transition-colors cursor-pointer">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
