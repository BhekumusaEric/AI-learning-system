"use client";

import React from 'react';
import { BookOpen, UserCircle, Menu } from 'lucide-react';
import { useProgress } from '@/components/providers/ProgressProvider';
import { PartData } from '@/lib/syllabus';

export default function DipHeader({ syllabus, onMenuClick }: { syllabus: PartData[]; onMenuClick?: () => void }) {
  const { completedPages } = useProgress();

  // DIP = chapter 1 only
  const chapter1 = syllabus[0]?.chapters.find(c => c.id === 'chapter1_python_programming_fundamentals');
  const totalPages = chapter1?.pages.length ?? 0;
  const completedCount = Object.keys(completedPages).filter(k => completedPages[k]).length;
  const pct = totalPages > 0 ? Math.min(100, Math.round((completedCount / totalPages) * 100)) : 0;

  return (
    <header className="w-full border-b border-border-subtle bg-secondary shrink-0 z-20">
      <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button onClick={onMenuClick} className="p-2 hover:bg-background rounded text-secondary-text hover:text-white transition-colors md:hidden">
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="bg-accent/20 p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold text-foreground tracking-tight leading-tight">Digital Inclusion Program</h1>
            <p className="text-[10px] text-secondary-text leading-tight hidden sm:block">Powered by IDC SEF · 40 hrs</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-secondary-text">Progress</span>
            <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-sm font-bold text-accent">{pct}%</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3 border-l border-border-subtle pl-3 md:pl-4">
            <DipUsername />
            <UserCircle className="w-7 h-7 md:w-8 md:h-8 text-secondary-text" />
          </div>
        </div>
      </div>
      {/* Mobile progress bar */}
      <div className="h-0.5 bg-background md:hidden">
        <div className="h-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </header>
  );
}

function DipUsername() {
  const [username, setUsername] = React.useState<string | null>(null);
  React.useEffect(() => { setUsername(localStorage.getItem('ioai_user') || 'Guest'); }, []);
  return (
    <div className="flex flex-col items-end">
      <span className="text-sm font-bold text-foreground capitalize">{username || '...'}</span>
      {username && (
        <button
          onClick={() => { localStorage.removeItem('ioai_user'); window.location.href = '/dip/login'; }}
          className="text-[10px] text-error hover:text-error/80 uppercase tracking-wider font-semibold"
        >
          Sign Out
        </button>
      )}
    </div>
  );
}
