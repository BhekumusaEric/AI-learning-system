"use client";

import React, { ReactNode } from 'react';

interface TwoPanelLayoutProps {
  leftPanel: ReactNode;
  rightPanel?: ReactNode;
}

export default function TwoPanelLayout({ leftPanel, rightPanel }: TwoPanelLayoutProps) {
  if (!rightPanel) {
    return (
      <div className="w-full h-full p-6 overflow-y-auto">
        {leftPanel}
      </div>
    );
  }

  // Simple Flexbox fallback to avoid dependency issues with react 19
  return (
    <div className="flex h-full w-full">
      <div className="flex-[4] h-full overflow-hidden bg-background">
        <div className="h-full overflow-y-auto w-full p-6">
          {leftPanel}
        </div>
      </div>
      <div className="w-1 bg-border-subtle shrink-0" />
      <div className="flex-[6] h-full overflow-hidden bg-secondary">
        <div className="h-full overflow-y-auto w-full flex flex-col">
          {rightPanel}
        </div>
      </div>
    </div>
  );
}
