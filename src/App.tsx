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
  if (user) return <Navigate to="/dashboard" replace />;
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
      </Routes>
    </BrowserRouter>
  );
}
