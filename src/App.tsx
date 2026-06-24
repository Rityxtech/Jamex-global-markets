import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

declare const __BASE_PATH__: string;
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Invest from './pages/Invest';
import Plans from './pages/Plans';
import Wallet from './pages/Wallet';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import ConfirmInvestment from './pages/ConfirmInvestment';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Kyc from './pages/Kyc';
import Referral from './pages/Referral';
import TransactionHistory from './pages/TransactionHistory';
import Support from './pages/Support';
import UserSupportChat from './pages/UserSupportChat';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Loans from './pages/Loans';
import Header from './components/Header';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminPlanManagement from './pages/admin/AdminPlanManagement';
import AdminFinancials from './pages/admin/AdminFinancials';
import AdminSupport from './pages/admin/AdminSupport';
import AdminLiveChat from './pages/admin/AdminLiveChat';
import AdminKYCReview from './pages/admin/AdminKYCReview';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReferrals from './pages/admin/AdminReferrals';
import { useAuthStore } from './store/authStore';
import { useMarketStore } from './store/marketStore';
import { useSiteSettingsStore } from './store/siteSettingsStore';
import LiveChatWidget from './components/LiveChatWidget';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LiveChatWidgetWrapper() {
  const { pathname } = useLocation();
  const hideOnPaths = ['/admin', '/login', '/register', '/forgot-password', '/reset-password', '/admin-login'];
  if (hideOnPaths.some((p) => pathname.startsWith(p))) return null;
  return <LiveChatWidget />;
}

/** Shows Home for guests; redirects authenticated users to /dashboard */
function RootRoute() {
  const { user, loading, profile } = useAuthStore();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }
  if (user) {
    if (profile?.is_admin) return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <Home />;
}

export default function App() {
  const { initialize, recoverSession } = useAuthStore();
  const { connect, disconnect } = useMarketStore();
  const { siteName, fetchSettings, subscribe } = useSiteSettingsStore();

  useEffect(() => {
    initialize();
    connect();
    return () => disconnect();
  }, [initialize, connect, disconnect]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        recoverSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [recoverSession]);

  useEffect(() => {
    fetchSettings();
    return subscribe();
  }, [fetchSettings, subscribe]);

  useEffect(() => {
    if (siteName) {
      document.title = `${siteName} | Institutional Wealth Management`;
    }
  }, [siteName]);

  console.log('[DEBUG] __BASE_PATH__ =', __BASE_PATH__);
  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <ScrollToTop />
      <Header />
      <LiveChatWidgetWrapper />
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/about" element={<About />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/contact" element={<Contact />} />

        {/* Public Routes (guests only) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes — Sidebar & BottomNav live in AppLayout, mounted once */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invest" element={<Invest />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/kyc" element={<Kyc />} />
            <Route path="/referrals" element={<Referral />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/support" element={<Support />} />
            <Route path="/support/chat" element={<UserSupportChat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/confirm-investment" element={<ConfirmInvestment />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/users/:id" element={<AdminKYCReview />} />
            <Route path="/admin/plans" element={<AdminPlanManagement />} />
            <Route path="/admin/financials" element={<AdminFinancials />} />
            <Route path="/admin/support" element={<AdminSupport />} />
            <Route path="/admin/livechat" element={<AdminLiveChat />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/referrals" element={<AdminReferrals />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
