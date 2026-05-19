import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Invest from './pages/Invest';
import Wallet from './pages/Wallet';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import ConfirmInvestment from './pages/ConfirmInvestment';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Kyc from './pages/Kyc';
import Referral from './pages/Referral';
import TransactionHistory from './pages/TransactionHistory';
import Support from './pages/Support';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Loans from './pages/Loans';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { useAuthStore } from './store/authStore';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter basename="/Jamex-global-markets">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Public Routes (Only accessible if logged out) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected Routes (Only accessible if logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invest" element={<Invest />} />
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
      </Routes>
    </BrowserRouter>
  );
}

