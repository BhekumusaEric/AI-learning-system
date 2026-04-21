"use client";

import React, { useState, useEffect } from 'react';
import TwoPanelLayout from '@/components/layout/TwoPanelLayout';
import CodeEditor from '@/components/editor/CodeEditor';
import FeedbackPanel, { TestResult } from '@/components/editor/FeedbackPanel';
import ColabPanel from '@/components/editor/ColabPanel';
import EmbeddedColabPanel from '@/components/editor/EmbeddedColabPanel';
import { runPythonCode, getPyodide, isPyodideReady, setInputCallback, getPyodideError, getPyodideStatus, clearPyodideWorker } from '@/lib/pyodide';
import { usePersistedCode } from '@/lib/usePersistedCode';
import VideoEmbed from '@/components/VideoEmbed';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useProgress } from '@/components/providers/ProgressProvider';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle2, ExternalLink } from 'lucide-react';
import { PageData, ResourceData } from '@/lib/syllabus';
import EmailGate from '@/components/EmailGate';
import { WrpContent } from '@/components/wrp/WrpLessonClient';
import UserTour from '@/components/UserTour';

export default function LessonPageClient({ 
  pageId,
  content, 
  initialCodeProp, 
  testCodeProp,
  isPractice,
  pageType,
  resources,
  prevPage,
  nextPage,
  colabNotebook,
  video
}: { 
  pageId: string;
  content: string; 
  initialCodeProp: string | null; 
  testCodeProp: string | null;
  isPractice: boolean;
  pageType: string | null;
  resources: ResourceData[];
  prevPage: PageData | null;
  nextPage: PageData | null;
  colabNotebook: string | null;
  video: string | null;
}) {
  const { code, setCode, resetCode } = usePersistedCode(pageId, initialCodeProp);
  const [isRunning, setIsRunning] = useState(false);
  const [isEnvLoading, setIsEnvLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const [envError, setEnvError] = useState<string | null>(null);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const { markCompleted, completedPages } = useProgress();
  const router = useRouter();
  const isCompleted = completedPages[pageId];
  const [emailGate, setEmailGate] = useState<{ loginId: string; fullName: string } | null>(null);

  useEffect(() => {
    const loginId = localStorage.getItem('ioai_user');
    const fullName = localStorage.getItem('ioai_name') || '';
    if (!loginId) { router.replace('/saaio/login'); return; }
    fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login_id: loginId, platform: 'saaio' }),
    })
      .then(r => r.json())
      .then(data => { if (!data.has_email) setEmailGate({ loginId, fullName }); })
      .catch(() => {});
  }, []);

  const isLab = pageType === 'lab';
  const hasCodeAlong = !!video;
  const needsPyodide = (isPractice || isLab || hasCodeAlong) && !colabNotebook;

  const initPyodide = () => {
    if (!needsPyodide) return;
    setIsEnvLoading(true);
    setEnvError(null);
    getPyodide();
    const interval = setInterval(() => {
      setLoadingStatus(getPyodideStatus());
      const err = getPyodideError();
      if (err) {
        setEnvError(err);
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
  }, [needsPyodide, pageId]);

  const handleRetryEnv = () => {
    clearPyodideWorker();
    initPyodide();
  };

  useEffect(() => { setResults(null); }, [pageId]);

  const handleRun = async () => {
    setIsRunning(true);
    setResults(null);
    
    const { error, stdout } = await runPythonCode(code, testCodeProp || "");
    
    setIsRunning(false);
    
    if (error) {
      const isAssertionError = error.includes("AssertionError");
      const errorLines = error.trim().split('\n');
      const lastErrorLine = errorLines[errorLines.length - 1];
      let errorType = isAssertionError ? "AssertionError" : "RuntimeError";
      
      if (lastErrorLine && lastErrorLine.includes(':')) {
        errorType = lastErrorLine.split(':')[0].trim();
      }
      
      let lineNumber: number | undefined = undefined;
      const lineMatch = error.match(/File "<exec>", line (\d+)/);
      if (lineMatch && lineMatch[1]) {
        const parsedLine = parseInt(lineMatch[1], 10);
        const userCodeLinesCount = code.split('\n').length;
        if (parsedLine <= userCodeLinesCount) {
           lineNumber = parsedLine;
        }
      }

      let generatedHint = "A test assertion failed. Check your logic and variable values.";
      if (!isAssertionError) {
        if (errorType === 'SyntaxError') generatedHint = "Check for missing parentheses, quotes, or colons at the end of statements.";
        else if (errorType === 'NameError') generatedHint = "A variable is being used before it was defined. Check your spelling (Python is case-sensitive).";
        else if (errorType === 'TypeError') generatedHint = "You might be trying to combine incompatible data types, like adding a string to a number.";
        else if (errorType === 'IndentationError') generatedHint = "Python relies on spaces for structure. Make sure your code is indented correctly without mixing tabs and spaces.";
        else generatedHint = "Look at the error message for clues about what went wrong.";
      }

      if (isAssertionError) {
        const raw = error.split('AssertionError:').slice(1).join('AssertionError:').trim();
        const labelPart = raw.split('\nYour output:')[0].replace(/\s*—\s*$/, '').trim();
        const gotVal  = raw.includes('Your output:') ? raw.split('Your output:')[1].split('\n')[0].trim() : '';
        const expVal  = raw.includes('Expected:')    ? raw.split('Expected:')[1].split('\n')[0].trim()    : '';
        let displayError = '';
        if (labelPart) displayError += `${labelPart}\n`;
        if (gotVal)    displayError += `Your output:  ${gotVal}\n`;
        if (expVal)    displayError += `Expected:     ${expVal}`;
        if (!displayError) displayError = 'A test assertion failed. Check your logic.';
        setResults([
          { id: 0, name: "Output Console", passed: true, error: stdout || "No output" },
          { id: 1, name: "Test Failed", passed: false, errorType, lineNumber,
            hint: 'Compare your output to the expected value above and trace through your logic.',
            error: displayError }
        ]);
      } else {
        setResults([
          { id: 0, name: "Output Console", passed: true, error: stdout || "Program exited with error before generating output" },
          { id: 1, name: "Code Error", passed: false, errorType, lineNumber, hint: generatedHint,
            error: error.split('\n').slice(-4).join('\n') }
        ]);
      }
      return;
    }
    
    setResults([
      { id: 1, name: "Output Console", passed: true, error: stdout || "Program exited normally with no output" },
      ...(testCodeProp ? [{ id: 2, name: "All Tests Passed", passed: true, error: "All hidden tests passed successfully!" }] : [])
    ]);
  };

  const handleReset = () => {
    resetCode();
    setResults(null);
  };

  const isWrp = pageId.startsWith('page') && [
    'page1_welcome_and_mindfulness','page2_verbal_communication','page2b_spin_the_wheel',
    'page3_mock_interview','page4_written_communication','page5_email_practice',
    'page6_linkedin_personal_brand','page6b_buzzword_bingo','page7_resume_building',
    'page7b_cv_builder','page8_interview_readiness','page8b_spot_the_mistake','page9_live_quiz',
  ].includes(pageId);

  const leftPanel = isWrp ? (
    <div id="learner-content" className="w-full">
      {video && <VideoEmbed src={video} />}
      <div className="max-w-3xl mx-auto w-full py-8">
        <WrpContent content={content} video={video} />
        <div className="mt-16 pt-8 border-t border-border-subtle flex items-center justify-between">
          {prevPage ? (
            <button onClick={() => router.push(`/lesson/${prevPage.id}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border-subtle text-secondary-text hover:text-white hover:border-accent transition-all">
              <ChevronLeft className="w-4 h-4" />
              <div className="flex flex-col items-start px-2">
                <span className="text-[10px] uppercase tracking-wider font-bold mb-0.5">Previous</span>
                <span className="text-sm font-medium">{prevPage.title}</span>
              </div>
            </button>
          ) : <div />}
          {nextPage ? (
            <button onClick={() => { markCompleted(pageId); router.push(`/lesson/${nextPage.id}`); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 hover:border-accent transition-all group">
              <div className="flex flex-col items-end px-2">
                <span className="text-[10px] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap">Mark Complete & Next</span>
                <span className="text-sm font-medium whitespace-nowrap">{nextPage.title}</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => markCompleted(pageId)}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-accent text-background hover:bg-accent/90 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Finish Module
            </button>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full">
      {video && <VideoEmbed src={video} />}
      <div className="prose prose-invert prose-cyan max-w-none
        prose-p:text-[16px] prose-p:leading-relaxed prose-p:text-gray-300
        prose-headings:text-white prose-headings:font-semibold
        prose-h1:text-3xl prose-h1:mb-6
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:pb-2 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
        prose-strong:text-accent prose-strong:font-bold
        prose-em:text-gray-300
        prose-a:text-accent prose-a:underline prose-a:decoration-accent/50 hover:prose-a:decoration-accent
        prose-pre:bg-secondary prose-pre:border prose-pre:border-border-subtle prose-pre:rounded-xl prose-pre:p-4 prose-pre:my-6
        prose-code:text-[#00B0F0] prose-code:bg-[#00B0F0]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:text-[13px]
        prose-ul:text-gray-300 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
        prose-ol:text-gray-300 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
        prose-li:marker:text-accent prose-li:my-1
        prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-accent/5 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-300 prose-blockquote:not-italic prose-blockquote:my-6
      ">
        <div id="learner-theory">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {content}
          </ReactMarkdown>
        </div>

        {resources && resources.length > 0 && (
          <div className="mt-12 not-prose">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
               Further Reading
            </h3>
            <div className="flex flex-col gap-3">
              {resources.map((res, i) => (
                <a 
                  key={i} 
                  href={res.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 rounded-xl border border-border-subtle bg-secondary/50 hover:bg-secondary hover:border-accent/50 transition-all duration-200"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-accent" />
                  <span className="text-sm font-medium text-gray-200 group-hover:text-accent transition-colors underline">{res.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

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
              id="learner-progress"
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
    </div>
  );

  const rightPanel = isPractice || isLab || hasCodeAlong ? (
    isLab && colabNotebook ? (
      <EmbeddedColabPanel
        notebookPath={colabNotebook as string}
        onMarkComplete={() => { markCompleted(pageId); if (nextPage) router.push(`/lesson/${nextPage.id}`); }}
      />
    ) : colabNotebook ? (
      <ColabPanel
        notebookPath={colabNotebook as string}
        onMarkComplete={() => { markCompleted(pageId); if (nextPage) router.push(`/lesson/${nextPage.id}`); }}
      />
    ) : (
      <>
    <div id="learner-ide" className="flex flex-col h-full">
      <CodeEditor
        code={code}
        onChange={(val) => setCode(val || '')}
        onRun={handleRun}
        onReset={handleReset}
        isRunning={isRunning}
        isLoading={isEnvLoading}
        loadingStatus={loadingStatus}
        onInputRequest={cb => setInputCallback(cb)}
      />
      {envError ? (
        <div className="p-6 m-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200">
          <h4 className="font-bold flex items-center gap-2 mb-2">
            Python Environment Failed to Load
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
          onNext={nextPage
            ? () => { markCompleted(pageId); router.push(`/lesson/${nextPage.id}`); }
            : undefined
          }
        />
      )}
    </div>
      </>
    )
  ) : null;

  return (
    <>
      {emailGate && (
        <EmailGate
          loginId={emailGate.loginId}
          platform="saaio"
          onVerified={() => setEmailGate(null)}
        />
      )}
      <TwoPanelLayout leftPanel={leftPanel} rightPanel={rightPanel} />

      <UserTour 
        tourId="learner_lesson"
        steps={[
          { targetId: 'learner-content', title: 'Your Classroom', description: 'Welcome to your interactive learning environment. This is where you will find your lessons and tutorials.', position: 'right' },
          { targetId: 'learner-theory', title: 'Theory & Concepts', description: 'Read through the material and watch the videos to build your understanding before jumping into code.', position: 'bottom' },
          { targetId: 'learner-ide', title: 'Interactive IDE', description: 'Practice what you learn! Write and run real Python code directly in the browser.', position: 'left' },
          { targetId: 'learner-progress', title: 'Marking Progress', description: 'Crucial: Always click this button once you finish a page to save your progress and unlock your certificate.', position: 'top' }
        ]}
      />
    </>
  );
}
