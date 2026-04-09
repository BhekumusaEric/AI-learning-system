"use client";

import React, { useState } from 'react';
import WrpHeader from '@/components/wrp/WrpHeader';
import WrpSidebar from '@/components/wrp/WrpSidebar';
import { WrpPage } from '@/lib/wrpSyllabus';
import SessionGuard from '@/components/providers/SessionGuard';

export default function WrpDashboardLayout({ children, pages }: { children: React.ReactNode; pages: WrpPage[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-foreground">
      <SessionGuard platform="wrp" />
      <WrpHeader onMenuClick={() => setDrawerOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:flex h-full">
          <WrpSidebar pages={pages} />
        </div>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
            <div className="relative z-10 h-full">
              <WrpSidebar pages={pages} onClose={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col overflow-hidden bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
