"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Menu, ChevronLeft, Award, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PartData } from '@/lib/syllabus';
import { useProgress } from '@/components/providers/ProgressProvider';

export default function DipSidebar({ syllabus }: { syllabus: PartData[] }) {
  const pathname = usePathname();
  const { completedPages } = useProgress();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // DIP = only chapter 1 (Python Fundamentals) pages, shown flat as topics
  const chapter1 = syllabus[0]?.chapters.find(c => c.id === 'chapter1_python_programming_fundamentals');
  const pages = chapter1 ? [...chapter1.pages].sort((a, b) => a.order - b.order) : [];

  const totalPages = pages.length;
  const completedCount = pages.filter(p => completedPages[p.id]).length;
  const examUnlocked = completedCount >= Math.floor(totalPages * 0.8);

  return (
    <aside className={`h-full border-r border-border-subtle bg-background flex flex-col shrink-0 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-72'}`}>
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

          {/* Part 1 header — non-collapsible, always open */}
          <div className="px-4 py-2 flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-accent shrink-0" />
            <span className="text-sm font-bold text-foreground truncate">Part 1: Python Fundamentals</span>
            <span className="text-[10px] text-secondary-text ml-auto shrink-0">{completedCount}/{totalPages}</span>
          </div>

          {/* Topics listed directly — these are the "chapters" */}
          <div className="pl-4 py-1">
            {pages.map(page => {
              const isActive = pathname === `/dip/lesson/${page.id}`;
              return (
                <Link
                  href={`/dip/lesson/${page.id}`}
                  key={page.id}
                  className={`flex items-start gap-2 px-4 py-2 text-sm rounded-l-md transition-colors ${
                    isActive
                      ? 'bg-secondary border-r-2 border-accent text-accent font-medium'
                      : 'text-secondary-text hover:text-foreground hover:bg-secondary/30'
                  }`}
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

          {/* Exam link */}
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
