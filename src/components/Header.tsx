import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  const { user, signOut } = useAuthStore();
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Handle scroll effect for glassmorphism intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 right-0 z-[60] transition-all duration-300 ${
        isLoggedIn ? 'left-0 md:left-64' : 'left-0'
      } ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(37,99,235,0.1)] border-b border-white/40' 
          : 'bg-white/60 backdrop-blur-md border-b border-white/20'
      } h-16 flex items-center justify-between px-4 md:px-8`}
    >
      {/* Background glow effect for bright premium feel */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent pointer-events-none rounded-b-xl"></div>
      
      {/* LEFT SIDE: Brand (Logged Out) or Menu Trigger (Logged In Mobile) */}
      <div className="flex items-center gap-4 relative z-10">
        {!isLoggedIn ? (
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#b4c5ff] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0d1322] to-[#2563eb] tracking-tight">
              Jamex Global
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.dispatchEvent(new Event('toggle-mobile-menu'))}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/50 text-[#0d1322] border border-[#2563eb]/20 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="text-lg md:text-xl font-bold text-[#0d1322] tracking-tight hidden sm:block md:hidden">
              Jamex Global
            </h1>
            
            {/* Desktop Logged In Nav items (optional addition for premium feel) */}
            <div className="hidden lg:flex items-center bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#2563eb]/10 shadow-inner">
              <span className="material-symbols-outlined text-[#2563eb]/60 text-[20px] mr-2">search</span>
              <input 
                className="bg-transparent border-none outline-none focus:ring-0 text-sm text-[#0d1322] placeholder:text-gray-400 w-48 font-medium" 
                placeholder="Search assets..." 
                type="text" 
              />
            </div>
          </div>
        )}
      </div>

      {/* CENTER: Navigation Links (Logged Out Desktop) */}
      {!isLoggedIn && (
        <nav className="hidden md:flex items-center gap-8 relative z-10">
          <Link to="/" className="text-sm font-bold text-[#2563eb] border-b-2 border-[#2563eb] py-1">Home</Link>
          <a href="#" className="text-sm font-semibold text-gray-600 hover:text-[#2563eb] transition-colors py-1">Markets</a>
          <a href="#" className="text-sm font-semibold text-gray-600 hover:text-[#2563eb] transition-colors py-1">Wealth</a>
          <a href="#" className="text-sm font-semibold text-gray-600 hover:text-[#2563eb] transition-colors py-1">Company</a>
        </nav>
      )}

      {/* RIGHT SIDE: Auth Buttons / Profile & Fake Logo */}
      <div className="flex items-center gap-4 relative z-10">
        {!isLoggedIn ? (
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 text-sm font-bold text-[#0d1322] hover:text-[#2563eb] transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2 text-sm font-bold bg-[#2563eb] text-white rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all">
              Get Started
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/deposit')} 
              className="hidden sm:flex items-center gap-1 bg-[#2563eb] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.5)] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Deposit
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <button onClick={handleLogout} className="relative w-10 h-10 rounded-full bg-white/60 hover:bg-error/10 border border-[#2563eb]/10 flex items-center justify-center text-gray-600 hover:text-error transition-all shadow-sm group">
                <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">logout</span>
              </button>
              <Link to="/profile" className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden hover:border-[#2563eb] transition-colors bg-gray-100 cursor-pointer">
                <img alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8rnZBb6DNeNhGDYvtVvvofqp-s6sLQVmilHaqeqKBcD-6Mz-EGcqhvwJDsaBzor3-TNIGY7YLMF0PKALoslp4OYBS5ixeDdkQYPZwrzya2HwHdalEYNUi7f1gTmczAlDEcRC8PzfbFV1QluVYj7k6Jb8PjpIY8nX_QEQeBid_xg-qSOW6ZwEVm9A8u9oAw21hdjZ73UmfRwHrvrtfgOGn_5VQHH_Rg6r93mz6P3L7IbsrKZID-y6mrrW9D7gLWmEF7q3E74C9qzfj" className="w-full h-full object-cover" />
              </Link>
            </div>
          </div>
        )}

        {/* Fake Logo on the right end (as requested) */}
        <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-tr from-pink-500 to-orange-400 text-white font-black text-xs shadow-lg ml-2 border border-white/50 cursor-help" title="Fake Logo (To be removed)">
          FL
        </div>
      </div>
    </header>
  );
}
