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
import { useProgress } from '@/components/providers/ProgressProvider';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { PageData, ResourceData } from '@/lib/syllabus';

export default function LessonPageClient({ 
  pageId,
  content, 
  initialCodeProp, 
  testCodeProp,
  isPractice,
  resources,
  prevPage,
  nextPage
}: { 
  pageId: string;
  content: string; 
  initialCodeProp: string | null; 
  testCodeProp: string | null;
  isPractice: boolean;
  resources: ResourceData[];
  prevPage: PageData | null;
  nextPage: PageData | null;
}) {
  const [code, setCode] = useState(initialCodeProp || "# Write your python code here\\n\\n");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const { markCompleted, completedPages } = useProgress();
  const router = useRouter();
  const isCompleted = completedPages[pageId];

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
    setResults(null);
    
    const { error, stdout, stderr } = await runPythonCode(code, testCodeProp || "");
    
    setIsRunning(false);
    
    if (error) {
      const isAssertionError = error.includes("AssertionError");
      
      // Extract the last line for errorType and message
      const errorLines = error.trim().split('\n');
      const lastErrorLine = errorLines[errorLines.length - 1];
      let errorType = isAssertionError ? "AssertionError" : "RuntimeError";
      
      if (lastErrorLine && lastErrorLine.includes(':')) {
        errorType = lastErrorLine.split(':')[0].trim();
      }
      
      // Extract line number pointing to '<exec>' (the dynamically run code)
      let lineNumber: number | undefined = undefined;
      const lineMatch = error.match(/File "<exec>", line (\d+)/);
      if (lineMatch && lineMatch[1]) {
        const parsedLine = parseInt(lineMatch[1], 10);
        // Only show line number if it's within the user's code length (not hidden tests)
        const userCodeLinesCount = code.split('\n').length;
        if (parsedLine <= userCodeLinesCount) {
           lineNumber = parsedLine;
        }
      }

      // Generate generic hints based on common python errors
      let generatedHint = "A test assertion failed. Check your logic and variable values.";
      if (!isAssertionError) {
        if (errorType === 'SyntaxError') generatedHint = "Check for missing parentheses, quotes, or colons at the end of statements.";
        else if (errorType === 'NameError') generatedHint = "A variable is being used before it was defined. Check your spelling (Python is case-sensitive).";
        else if (errorType === 'TypeError') generatedHint = "You might be trying to combine incompatible data types, like adding a string to a number.";
        else if (errorType === 'IndentationError') generatedHint = "Python relies on spaces for structure. Make sure your code is indented correctly without mixing tabs and spaces.";
        else generatedHint = "Look at the error message for clues about what went wrong.";
      }

      setResults([{
        id: 0,
        name: isAssertionError ? "Hidden Test Failed" : "Code Syntax/Runtime Error",
        passed: false,
        errorType: errorType,
        lineNumber: lineNumber,
        hint: generatedHint,
        error: isAssertionError 
          ? error.split('AssertionError:')[1]?.split('\n')[0]?.trim() || "Assertion failed"
          : error.split('\n').slice(-4).join('\n') // Show last few lines of traceback
      }]);
      return;
    }
    
    // Simplistic success if code ran without Python tracebacks stdout
    setResults([
      { id: 1, name: "Output Console", passed: true, error: stdout || "Program exited normally with no output" },
      ...(testCodeProp ? [{ id: 2, name: "Hidden Tests Evaluation", passed: true, error: "All tests passed successfully!" }] : [])
    ]);
  };

  const handleReset = () => {
    setCode(initialCodeProp || "");
    setResults(null);
  };

  const leftPanel = (
    <div className="prose prose-invert prose-cyan max-w-none 
      prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-gray-300
      prose-headings:text-white prose-headings:font-semibold
      prose-h1:text-3xl prose-h1:mb-6
      prose-h2:text-2xl prose-h2:mt-10 prose-h2:border-b prose-h2:border-[#333] prose-h2:pb-2 prose-h2:mb-4
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
      prose-strong:text-accent prose-strong:font-bold
      prose-em:text-gray-300
      prose-a:text-accent prose-a:underline prose-a:decoration-accent/50 hover:prose-a:decoration-accent
      prose-pre:bg-[#161616] prose-pre:border prose-pre:border-[#333] prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:p-4 prose-pre:my-6
      prose-code:text-[#00B0F0] prose-code:bg-[#00B0F0]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:font-mono prose-code:text-[13px]
      prose-ul:text-gray-300 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
      prose-ol:text-gray-300 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
      prose-li:marker:text-accent prose-li:my-1
      prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-accent/5 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-300 prose-blockquote:not-italic prose-blockquote:my-6
    ">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]} 
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>

      {/* External Resources List */}
      {resources && resources.length > 0 && (
        <div className="mt-12 not-prose">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
             <span className="text-accent">◆</span> Further Reading
          </h3>
          <div className="flex flex-col gap-3">
            {resources.map((res, i) => (
              <a 
                key={i} 
                href={res.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-xl border border-border-subtle bg-secondary/50 hover:bg-secondary hover:border-accent/50 transition-all duration-200"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-200 group-hover:text-accent transition-colors">{res.title}</span>
                  <span className="text-[11px] text-gray-500 mt-1 truncate max-w-md">{res.url}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all">
                  ↗
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-16 pt-8 border-t border-border-subtle flex items-center justify-between not-prose">
        {prevPage ? (
          <button 
            onClick={() => router.push(`/lesson/${prevPage.id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border-subtle text-secondary-text hover:text-white hover:border-accent transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <div className="flex flex-col items-start px-2">
              <span className="text-[10px] uppercase tracking-wider font-bold mb-0.5">Previous</span>
              <span className="text-sm font-medium">{prevPage.title}</span>
            </div>
          </button>
        ) : <div />}

        {nextPage ? (
          <button 
            onClick={() => {
              markCompleted(pageId);
              router.push(`/lesson/${nextPage.id}`);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 hover:border-accent transition-all group"
          >
            <div className="flex flex-col items-end px-2">
              <span className="text-[10px] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap">Mark Complete & Next</span>
              <span className="text-sm font-medium whitespace-nowrap">{nextPage.title}</span>
            </div>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button 
            onClick={() => markCompleted(pageId)}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-accent text-background hover:bg-accent/90 focus:ring-4 focus:ring-accent/20 transition-all font-semibold"
          >
            <CheckCircle2 className="w-4 h-4" />
            Finish Module
          </button>
        )}
      </div>
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
  ) : null;

  return <TwoPanelLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
}
