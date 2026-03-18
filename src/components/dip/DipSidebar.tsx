"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, CheckCircle2, Circle, Menu, ChevronLeft, Award } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PartData } from '@/lib/syllabus';
import { useProgress } from '@/components/providers/ProgressProvider';

export default function DipSidebar({ syllabus }: { syllabus: PartData[] }) {
  const pathname = usePathname();
  const { completedPages } = useProgress();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const part = syllabus[0]; // DIP only uses Part 1
  const sortedChapters = part ? [...part.chapters].sort((a, b) => a.order - b.order) : [];

  const getInitialExpanded = () => {
    const chapters: Record<string, boolean> = {};
    sortedChapters.forEach(chapter => {
      if (chapter.pages.some(p => `/dip/lesson/${p.id}` === pathname)) {
        chapters[chapter.id] = true;
      }
    });
    return chapters;
  };

  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(getInitialExpanded);

  useEffect(() => {
    const expanded = getInitialExpanded();
    setExpandedChapters(prev => ({ ...prev, ...expanded }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggle = (id: string) => setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));

  // Count total pages to determine if exam is unlocked
  const totalPages = sortedChapters.reduce((acc, c) => acc + c.pages.length, 0);
  const completedCount = sortedChapters.reduce((acc, c) =>
    acc + c.pages.filter(p => completedPages[p.id]).length, 0);
  const examUnlocked = completedCount >= Math.floor(totalPages * 0.8);

  return (
    <aside className={`h-full border-r border-border-subtle bg-background flex flex-col shrink-0 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'}`}>
      <div className="p-4 border-b border-border-subtle shrink-0 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-sm font-bold text-secondary-text uppercase tracking-wider">Table of Contents</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 hover:bg-secondary rounded text-secondary-text hover:text-white transition-colors ${isCollapsed ? 'mx-auto mt-2' : ''}`}
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto py-2">
          {sortedChapters.map((chapter, idx) => {
            const isExpanded = !!expandedChapters[chapter.id];
            const chapterCompleted = chapter.pages.filter(p => completedPages[p.id]).length;
            return (
              <div key={chapter.id} className="mb-1">
                <div
                  onClick={() => toggle(chapter.id)}
                  className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-secondary/50 transition-colors"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-secondary-text shrink-0" /> : <ChevronRight className="w-4 h-4 text-secondary-text shrink-0" />}
                  <span className="text-sm font-medium text-foreground/90 truncate leading-snug flex-1">
                    Ch.{idx + 1}: {chapter.title.replace(/^Chapter \d+: /, '')}
                  </span>
                  <span className="text-[10px] text-secondary-text shrink-0">{chapterCompleted}/{chapter.pages.length}</span>
                </div>

                {isExpanded && (
                  <div className="pl-6 py-1">
                    {[...chapter.pages].sort((a, b) => a.order - b.order).map(page => {
                      const isActive = pathname === `/dip/lesson/${page.id}`;
                      return (
                        <Link
                          href={`/dip/lesson/${page.id}`}
                          key={page.id}
                          className={`flex items-start gap-2 px-4 py-2 text-sm rounded-l-md transition-colors ${isActive ? 'bg-secondary border-r-2 border-accent text-accent font-medium' : 'text-secondary-text hover:text-foreground hover:bg-secondary/30'}`}
                        >
                          {completedPages[page.id] ? (
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-secondary-text/50 shrink-0 mt-0.5" />
                          )}
                          <span className="leading-snug">{page.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Exam link at the bottom */}
          <div className="mt-4 mx-4 border-t border-border-subtle pt-4">
            <Link
              href="/dip/exam"
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
                examUnlocked
                  ? 'bg-accent/10 text-accent hover:bg-accent/20 border border-accent/30'
                  : 'text-secondary-text/40 cursor-not-allowed pointer-events-none border border-border-subtle'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Final Exam & Certificate</span>
              {!examUnlocked && <span className="text-[10px] ml-auto">80% required</span>}
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
