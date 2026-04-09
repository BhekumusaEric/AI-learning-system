"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Menu, ChevronLeft, Award, BookOpen, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PartData } from '@/lib/syllabus';
import { useProgress } from '@/components/providers/ProgressProvider';

export default function DipSidebar({ syllabus, onClose }: { syllabus: PartData[]; onClose?: () => void }) {
  const pathname = usePathname();
  const { completedPages } = useProgress();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [examPassed, setExamPassed] = useState(false);

  const part1 = syllabus.find(p => p.id === 'part1_foundational_skills_classical_ml');
  const chapter1 = part1?.chapters.find(c => c.id === 'chapter1_python_programming_fundamentals');
  const chapter2 = part1?.chapters.find(c => c.id === 'chapter2_battle_grounds');
  const fundamentalPages = chapter1 ? [...chapter1.pages].sort((a, b) => a.order - b.order) : [];
  const battlePages = chapter2 ? [...chapter2.pages].sort((a, b) => a.order - b.order) : [];

  const totalPages = fundamentalPages.length;
  const completedCount = fundamentalPages.filter(p => completedPages[p.id]).length;
  const examUnlocked = completedCount >= Math.floor(totalPages * 0.8);

  useEffect(() => {
    // Check localStorage first for instant render
    if (localStorage.getItem('dip_exam_passed') === 'true') {
      setExamPassed(true);
      return;
    }
    // Then verify from DB
    const loginId = localStorage.getItem('ioai_user');
    if (!loginId) return;
    fetch(`/api/progress?username=${loginId}`)
      .then(r => r.json())
      .then(data => {
        if (data.examPassed === true) {
          setExamPassed(true);
          localStorage.setItem('dip_exam_passed', 'true');
        }
      })
      .catch(() => {});
  }, []);

  return (
    <aside className={`h-full border-r border-border-subtle bg-background flex flex-col shrink-0 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-72'}`}>
      <div className="p-4 border-b border-border-subtle shrink-0 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-sm font-bold text-secondary-text uppercase tracking-wider">Table of Contents</h2>}
        <div className="flex items-center gap-1">
          {onClose && (
            <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded text-secondary-text hover:text-white transition-colors md:hidden">
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 hover:bg-secondary rounded text-secondary-text hover:text-white transition-colors hidden md:flex ${isCollapsed ? 'mx-auto mt-2' : ''}`}
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto py-2">

          {/* Chapter 1: Python Fundamentals */}
          <div className="px-4 py-2 flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-accent shrink-0" />
            <span className="text-sm font-bold text-foreground truncate">Python Fundamentals</span>
            <span className="text-[10px] text-secondary-text ml-auto shrink-0">{fundamentalPages.filter(p => completedPages[p.id]).length}/{fundamentalPages.length}</span>
          </div>
          <div className="pl-4 py-1">
            {fundamentalPages.map(page => {
              const isActive = pathname === `/dip/lesson/${page.id}`;
              return (
                <Link href={`/dip/lesson/${page.id}`} key={page.id}
                  className={`flex items-start gap-2 px-4 py-2 text-sm rounded-l-md transition-colors ${
                    isActive ? 'bg-secondary border-r-2 border-accent text-accent font-medium'
                      : 'text-secondary-text hover:text-foreground hover:bg-secondary/30'
                  }`}
                >
                  {completedPages[page.id] ? <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /> : <Circle className="w-4 h-4 text-secondary-text/50 shrink-0 mt-0.5" />}
                  <span className="leading-snug">{page.title}</span>
                </Link>
              );
            })}
          </div>

          {/* Exam / Certificate links */}
          <div className="mt-4 mx-4 border-t border-border-subtle pt-4 flex flex-col gap-2">
            {examPassed ? (
              // Passed — show certificate button prominently, exam as secondary
              <>
                <Link
                  href="/dip/certificate"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold bg-accent/10 text-accent hover:bg-accent/20 border border-accent/30 transition-colors"
                >
                  <Award className="w-4 h-4 shrink-0" />
                  <span>My Certificate</span>
                  <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" />
                </Link>
                <Link
                  href="/dip/exam"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs text-secondary-text hover:text-foreground hover:bg-secondary/30 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>Review Exam</span>
                </Link>
              </>
            ) : (
              // Not passed — show exam link
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
            )}
          </div>

          {/* Chapter 2: Battle Grounds (optional) */}
          {battlePages.length > 0 && (
            <>
              <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                <span className="text-lg shrink-0">⚔️</span>
                <span className="text-sm font-bold text-foreground truncate">Battle Grounds</span>
                <span className="text-xs text-secondary-text/50 ml-1">(optional)</span>
                <span className="text-[10px] text-secondary-text ml-auto shrink-0">{battlePages.filter(p => completedPages[p.id]).length}/{battlePages.length}</span>
              </div>
              <div className="pl-4 py-1">
                {battlePages.map(page => {
                  const isActive = pathname === `/dip/lesson/${page.id}`;
                  return (
                    <Link href={`/dip/lesson/${page.id}`} key={page.id}
                      className={`flex items-start gap-2 px-4 py-2 text-sm rounded-l-md transition-colors ${
                        isActive ? 'bg-secondary border-r-2 border-accent text-accent font-medium'
                          : 'text-secondary-text hover:text-foreground hover:bg-secondary/30'
                      }`}
                    >
                      {completedPages[page.id] ? <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /> : <Circle className="w-4 h-4 text-secondary-text/50 shrink-0 mt-0.5" />}
                      <span className="leading-snug">{page.title}</span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
}
