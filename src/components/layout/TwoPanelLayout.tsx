"use client";

import React, { ReactNode, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface TwoPanelLayoutProps {
  leftPanel: ReactNode;
  rightPanel?: ReactNode;
}

export default function TwoPanelLayout({ leftPanel, rightPanel }: TwoPanelLayoutProps) {
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  if (!rightPanel) {
    return (
      <div className="w-full h-full p-6 overflow-y-auto">
        {leftPanel}
      </div>
    );
  }

  // Simple Flexbox with smooth transition classes for collapsing Right Panel
  return (
    <div className="flex h-full w-full relative">
      {/* Left Theory Panel */}
      <div className={`h-full overflow-hidden bg-background transition-all duration-500 ease-in-out ${isRightCollapsed ? 'flex-1' : 'flex-[4]'}`}>
        <div className="h-full overflow-y-auto w-full p-6">
          {leftPanel}
        </div>
      </div>
      
      {/* Middle Divider / Toggle Button */}
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
  );
}
