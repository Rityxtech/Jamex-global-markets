import React, { useState } from 'react';

const referralStats = [
  {
    label: 'Total Referrals',
    value: '8,241',
    sub: '+142 this month',
    subColor: 'text-tertiary',
    icon: 'group_add',
    accent: 'border-primary',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    label: 'Active Referrers',
    value: '1,834',
    sub: '22.3% conversion',
    subColor: 'text-on-surface-variant',
    icon: 'person_check',
    accent: 'border-tertiary',
    iconBg: 'bg-tertiary/10 text-tertiary',
  },
  {
    label: 'Total Commissions Paid',
    value: '$284,920',
    sub: '+$12,450 pending',
    subColor: 'text-on-surface-variant',
    icon: 'payments',
    accent: 'border-secondary',
    iconBg: 'bg-secondary/10 text-secondary',
  },
  {
    label: 'Avg Commission Rate',
    value: '5.0%',
    sub: 'Tier-based structure',
    subColor: 'text-on-surface-variant',
    icon: 'percent',
    accent: 'border-outline',
    iconBg: 'bg-surface-variant/30 text-on-surface-variant',
  },
];

const commissionTiers = [
  { tier: 'Bronze', range: '1–5 referrals', rate: '2.5%', color: 'text-on-surface-variant', barColor: 'bg-outline', barWidth: 'w-[25%]' },
  { tier: 'Silver', range: '6–20 referrals', rate: '4.0%', color: 'text-secondary', barColor: 'bg-secondary', barWidth: 'w-[45%]' },
  { tier: 'Gold', range: '21–50 referrals', rate: '5.0%', color: 'text-primary', barColor: 'bg-primary', barWidth: 'w-[65%]' },
  { tier: 'Platinum', range: '50+ referrals', rate: '7.5%', color: 'text-tertiary', barColor: 'bg-tertiary', barWidth: 'w-[85%]' },
];

const topReferrers = [
  { rank: 1, name: 'Nexus Quant Ltd.', id: 'JM-INST-004', referred: 142, earned: '$28,400', status: 'Platinum', statusColor: 'text-tertiary bg-tertiary/10 border-tertiary/30' },
  { rank: 2, name: 'Alexander Vance', id: 'JM-99281-XB', referred: 87, earned: '$17,400', status: 'Platinum', statusColor: 'text-tertiary bg-tertiary/10 border-tertiary/30' },
  { rank: 3, name: 'Helena Petrov', id: 'JM-10423-ZK', referred: 43, earned: '$8,600', status: 'Gold', statusColor: 'text-primary bg-primary/10 border-primary/30' },
  { rank: 4, name: 'Marcus Sterling', id: 'JM-22345-OP', referred: 19, earned: '$3,040', status: 'Silver', statusColor: 'text-secondary bg-secondary/10 border-secondary/30' },
  { rank: 5, name: 'Elena Vasquez', id: 'JM-44901-RQ', referred: 11, earned: '$1,760', status: 'Silver', statusColor: 'text-secondary bg-secondary/10 border-secondary/30' },
  { rank: 6, name: 'David Okafor', id: 'JM-55812-TY', referred: 4, earned: '$400', status: 'Bronze', statusColor: 'text-on-surface-variant bg-surface-variant/20 border-outline-variant/50' },
];



export default function AdminReferrals() {
  const [referralBonusAmount, setReferralBonusAmount] = useState('50.00');
  const [minDepositRequirement, setMinDepositRequirement] = useState('250');
  const [commissionLock, setCommissionLock] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

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
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-label-md text-label-md active:scale-95 transition-all cursor-pointer shadow-lg ${
            savedSuccess
              ? 'bg-tertiary text-on-tertiary shadow-tertiary/20'
              : 'bg-primary text-on-primary shadow-primary/20 hover:brightness-110'
          }`}
        >
          <span className="material-symbols-outlined text-sm">{savedSuccess ? 'check_circle' : 'save'}</span>
          {savedSuccess ? 'Saved!' : 'Save Config'}
        </button>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {referralStats.map((stat) => (
          <div key={stat.label} className={`glass-card p-4 rounded-xl flex items-center gap-4 border-l-4 ${stat.accent}`}>
            <div className={`p-3 rounded-lg ${stat.iconBg}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{stat.label}</p>
              <p className="font-headline-md text-headline-md text-on-surface font-bold">{stat.value}</p>
              <p className={`text-[11px] ${stat.subColor}`}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Commission Tier Structure */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-surface-container-high/50 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Commission Tiers</h3>
              <span className="material-symbols-outlined text-on-surface-variant">workspace_premium</span>
            </div>
            <div className="p-6 space-y-5">
              {commissionTiers.map((tier) => (
                <div key={tier.tier}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div>
                      <span className={`font-label-md text-label-md font-bold ${tier.color}`}>{tier.tier}</span>
                      <span className="ml-2 text-[10px] text-on-surface-variant">{tier.range}</span>
                    </div>
                    <span className={`font-tabular-nums text-sm font-bold ${tier.color}`}>{tier.rate}</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                    <div className={`${tier.barColor} h-full ${tier.barWidth} rounded-full transition-all`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Global Referral Config */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-surface-container-high/50 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Global Config</h3>
              <span className="material-symbols-outlined text-primary text-sm">tune</span>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Referral Signup Bonus (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                  <input
                    value={referralBonusAmount}
                    onChange={(e) => setReferralBonusAmount(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg pl-8 pr-4 py-3 text-tabular-nums text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Min. Deposit to Unlock (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                  <input
                    value={minDepositRequirement}
                    onChange={(e) => setMinDepositRequirement(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg pl-8 pr-4 py-3 text-tabular-nums text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Lock Commission Rates</p>
                  <p className="text-[11px] text-on-surface-variant">Prevents referrers from changing tier</p>
                </div>
                <button
                  onClick={() => setCommissionLock(!commissionLock)}
                  className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${commissionLock ? 'bg-primary' : 'bg-surface-container-highest border border-outline-variant/30'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${commissionLock ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Referrers Table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-surface-container-high/50 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">All Referrals</h3>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">leaderboard</span>
                <span className="font-label-sm text-label-sm">All time</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-high/30 text-on-surface-variant border-b border-outline-variant/20">
                  <tr>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">Referrer</th>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">Referred</th>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">Total Earned</th>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider">Tier</th>
                    <th className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {topReferrers.map((referrer) => (
                    <tr key={referrer.id} className="hover:bg-surface-variant/10 transition-colors group">
                      <td className="px-6 py-4">
                        <span className={`font-tabular-nums font-bold text-sm ${referrer.rank <= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {referrer.rank <= 3 ? `#${referrer.rank}` : referrer.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-label-md text-label-md text-on-surface font-bold">{referrer.name}</p>
                        <p className="text-[11px] font-tabular-nums text-on-surface-variant">{referrer.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-tabular-nums text-on-surface font-bold">{referrer.referred}</span>
                        <span className="text-on-surface-variant text-xs ml-1">users</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-tabular-nums text-tertiary font-bold">{referrer.earned}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded border text-[10px] font-bold uppercase ${referrer.statusColor}`}>
                          {referrer.status}
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
