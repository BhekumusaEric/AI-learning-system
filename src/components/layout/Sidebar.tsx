"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, CheckCircle2, Circle, BookOpen, Menu, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PartData } from '@/lib/syllabus';
import { useProgress } from '@/components/providers/ProgressProvider';

interface SidebarProps {
  syllabus: PartData[];
}

export default function Sidebar({ syllabus }: SidebarProps) {
  const pathname = usePathname();
  const { completedPages } = useProgress();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sort parts so they display in proper numeric order
  const sortedSyllabus = [...syllabus].sort((a, b) => a.order - b.order);

  // Initialise expanded state based on active path
  const getInitialExpanded = () => {
    const parts: Record<string, boolean> = {};
    const chapters: Record<string, boolean> = {};
    syllabus.forEach(part => {
      part.chapters.forEach(chapter => {
        const isActive = chapter.pages.some(p => "/lesson/" + p.id === pathname);
        if (isActive) {
          parts[part.id] = true;
          chapters[chapter.id] = true;
        }
      });
    });
    return { parts, chapters };
  };

  const initial = getInitialExpanded();
  const [expandedParts, setExpandedParts] = useState<Record<string, boolean>>(initial.parts);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(initial.chapters);

  // Re-expand when navigating to a new lesson
  useEffect(() => {
    if (!pathname) return;
    const { parts, chapters } = getInitialExpanded();
    setExpandedParts(prev => ({ ...prev, ...parts }));
    setExpandedChapters(prev => ({ ...prev, ...chapters }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const togglePart = (id: string) => setExpandedParts(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleChapter = (id: string) => setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className={`h-full border-r border-border-subtle bg-background flex flex-col shrink-0 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'}`}>
      <div className="p-4 border-b border-border-subtle shrink-0 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-sm font-bold text-secondary-text uppercase tracking-wider mb-2">Table of Contents</h2>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className={`p-1.5 hover:bg-secondary rounded text-secondary-text hover:text-white transition-colors ${isCollapsed ? 'mx-auto mt-2' : ''}`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto py-2">
          {sortedSyllabus.map(part => {
            const isPartExpanded = !!expandedParts[part.id];
            
            return (
              <div key={part.id} className="mb-4">
                <div 
                  onClick={() => togglePart(part.id)}
                  className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-secondary/50 transition-colors"
                >
                  {isPartExpanded ? (
                    <ChevronDown className="w-4 h-4 text-secondary-text shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-secondary-text shrink-0" />
                  )}
                  <BookOpen className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm font-semibold truncate leading-snug">{part.title}</span>
                </div>
                
                {isPartExpanded && (
                  <div className="pl-6">
                    {[...part.chapters].sort((a,b) => a.order - b.order).map(chapter => {
                      const isChapterExpanded = !!expandedChapters[chapter.id];
                      
                      return (
                        <div key={chapter.id} className="mt-1">
                          <div 
                            onClick={() => toggleChapter(chapter.id)}
                            className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-secondary/50 transition-colors"
                          >
                            {isChapterExpanded ? (
                              <ChevronDown className="w-4 h-4 text-secondary-text shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-secondary-text shrink-0" />
                            )}
                            <span className="text-sm font-medium text-foreground/90 truncate leading-snug">{chapter.title}</span>
                          </div>
                          
                          {isChapterExpanded && (
                            <div className="pl-6 py-1">
                              {[...chapter.pages].sort((a,b) => a.order - b.order).map(page => {
                                const isActive = pathname === "/lesson/" + page.id;
                                return (
                                  <Link 
                                    href={"/lesson/" + page.id}
                                    key={page.id}
                                    className={"flex items-start gap-2 px-4 py-2 text-sm rounded-l-md transition-colors " + (isActive ? 'bg-secondary border-r-2 border-accent text-accent font-medium' : 'text-secondary-text hover:text-foreground hover:bg-secondary/30')}
                                  >
                                    {completedPages[page.id] ? (
                                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-secondary-text/50 shrink-0 mt-0.5" />
                                    )}
                                    <span className="leading-snug">
                                      {page.title}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
