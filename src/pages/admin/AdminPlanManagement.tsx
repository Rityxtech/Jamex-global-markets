import React, { useState } from 'react';

const plans = [
  {
    id: 'alpha-92',
    name: 'Alpha 92',
    tier: 'Aggressive',
    tierColor: 'bg-tertiary-container/30 text-tertiary',
    active: true,
    dailyYield: '2.45%',
    duration: '90',
    totalCapital: '$14.2M',
    roi: 18.4,
    paused: false,
    sparkPath: 'M0 50 Q 20 40 40 45 T 80 30 T 120 40 T 160 20 T 200 10',
    sparkFill: 'M0 50 Q 20 40 40 45 T 80 30 T 120 40 T 160 20 T 200 10 L 200 60 L 0 60 Z',
  },
  {
    id: 'delta-11',
    name: 'Delta 11',
    tier: 'Balanced',
    tierColor: 'bg-primary-container/20 text-primary',
    active: true,
    dailyYield: '1.12%',
    duration: '180',
    totalCapital: '$8.9M',
    roi: 12.1,
    paused: false,
    sparkPath: 'M0 45 Q 30 48 60 30 T 120 25 T 180 35 T 200 32',
    sparkFill: 'M0 45 Q 30 48 60 30 T 120 25 T 180 35 T 200 32 L 200 60 L 0 60 Z',
  },
  {
    id: 'zeta-prime',
    name: 'Zeta Prime',
    tier: 'Maintenance',
    tierColor: 'bg-error-container/20 text-error',
    active: false,
    dailyYield: '0.85%',
    duration: '365',
    totalCapital: '—',
    roi: 0,
    paused: true,
    sparkPath: '',
    sparkFill: '',
  },
];

const analyticsRows = [
  {
    name: 'Alpha 92',
    tier: 'Institutional',
    icon: 'rocket_launch',
    iconBg: 'bg-primary/10',
    roi: '2.45%',
    users: '1,429',
    platformProfit: '$2.1M',
    userPayouts: '$840k',
    stability: 92,
  },
  {
    name: 'Delta 11',
    tier: 'Standard',
    icon: 'balance',
    iconBg: 'bg-secondary-container/10',
    roi: '1.12%',
    users: '4,812',
    platformProfit: '$1.4M',
    userPayouts: '$1.1M',
    stability: 78,
  },
];

export default function AdminPlanManagement() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [planToggles, setPlanToggles] = useState<Record<string, boolean>>({
    'alpha-92': true,
    'delta-11': true,
    'zeta-prime': false,
  });

  const [form, setForm] = useState({
    name: '',
    dailyRoi: '',
    duration: '',
    minDeposit: '',
    maxDeposit: '',
    risk: 'Balanced',
    notes: '',
  });

  const handleToggle = (id: string) => {
    setPlanToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Side Panel Backdrop */}
      {panelOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-500"
          onClick={() => setPanelOpen(false)}
        />
      )}

      {/* Create Plan Side Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-surface-container-lowest/95 backdrop-blur-2xl shadow-2xl z-[60] transform transition-transform duration-500 ease-in-out border-l border-outline-variant/20 flex flex-col ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Create Investment Plan</h3>
            <p className="text-on-surface-variant font-label-sm text-label-sm">Deploy new institutional contract parameters.</p>
          </div>
          <button
            onClick={() => setPanelOpen(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-variant/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Plan Name</label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                placeholder="e.g. Omega Frontier"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Daily ROI %</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    value={form.dailyRoi}
                    onChange={(e) => setForm({ ...form, dailyRoi: e.target.value })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline font-label-md text-label-md">%</span>
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Duration (Days)</label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  placeholder="90"
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Min Deposit ($)</label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  placeholder="5000"
                  type="number"
                  value={form.minDeposit}
                  onChange={(e) => setForm({ ...form, minDeposit: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Max Deposit ($)</label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  placeholder="100000"
                  type="number"
                  value={form.maxDeposit}
                  onChange={(e) => setForm({ ...form, maxDeposit: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Risk Rating</label>
              <select
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md focus:border-primary outline-none transition-all"
                value={form.risk}
                onChange={(e) => setForm({ ...form, risk: e.target.value })}
              >
                <option>Conservative</option>
                <option>Balanced</option>
                <option>Aggressive</option>
                <option>Experimental</option>
              </select>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Internal Notes</label>
              <textarea
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
                placeholder="Define underlying trading algorithms or liquidity sources..."
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Preview Banner */}
          <div className="border border-primary/20 bg-primary/5 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl text-primary">insights</span>
            </div>
            <h4 className="font-label-md text-label-md text-primary mb-1 uppercase tracking-widest">Plan Deployment Preview</h4>
            <p className="text-on-surface text-body-md">New plans are subject to a 24-hour liquidity verification period before appearing in the client terminal.</p>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-outline-variant/10 bg-surface-container-lowest/50 flex gap-4 shrink-0">
          <button
            onClick={() => setPanelOpen(false)}
            className="flex-1 border border-outline-variant/30 text-on-surface-variant py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container-highest/30 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer">
            Deploy Plan
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="space-y-8 pb-20 md:pb-0">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm mb-1 uppercase tracking-widest">
              <span className="material-symbols-outlined text-base">verified_user</span>
              Administrator Console
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Investment Plan Management</h1>
            <p className="text-on-surface-variant font-body-md text-body-md mt-1">Configure, monitor, and deploy institutional-grade trading contracts.</p>
          </div>
          <button
            onClick={() => setPanelOpen(true)}
            className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:brightness-110 transition-all shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined">add</span>
            Create New Plan
          </button>
        </header>

        {/* Active Plan Cards */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">Active Contracts</h2>
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold animate-pulse">4 LIVE</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`glass-card rounded-xl overflow-hidden flex flex-col transition-all duration-200 ${plan.paused ? 'opacity-80 border-dashed border-error/30' : ''}`}
              >
                {/* Card Header */}
                <div className="bg-surface-container-high/50 px-card-padding py-3 flex justify-between items-center border-b border-outline-variant/20">
                  <span className={`font-label-md text-label-md font-bold ${plan.paused ? 'text-on-surface-variant' : 'text-primary'}`}>
                    {plan.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`${plan.tierColor} px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter`}>
                      {plan.tier}
                    </span>
                    {/* Toggle */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        checked={planToggles[plan.id]}
                        onChange={() => handleToggle(plan.id)}
                        className="sr-only peer"
                        type="checkbox"
                      />
                      <div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary-container relative"></div>
                    </label>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-card-padding space-y-4 flex-1">
                  {plan.paused ? (
                    <>
                      <div className={`grid grid-cols-2 gap-4 ${plan.paused ? 'filter grayscale' : ''}`}>
                        <div>
                          <p className="text-on-surface-variant font-label-sm text-label-sm mb-1">Daily Yield</p>
                          <p className="text-on-surface-variant font-tabular-nums text-headline-md">{plan.dailyYield}</p>
                        </div>
                        <div>
                          <p className="text-on-surface-variant font-label-sm text-label-sm mb-1">Duration</p>
                          <p className="text-on-surface-variant font-tabular-nums text-headline-md">{plan.duration} <span className="text-sm font-normal">Days</span></p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-outline-variant/10 text-center py-6 flex flex-col items-center">
                        <span className="material-symbols-outlined text-error text-3xl mb-2">lock_clock</span>
                        <p className="text-error font-label-md text-label-md">New Investments Halted</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-on-surface-variant font-label-sm text-label-sm mb-1">Daily Yield</p>
                          <p className="text-tertiary font-tabular-nums text-headline-md">{plan.dailyYield}</p>
                        </div>
                        <div>
                          <p className="text-on-surface-variant font-label-sm text-label-sm mb-1">Duration</p>
                          <p className="text-on-surface font-tabular-nums text-headline-md">
                            {plan.duration} <span className="text-sm font-normal">Days</span>
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-outline-variant/10">
                        <p className="text-on-surface-variant font-label-sm text-label-sm mb-1">Total Capital Invested</p>
                        <p className="text-primary font-tabular-nums text-headline-lg">{plan.totalCapital}</p>
                      </div>
                      {/* Sparkline */}
                      <div className="h-12 w-full mt-2 relative overflow-hidden rounded bg-surface-container-low/50 border border-outline-variant/10">
                        <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 60">
                          <defs>
                            <linearGradient id={`grad-${plan.id}`} x1="0%" x2="0%" y1="0%" y2="100%">
                              <stop offset="0%" style={{ stopColor: '#b4c5ff', stopOpacity: 1 }} />
                              <stop offset="100%" style={{ stopColor: '#b4c5ff', stopOpacity: 0 }} />
                            </linearGradient>
                          </defs>
                          <path d={plan.sparkFill} fill={`url(#grad-${plan.id})`} opacity="0.4" />
                          <path d={plan.sparkPath} fill="none" stroke="#b4c5ff" strokeWidth="2" />
                        </svg>
                        <span className="absolute top-1 right-2 text-[10px] text-tertiary font-bold">+{plan.roi}% ROI Hist.</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Analytics Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">Plan Analytics & Performance</h2>
            <div className="flex gap-2">
              <button className="text-on-surface-variant hover:text-primary px-3 py-1 rounded border border-outline-variant/30 text-xs transition-colors cursor-pointer">
                Export CSV
              </button>
              <button className="text-on-surface-variant hover:text-primary px-3 py-1 rounded border border-outline-variant/30 text-xs transition-colors cursor-pointer">
                Last 30 Days
              </button>
            </div>
          </div>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high/50 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/20">
                    <th className="px-6 py-4">Plan Identification</th>
                    <th className="px-6 py-4">Current ROI %</th>
                    <th className="px-6 py-4">Total Users</th>
                    <th className="px-6 py-4">Platform Profit</th>
                    <th className="px-6 py-4">User Payouts</th>
                    <th className="px-6 py-4">Stability Index</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-tabular-nums divide-y divide-outline-variant/10">
                  {analyticsRows.map((row) => (
                    <tr key={row.name} className="hover:bg-surface-container-high/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded ${row.iconBg} flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-primary text-sm">{row.icon}</span>
                          </div>
                          <div>
                            <p className="text-on-surface font-label-md text-label-md">{row.name}</p>
                            <p className="text-outline text-[10px]">Tier: {row.tier}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-tertiary font-bold">{row.roi}</td>
                      <td className="px-6 py-4 text-on-surface">{row.users}</td>
                      <td className="px-6 py-4 text-on-surface">{row.platformProfit}</td>
                      <td className="px-6 py-4 text-on-surface">{row.userPayouts}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                            <div className="h-full bg-tertiary rounded-full" style={{ width: `${row.stability}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-tertiary">{row.stability}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                          edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
