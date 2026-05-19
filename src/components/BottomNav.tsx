import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
    const location = useLocation();
    
    const isActive = (path: string) => location.pathname === path;

    const renderLink = (path: string, icon: string, label: string) => {
        const active = isActive(path);
        if (active) {
            return (
                <Link to={path} className="flex flex-col items-center justify-center w-[20%] h-full gap-1 text-primary relative">
                    <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>
                    <span className="material-symbols-outlined text-[24px] z-10" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider z-10 mt-0.5">{label}</span>
                    <div className="absolute top-2 w-10 h-10 bg-primary/20 rounded-full blur-md pointer-events-none"></div>
                </Link>
            );
        }
        return (
            <Link to={path} className="flex flex-col items-center justify-center w-[20%] h-full gap-1 text-on-surface-variant hover:text-primary transition-colors group">
                <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">{icon}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">{label}</span>
            </Link>
        );
    };

    const isWalletActive = isActive('/wallet');

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full z-50 pointer-events-none" style={{ filter: 'drop-shadow(0 -4px 20px rgba(0,0,0,0.4))' }}>
            <div className="absolute bottom-0 left-0 w-full h-[68px] bg-surface-container-highest pointer-events-auto"
                style={{
                    WebkitMaskImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODQiIGhlaWdodD0iNjgiIHZpZXdCb3g9IjAgMCA4NCA2OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCwwIEMxMiwwIDE2LDQgMjAsMTIgQzI2LDI0IDMzLDMyIDQyLDMyIEM1MSwzMiA1OCwyNCA2NCwxMiBDNjgsNCA3MiwwIDg0LDAgTDg0LDY4IEwwLDY4IFoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+'), linear-gradient(black, black), linear-gradient(black, black)`,
                    WebkitMaskSize: '84px 68px, calc(50% - 42px) 100%, calc(50% - 42px) 100%',
                    WebkitMaskPosition: 'top center, top left, top right',
                    WebkitMaskRepeat: 'no-repeat',
                    maskImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODQiIGhlaWdodD0iNjgiIHZpZXdCb3g9IjAgMCA4NCA2OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCwwIEMxMiwwIDE2LDQgMjAsMTIgQzI2LDI0IDMzLDMyIDQyLDMyIEM1MSwzMiA1OCwyNCA2NCwxMiBDNjgsNCA3MiwwIDg0LDAgTDg0LDY4IEwwLDY4IFoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+'), linear-gradient(black, black), linear-gradient(black, black)`,
                    maskSize: '84px 68px, calc(50% - 42px) 100%, calc(50% - 42px) 100%',
                    maskPosition: 'top center, top left, top right',
                    maskRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
            </div>

            <nav className="relative w-full h-[68px] flex justify-between items-center px-1 pointer-events-auto pb-safe">
                {renderLink('/dashboard', 'dashboard', 'Home')}
                {renderLink('/invest', 'account_balance', 'Invest')}
                
                {/* CENTER FAB */}
                <Link to="/wallet" className="flex flex-col items-center justify-center w-[20%] h-full relative group">
                    <div className={`absolute -top-5 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 ${isWalletActive ? 'bg-primary scale-105 shadow-[0_0_20px_rgba(37,99,235,0.6)] ring-2 ring-primary ring-offset-2 ring-offset-surface-container-highest' : 'bg-gradient-to-tr from-primary to-tertiary shadow-[0_8px_24px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95'}`}>
                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider absolute bottom-2 transition-colors ${isWalletActive ? 'text-primary' : 'text-on-surface-variant'}`}>Wallet</span>
                </Link>

                {renderLink('/transactions', 'receipt_long', 'History')}
                {renderLink('/support', 'headset_mic', 'Support')}
            </nav>
        </div>
    );
}
