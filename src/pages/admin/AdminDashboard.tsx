import React from 'react';

export default function AdminDashboard() {
  return (
    <>
      {/* Global Metrics Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-card-padding rounded-xl">
          <div className="flex justify-between items-start mb-3">
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">account_balance</span>
            <span className="text-tertiary font-tabular-nums text-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span> +4.2%
            </span>
          </div>
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Total AUM</p>
          <p className="font-headline-md text-headline-md font-bold text-on-surface mt-1">$4.82B</p>
        </div>
        <div className="glass-card p-card-padding rounded-xl">
          <div className="flex justify-between items-start mb-3">
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">group</span>
            <span className="text-tertiary font-tabular-nums text-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span> +12%
            </span>
          </div>
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Registered Users</p>
          <p className="font-headline-md text-headline-md font-bold text-on-surface mt-1">142,902</p>
        </div>
        <div className="glass-card p-card-padding rounded-xl">
          <div className="flex justify-between items-start mb-3">
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">payments</span>
            <span className="text-error font-tabular-nums text-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_down</span> -1.5%
            </span>
          </div>
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">24h Deposit Vol</p>
          <p className="font-headline-md text-headline-md font-bold text-on-surface mt-1">$12.4M</p>
        </div>
        <div className="glass-card p-card-padding rounded-xl">
          <div className="flex justify-between items-start mb-3">
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">description</span>
            <span className="text-tertiary font-tabular-nums text-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span> +0.8%
            </span>
          </div>
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Active Contracts</p>
          <p className="font-headline-md text-headline-md font-bold text-on-surface mt-1">8,412</p>
        </div>
      </div>

      {/* Platform Health Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high/50">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">System Performance & User Growth</h2>
              <p className="font-label-sm text-label-sm text-outline">Real-time dual-axis synchronization (7-day window)</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm">Daily</button>
              <button className="px-3 py-1 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">Monthly</button>
            </div>
          </div>
          <div className="p-6 flex-1 h-[320px] relative">
            {/* Chart Mockup */}
            <div className="absolute inset-x-6 bottom-12 top-6 flex items-end justify-between gap-1">
              <div className="w-1/12 bg-primary/20 h-2/3 rounded-t-sm relative group">
                <div className="absolute bottom-full left-0 right-0 h-[2px] bg-primary group-hover:h-1 transition-all"></div>
              </div>
              <div className="w-1/12 bg-primary/20 h-1/2 rounded-t-sm relative group">
                <div className="absolute bottom-full left-0 right-0 h-[2px] bg-primary"></div>
              </div>
              <div className="w-1/12 bg-primary/20 h-3/4 rounded-t-sm relative group">
                <div className="absolute bottom-full left-0 right-0 h-[2px] bg-primary"></div>
              </div>
              <div className="w-1/12 bg-primary/20 h-4/5 rounded-t-sm relative group">
                <div className="absolute bottom-full left-0 right-0 h-[2px] bg-primary"></div>
              </div>
              <div className="w-1/12 bg-primary/20 h-1/2 rounded-t-sm relative group">
                <div className="absolute bottom-full left-0 right-0 h-[2px] bg-primary"></div>
              </div>
              <div className="w-1/12 bg-primary/20 h-2/3 rounded-t-sm relative group">
                <div className="absolute bottom-full left-0 right-0 h-[2px] bg-primary"></div>
              </div>
              <div className="w-1/12 bg-primary/20 h-3/4 rounded-t-sm relative group">
                <div className="absolute bottom-full left-0 right-0 h-[2px] bg-primary"></div>
              </div>
            </div>
            {/* Grid Lines */}
            <div className="absolute inset-x-6 top-6 bottom-12 border-b border-outline-variant/10 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-outline-variant/10 w-full"></div>
              <div className="border-b border-outline-variant/10 w-full"></div>
              <div className="border-b border-outline-variant/10 w-full"></div>
              <div className="border-b border-outline-variant/10 w-full"></div>
            </div>
            <div className="absolute bottom-4 inset-x-6 flex justify-between text-label-sm text-outline font-tabular-nums">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="glass-card rounded-xl flex flex-col">
          <div className="p-6 border-b border-outline-variant/10 bg-surface-container-high/50">
            <h2 className="font-headline-md text-headline-md text-on-surface">Capital Inflow</h2>
            <p className="font-label-sm text-label-sm text-outline">Geographic heat distribution</p>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="relative h-32 w-full bg-surface-container-low rounded-lg mb-4 overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#2563eb 2px, transparent 2px)', backgroundSize: '10px 10px' }}></div>
              <div className="absolute top-4 left-1/4 w-3 h-3 bg-primary rounded-full animate-ping"></div>
              <div className="absolute bottom-8 right-1/3 w-2 h-2 bg-primary rounded-full"></div>
              <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-primary/40 rounded-full animate-pulse"></div>
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="font-label-md text-label-md">United Arab Emirates</span>
                </div>
                <span className="font-tabular-nums text-on-surface font-bold">34%</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-outline rounded-full"></span>
                  <span className="font-label-md text-label-md">Singapore</span>
                </div>
                <span className="font-tabular-nums text-on-surface font-bold">22%</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-outline rounded-full"></span>
                  <span className="font-label-md text-label-md">Switzerland</span>
                </div>
                <span className="font-tabular-nums text-on-surface font-bold">18%</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-outline rounded-full"></span>
                  <span className="font-label-md text-label-md">Luxembourg</span>
                </div>
                <span className="font-tabular-nums text-on-surface font-bold">12%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lower Section: Pending Approvals & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="glass-card rounded-xl flex flex-col">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high/50">
            <h2 className="font-headline-md text-headline-md text-on-surface">Pending Approvals</h2>
            <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">8 Urgent</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr className="text-outline font-label-sm text-label-sm border-b border-outline-variant/10">
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">User/Entity</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="font-label-md text-label-md">
                <tr className="zebra-row border-b border-outline-variant/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">badge</span>
                      KYC Tier 3
                    </div>
                  </td>
                  <td className="px-6 py-4">Al-Fayed Trust</td>
                  <td className="px-6 py-4 font-tabular-nums">—</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline">Review</button>
                  </td>
                </tr>
                <tr className="zebra-row border-b border-outline-variant/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">output</span>
                      Withdrawal
                    </div>
                  </td>
                  <td className="px-6 py-4">Marcus Sterling</td>
                  <td className="px-6 py-4 font-tabular-nums text-on-surface font-bold">$250,000</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline">Verify</button>
                  </td>
                </tr>
                <tr className="zebra-row border-b border-outline-variant/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">edit_document</span>
                      Entity Docs
                    </div>
                  </td>
                  <td className="px-6 py-4">Oasis Ventures</td>
                  <td className="px-6 py-4 font-tabular-nums">—</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline">Review</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Administrative Activity */}
        <div className="glass-card rounded-xl flex flex-col">
          <div className="p-6 border-b border-outline-variant/10 bg-surface-container-high/50">
            <h2 className="font-headline-md text-headline-md text-on-surface">System Events Feed</h2>
          </div>
          <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm text-outline">history</span>
              </div>
              <div>
                <p className="text-on-surface font-label-md text-label-md">New KYC Submitted by <span className="text-primary">Elena Rodriguez</span></p>
                <p className="text-outline text-[11px] font-tabular-nums">2 minutes ago • ID: 88291</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm text-error">priority_high</span>
              </div>
              <div>
                <p className="text-on-surface font-label-md text-label-md">Withdrawal Request #8829 <span className="text-outline">flagged for review</span></p>
                <p className="text-outline text-[11px] font-tabular-nums">14 minutes ago • High Priority</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm text-tertiary">settings_applications</span>
              </div>
              <div>
                <p className="text-on-surface font-label-md text-label-md">Plan 'Alpha 92' Updated by <span className="text-primary">Admin_772</span></p>
                <p className="text-outline text-[11px] font-tabular-nums">42 minutes ago • System Change</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm text-outline">group_add</span>
              </div>
              <div>
                <p className="text-on-surface font-label-md text-label-md">New Institutional Account Activated: <span className="text-primary">Nomura HK</span></p>
                <p className="text-outline text-[11px] font-tabular-nums">1 hour ago • Tier 4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
