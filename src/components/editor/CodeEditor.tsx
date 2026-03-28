"use client";

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Play, RotateCcw } from 'lucide-react';

// Load Monaco only on client, never during SSR
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#1e1e1e] flex items-center justify-center">
      <span className="text-xs text-secondary-text animate-pulse">Loading editor...</span>
    </div>
  ),
});

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning?: boolean;
  isLoading?: boolean;
  onInputRequest?: (cb: (prompt: string) => Promise<string>) => void;
}

export default function CodeEditor({ code, onChange, onRun, onReset, isRunning = false, isLoading = false, onInputRequest }: CodeEditorProps) {
  const [inputPrompt, setInputPrompt] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  // Start as false — safe because MonacoEditor has ssr:false so it never
  // renders on the server regardless of this value
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resolverRef = useRef<((val: string) => void) | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (onInputRequest) {
      onInputRequest((prompt: string) => {
        setInputPrompt(prompt || '▶ Input required');
        setInputValue('');
        return new Promise<string>((resolve) => { resolverRef.current = resolve; });
      });
    }
  }, [onInputRequest]);

  useEffect(() => {
    if (inputPrompt !== null) inputRef.current?.focus();
  }, [inputPrompt]);

  function submitInput() {
    resolverRef.current?.(inputValue);
    resolverRef.current = null;
    setInputPrompt(null);
    setInputValue('');
  }

  const busy = isRunning || isLoading;

  return (
    <div className="flex flex-col h-1/2 min-h-[300px] border-b border-border-subtle bg-[#1e1e1e]">
      <div className="flex items-center justify-between p-3 shrink-0 bg-[#252526] border-b border-border-subtle">
        <span className="text-sm font-semibold text-[#cccccc]">main.py</span>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="text-xs text-secondary-text animate-pulse hidden sm:inline">Loading Python environment...</span>
          )}
          <button
            onClick={onReset}
            disabled={busy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded bg-transparent hover:bg-white/10 text-secondary-text transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={onRun}
            disabled={busy}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded bg-accent text-black hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" fill="currentColor" />
            {isLoading ? 'Loading...' : isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {inputPrompt !== null && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a2e] border-b border-accent/40">
          <span className="text-accent text-xs font-mono shrink-0">{inputPrompt}</span>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitInput()}
            className="flex-1 bg-transparent text-white text-xs font-mono outline-none border-b border-accent/60 pb-0.5"
            placeholder="type here and press Enter..."
          />
          <button onClick={submitInput} className="text-xs px-2 py-0.5 bg-accent text-black font-bold rounded">Enter</button>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          <textarea
            value={code}
            onChange={e => onChange(e.target.value)}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 resize-none outline-none leading-6"
            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
          />
        ) : (
          <MonacoEditor
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
        )}
      </div>
    </div>
  );
}
