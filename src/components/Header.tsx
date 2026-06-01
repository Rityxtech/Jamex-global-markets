import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { user, loading } = useAuthStore();
  const isLoggedIn = !!user;

  // Handle scroll effect for glassmorphism intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Do not render Header on auth pages or admin panel (AdminLayout has its own header)
  if (
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password' ||
    location.pathname.startsWith('/admin')
  ) {
    return null;
  }

  return (
    <header 
      className={`fixed top-0 right-0 left-0 z-[60] transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-900 shadow-md border-b-2 border-[#10B981]' 
          : 'bg-gray-800 border-b-2 border-[#10B981]'
      } h-14 md:h-16 flex items-center justify-between px-4 md:px-8`}
    >
      {/* Background glow effect for bright premium feel */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent pointer-events-none rounded-b-xl"></div>
      
      {/* LEFT SIDE: Brand */}
      <div className="flex items-center gap-4 relative z-[70]">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#b4c5ff] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
          </div>
          <span className="text-base md:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 tracking-tight">
            <span className="md:hidden">Jamex</span>
            <span className="hidden md:inline">Jamex Global</span>
          </span>
        </Link>
        
        {isLoggedIn && (
          <div className="hidden lg:flex items-center bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#2563eb]/10 shadow-inner ml-2">
            <span className="material-symbols-outlined text-[#2563eb]/60 text-[20px] mr-2">search</span>
            <input 
              className="bg-transparent border-none outline-none focus:ring-0 text-sm text-[#0d1322] placeholder:text-gray-400 w-48 font-medium" 
              placeholder="Search assets..." 
              type="text" 
            />
          </div>
        )}
      </div>

      {/* CENTER: Navigation Links (Logged Out Desktop) */}
      {!isLoggedIn && (
        <nav className="hidden md:flex items-center gap-8 relative z-[70]">
          <Link to="/" className="text-sm font-bold text-white border-b-2 border-white py-1">Home</Link>
          <Link to="/about" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors py-1">About us</Link>
          <Link to="/plans" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors py-1">Plans</Link>
          <Link to="/support" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors py-1">Contact us</Link>
        </nav>
      )}

      {/* RIGHT SIDE: Auth Buttons / Profile & Fake Logo */}
      <div className="flex items-center gap-4 relative z-[70]">
        {loading ? (
          /* Skeleton while auth state initializes — prevents flash of logged-out UI */
          <div className="flex items-center gap-3 animate-pulse">
            <div className="hidden sm:block w-24 h-8 bg-gray-700/60 rounded-xl"></div>
            <div className="w-10 h-10 bg-gray-700/60 rounded-full"></div>
          </div>
        ) : !isLoggedIn ? (
          <div className="flex items-center gap-1 sm:gap-3">
            <Link to="/login" className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white hover:text-gray-300 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold bg-[#2563eb] text-white rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all">
              Get Started
            </Link>
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-white rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[24px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
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
              <button 
                onClick={() => {
                  if (window.innerWidth < 768) {
                    window.dispatchEvent(new Event('toggle-mobile-menu'));
                  } else {
                    navigate('/profile');
                  }
                }}
                className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden hover:border-[#2563eb] transition-colors bg-gray-100 cursor-pointer p-0"
              >
                <img alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8rnZBb6DNeNhGDYvtVvvofqp-s6sLQVmilHaqeqKBcD-6Mz-EGcqhvwJDsaBzor3-TNIGY7YLMF0PKALoslp4OYBS5ixeDdkQYPZwrzya2HwHdalEYNUi7f1gTmczAlDEcRC8PzfbFV1QluVYj7k6Jb8PjpIY8nX_QEQeBid_xg-qSOW6ZwEVm9A8u9oAw21hdjZ73UmfRwHrvrtfgOGn_5VQHH_Rg6r93mz6P3L7IbsrKZID-y6mrrW9D7gLWmEF7q3E74C9qzfj" className="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        )}


      </div>

      {/* Mobile Menu Dropdown (Logged Out) */}
      {!isLoggedIn && (
        <>
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className={`absolute top-full left-0 right-0 bg-gray-900 border-b border-gray-800 z-[60] flex flex-col py-3 px-4 md:hidden shadow-2xl origin-top transition-all duration-300 ease-out overflow-hidden ${mobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
            <nav className="flex flex-col gap-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-bold transition-colors ${location.pathname === '/' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                <span className="material-symbols-outlined text-[20px]">home</span>
                Home
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-bold transition-colors ${location.pathname === '/about' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                <span className="material-symbols-outlined text-[20px]">info</span>
                About us
              </Link>
              <Link to="/plans" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-bold transition-colors ${location.pathname === '/plans' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                <span className="material-symbols-outlined text-[20px]">diamond</span>
                Plans
              </Link>
              <Link to="/support" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-bold transition-colors ${location.pathname === '/support' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                <span className="material-symbols-outlined text-[20px]">headset_mic</span>
                Contact us
              </Link>
            </nav>
            <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-gray-800">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-colors border border-gray-700">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold bg-[#2563eb] text-white hover:shadow-[0_4px_14px_rgba(37,99,235,0.6)] transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
