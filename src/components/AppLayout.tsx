import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

/**
 * AppLayout — single shell for all authenticated pages.
 * Sidebar and BottomNav are mounted once here so their height
 * never changes between page navigations.
 */
export default function AppLayout() {
  return (
    <div className="deep-mesh-bg text-on-surface selection:bg-primary/30 min-h-screen dark bg-background">
      {/* Sidebar: fixed, always the same height = 100vh minus header */}
      <Sidebar />

      {/* Page content shifted right by sidebar width on desktop */}
      <main className="md:ml-64 min-h-screen flex flex-col pt-14 md:pt-16 pb-[68px] md:pb-0">
        <Outlet />
      </main>

      {/* Bottom nav: fixed, mobile only */}
      <BottomNav />
    </div>
  );
}
