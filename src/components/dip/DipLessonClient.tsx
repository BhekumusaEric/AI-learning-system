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
import { ChevronRight, ChevronLeft, CheckCircle2, Award } from 'lucide-react';
import { ResourceData } from '@/lib/syllabus';

interface DipLessonClientProps {
  pageId: string;
  content: string;
  initialCodeProp: string | null;
  testCodeProp: string | null;
  isPractice: boolean;
  resources: ResourceData[];
  prevPageId: string | null;
  prevPageTitle: string | null;
  nextPageId: string | null;
  nextPageTitle: string | null;
  isLastPage: boolean;
}

export default function DipLessonClient({
  pageId, content, initialCodeProp, testCodeProp, isPractice, resources,
  prevPageId, prevPageTitle, nextPageId, nextPageTitle, isLastPage,
}: DipLessonClientProps) {
  const [code, setCode] = useState(initialCodeProp || '# Write your python code here\n\n');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const { markCompleted, completedPages } = useProgress();
  const router = useRouter();

  useEffect(() => { if (isPractice) getPyodide(); }, [isPractice]);
  useEffect(() => { setCode(initialCodeProp || '# Write your python code here\n\n'); setResults(null); }, [initialCodeProp]);

  const handleRun = async () => {
    setIsRunning(true);
    setResults(null);
    const { error, stdout } = await runPythonCode(code, testCodeProp || '');
    setIsRunning(false);

    if (error) {
      const isAssertion = error.includes('AssertionError');
      const errorLines = error.trim().split('\n');
      const lastLine = errorLines[errorLines.length - 1];
      let errorType = isAssertion ? 'AssertionError' : 'RuntimeError';
      if (lastLine?.includes(':')) errorType = lastLine.split(':')[0].trim();

      let lineNumber: number | undefined;
      const lineMatch = error.match(/File "<exec>", line (\d+)/);
      if (lineMatch) {
        const n = parseInt(lineMatch[1], 10);
        if (n <= code.split('\n').length) lineNumber = n;
      }

      const hints: Record<string, string> = {
        SyntaxError: 'Check for missing parentheses, quotes, or colons.',
        NameError: 'A variable is used before it was defined. Check spelling.',
        TypeError: 'You may be combining incompatible types.',
        IndentationError: 'Check your indentation — no mixing tabs and spaces.',
      };

      setResults([
        { id: 0, name: 'Output Console', passed: true, error: stdout || 'Program exited with error' },
        { id: 1, name: isAssertion ? 'Hidden Test Failed' : 'Code Error', passed: false, errorType, lineNumber,
          hint: hints[errorType] || 'Check the error message for clues.',
          error: isAssertion ? error.split('AssertionError:')[1]?.split('\n')[0]?.trim() || 'Assertion failed'
            : error.split('\n').slice(-4).join('\n') },
      ]);
      return;
    }

    setResults([
      { id: 1, name: 'Output Console', passed: true, error: stdout || 'Program exited normally' },
      ...(testCodeProp ? [{ id: 2, name: 'Hidden Tests', passed: true, error: 'All tests passed!' }] : []),
    ]);
  };

  const navigate = (id: string) => router.push(`/dip/lesson/${id}`);

  const leftPanel = (
    <div className="prose prose-invert prose-cyan max-w-none
      prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-gray-300
      prose-headings:text-white prose-headings:font-semibold
      prose-h1:text-3xl prose-h1:mb-6
      prose-h2:text-2xl prose-h2:mt-10 prose-h2:border-b prose-h2:border-[#333] prose-h2:pb-2 prose-h2:mb-4
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
      prose-strong:text-accent prose-strong:font-bold
      prose-a:text-accent prose-a:underline
      prose-pre:bg-[#161616] prose-pre:border prose-pre:border-[#333] prose-pre:rounded-xl prose-pre:p-4 prose-pre:my-6
      prose-code:text-[#00B0F0] prose-code:bg-[#00B0F0]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
      prose-ul:text-gray-300 prose-li:marker:text-accent
      prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-accent/5 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-lg
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>

      {resources?.length > 0 && (
        <div className="mt-12 not-prose">
          <h3 className="text-xl font-semibold text-white mb-4">◆ Further Reading</h3>
          <div className="flex flex-col gap-3">
            {resources.map((res, i) => (
              <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-xl border border-border-subtle bg-secondary/50 hover:bg-secondary hover:border-accent/50 transition-all">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-200 group-hover:text-accent transition-colors">{res.title}</span>
                  <span className="text-[11px] text-gray-500 mt-1 truncate max-w-md">{res.url}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all">↗</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-16 pt-8 border-t border-border-subtle flex items-center justify-between not-prose">
        {prevPageId ? (
          <button onClick={() => navigate(prevPageId)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border-subtle text-secondary-text hover:text-white hover:border-accent transition-all">
            <ChevronLeft className="w-4 h-4" />
            <div className="flex flex-col items-start px-2">
              <span className="text-[10px] uppercase tracking-wider font-bold mb-0.5">Previous</span>
              <span className="text-sm font-medium">{prevPageTitle}</span>
            </div>
          </button>
        ) : <div />}

        {isLastPage ? (
          <button onClick={() => { markCompleted(pageId); router.push('/dip/exam'); }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-black font-bold hover:bg-accent/90 transition-all">
            <Award className="w-5 h-5" />
            Go to Final Exam
          </button>
        ) : nextPageId ? (
          <button onClick={() => { markCompleted(pageId); navigate(nextPageId); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 hover:border-accent transition-all group">
            <div className="flex flex-col items-end px-2">
              <span className="text-[10px] uppercase tracking-wider font-bold mb-0.5">Mark Complete & Next</span>
              <span className="text-sm font-medium">{nextPageTitle}</span>
            </div>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button onClick={() => markCompleted(pageId)}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-accent text-background font-semibold hover:bg-accent/90 transition-all">
            <CheckCircle2 className="w-4 h-4" />
            Finish Module
          </button>
        )}
      </div>
    </div>
  );

  const rightPanel = isPractice ? (
    <>
      <CodeEditor code={code} onChange={v => setCode(v || '')} onRun={handleRun} onReset={() => { setCode(initialCodeProp || ''); setResults(null); }} isRunning={isRunning} />
      <FeedbackPanel results={results} isRunning={isRunning} />
    </>
  ) : null;

  return <TwoPanelLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
}
