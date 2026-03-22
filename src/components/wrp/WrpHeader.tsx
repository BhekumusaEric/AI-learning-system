"use client";

import React from 'react';
import { Briefcase, Menu, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WrpHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('ioai_user');
    localStorage.removeItem('ioai_name');
    router.push('/wrp/login');
  };

  const name = typeof window !== 'undefined'
    ? (localStorage.getItem('ioai_name') || '').replace(/_/g, ' ')
    : '';

  return (
    <header className="h-14 border-b border-border-subtle bg-background flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="p-1.5 hover:bg-secondary rounded text-secondary-text hover:text-white transition-colors md:hidden">
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="bg-accent/20 p-1.5 rounded-lg">
            <Briefcase className="w-4 h-4 text-accent" />
          </div>
          <div className="leading-tight">
            <p className="text-xs font-bold text-accent tracking-wider uppercase">WeThinkCode_</p>
            <p className="text-xs text-secondary-text">Work Readiness Program</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {name && <span className="text-sm text-secondary-text hidden sm:block">{name}</span>}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-secondary-text hover:text-error transition-colors px-2 py-1.5 rounded hover:bg-error/10"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:block">Log out</span>
        </button>
      </div>
    </header>
  );
}
