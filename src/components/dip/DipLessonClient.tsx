"use client";

import React, { useState, useEffect } from 'react';
import TwoPanelLayout from '@/components/layout/TwoPanelLayout';
import CodeEditor from '@/components/editor/CodeEditor';
import FeedbackPanel, { TestResult } from '@/components/editor/FeedbackPanel';
import ColabPanel from '@/components/editor/ColabPanel';
import EmbeddedColabPanel from '@/components/editor/EmbeddedColabPanel';
import { runPythonCode, getPyodide, isPyodideReady, getPyodideError, getPyodideStatus, clearPyodideWorker, setInputCallback } from '@/lib/pyodide';
import { usePersistedCode } from '@/lib/usePersistedCode';
import VideoEmbed from '@/components/VideoEmbed';
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
  pageType: string | null;
  resources: ResourceData[];
  prevPageId: string | null;
  prevPageTitle: string | null;
  nextPageId: string | null;
  nextPageTitle: string | null;
  isLastPage: boolean;
  colabNotebook: string | null;
  video: string | null;
}

export default function DipLessonClient({
  pageId, content, initialCodeProp, testCodeProp, isPractice, pageType, resources,
  prevPageId, prevPageTitle, nextPageId, nextPageTitle, isLastPage, colabNotebook,
  video
}: DipLessonClientProps) {
  const { code, setCode, resetCode } = usePersistedCode(pageId, initialCodeProp);
  const isLab = pageType === 'lab';
  const hasCodeAlong = !!video;
  const needsEditor = (isPractice || isLab || hasCodeAlong) && !colabNotebook;

  const [isRunning, setIsRunning] = useState(false);
  const [isEnvLoading, setIsEnvLoading] = useState(needsEditor);
  const [loadingStatus, setLoadingStatus] = useState(needsEditor ? 'Initializing...' : '');
  const [envError, setEnvError] = useState<string | null>(null);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [testsPassed, setTestsPassed] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [timeReady, setTimeReady] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { markCompleted, completedPages } = useProgress();

  // Minimum read time based on content length (1 second per 200 chars, min 30s, max 120s)
  useEffect(() => {
    if (isPractice) { setTimeReady(true); return; } // code pages don't need timer
    const minTime = Math.min(120, Math.max(30, Math.floor(content.length / 200)));
    setTimeLeft(minTime);
    setTimeReady(false);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); setTimeReady(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [pageId, isPractice, content]);
  const router = useRouter();

  const initPyodide = () => {
    if (!needsEditor) {
      setIsEnvLoading(false);
      return;
    }

    // If already ready, don't show loading
    if (isPyodideReady()) {
      setIsEnvLoading(false);
      return;
    }

    setIsEnvLoading(true);
    setEnvError(null);
    getPyodide();
    const interval = setInterval(() => {
      setLoadingStatus(getPyodideStatus());
      const error = getPyodideError();
      if (error) {
        setEnvError(error);
        setIsEnvLoading(false);
        clearInterval(interval);
      } else if (isPyodideReady()) {
        setIsEnvLoading(false);
        setEnvError(null);
        clearInterval(interval);
      }
    }, 300);
    return interval;
  };

  useEffect(() => {
    const interval = initPyodide();
    return () => { if (interval) clearInterval(interval); };
  }, [needsEditor, pageId]);

  const handleRetryEnv = () => {
    clearPyodideWorker();
    initPyodide();
  };

  useEffect(() => { setResults(null); setTestsPassed(false); setDuplicateWarning(false); }, [pageId]);

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

      if (isAssertion) {
        const raw = error.split('AssertionError:').slice(1).join('AssertionError:').trim();
        const yourMatch = raw.includes("Your output:") ? raw.split("Your output:")[1] : null;
        const expMatch  = raw.includes("Expected:")    ? raw.split("Expected:")[1]    : null;
        const labelPart = raw.split('\nYour output:')[0].replace(/\s*—\s*$/, '').trim();

        const gotVal  = yourMatch ? yourMatch.split("\n")[0].trim() : "";
        const expVal  = expMatch  ? expMatch.split("\n")[0].trim()  : "";

        let displayError = '';
        if (labelPart) displayError += `${labelPart}\n`;
        if (gotVal)    displayError += `Your output:  ${gotVal}\n`;
        if (expVal)    displayError += `Expected:     ${expVal}`;
        if (!displayError) displayError = 'A test assertion failed. Check your logic.';

        setResults([
          { id: 0, name: 'Output Console', passed: true, error: stdout || 'No output' },
          { id: 1, name: 'Test Failed', passed: false, errorType: 'AssertionError', lineNumber,
            hint: 'Compare your output to the expected value above and trace through your logic.',
            error: displayError },
        ]);
      } else {
        setResults([
          { id: 0, name: 'Output Console', passed: true, error: stdout || 'Program exited with error' },
          { id: 1, name: 'Code Error', passed: false, errorType, lineNumber,
            hint: hints[errorType] || 'Check the error message for clues.',
            error: error.split('\n').slice(-4).join('\n') },
        ]);
      }
      return;
    }

    setResults([
      { id: 1, name: 'Output Console', passed: true, error: stdout || 'Program exited normally' },
      ...(testCodeProp ? [{ id: 2, name: 'All Tests Passed', passed: true, error: 'All hidden tests passed!' }] : []),
    ]);
    if (testCodeProp) {
      setTestsPassed(true);
      // Submit code hash for similarity detection
      const loginId = localStorage.getItem('ioai_user');
      if (loginId) {
        fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login_id: loginId, page_id: pageId, code }),
        })
          .then(r => r.json())
          .then(data => { if (data.duplicate) setDuplicateWarning(true); })
          .catch(() => {});
      }
    }
  };

  const navigate = (id: string) => router.push(`/dip/lesson/${id}`);

  const leftPanel = (
    <div className="w-full">
      {video && <VideoEmbed src={video} />}
      <div className="prose prose-invert prose-cyan max-w-none
        prose-p:text-[16px] prose-p:leading-relaxed prose-p:text-gray-300
        prose-headings:text-white prose-headings:font-semibold
        prose-h1:text-3xl prose-h1:mb-6
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:pb-2 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
        prose-strong:text-accent prose-strong:font-bold
        prose-a:text-accent prose-a:underline
        prose-pre:bg-secondary prose-pre:border prose-pre:border-border-subtle prose-pre:rounded-xl prose-pre:p-4 prose-pre:my-6
        prose-code:text-[#00B0F0] prose-code:bg-[#00B0F0]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:text-[13px]
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

        {duplicateWarning && (
          <div className="mt-8 p-4 rounded-xl bg-error/10 border border-error/30 flex items-start gap-3 not-prose">
            <span className="text-error text-lg shrink-0">⚠️</span>
            <div>
              <p className="text-error font-bold text-sm mb-1">Identical code detected</p>
              <p className="text-error/80 text-xs leading-relaxed">
                Your solution matches another student's submission exactly. This has been flagged for admin review.
                If you copied this code, please delete it and solve the challenge yourself — your certificate reflects your own skills.
              </p>
            </div>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 not-prose">
          {prevPageId ? (
            <button onClick={() => navigate(prevPageId)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary border border-border-subtle text-secondary-text hover:text-white hover:border-accent transition-all">
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <div className="flex flex-col items-start px-2">
                <span className="text-[10px] uppercase tracking-wider font-bold mb-0.5">Previous</span>
                <span className="text-sm font-medium">{prevPageTitle}</span>
              </div>
            </button>
          ) : <div />}

          {isLastPage ? (
            <button onClick={() => { markCompleted(pageId); router.push('/dip/exam'); }}
              disabled={isPractice && !!testCodeProp && !testsPassed || !timeReady}
              title={!timeReady ? `Read for ${timeLeft}s more to unlock` : isPractice && !!testCodeProp && !testsPassed ? 'Pass all tests to continue' : ''}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-black font-bold hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <Award className="w-5 h-5" />
              {!timeReady ? `Read ${timeLeft}s more...` : isPractice && !!testCodeProp && !testsPassed ? 'Pass tests to unlock' : 'Go to Final Exam'}
            </button>
          ) : nextPageId ? (
            <button onClick={() => { markCompleted(pageId); navigate(nextPageId); }}
              disabled={isPractice && !!testCodeProp && !testsPassed || !timeReady}
              title={!timeReady ? `Read for ${timeLeft}s more to unlock` : isPractice && !!testCodeProp && !testsPassed ? 'Pass all tests to continue' : ''}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 hover:border-accent transition-all group disabled:opacity-40 disabled:cursor-not-allowed">
              <div className="flex flex-col items-center sm:items-end px-2">
                <span className="text-[10px] uppercase tracking-wider font-bold mb-0.5">
                  {!timeReady ? `Read ${timeLeft}s more...` : isPractice && !!testCodeProp && !testsPassed ? 'Pass tests to unlock' : 'Mark Complete & Next'}
                </span>
                <span className="text-sm font-medium">{nextPageTitle}</span>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button onClick={() => markCompleted(pageId)}
              disabled={isPractice && !!testCodeProp && !testsPassed || !timeReady}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-background font-semibold hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <CheckCircle2 className="w-4 h-4" />
              {!timeReady ? `Read ${timeLeft}s more...` : isPractice && !!testCodeProp && !testsPassed ? 'Pass tests to unlock' : 'Finish Module'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // isLab, hasCodeAlong, needsEditor already computed above

  const rightPanel = isPractice || isLab || hasCodeAlong ? (
    isLab && colabNotebook ? (
      <EmbeddedColabPanel
        notebookPath={colabNotebook as string}
        onMarkComplete={() => { markCompleted(pageId); if (nextPageId) navigate(nextPageId); }}
      />
    ) : colabNotebook ? (
      <ColabPanel
        notebookPath={colabNotebook as string}
        onMarkComplete={() => { markCompleted(pageId); if (nextPageId) navigate(nextPageId); }}
      />
    ) : (
      <>
        <CodeEditor code={code} onChange={v => setCode(v || '')} onRun={handleRun} onReset={() => { resetCode(); setResults(null); }} isRunning={isRunning} isLoading={isEnvLoading} loadingStatus={loadingStatus} onInputRequest={cb => setInputCallback(cb)} />
        {envError ? (
          <div className="p-6 m-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200">
            <h4 className="font-bold flex items-center gap-2 mb-2">
              <span className="text-lg">⚠️</span> Python Environment Failed to Load
            </h4>
            <p className="text-sm mb-4 opacity-90">{envError}</p>
            <button
              onClick={handleRetryEnv}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded transition-colors"
            >
              Retry Loading Environment
            </button>
          </div>
        ) : (
          <FeedbackPanel
            results={results}
            isRunning={isRunning}
            onNext={testsPassed
              ? (isLastPage
                ? () => { markCompleted(pageId); router.push('/dip/exam'); }
                : nextPageId
                  ? () => { markCompleted(pageId); navigate(nextPageId); }
                  : undefined)
              : undefined
            }
            nextLabel={isLastPage ? 'Go to Final Exam' : 'Next Lesson'}
          />
        )}
      </>
    )
  ) : null;

  return <TwoPanelLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
}
