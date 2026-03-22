"use client";

import React from 'react';
import { CheckCircle2, Circle, ChevronLeft, Menu, X, Award, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WrpPage } from '@/lib/wrpSyllabus';
import { useProgress } from '@/components/providers/ProgressProvider';

const TYPE_ICON: Record<string, string> = {
  read: '📖',
  interview: '🎯',
  'email-practice': '✉️',
  games: '🎮',
  'cv-builder': '📄',
  quiz: '⚡',
};

export default function WrpSidebar({ pages, onClose }: { pages: WrpPage[]; onClose?: () => void }) {
  const pathname = usePathname();
  const { completedPages } = useProgress();
  const [collapsed, setCollapsed] = React.useState(false);

  const completedCount = pages.filter(p => completedPages[p.id]).length;
  const examUnlocked = completedCount >= Math.floor(pages.length * 0.8);

  return (
    <aside className={`h-full border-r border-border-subtle bg-background flex flex-col shrink-0 overflow-hidden transition-all duration-300 ${collapsed ? 'w-16' : 'w-72'}`}>
      <div className="p-4 border-b border-border-subtle shrink-0 flex items-center justify-between">
        {!collapsed && <h2 className="text-sm font-bold text-secondary-text uppercase tracking-wider">Program Modules</h2>}
        <div className="flex items-center gap-1">
          {onClose && (
            <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded text-secondary-text hover:text-white transition-colors md:hidden">
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 hover:bg-secondary rounded text-secondary-text hover:text-white transition-colors hidden md:flex ${collapsed ? 'mx-auto mt-2' : ''}`}
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto py-2">
          {/* Progress bar */}
          <div className="px-4 py-3 mb-2">
            <div className="flex justify-between text-xs text-secondary-text mb-1.5">
              <span>Progress</span>
              <span className="text-accent font-bold">{completedCount}/{pages.length}</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${pages.length > 0 ? (completedCount / pages.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="px-4 py-2 flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-accent shrink-0" />
            <span className="text-sm font-bold text-foreground">Work Readiness</span>
          </div>

          <div className="pl-4 py-1">
            {pages.map(page => {
              const isActive = pathname === `/wrp/lesson/${page.id}`;
              const done = !!completedPages[page.id];
              return (
                <Link
                  href={`/wrp/lesson/${page.id}`}
                  key={page.id}
                  className={`flex items-start gap-2 px-4 py-2 text-sm rounded-l-md transition-colors ${
                    isActive
                      ? 'bg-secondary border-r-2 border-accent text-accent font-medium'
                      : 'text-secondary-text hover:text-foreground hover:bg-secondary/30'
                  }`}
                >
                  {done
                    ? <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    : <Circle className="w-4 h-4 text-secondary-text/50 shrink-0 mt-0.5" />}
                  <span className="leading-snug">
                    <span className="mr-1">{TYPE_ICON[page.type] || '📖'}</span>
                    {page.title}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Certificate link */}
          <div className="mt-4 mx-4 border-t border-border-subtle pt-4">
            <Link
              href="/wrp/certificate"
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
                examUnlocked
                  ? 'bg-accent/10 text-accent hover:bg-accent/20 border border-accent/30'
                  : 'text-secondary-text/40 cursor-not-allowed pointer-events-none border border-border-subtle'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Get Certificate</span>
              {!examUnlocked && <span className="text-[10px] ml-auto">80% required</span>}
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
