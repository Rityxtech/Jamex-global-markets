import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function PublicRoute() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  if (user) {
    if (user.email === 'akugbof@gmail.com') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
