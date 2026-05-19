import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleToggle = () => setIsMobileMenuOpen(prev => !prev);
        const handleClose = () => setIsMobileMenuOpen(false);
        
        window.addEventListener('toggle-mobile-menu', handleToggle);
        
        // Close menu on route change
        handleClose();
        
        return () => {
            window.removeEventListener('toggle-mobile-menu', handleToggle);
        };
    }, [location.pathname]);

    // Prevent body scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const getLinkClass = (path: string, hideOnMobile: boolean = false) => {
        const isActive = location.pathname === path;
        const displayClass = hideOnMobile ? 'hidden md:flex' : 'flex';
        const baseClass = `${displayClass} items-center gap-3 px-4 h-10 transition-all duration-300 rounded-xl whitespace-nowrap`;
        
        if (isActive) {
            return `${baseClass} bg-primary/10 text-primary font-bold border border-primary/20 shadow-sm shadow-primary/5`;
        }
        return `${baseClass} text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface font-medium border border-transparent`;
    };

    const getIconStyle = (path: string) => {
        return location.pathname === path ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" };
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-16 h-[calc(100dvh-132px)] md:h-[calc(100dvh-64px)] w-64 bg-surface-container dark:bg-surface-container border-r border-outline-variant/20 flex flex-col pt-3 pb-1 md:pb-4 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-2xl md:shadow-none`}>
                
                {/* Premium Profile & Quick Actions Section */}
                <div className="px-3 mb-2">
                    <div className="relative overflow-hidden bg-surface-container-highest rounded-2xl p-2.5 border border-outline-variant/30 shadow-lg group">
                        {/* Animated Mesh Gradients */}
                        <div className="absolute -top-12 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-700 pointer-events-none"></div>
                        <div className="absolute -bottom-10 -left-8 w-28 h-28 bg-[#3b82f6]/20 rounded-full blur-xl group-hover:bg-[#3b82f6]/30 group-hover:scale-110 transition-all duration-700 pointer-events-none delay-100"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div>

                        <div className="relative z-10">
                            {/* Profile Info */}
                            <div className="flex items-center gap-2 mb-2">
                                {/* Animated Avatar Container */}
                                <div className="relative w-11 h-11 shrink-0 group/avatar cursor-pointer" onClick={() => navigate('/profile')}>
                                    <div className="absolute inset-[-2px] bg-gradient-to-tr from-primary via-blue-400 to-transparent rounded-full opacity-70 group-hover/avatar:opacity-100 group-hover/avatar:rotate-180 transition-all duration-700 blur-[1px]"></div>
                                    <div className="relative w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden border-2 border-surface shadow-inner">
                                        <img 
                                            src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || 'User')}&background=2563eb&color=fff`} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500" 
                                            onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=2563eb&color=fff'; }}
                                        />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-surface rounded-full shadow-sm"></div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[14px] font-bold text-on-surface truncate leading-tight group-hover:text-primary transition-colors">
                                            {user?.user_metadata?.full_name || 'Verified User'}
                                        </p>
                                        <span className="material-symbols-outlined text-primary text-[14px] shrink-0 drop-shadow-[0_0_4px_rgba(37,99,235,0.4)]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant truncate font-medium">
                                        {user?.email || 'user@example.com'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Standard Action Buttons */}
                            <div className="flex flex-col gap-1.5 mt-1 relative z-10">
                                <div className="flex gap-1.5">
                                    <button onClick={() => { setIsMobileMenuOpen(false); navigate('/deposit'); }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-surface hover:bg-surface-variant text-on-surface transition-colors border border-outline-variant/30 text-[10px] font-bold shadow-sm active:scale-95">
                                        <span className="material-symbols-outlined text-[14px] text-primary">add_circle</span>
                                        Deposit
                                    </button>
                                    <button onClick={() => { setIsMobileMenuOpen(false); navigate('/withdraw'); }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-surface hover:bg-surface-variant text-on-surface transition-colors border border-outline-variant/30 text-[10px] font-bold shadow-sm active:scale-95">
                                        <span className="material-symbols-outlined text-[14px] text-on-surface-variant">payments</span>
                                        Withdraw
                                    </button>
                                </div>
                                <button onClick={() => { setIsMobileMenuOpen(false); navigate('/invest'); }} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary hover:opacity-90 text-on-primary transition-all text-[11px] font-bold shadow-md shadow-primary/30 active:scale-95">
                                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                                    Invest Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-hide pb-2">
                    {/* OVERVIEW SECTION */}
                    <div>
                        <h3 className="px-4 text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest mb-0.5">Overview</h3>
                        <div className="space-y-0">
                            <Link to="/dashboard" className={getLinkClass("/dashboard")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/dashboard")}>dashboard</span>
                                <span className="text-sm">Dashboard</span>
                            </Link>
                        </div>
                    </div>

                    {/* PORTFOLIO SECTION */}
                    <div>
                        <h3 className="px-4 text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest mb-0.5">Portfolio</h3>
                        <div className="space-y-0">
                            <Link to="/invest" className={getLinkClass("/invest")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/invest")}>trending_up</span>
                                <span className="text-sm">My Investments</span>
                            </Link>
                            <Link to="/loans" className={getLinkClass("/loans")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/loans")}>real_estate_agent</span>
                                <span className="text-sm">Loans</span>
                            </Link>
                            <Link to="/wallet" className={getLinkClass("/wallet", true)}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/wallet")}>account_balance_wallet</span>
                                <span className="text-sm">Wallet</span>
                            </Link>
                        </div>
                    </div>

                    {/* TRANSACTIONS SECTION */}
                    <div className="hidden md:block">
                        <h3 className="px-4 text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest mb-0.5">Transfers</h3>
                        <div className="space-y-0">
                            <Link to="/transactions" className={getLinkClass("/transactions")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/transactions")}>receipt_long</span>
                                <span className="text-sm">History</span>
                            </Link>
                        </div>
                    </div>

                    {/* ACCOUNT SECTION */}
                    <div>
                        <h3 className="px-4 text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest mb-0.5">Account</h3>
                        <div className="space-y-0">
                            <Link to="/kyc" className={getLinkClass("/kyc")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/kyc")}>verified_user</span>
                                <span className="text-sm">Verification</span>
                            </Link>
                            <Link to="/referrals" className={getLinkClass("/referrals")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/referrals")}>groups</span>
                                <span className="text-sm">Referrals</span>
                            </Link>
                            <Link to="/settings" className={getLinkClass("/settings")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/settings")}>settings</span>
                                <span className="text-sm">Settings</span>
                            </Link>
                            <Link to="/support" className={getLinkClass("/support", true)}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/support")}>headset_mic</span>
                                <span className="text-sm">Support</span>
                            </Link>
                            <button onClick={async () => {
                                await useAuthStore.getState().signOut();
                                navigate('/login');
                            }} className="w-full flex items-center gap-3 px-4 h-10 mt-2 text-error bg-error/10 hover:bg-error/20 transition-all duration-300 rounded-xl font-bold text-left shadow-sm border border-error/20">
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                <span className="text-sm">Logout</span>
                            </button>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
}
