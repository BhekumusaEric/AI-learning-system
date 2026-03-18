"use client";

import React from 'react';
import DipHeader from '@/components/dip/DipHeader';
import DipSidebar from '@/components/dip/DipSidebar';
import { PartData } from '@/lib/syllabus';

export default function DipLayout({ children, syllabus }: { children: React.ReactNode; syllabus: PartData[] }) {
  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-foreground">
      <DipHeader syllabus={syllabus} />
      <div className="flex flex-1 overflow-hidden">
        <DipSidebar syllabus={syllabus} />
        <main className="flex-1 flex flex-col overflow-hidden bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
