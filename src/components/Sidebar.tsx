import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
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

    const getLinkClass = (path: string) => {
        const isActive = location.pathname === path;
        if (isActive) {
            return "flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold transition-all duration-300";
        }
        return "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface transition-all duration-300 rounded-xl font-medium";
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
            <aside className={`fixed left-0 top-0 h-screen w-64 bg-surface-container dark:bg-surface-container border-r border-outline-variant/20 flex flex-col py-6 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-2xl md:shadow-none`}>
                {/* Header / Brand */}
                <div className="mb-8 px-6 flex items-center justify-between mt-2 md:mt-0">
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#2563eb] to-[#b4c5ff] rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-white text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-on-surface tracking-tight leading-tight">Jamex Global</h2>
                            <p className="text-[10px] font-bold text-primary tracking-widest uppercase">Institutional</p>
                        </div>
                    </Link>
                    {/* Mobile Close Button */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-surface-variant/30 text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                
                <nav className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide pb-6">
                    {/* OVERVIEW SECTION */}
                    <div>
                        <h3 className="px-4 text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest mb-2">Overview</h3>
                        <div className="space-y-1">
                            <Link to="/dashboard" className={getLinkClass("/dashboard")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/dashboard")}>dashboard</span>
                                <span className="text-sm">Dashboard</span>
                            </Link>
                            <Link to="/profile" className={getLinkClass("/profile")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/profile")}>person</span>
                                <span className="text-sm">My Profile</span>
                            </Link>
                        </div>
                    </div>

                    {/* PORTFOLIO SECTION */}
                    <div>
                        <h3 className="px-4 text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest mb-2">Portfolio</h3>
                        <div className="space-y-1">
                            <Link to="/invest" className={getLinkClass("/invest")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/invest")}>trending_up</span>
                                <span className="text-sm">Investments</span>
                            </Link>
                            <Link to="/loans" className={getLinkClass("/loans")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/loans")}>real_estate_agent</span>
                                <span className="text-sm">Loans</span>
                            </Link>
                            <Link to="/wallet" className={getLinkClass("/wallet")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/wallet")}>account_balance_wallet</span>
                                <span className="text-sm">Wallet</span>
                            </Link>
                        </div>
                    </div>

                    {/* TRANSACTIONS SECTION */}
                    <div>
                        <h3 className="px-4 text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest mb-2">Transfers</h3>
                        <div className="space-y-1">
                            <Link to="/deposit" className={getLinkClass("/deposit")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/deposit")}>arrow_downward</span>
                                <span className="text-sm">Deposit</span>
                            </Link>
                            <Link to="/withdraw" className={getLinkClass("/withdraw")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/withdraw")}>arrow_upward</span>
                                <span className="text-sm">Withdraw</span>
                            </Link>
                            <Link to="/transactions" className={getLinkClass("/transactions")}>
                                <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/transactions")}>receipt_long</span>
                                <span className="text-sm">History</span>
                            </Link>
                        </div>
                    </div>

                    {/* ACCOUNT SECTION */}
                    <div>
                        <h3 className="px-4 text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest mb-2">Account</h3>
                        <div className="space-y-1">
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
                        </div>
                    </div>
                </nav>
                
                <div className="mt-auto pt-6 px-4 border-t border-outline-variant/10 space-y-2">
                    <button onClick={() => navigate('/invest')} className="w-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all mb-2 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        New Investment
                    </button>
                    <Link to="/support" className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface transition-all duration-300 rounded-xl font-medium">
                        <span className="material-symbols-outlined text-[20px]">headset_mic</span>
                        <span className="text-sm">Support</span>
                    </Link>
                    <button onClick={async () => {
                        await useAuthStore.getState().signOut();
                        navigate('/login');
                    }} className="w-full flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-error/10 hover:text-error transition-all duration-300 rounded-xl font-medium text-left">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
