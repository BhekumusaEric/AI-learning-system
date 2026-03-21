"use client";

import React from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning?: boolean;
  isLoading?: boolean;
}

export default function CodeEditor({ code, onChange, onRun, onReset, isRunning = false, isLoading = false }: CodeEditorProps) {
  const busy = isRunning || isLoading;
  return (
    <div className="flex flex-col h-1/2 min-h-[300px] border-b border-border-subtle bg-[#1e1e1e]">
      <div className="flex items-center justify-between p-3 shrink-0 bg-[#252526] border-b border-border-subtle">
        <span className="text-sm font-semibold text-[#cccccc]">main.py</span>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="text-xs text-secondary-text animate-pulse">⏳ Loading environment...</span>
          )}
          <button
            onClick={onReset}
            disabled={busy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-transparent hover:bg-white/10 text-secondary-text transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={onRun}
            disabled={busy}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded bg-accent text-black hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" fill="currentColor" />
            {isLoading ? 'Loading...' : isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'var(--font-jetbrains-mono)',
            fontLigatures: true,
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
          }}
        />
      </div>
    </div>
  );
}
