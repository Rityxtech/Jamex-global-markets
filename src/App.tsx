import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Invest from './pages/Invest';
import Plans from './pages/Plans';
import Wallet from './pages/Wallet';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import ConfirmInvestment from './pages/ConfirmInvestment';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Kyc from './pages/Kyc';
import Referral from './pages/Referral';
import TransactionHistory from './pages/TransactionHistory';
import Support from './pages/Support';
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
import AdminKYCReview from './pages/admin/AdminKYCReview';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReferrals from './pages/admin/AdminReferrals';
import { useAuthStore } from './store/authStore';
import { useMarketStore } from './store/marketStore';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Shows Home for guests; redirects authenticated users to /dashboard */
function RootRoute() {
  const { user, loading } = useAuthStore();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }
  if (user) {
    if (user.email === 'akugbof@gmail.com') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <Home />;
}

export default function App() {
  const { initialize } = useAuthStore();
  const { connect, disconnect } = useMarketStore();

  useEffect(() => {
    initialize();
    connect();
    return () => disconnect();
  }, [initialize, connect, disconnect]);

  return (
    <BrowserRouter basename="/Jamex-global-markets">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<RootRoute />} />

        {/* Public Routes (guests only) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected Routes — Sidebar & BottomNav live in AppLayout, mounted once */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invest" element={<Invest />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/kyc" element={<Kyc />} />
            <Route path="/referrals" element={<Referral />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/support" element={<Support />} />
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
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/referrals" element={<AdminReferrals />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
