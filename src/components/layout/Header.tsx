"use client";

import React from 'react';
import { BookOpen, UserCircle, LayoutTemplate } from 'lucide-react';
import { useProgress } from '@/components/providers/ProgressProvider';
import { PartData } from '@/lib/syllabus';

interface HeaderProps {
  syllabus?: PartData[];
}

export default function Header({ syllabus = [] }: HeaderProps) {
  const { completedPages } = useProgress();

  let totalPages = 0;
  syllabus.forEach(part => {
    part.chapters.forEach(chapter => {
      totalPages += chapter.pages.length;
    });
  });

  // Since progress might track keys not currently in syllabus (if modified), we count intersection or just length. 
  // For safety, we can count total keys marked true. 
  const completedCount = Object.keys(completedPages).filter(k => completedPages[k]).length;
  // Cap it at 100% just in case of stale cache
  const progressPercentage = totalPages > 0 ? Math.min(100, Math.round((completedCount / totalPages) * 100)) : 0;

  return (
    <header className="h-16 w-full border-b border-border-subtle bg-secondary flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center gap-3">
        <div className="bg-white/10 p-1.5 rounded-lg">
          <img src="/logo_white.png" alt="WeThinkCode" className="w-8 h-8 object-contain" />
        </div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          WeThinkCode_ IDC Curriculum
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Progress Bar */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-secondary-text">Syllabus Progress</span>
          <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
          <span className="text-sm font-bold text-accent">{progressPercentage}%</span>
        </div>

        {/* Mode Toggle & Profile */}
        <div className="flex items-center gap-4 border-l border-border-subtle pl-4">
          <button className="flex items-center gap-2 text-sm text-secondary-text hover:text-foreground transition-colors">
            <LayoutTemplate className="w-4 h-4" />
            <span className="hidden sm:inline">Learn Mode</span>
          </button>
          
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border-subtle">
            <ClientUsername />
            <UserCircle className="w-8 h-8 text-secondary-text" />
          </div>
        </div>
      </div>
    </header>
  );
}

// Separate client component to prevent hydration errors when reading localStorage
function ClientUsername() {
  const [username, setUsername] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUsername(localStorage.getItem('ioai_user') || 'Guest');
  }, []);

  return (
    <div className="flex flex-col items-end">
      <span className="text-sm font-bold text-foreground capitalize">
        {username || '...'}
      </span>
      {username && (
        <button 
          onClick={() => {
            localStorage.removeItem('ioai_user');
            window.location.href = '/login';
          }}
          className="text-[10px] text-error hover:text-error/80 uppercase tracking-wider font-semibold"
        >
          Sign Out
        </button>
      )}
    </div>
  );
}
