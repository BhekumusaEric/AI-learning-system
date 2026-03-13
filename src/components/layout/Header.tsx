import React from 'react';
import { BookOpen, UserCircle, LayoutTemplate } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 w-full border-b border-border-subtle bg-secondary flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="bg-accent/20 p-2 rounded-lg">
          <BookOpen className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          IOAI Training Grounds
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Progress Bar */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-secondary-text">Syllabus Progress</span>
          <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-accent w-[45%]" />
          </div>
          <span className="text-sm font-bold text-accent">45%</span>
        </div>

        {/* Mode Toggle & Profile */}
        <div className="flex items-center gap-4 border-l border-border-subtle pl-4">
          <button className="flex items-center gap-2 text-sm text-secondary-text hover:text-foreground transition-colors">
            <LayoutTemplate className="w-4 h-4" />
            <span className="hidden sm:inline">Learn Mode</span>
          </button>
          
          <button className="text-secondary-text hover:text-foreground transition-colors">
            <UserCircle className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
