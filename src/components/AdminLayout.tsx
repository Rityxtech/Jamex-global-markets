import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

type ConnStatus = 'checking' | 'connected' | 'offline';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const [connStatus, setConnStatus] = useState<ConnStatus>('checking');

  useEffect(() => {
    async function ping() {
      try {
        const { error } = await supabase.from('wallets').select('user_id').limit(1);
        setConnStatus(error ? 'offline' : 'connected');
      } catch {
        setConnStatus('offline');
      }
    }
    ping();
    const interval = setInterval(ping, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', icon: 'dashboard', label: 'Dashboard', end: true },
    { to: '/admin/users', icon: 'group', label: 'User Management' },
    { to: '/admin/plans', icon: 'account_balance_wallet', label: 'Plan Management' },
    { to: '/admin/financials', icon: 'payments', label: 'Financials' },
    { to: '/admin/referrals', icon: 'share', label: 'Referrals' },
    { to: '/admin/support', icon: 'contact_support', label: 'Support' },
    { to: '/admin/settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <div className="font-body-md text-body-md overflow-x-hidden min-h-screen bg-surface-dim">
      {/* Top Navigation Anchor */}
      <header className="bg-surface-container/80 backdrop-blur-xl text-primary font-headline-md text-headline-md border-b border-outline-variant/30 shadow-sm flex justify-between items-center h-16 px-margin-desktop w-full sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">Jamex Global</span>
          <div className="hidden md:flex gap-6 items-center">
            <span className="text-on-surface-variant font-medium font-label-md text-label-md">Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 items-center gap-2 w-64">
            <span className="material-symbols-outlined text-outline text-sm">search</span>
            <input className="bg-transparent border-none outline-none focus:ring-0 text-label-md w-full placeholder-outline text-on-surface" placeholder="Search accounts, txns..." type="text" />
          </div>
          <div className="flex items-center gap-3">
            {/* Supabase connection indicator */}
            <div
              title={connStatus === 'connected' ? 'Supabase: Connected' : connStatus === 'offline' ? 'Supabase: Offline' : 'Checking connection…'}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all ${
                connStatus === 'connected'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : connStatus === 'offline'
                  ? 'bg-error/10 border-error/30 text-error'
                  : 'bg-surface-container-highest border-outline-variant/30 text-outline'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                connStatus === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : connStatus === 'offline'
                  ? 'bg-error'
                  : 'bg-outline animate-pulse'
              }`} />
              {connStatus === 'connected' ? 'Live' : connStatus === 'offline' ? 'Offline' : '…'}
            </div>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">notifications</button>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">shield_lock</button>
            <div className="h-8 w-8 rounded-full bg-primary-container flex items-center justify-center border border-primary/20">
              <img alt="Administrator Avatar" className="h-full w-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2LM4tehUU_4yx6pq6cwN6oTW4JJd98jGVU9gpVXPQMj8V_baMvYjHUAjExVqGOpYXih69t_UWasrV-UCs7b9YcbQw2vJAyb2pdGqBTqKIEvEuxxVh5167StgEsYcuJl5g-c9upyK3-VdlC2h0sgWoQ5wTLcRWtRRnnyks1nmnNrCv6-E9YfdOgMxdLC34hjqOV-4cEKZp6oOktezuD8Fx2na_hatIrhtMV6QpuGc-R8ukFyqKxnF9JU0GiuN2fiU_LXltbYpZTS88" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex flex-col py-2 border-r-4 border-green-500 bg-surface-container-lowest/90 backdrop-blur-xl fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-40">
          
          
          <nav className="px-4 space-y-1">
            {navItems.map(({ to, icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  isActive
                    ? 'bg-secondary-container/40 text-on-secondary-container border-r-4 border-primary rounded-r-lg flex items-center gap-3 px-4 py-3'
                    : 'text-on-surface-variant hover:bg-surface-container-highest/50 hover:text-primary transition-all duration-200 flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg'
                }
              >
                <span className="material-symbols-outlined">{icon}</span>
                <span className="font-label-md text-label-md">{label}</span>
              </NavLink>
            ))}
          </nav>
          <button 
            onClick={handleLogout}
            className="w-full bg-error-container/20 text-error border border-error/30 py-2.5 rounded-lg font-label-md text-label-md hover:bg-error-container/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Secure Logout
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-margin-desktop space-y-6 min-h-[calc(100vh-64px)]">
            <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container/95 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center z-50">
        <NavLink to="/admin" end className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-medium">Dash</span>
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] font-medium">Users</span>
        </NavLink>
        <NavLink to="/admin/financials" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">payments</span>
          <span className="text-[10px] font-medium">Txns</span>
        </NavLink>
        <NavLink to="/admin/settings" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-medium">Set</span>
        </NavLink>
      </nav>
    </div>
  );
}
