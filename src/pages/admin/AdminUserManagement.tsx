import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const users = [
  {
    id: 'JM-99281-XB',
    name: 'Alexander Vance',
    type: 'Institutional',
    kyc: 'Verified',
    balance: '$1,482,900.00',
    balanceSub: '+1.2% Day',
    balanceSubColor: 'text-tertiary',
    lastActivity: '2 mins ago',
    lastActivitySub: 'IP: 192.168.1.1',
  },
  {
    id: 'JM-10423-ZK',
    name: 'Helena Petrov',
    type: 'Retail',
    kyc: 'Pending',
    balance: '$22,450.12',
    balanceSub: 'Locked Balance',
    balanceSubColor: 'text-on-surface-variant opacity-60',
    lastActivity: '45 mins ago',
    lastActivitySub: 'Mobile App (iOS)',
  },
  {
    id: 'JM-INST-004',
    name: 'Nexus Quant Fund',
    type: 'Institutional',
    kyc: 'Verified',
    balance: '$14,500,000.00',
    balanceSub: 'Custodial Vault',
    balanceSubColor: 'text-on-surface-variant opacity-60',
    lastActivity: 'Active Now',
    lastActivitySub: 'API Gateway 4',
  },
  {
    id: 'JM-22345-OP',
    name: 'Marcus Sterling',
    type: 'Retail',
    kyc: 'Rejected',
    balance: '$0.00',
    balanceSub: 'Restricted',
    balanceSubColor: 'text-on-surface-variant opacity-60',
    lastActivity: '3 days ago',
    lastActivitySub: 'Web Portal',
  },
];

function KycBadge({ status }: { status: string }) {
  if (status === 'Verified') {
    return (
      <div className="flex items-center text-tertiary">
        <span className="material-symbols-outlined text-sm mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <span className="font-label-sm text-label-sm">Verified</span>
      </div>
    );
  }
  if (status === 'Pending') {
    return (
      <div className="flex items-center text-primary">
        <span className="material-symbols-outlined text-sm mr-1">history</span>
        <span className="font-label-sm text-label-sm">Pending Approval</span>
      </div>
    );
  }
  return (
    <div className="flex items-center text-error">
      <span className="material-symbols-outlined text-sm mr-1">cancel</span>
      <span className="font-label-sm text-label-sm">Rejected</span>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  if (type === 'Institutional') {
    return (
      <span className="px-2 py-1 bg-secondary-container/30 text-on-secondary-container text-[10px] font-bold rounded uppercase border border-secondary-container/50">
        Institutional
      </span>
    );
  }
  return (
    <span className="px-2 py-1 bg-surface-variant/30 text-on-surface-variant text-[10px] font-bold rounded uppercase border border-outline-variant/50">
      Retail
    </span>
  );
}

export default function AdminUserManagement() {
  const navigate = useNavigate();
  const [kycFilter, setKycFilter] = useState('All Statuses');
  const [tierFilter, setTierFilter] = useState('All');

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Page Header & Stats Summary Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-1">User Directory</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Managing 14,822 global market participants</p>
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-xl flex items-center space-x-4 border-l-4 border-tertiary">
            <div className="bg-tertiary/10 p-3 rounded-lg text-tertiary">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Verified Users</p>
              <p className="font-headline-md text-headline-md text-on-surface font-bold">12,402</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl flex items-center space-x-4 border-l-4 border-error">
            <div className="bg-error/10 p-3 rounded-lg text-error">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">KYC Pending</p>
              <p className="font-headline-md text-headline-md text-on-surface font-bold">2,420</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl flex items-center space-x-4 border-l-4 border-primary">
            <div className="bg-primary/10 p-3 rounded-lg text-primary">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Avg. Portfolio</p>
              <p className="font-headline-md text-headline-md text-on-surface font-bold">$64,281</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Pane */}
      <section className="glass-card rounded-xl overflow-hidden">
        <div className="px-6 py-3 flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-high/50">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-primary text-xl">filter_list</span>
            <span className="font-label-md text-label-md font-bold text-on-surface">Advanced Segmentation Filters</span>
          </div>
          <button
            onClick={() => { setKycFilter('All Statuses'); setTierFilter('All'); }}
            className="text-primary font-label-sm text-label-sm hover:underline cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* KYC Status */}
          <div className="space-y-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">KYC Status</label>
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none text-on-surface"
            >
              <option>All Statuses</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
          </div>
          {/* Account Tier */}
          <div className="space-y-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Account Tier</label>
            <div className="flex space-x-2">
              {['All', 'Retail', 'Inst.'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`flex-1 py-2 px-2 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                    tierFilter === tier
                      ? 'bg-primary-container text-on-primary-container'
                      : 'border border-outline-variant/30 text-on-surface-variant hover:border-primary'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
          {/* Balance Range */}
          <div className="space-y-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Balance Range (USD)</label>
            <div className="flex items-center space-x-2">
              <input className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 text-xs outline-none text-on-surface focus:border-primary-container transition-colors" placeholder="Min" type="text" />
              <span className="text-on-surface-variant">—</span>
              <input className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 text-xs outline-none text-on-surface focus:border-primary-container transition-colors" placeholder="Max" type="text" />
            </div>
          </div>
          {/* Registration Window */}
          <div className="space-y-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Registration Window</label>
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 text-xs outline-none text-on-surface focus:border-primary-container transition-colors"
              type="date"
            />
          </div>
        </div>
      </section>

      {/* User Data Table */}
      <section className="glass-card rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-surface-container-high/80 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant/20">User Entity</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant/20">Type</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant/20">KYC Status</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant/20">Wallet Balance</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant/20">Last Activity</th>
                <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant/20 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} onClick={() => navigate(`/admin/users/${user.id}`)} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary">person</span>
                      </div>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface font-bold">{user.name}</p>
                        <p className="text-[11px] font-tabular-nums text-on-surface-variant">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <TypeBadge type={user.type} />
                  </td>
                  <td className="px-6 py-4">
                    <KycBadge status={user.kyc} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-tabular-nums text-label-md text-on-surface">{user.balance}</p>
                    <p className={`text-[10px] ${user.balanceSubColor}`}>{user.balanceSub}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{user.lastActivity}</p>
                    <p className="text-[10px] text-on-surface-variant opacity-60">{user.lastActivitySub}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="h-8 w-8 flex items-center justify-center rounded border border-outline-variant/30 hover:bg-primary-container text-on-surface-variant hover:text-on-primary-container transition-all active:scale-95 cursor-pointer"
                        title="View Profile"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 w-8 flex items-center justify-center rounded border border-outline-variant/30 hover:bg-tertiary-container text-on-surface-variant hover:text-on-tertiary-container transition-all active:scale-95 cursor-pointer"
                        title="Credit/Debit"
                      >
                        <span className="material-symbols-outlined text-lg">currency_exchange</span>
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 w-8 flex items-center justify-center rounded border border-outline-variant/30 hover:bg-error/20 text-on-surface-variant hover:text-error transition-all active:scale-95 cursor-pointer"
                        title="Suspend"
                      >
                        <span className="material-symbols-outlined text-lg">block</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-surface-container-highest/20 border-t border-outline-variant/20 flex items-center justify-between">
          <p className="font-label-sm text-label-sm text-on-surface-variant">Showing 1 to 50 of 14,822 users</p>
          <div className="flex items-center space-x-2">
            <button disabled className="px-3 py-1 border border-outline-variant/30 rounded text-on-surface-variant hover:bg-surface-variant/20 transition-colors disabled:opacity-30">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="px-3 py-1 bg-primary text-on-primary font-bold rounded text-xs">1</button>
            <button className="px-3 py-1 border border-outline-variant/30 rounded text-on-surface-variant hover:bg-surface-variant/20 transition-colors text-xs">2</button>
            <button className="px-3 py-1 border border-outline-variant/30 rounded text-on-surface-variant hover:bg-surface-variant/20 transition-colors text-xs">3</button>
            <span className="text-on-surface-variant px-1">...</span>
            <button className="px-3 py-1 border border-outline-variant/30 rounded text-on-surface-variant hover:bg-surface-variant/20 transition-colors text-xs">297</button>
            <button className="px-3 py-1 border border-outline-variant/30 rounded text-on-surface-variant hover:bg-surface-variant/20 transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-variant/10 flex justify-between items-center text-on-surface-variant pt-4">
        <div className="flex space-x-6">
          <span className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">description</span>
            <span className="font-label-sm text-label-sm">Documentation</span>
          </span>
          <span className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">gavel</span>
            <span className="font-label-sm text-label-sm">Legal</span>
          </span>
        </div>
        <p className="font-label-sm text-label-sm opacity-50 hidden sm:block">© 2024 Jamex Global Markets Ltd. System Ver 4.2.1-stable</p>
      </footer>
    </div>
  );
}
