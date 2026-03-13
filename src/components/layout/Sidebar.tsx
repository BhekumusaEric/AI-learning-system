"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, CheckCircle2, Circle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PartData } from '@/lib/syllabus';

interface SidebarProps {
  syllabus: PartData[];
}

export default function Sidebar({ syllabus }: SidebarProps) {
  const pathname = usePathname();
  const [expandedParts, setExpandedParts] = useState<Record<string, boolean>>({});
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  // Sort parts so they display in proper numeric order
  const sortedSyllabus = [...syllabus].sort((a, b) => a.order - b.order);

  // Auto-expand the active part and chapter
  useEffect(() => {
    if (!pathname) return;
    
    let newExpandedParts = { ...expandedParts };
    let newExpandedChapters = { ...expandedChapters };
    let changed = false;

    syllabus.forEach(part => {
      const hasActivePage = part.chapters.some(c => c.pages.some(p => "/lesson/" + p.id === pathname));
      if (hasActivePage && !newExpandedParts[part.id]) {
        newExpandedParts[part.id] = true;
        changed = true;
      }
      
      part.chapters.forEach(chapter => {
        const isChapterActive = chapter.pages.some(p => "/lesson/" + p.id === pathname);
        if (isChapterActive && !newExpandedChapters[chapter.id]) {
          newExpandedChapters[chapter.id] = true;
          changed = true;
        }
      });
    });

    if (changed) {
      setExpandedParts(newExpandedParts);
      setExpandedChapters(newExpandedChapters);
    }
  }, [pathname, syllabus]);

  const togglePart = (id: string) => setExpandedParts(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleChapter = (id: string) => setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className="w-80 h-full border-r border-border-subtle bg-background flex flex-col shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-border-subtle shrink-0">
        <h2 className="text-sm font-bold text-secondary-text uppercase tracking-wider mb-2">Table of Contents</h2>
      </div>

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
                                  {page.completed ? (
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
    </aside>
  );
}
