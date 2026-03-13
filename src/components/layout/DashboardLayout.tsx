"use client";

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { PartData } from '@/lib/syllabus';

interface DashboardLayoutProps {
  children: React.ReactNode;
  syllabus?: PartData[];
}

export default function DashboardLayout({ children, syllabus = [] }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-foreground">
      <Header syllabus={syllabus} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar syllabus={syllabus} />
        <main className="flex-1 flex flex-col overflow-hidden bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
