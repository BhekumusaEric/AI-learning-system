"use client";

import React, { useState, useEffect } from 'react';
import TwoPanelLayout from '@/components/layout/TwoPanelLayout';
import CodeEditor from '@/components/editor/CodeEditor';
import FeedbackPanel, { TestResult } from '@/components/editor/FeedbackPanel';
import { runPythonCode, getPyodide } from '@/lib/pyodide';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';

export default function LessonPageClient({ 
  content, 
  initialCodeProp, 
  isPractice 
}: { 
  content: string; 
  initialCodeProp: string | null; 
  isPractice: boolean;
}) {
  const [code, setCode] = useState(initialCodeProp || "# Write your python code here\\n\\n");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);

  useEffect(() => {
    // Prefetch pyodide in the background
    if (isPractice) getPyodide();
  }, [isPractice]);

  // Update editor code safely when navigating
  useEffect(() => {
    setCode(initialCodeProp || "# Write your python code here\\n\\n");
    setResults(null);
  }, [initialCodeProp]);

  const handleRun = async () => {
    setIsRunning(true);
    
    // We execute user code and test for a 'check_example' or 'check_*' if provided... 
    // In our markdown, test instructions are typically embedded. Wait to design proper ast evaluation.
    // For now we will run the user code entirely
    const { error, stdout, stderr } = await runPythonCode(code, "");
    
    setIsRunning(false);
    
    if (error) {
      setResults([{
        id: 0,
        name: "Code Execution Error",
        passed: false,
        error: error
      }]);
      return;
    }
    
    // Simplistic success if code ran without Python tracebacks stdout
    setResults([
      { id: 1, name: "Output Console", passed: true, error: stdout || "Program exited normally with no output" }
    ]);
  };

  const handleReset = () => {
    setCode(initialCodeProp || "");
    setResults(null);
  };

  const leftPanel = (
    <div className="prose prose-invert prose-emerald max-w-none prose-pre:bg-[#1a1a1a] prose-pre:border-border-subtle prose-pre:border">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]} 
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );

  const rightPanel = isPractice ? (
    <>
      <CodeEditor
        code={code}
        onChange={(val) => setCode(val || '')}
        onRun={handleRun}
        onReset={handleReset}
        isRunning={isRunning}
      />
      <FeedbackPanel 
        results={results} 
        isRunning={isRunning} 
      />
    </>
  ) : (
     <FeedbackPanel 
        results={[{ id: 99, name: "Read-only page", passed: true, error: "Keep reading the theory section on the left before advancing." }]} 
        isRunning={false} 
      />
  );

  return <TwoPanelLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
}
