import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useReferralStore } from '../store/referralStore';

export default function Referral() {
    const { user } = useAuthStore();
    const { 
        referralCode, 
        stats, 
        downline, 
        activity, 
        loading, 
        fetchReferralData, 
        setupRealtimeSubscriptions, 
        unsubscribe 
    } = useReferralStore();
    
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    useEffect(() => {
        if (user) {
            fetchReferralData(user.id);
            setupRealtimeSubscriptions(user.id);
        }
        return () => {
            unsubscribe();
        };
    }, [user, fetchReferralData, setupRealtimeSubscriptions, unsubscribe]);

    const inviteLink = referralCode ? `https://jamex.global/ref/${referralCode}` : 'Loading...';

    const handleCopy = () => {
        if (!referralCode) return;
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredDownline = useMemo(() => {
        if (!searchQuery) return downline;
        return downline.filter(r => 
            r.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [downline, searchQuery]);

    // formatting helpers
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return formatDate(dateString);
    };

    const getInitials = (name?: string) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="flex-1 p-2.5 md:p-margin-desktop space-y-2.5 md:space-y-6 max-w-[1400px] mx-auto w-full mb-6">
            {/* Referral Center Header */}
            <div className="flex flex-col mt-1 md:mt-4 w-full">
                {/* Quick Share Card */}
                <div className="glass-card p-2.5 md:p-4 rounded-xl flex flex-col sm:flex-row items-center gap-2 md:gap-4 w-full border border-outline-variant/20">
                    <div className="flex-1 w-full">
                        <p className="text-[8px] md:text-label-sm text-primary mb-1 md:mb-1.5 font-bold uppercase tracking-wider">Your Unique Invite Link</p>
                        <div className="flex bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-1">
                            <input 
                                className="bg-transparent border-none focus:ring-0 text-[9px] md:text-sm w-full font-bold px-2 md:px-3 py-1 outline-none font-mono text-on-surface" 
                                readOnly 
                                type="text" 
                                value={inviteLink}
                            />
                            <button 
                                onClick={handleCopy}
                                disabled={!referralCode}
                                className={`${copied ? 'bg-tertiary text-on-tertiary' : 'bg-primary text-on-primary'} px-2.5 py-1 md:px-4 md:py-1.5 rounded-md text-[8px] md:text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center justify-center min-w-[60px] md:min-w-[80px] shadow-sm disabled:opacity-50`}
                            >
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-6">
                <div className="glass-card rounded-xl p-2.5 md:p-5 border border-outline-variant/20 hover:border-primary/50 transition-all group relative overflow-hidden">
                    {/* Glow background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-surface-container-low/50 to-surface-container-low opacity-60"></div>
                    
                    {/* Decorative 3D Wireframe Cube Mesh */}
                    <div className="absolute -right-1 -bottom-1 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500 pointer-events-none">
                        <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5M2 7v10M12 12v10M22 7v10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="refGridTotal" width="8" height="8" patternUnits="userSpaceOnUse">
                                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#refGridTotal)" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1.5 md:mb-3">
                            <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-[12px] md:text-[18px]">group</span>
                            </div>
                            <span className="text-[8px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Referrals</span>
                        </div>
                        <div className="text-xl md:text-4xl font-bold text-on-surface font-tabular-nums">{stats.totalReferrals}</div>
                        <div className="flex items-center gap-1 mt-0.5 md:mt-2">
                            <span className="material-symbols-outlined text-tertiary text-[12px] md:text-[16px]">expand_less</span>
                            <span className="text-[8px] md:text-xs text-tertiary font-bold tracking-wide">+{stats.thisMonth} this month</span>
                        </div>
                    </div>
                </div>
                
                <div className="glass-card rounded-xl p-2.5 md:p-5 border border-outline-variant/20 hover:border-primary/50 transition-all group relative overflow-hidden">
                    {/* Glow background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-surface-container-low/50 to-surface-container-low opacity-60"></div>
                    
                    {/* Decorative 3D Wireframe Globe/Sphere Mesh */}
                    <div className="absolute -right-1 -bottom-1 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500 pointer-events-none">
                        <svg className="w-16 h-16 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <circle cx="12" cy="12" r="9" />
                            <ellipse cx="12" cy="12" rx="5" ry="9" />
                            <line x1="12" y1="3" x2="12" y2="21" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <path d="M3.5 9h17M3.5 15h17" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="refGridActive" width="8" height="8" patternUnits="userSpaceOnUse">
                                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-secondary"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#refGridActive)" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1.5 md:mb-3">
                            <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined text-[12px] md:text-[18px]">verified</span>
                            </div>
                            <span className="text-[8px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Investors</span>
                        </div>
                        <div className="text-xl md:text-4xl font-bold text-on-surface font-tabular-nums">{stats.activeInvestors}</div>
                        <div className="flex items-center gap-1 mt-0.5 md:mt-2">
                            <span className="text-[8px] md:text-xs text-on-surface-variant font-bold tracking-wide">
                                {stats.totalReferrals > 0 ? Math.round((stats.activeInvestors / stats.totalReferrals) * 100) : 0}% conversion rate
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="glass-card rounded-xl p-2.5 md:p-5 border border-outline-variant/20 hover:border-primary/50 transition-all group border-t-[3px] border-t-tertiary relative overflow-hidden">
                    {/* Glow background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-tertiary/5 via-surface-container-low/50 to-surface-container-low opacity-60"></div>
                    
                    {/* Decorative 3D Wireframe Cylinder/Stack Mesh */}
                    <div className="absolute -right-1 -bottom-1 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500 pointer-events-none">
                        <svg className="w-16 h-16 text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <ellipse cx="12" cy="6" rx="7" ry="2" />
                            <path d="M5 12c0 1.1 3.1 2 7 2s7-.9 7-2" />
                            <path d="M5 18c0 1.1 3.1 2 7 2s7-.9 7-2" />
                            <line x1="5" y1="6" x2="5" y2="18" />
                            <line x1="19" y1="6" x2="19" y2="18" />
                            <line x1="12" y1="8" x2="12" y2="20" strokeDasharray="2 2" />
                        </svg>
                    </div>

                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="refGridComm" width="8" height="8" patternUnits="userSpaceOnUse">
                                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-tertiary"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#refGridComm)" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1.5 md:mb-3">
                            <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                                <span className="material-symbols-outlined text-[12px] md:text-[18px]">payments</span>
                            </div>
                            <span className="text-[8px] md:text-xs font-bold text-tertiary uppercase tracking-wider">Commissions</span>
                        </div>
                        <div className="text-xl md:text-4xl font-bold text-on-surface font-tabular-nums">{formatCurrency(stats.commissionsTotal)}</div>
                        <div className="flex items-center gap-1 mt-0.5 md:mt-2">
                            {stats.pendingCommissions > 0 && (
                                <>
                                    <span className="material-symbols-outlined text-tertiary text-[12px] md:text-[16px]">expand_less</span>
                                    <span className="text-[8px] md:text-xs text-tertiary font-bold tracking-wide">+{formatCurrency(stats.pendingCommissions)} pending</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 md:gap-6">
                {/* Downline Network Table */}
                <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col border border-outline-variant/20">
                    <div className="bg-surface-container-high/40 px-2.5 py-2 md:px-5 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/10">
                        <h3 className="text-[10px] md:text-sm font-bold text-on-surface uppercase tracking-widest flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] md:text-[20px]">account_tree</span>
                            Downline Network
                        </h3>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex items-center w-full sm:w-auto">
                                <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-[14px] md:text-[18px]">search</span>
                                <input 
                                    className="w-full sm:w-48 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-[9px] md:text-sm py-1 md:py-2 pl-7 md:pl-9 pr-2 focus:ring-1 focus:ring-primary focus:outline-none text-on-surface font-medium" 
                                    placeholder="Search name..." 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-1 border border-outline-variant/50 rounded-lg bg-surface-container-low text-[16px] md:text-[20px]">filter_list</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto flex-1 scrollbar-hide min-h-[250px]">
                        <table className="w-full text-left min-w-[400px]">
                            <thead>
                                <tr className="bg-surface-container-highest/20 text-[8px] md:text-[11px] text-on-surface-variant uppercase tracking-widest font-bold border-b border-outline-variant/10">
                                    <th className="px-2.5 py-2 md:px-5 md:py-3">Name</th>
                                    <th className="px-2.5 py-2 md:px-5 md:py-3">Join Date</th>
                                    <th className="px-2.5 py-2 md:px-5 md:py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="px-5 py-8 text-center text-on-surface-variant text-sm">
                                            Loading network...
                                        </td>
                                    </tr>
                                ) : filteredDownline.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-5 py-8 text-center text-on-surface-variant text-sm">
                                            No referrals found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDownline.map((ref) => (
                                        <tr key={ref.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-2.5 py-2 md:px-5 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    {ref.profiles?.avatar_url ? (
                                                        <img src={ref.profiles.avatar_url} alt="avatar" className="w-5 h-5 md:w-8 md:h-8 rounded-full border border-primary/30 shrink-0" />
                                                    ) : (
                                                        <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-primary/20 border border-primary/30 text-primary flex items-center justify-center text-[8px] md:text-xs font-bold shrink-0">
                                                            {getInitials(ref.profiles?.full_name)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-[10px] md:text-sm font-bold text-on-surface leading-tight">{ref.profiles?.full_name || 'Anonymous User'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-2.5 py-2 md:px-5 md:py-4 text-[8px] md:text-xs font-mono text-on-surface-variant font-bold">{formatDate(ref.created_at)}</td>
                                            <td className="px-2.5 py-2 md:px-5 md:py-4">
                                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${
                                                    ref.status === 'active' ? 'border-tertiary/20 bg-tertiary/10 text-tertiary' :
                                                    ref.status === 'pending' ? 'border-primary/20 bg-primary/10 text-primary' :
                                                    'border-outline-variant/30 bg-surface-variant/30 text-on-surface-variant'
                                                }`}>
                                                    <span className={`w-1 h-1 rounded-full ${
                                                        ref.status === 'active' ? 'bg-tertiary' :
                                                        ref.status === 'pending' ? 'bg-primary' :
                                                        'bg-on-surface-variant'
                                                    }`}></span> {ref.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="border-t border-outline-variant/10 px-2.5 py-2 md:px-5 md:py-4 text-center bg-surface-container-highest/10">
                        <button className="text-[8px] md:text-xs font-bold text-primary hover:underline uppercase tracking-wider transition-all">View Full Network</button>
                    </div>
                </div>

                {/* Recent Earnings */}
                <div className="glass-card rounded-xl overflow-hidden flex flex-col h-fit border border-outline-variant/20 min-h-[300px]">
                    <div className="bg-surface-container-high/40 px-2.5 py-2 md:px-5 md:py-4 border-b border-outline-variant/10">
                        <h3 className="text-[10px] md:text-sm font-bold text-on-surface uppercase tracking-widest flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] md:text-[20px]">notifications_active</span>
                            Recent Activity
                        </h3>
                    </div>
                    <div className="p-2.5 md:p-5 space-y-2 md:space-y-4">
                        {loading ? (
                            <div className="text-center text-on-surface-variant text-sm py-4">Loading activity...</div>
                        ) : activity.length === 0 ? (
                            <div className="text-center text-on-surface-variant text-sm py-4">No recent activity.</div>
                        ) : (
                            activity.slice(0, 5).map((item) => (
                                <div key={item.id} className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-1.5 md:p-2.5 rounded-lg border border-transparent hover:border-outline-variant/10 transition-colors">
                                    <div className="flex gap-2 items-center">
                                        <div className={`w-6 h-6 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                            item.status === 'processed' ? 'bg-tertiary/10 border border-tertiary/20' : 'bg-primary/10 border border-primary/20'
                                        }`}>
                                            <span className={`material-symbols-outlined text-[12px] md:text-[20px] ${
                                                item.status === 'processed' ? 'text-tertiary' : 'text-primary'
                                            }`}>{item.status === 'processed' ? 'trending_up' : 'stars'}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] md:text-sm font-bold text-on-surface leading-tight mb-0.5">{item.type}</p>
                                            <p className="text-[8px] md:text-[10px] text-on-surface-variant font-medium">
                                                {item.profiles?.full_name || 'System'} • {formatRelativeTime(item.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-[10px] md:text-sm font-bold font-tabular-nums mb-0.5 ${
                                            item.status === 'processed' ? 'text-tertiary' : 'text-primary'
                                        }`}>+{formatCurrency(item.amount)}</p>
                                        <p className={`text-[7px] md:text-[9px] font-bold uppercase tracking-wider ${
                                            item.status === 'processed' ? 'text-tertiary/80' : 'text-primary/80 animate-pulse'
                                        }`}>{item.status}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Promotion Banner */}
            <div className="mt-2.5 md:mt-8 relative overflow-hidden rounded-xl h-32 md:h-48 group shadow-xl border border-primary/20">
                <img alt="Financial Network Growth" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgAQ2OqzcYz61dXs2bP3xuOZHhTbd9qpDHdsUrdfSeq8OeWWnAen5C16r47IEFUTkdoqKMMQAdYmMYJAGeH1_JiJZ3iwohfqn6vOZoDzBTS5Tv5LpDOwnGGfHnvU_dJISpyahPxCHjjVEigpRBEpSlSx5F99bJzt9CZYSb4n5VbTczr5BsdL789a9p1esyqCEIPyJKFljn8cCwU7KllnLM7wIKAA9bXgAkGvqRwDi8d6YTRfKpBXeYItzyNkLgX0GEFsUN-OuZu3v1"/>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d1322] via-[#0d1322]/80 to-[#0d1322]/20 flex items-center px-3 md:px-12">
                    <div className="max-w-md">
                        <span className="bg-primary/20 text-primary border border-primary/30 text-[7px] md:text-[10px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded uppercase tracking-widest mb-1.5 md:mb-4 inline-block">Promo</span>
                        <h2 className="text-xs md:text-2xl font-bold text-white mb-1 leading-tight tracking-tight">Refer a Qualified Investor to Earn a $5,000 Bonus</h2>
                        <p className="text-[8px] md:text-xs font-medium text-white/70 mb-2 md:mb-5 leading-snug">Limited time offer for partners with over $1M in direct referrals.</p>
                        <button className="bg-primary text-on-primary px-2.5 py-1 md:px-6 md:py-2.5 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all text-[8px] md:text-xs uppercase tracking-wider shadow-sm shadow-primary/30">Claim Terms</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
