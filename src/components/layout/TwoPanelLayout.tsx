"use client";

import React, { ReactNode, useState } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Code2 } from 'lucide-react';

interface TwoPanelLayoutProps {
  leftPanel: ReactNode;
  rightPanel?: ReactNode;
}

export default function TwoPanelLayout({ leftPanel, rightPanel }: TwoPanelLayoutProps) {
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [mobileTab, setMobileTab] = useState<'theory' | 'practice'>('theory');

  if (!rightPanel) {
    return (
      <div className="w-full h-full p-4 md:p-6 overflow-y-auto">
        {leftPanel}
      </div>
    );
  }

  return (
    <>
      {/* ── MOBILE: tab switcher + single panel ── */}
      <div className="flex flex-col h-full md:hidden">
        <div className="flex shrink-0 border-b border-border-subtle bg-secondary">
          <button
            onClick={() => setMobileTab('theory')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              mobileTab === 'theory' ? 'text-accent border-b-2 border-accent' : 'text-secondary-text'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Theory
          </button>
          <button
            onClick={() => setMobileTab('practice')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              mobileTab === 'practice' ? 'text-accent border-b-2 border-accent' : 'text-secondary-text'
            }`}
          >
            <Code2 className="w-4 h-4" /> Practice
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          {mobileTab === 'theory' ? (
            <div className="h-full overflow-y-auto p-4">{leftPanel}</div>
          ) : (
            <div className="h-full overflow-y-auto flex flex-col">{rightPanel}</div>
          )}
        </div>
      </div>

      {/* ── DESKTOP: original side-by-side layout ── */}
      <div className="hidden md:flex h-full w-full relative">
        {/* Left Theory Panel */}
        <div className={`h-full overflow-hidden bg-background transition-all duration-500 ease-in-out ${isRightCollapsed ? 'flex-1' : 'flex-[4]'}`}>
          <div className="h-full overflow-y-auto w-full p-6">
            {leftPanel}
          </div>
        </div>

        {/* Divider / Toggle */}
        <div className="w-1 bg-border-subtle shrink-0 relative flex items-center justify-center hover:bg-accent/50 transition-colors z-10 cursor-col-resize">
          <button
            onClick={() => setIsRightCollapsed(!isRightCollapsed)}
            className="absolute w-6 h-12 bg-secondary border border-border-subtle rounded flex items-center justify-center cursor-pointer text-secondary-text hover:text-white hover:border-accent hover:bg-[#2a2a2a] transition-all z-20 shadow-md"
            title={isRightCollapsed ? "Expand Editor" : "Collapse Editor"}
          >
            {isRightCollapsed ? <ChevronLeft className="w-4 h-4 text-accent" /> : <ChevronRight className="w-4 h-4 text-accent" />}
          </button>
        </div>

        {/* Right Practice Panel */}
        <div className={`h-full overflow-hidden bg-secondary transition-all duration-500 ease-in-out ${isRightCollapsed ? 'w-0 flex-none opacity-0' : 'flex-[6] opacity-100'}`}>
          <div className="h-full overflow-y-auto w-full flex flex-col min-w-[300px]">
            {rightPanel}
          </div>
        </div>
      </div>
    </>
  );
}
