import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
            return "flex items-center gap-3 px-3 py-2 bg-secondary-container/50 text-on-secondary-container border-r-4 border-primary translate-x-1 transition-transform group rounded-lg";
        }
        return "flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-variant/30 transition-all duration-300 group rounded-lg";
    };

    const getIconStyle = (path: string) => {
        return location.pathname === path ? { fontVariationSettings: "'FILL' 1" } : {};
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
            <aside className={`fixed left-0 top-0 h-screen w-64 bg-surface-container dark:bg-surface-container border-r border-outline-variant/20 flex flex-col py-6 px-4 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="mb-10 px-2 flex items-center justify-between mt-2 md:mt-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                        </div>
                        <div>
                            <h2 className="text-headline-md font-headline-md font-bold text-primary tracking-tight" style={{ fontSize: '18px' }}>Jamex Global</h2>
                            <p className="text-label-sm font-label-sm text-on-surface-variant opacity-70">Institutional Grade</p>
                        </div>
                    </div>
                    {/* Mobile Close Button */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-surface-variant/30 text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                
                <nav className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-hide pb-4">
                    <Link to="/profile" className={getLinkClass("/profile")}>
                        <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/profile")}>person</span>
                        <span className="text-label-md font-label-md">My Profile</span>
                    </Link>
                    <Link to="/dashboard" className={getLinkClass("/dashboard")}>
                        <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/dashboard")}>dashboard</span>
                        <span className="text-label-md font-label-md">Dashboard</span>
                    </Link>
                    <Link to="/invest" className={getLinkClass("/invest")}>
                        <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/invest")}>account_balance</span>
                        <span className="text-label-md font-label-md">Investments</span>
                    </Link>
                    <Link to="/loans" className={getLinkClass("/loans")}>
                        <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/loans")}>real_estate_agent</span>
                        <span className="text-label-md font-label-md">Loans</span>
                    </Link>
                    <Link to="/wallet" className={getLinkClass("/wallet")}>
                        <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/wallet")}>account_balance_wallet</span>
                        <span className="text-label-md font-label-md">Wallet</span>
                    </Link>
                    <Link to="/transactions" className={getLinkClass("/transactions")}>
                        <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/transactions")}>receipt_long</span>
                        <span className="text-label-md font-label-md">Transactions</span>
                    </Link>
                    <Link to="/deposit" className={getLinkClass("/deposit")}>
                        <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/deposit")}>payments</span>
                        <span className="text-label-md font-label-md">Deposit</span>
                    </Link>
                    <Link to="/withdraw" className={getLinkClass("/withdraw")}>
                        <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/withdraw")}>account_balance</span>
                        <span className="text-label-md font-label-md">Withdraw</span>
                    </Link>
                    <Link to="/kyc" className={getLinkClass("/kyc")}>
                        <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/kyc")}>badge</span>
                        <span className="text-label-md font-label-md">Verification</span>
                    </Link>
                    <Link to="/referrals" className={getLinkClass("/referrals")}>
                        <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/referrals")}>groups</span>
                        <span className="text-label-md font-label-md">Referrals</span>
                    </Link>
                    <Link to="/settings" className={getLinkClass("/settings")}>
                        <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/settings")}>settings</span>
                        <span className="text-label-md font-label-md">Settings</span>
                    </Link>
                </nav>
                <div className="mt-auto pt-6 border-t border-outline-variant/10 space-y-1">
                    <button onClick={() => navigate('/invest')} className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-all mb-4 cursor-pointer font-bold">
                        New Investment
                    </button>
                    <Link to="/support" className={getLinkClass("/support")}>
                        <span className="material-symbols-outlined text-[20px]" style={getIconStyle("/support")}>headset_mic</span>
                        <span className="text-label-md font-label-md">Support</span>
                    </Link>
                    <Link to="/" className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span className="text-label-md font-label-md">Logout</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
