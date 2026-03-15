"use client";

import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight } from 'lucide-react';

export interface TestResult {
  id: number;
  passed: boolean;
  name: string;
  expected?: string;
  actual?: string;
  hint?: string;
  error?: string;
  errorType?: string;
  lineNumber?: number;
}

interface FeedbackPanelProps {
  results: TestResult[] | null;
  isRunning: boolean;
  onNext?: () => void;
}

export default function FeedbackPanel({ results, isRunning, onNext }: FeedbackPanelProps) {
  if (isRunning) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center flex-col gap-4 text-secondary-text">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p>Running tests in Pyodide Sandbox...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-secondary-text text-center">
        <p>Click "Run Code" when you are ready to test your solution.</p>
      </div>
    );
  }

  const allPassed = results.length > 0 && results.every(r => r.passed);

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      <h3 className="font-bold text-lg mb-2 text-foreground">Test Results</h3>
      
      <div className="flex flex-col gap-3">
        {results.map((res) => (
          <div 
            key={res.id} 
            className={`p-4 rounded-lg border ${res.passed ? 'bg-accent/10 border-accent/20' : 'bg-error/10 border-error/20'}`}
          >
            <div className="flex items-center gap-3">
              {res.passed ? (
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              ) : res.error ? (
                <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-error shrink-0" />
              )}
              <span className={`font-medium ${res.passed ? 'text-accent' : res.error ? 'text-warning' : 'text-error'}`}>
                {res.name}
              </span>
            </div>

            {!res.passed && res.error && (
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center gap-3 text-sm">
                  {res.errorType && (
                    <span className="px-2 py-0.5 bg-warning/20 text-warning rounded text-xs font-bold font-mono">
                      {res.errorType}
                    </span>
                  )}
                  {res.lineNumber && (
                    <span className="text-secondary-text text-xs font-mono">
                      Line {res.lineNumber}
                    </span>
                  )}
                </div>
                
                <div className="text-sm font-mono text-warning bg-black/40 p-3 rounded overflow-x-auto whitespace-pre">
                  {res.error}
                </div>

                {res.hint && (
                  <div className="mt-1 p-3 bg-secondary rounded border border-border-subtle text-foreground text-sm">
                    <span className="font-bold text-accent mr-2">HINT:</span>
                    {res.hint}
                  </div>
                )}
              </div>
            )}
            
            {!res.passed && !res.error && (
              <div className="mt-3 text-sm">
                <div className="flex flex-col gap-1 font-mono text-secondary-text mb-3 bg-black/40 p-3 rounded">
                  <div>Expected: <span className="text-foreground">{res.expected}</span></div>
                  <div>Got: <span className="text-error">{res.actual}</span></div>
                </div>
                {res.hint && (
                  <div className="p-3 bg-secondary rounded border border-border-subtle text-foreground">
                    <span className="font-bold text-accent mr-2">HINT:</span>
                    {res.hint}
                  </div>
                )}
              </div>
            )}
            
            {/* Show output for successful tests (like Output Console stdout) */}
            {res.passed && res.error && (
              <div className="mt-3 text-sm font-mono text-gray-300 bg-black/40 p-3 rounded overflow-x-auto whitespace-pre border border-[#333]">
                {res.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {allPassed && (
        <div className="mt-6 p-6 bg-accent/10 border border-accent/30 rounded-lg flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h4 className="font-bold text-xl text-accent mb-1">Excellent Work!</h4>
            <p className="text-secondary-text">All tests passed successfully.</p>
          </div>
          {onNext && (
            <button 
              onClick={onNext}
              className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-accent text-black font-bold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Next Lesson
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
