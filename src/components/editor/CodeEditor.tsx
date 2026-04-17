"use client";

import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, AlertTriangle, X } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning?: boolean;
  isLoading?: boolean;
  loadingStatus?: string;
  onInputRequest?: (cb: (prompt: string) => Promise<string>) => void;
}

const PASTE_THRESHOLD = 50; // chars — anything above this triggers the warning

export default function CodeEditor({ code, onChange, onRun, onReset, isRunning = false, isLoading = false, loadingStatus = 'Loading Python environment...', onInputRequest }: CodeEditorProps) {
  const [inputPrompt, setInputPrompt] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [pasteWarning, setPasteWarning] = useState(false);
  const [pasteCount, setPasteCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resolverRef = useRef<((val: string) => void) | null>(null);
  const editorRef = useRef<any>(null);

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

  const handlePasteDetected = (pastedText: string) => {
    if (pastedText.length > PASTE_THRESHOLD) {
      setPasteWarning(true);
      setPasteCount(c => c + 1);
    }
  };

  const handleMonacoMount = (editor: any) => {
    editorRef.current = editor;
    editor.onDidPaste((e: any) => {
      // Get the pasted text from the paste range
      const model = editor.getModel();
      if (model && e.range) {
        const pasted = model.getValueInRange(e.range);
        handlePasteDetected(pasted);
      }
    });
  };

  const handleMobilePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData('text');
    handlePasteDetected(pasted);
  };

  const busy = isRunning || isLoading;

  return (
    <div className="flex flex-col h-1/2 min-h-[300px] border-b border-border-subtle bg-[#1e1e1e]">
      <div className="flex items-center justify-between p-3 shrink-0 bg-[#252526] border-b border-border-subtle">
        <span className="text-sm font-semibold text-[#cccccc]">main.py</span>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="text-xs text-secondary-text animate-pulse hidden sm:inline">{loadingStatus}</span>
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

      {/* Paste warning banner */}
      {pasteWarning && (
        <div className="flex items-start gap-3 px-4 py-3 bg-warning/10 border-b border-warning/30">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-warning text-xs font-bold mb-0.5">
              {pasteCount >= 3 ? 'We noticed you keep pasting code — are you using AI?' : 'Looks like you pasted some code!'}
            </p>
            <p className="text-warning/80 text-xs leading-relaxed">
              {pasteCount >= 3
                ? 'Using AI to complete challenges prevents you from actually learning. The goal is to build real skills — employers will test you in person. Give it a genuine try!'
                : 'Typing code yourself is how you actually learn. Try writing it out line by line — even if it takes longer, it builds real understanding.'}
            </p>
          </div>
          <button onClick={() => setPasteWarning(false)} className="text-warning/60 hover:text-warning shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
            onPaste={handleMobilePaste}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 resize-none outline-none leading-6"
            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
          />
        ) : (
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={onChange}
            onMount={handleMonacoMount}
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
