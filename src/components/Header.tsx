import React from 'react';
import { Link } from 'react-router-dom';
import { useSidebarStore } from '../store/sidebarStore';

export default function Header({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const { toggle } = useSidebarStore();
  
  return (
    <nav className="fixed top-0 w-full h-12 md:h-16 bg-white/70 backdrop-blur-xl border-b border-blue-900/5 z-50 flex justify-center shadow-sm">
      <div className="w-full max-w-full px-3 md:px-6 flex justify-between items-center h-full gap-2 md:gap-4">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <Link to="/" className="flex items-center gap-1.5 md:gap-2 group">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-[#0a0f18] border border-transparent flex shrink-0 justify-center items-center shadow-md cursor-pointer group-hover:bg-electricBlue transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="md:w-3.5 md:h-3.5">
                <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
                <path d="M12 8L8 12L12 16L16 12L12 8Z" fill="#10B981" />
              </svg>
            </div>
            <span className="text-[11px] md:text-sm font-extrabold tracking-widest text-[#0a0f18] uppercase transition-colors whitespace-nowrap">Aura Quant</span>
          </Link>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-500">
          {!isLoggedIn ? (
             <>
                <Link to="/" className="text-[#0a0f18] relative after:content-[''] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-[2px] after:bg-electricBlue">Home</Link>
                <a href="#" className="hover:text-[#0a0f18] transition-colors">Markets</a>
                <a href="#" className="hover:text-[#0a0f18] transition-colors">Strategies</a>
                <a href="#" className="hover:text-[#0a0f18] transition-colors">About</a>
                <a href="#" className="hover:text-[#0a0f18] transition-colors">Contact</a>
             </>
          ) : (
             <>
                <Link to="/dashboard" className="text-[#0a0f18] relative after:content-[''] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-[2px] after:bg-electricBlue">Dashboard</Link>
                <Link to="/invest" className="hover:text-[#0a0f18] transition-colors">Invest</Link>
                <Link to="/allocations" className="hover:text-[#0a0f18] transition-colors">Allocations</Link>
                <Link to="/transactions" className="hover:text-[#0a0f18] transition-colors">History</Link>
             </>
          )}
        </div>

        {/* Auth / Profile Area */}
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:text-[#0a0f18] transition-colors px-2 md:px-3 py-1.5 md:py-2">Login</Link>
              <Link to="/register" className="bg-[#0a0f18] hover:bg-gray-800 text-white text-[9px] md:text-[11px] font-bold uppercase tracking-wider px-3 md:px-5 py-1.5 md:py-2 rounded shadow-md transition-all whitespace-nowrap">Open Account</Link>
            </>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
               <div className="hidden sm:flex flex-col items-end">
                   <span className="text-[10px] md:text-[11px] font-bold text-[#0a0f18] leading-none">Alexander</span>
                   <span className="text-[8px] md:text-[9px] text-gray-500 font-mono tracking-widest uppercase">Verified</span>
               </div>
               <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 overflow-hidden shadow-sm">
                   <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" alt="User Avatar" />
               </div>
               <button onClick={toggle} className="md:hidden p-1 ml-1 text-[#0a0f18] hover:bg-gray-100 rounded">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
               </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
