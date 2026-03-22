"use client";

import React, { useState } from 'react';
import DipHeader from '@/components/dip/DipHeader';
import DipSidebar from '@/components/dip/DipSidebar';
import { PartData } from '@/lib/syllabus';

export default function DipLayout({ children, syllabus }: { children: React.ReactNode; syllabus: PartData[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-foreground">
      <DipHeader syllabus={syllabus} onMenuClick={() => setDrawerOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar — hidden on mobile */}
        <div className="hidden md:flex h-full">
          <DipSidebar syllabus={syllabus} />
        </div>

        {/* Mobile drawer overlay */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
            <div className="relative z-10 h-full">
              <DipSidebar syllabus={syllabus} onClose={() => setDrawerOpen(false)} />
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
