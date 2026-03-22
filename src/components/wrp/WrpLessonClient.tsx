"use client";

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, ChevronRight, Award, CheckCircle2, Send, RotateCcw, Video, FileText, Lightbulb, BookOpen } from 'lucide-react';
import { useProgress } from '@/components/providers/ProgressProvider';
import { useRouter } from 'next/navigation';
import { WrpPage } from '@/lib/wrpSyllabus';
import CvBuilder from '@/components/wrp/CvBuilder';

// ── Mock Interview Bot ────────────────────────────────────────────────────────

const INTERVIEW_QUESTIONS = [
  "Tell me about yourself.",
  "Why are you interested in this role?",
  "What is your greatest strength?",
  "What is your biggest weakness?",
  "Tell me about a time you worked under pressure.",
  "Where do you see yourself in 5 years?",
  "Why should we hire you?",
  "Do you have any questions for me?",
];

const FEEDBACK_TIPS = [
  "Good start! Try to be more specific — use the STAR method: Situation, Task, Action, Result.",
  "Nice answer. Adding a concrete example or number would make this even stronger.",
  "Great use of specifics! Employers love measurable results.",
  "Strong response. Make sure to connect your answer back to the role you're applying for.",
  "Well structured. Try to keep answers between 60–90 seconds when spoken aloud.",
];

function MockInterviewBot() {
  const [qIndex, setQIndex] = useState(0);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: "Welcome to your mock interview! I'll ask you 8 common interview questions. Answer as you would in a real interview. Ready? Let's begin.\n\n**Question 1:** " + INTERVIEW_QUESTIONS[0] },
  ]);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat]);

  const submit = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');

    const feedback = FEEDBACK_TIPS[Math.floor(Math.random() * FEEDBACK_TIPS.length)];
    const next = qIndex + 1;

    const newChat = [
      ...chat,
      { role: 'user' as const, text: userMsg },
      { role: 'bot' as const, text: `💬 **Feedback:** ${feedback}` + (next < INTERVIEW_QUESTIONS.length ? `\n\n**Question ${next + 1}:** ${INTERVIEW_QUESTIONS[next]}` : '\n\n🎉 **Interview complete!** Well done for completing all 8 questions. Review the feedback above and practice the answers that felt weakest. You\'re more ready than you think!') },
    ];
    setChat(newChat);
    if (next < INTERVIEW_QUESTIONS.length) setQIndex(next);
    else setDone(true);
  };

  const reset = () => {
    setQIndex(0);
    setInput('');
    setDone(false);
    setChat([{ role: 'bot', text: "Welcome back! Let's run through the interview again.\n\n**Question 1:** " + INTERVIEW_QUESTIONS[0] }]);
  };

  return (
    <div className="my-6 border border-border-subtle rounded-xl overflow-hidden bg-[#0d0d0d]">
      <div className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-bold text-foreground">Mock Interview Simulator</span>
        </div>
        <button onClick={reset} className="flex items-center gap-1 text-xs text-secondary-text hover:text-accent transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Restart
        </button>
      </div>

      <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3">
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-accent text-black font-medium rounded-br-sm'
                : 'bg-secondary text-foreground rounded-bl-sm border border-border-subtle'
            }`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {!done && (
        <div className="flex gap-2 p-3 border-t border-border-subtle bg-secondary">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submit()}
            placeholder="Type your answer and press Enter..."
            className="flex-1 bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
          />
          <button
            onClick={submit}
            disabled={!input.trim()}
            className="px-4 py-2 bg-accent text-black font-bold rounded-lg hover:bg-accent/90 transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Email Practice ────────────────────────────────────────────────────────────

const EMAIL_CHECKLIST = [
  'Subject line is specific and professional',
  'Greeting uses the person\'s name',
  'First sentence states the purpose clearly',
  'Body is concise (under 200 words)',
  'Tone is professional but warm',
  'No text speak, slang, or emojis',
  'Ends with a clear call to action',
  'Sign-off includes full name and contact details',
  'Proofread — no spelling or grammar errors',
];

function EmailPractice({ scenario }: { scenario: string }) {
  const [email, setEmail] = useState('');
  const [checked, setChecked] = useState<boolean[]>(new Array(EMAIL_CHECKLIST.length).fill(false));
  const [submitted, setSubmitted] = useState(false);
  const score = checked.filter(Boolean).length;

  const toggle = (i: number) => setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));

  return (
    <div className="my-6 border border-border-subtle rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-secondary border-b border-border-subtle">
        <p className="text-xs text-secondary-text font-mono">📋 Scenario: {scenario}</p>
      </div>
      <div className="p-4">
        <textarea
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Write your professional email here..."
          rows={10}
          className="w-full bg-[#0d0d0d] border border-border-subtle rounded-lg px-4 py-3 text-sm text-foreground font-mono focus:outline-none focus:border-accent transition-all resize-none"
        />
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={email.trim().length < 50}
            className="mt-3 px-5 py-2 bg-accent text-black font-bold rounded-lg text-sm hover:bg-accent/90 transition-all disabled:opacity-40"
          >
            Self-Assess My Email
          </button>
        ) : (
          <div className="mt-4">
            <p className="text-sm font-bold text-foreground mb-3">Check each item that applies to your email:</p>
            <div className="flex flex-col gap-2 mb-4">
              {EMAIL_CHECKLIST.map((item, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => toggle(i)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                      checked[i] ? 'bg-accent border-accent' : 'border-border-subtle group-hover:border-accent/50'
                    }`}
                  >
                    {checked[i] && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                  </div>
                  <span className={`text-sm ${checked[i] ? 'text-foreground' : 'text-secondary-text'}`}>{item}</span>
                </label>
              ))}
            </div>
            <div className={`p-4 rounded-lg border text-center ${
              score >= 8 ? 'bg-accent/10 border-accent/30' : score >= 5 ? 'bg-warning/10 border-warning/30' : 'bg-error/10 border-error/30'
            }`}>
              <p className={`text-2xl font-bold mb-1 ${score >= 8 ? 'text-accent' : score >= 5 ? 'text-warning' : 'text-error'}`}>
                {score}/9
              </p>
              <p className="text-sm text-secondary-text">
                {score === 9 ? '🎉 Perfect! Your email is professional and complete.' :
                 score >= 7 ? '✅ Great work! Review the unchecked items and revise.' :
                 score >= 5 ? '⚠️ Good effort. Focus on the missing elements and rewrite.' :
                 '❌ Keep practising. Review the email etiquette module and try again.'}
              </p>
            </div>
            <button onClick={() => { setSubmitted(false); setChecked(new Array(EMAIL_CHECKLIST.length).fill(false)); }}
              className="mt-3 text-xs text-secondary-text hover:text-accent transition-colors">
              ↺ Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Video Embed ───────────────────────────────────────────────────────────────

function VideoEmbed({ src, title }: { src: string; title: string }) {
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border-subtle aspect-video">
      <iframe
        src={src}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

// ── Breathing Timer ───────────────────────────────────────────────────────────

function BreathingTimer() {
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const PHASES: { name: 'inhale' | 'hold' | 'exhale'; duration: number; label: string; color: string }[] = [
    { name: 'inhale', duration: 4, label: 'Breathe In', color: 'text-accent' },
    { name: 'hold', duration: 7, label: 'Hold', color: 'text-warning' },
    { name: 'exhale', duration: 8, label: 'Breathe Out', color: 'text-[#00b0f0]' },
  ];

  const start = () => {
    setCycles(0);
    runPhase(0, 0);
  };

  const runPhase = (phaseIdx: number, cycleCount: number) => {
    const p = PHASES[phaseIdx];
    setPhase(p.name);
    setCount(p.duration);
    let remaining = p.duration;
    intervalRef.current = setInterval(() => {
      remaining--;
      setCount(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        const nextPhase = (phaseIdx + 1) % 3;
        const newCycles = nextPhase === 0 ? cycleCount + 1 : cycleCount;
        setCycles(newCycles);
        if (newCycles >= 3 && nextPhase === 0) {
          setPhase('idle');
          setCount(0);
        } else {
          runPhase(nextPhase, newCycles);
        }
      }
    }, 1000);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const current = PHASES.find(p => p.name === phase);

  return (
    <div className="my-6 p-6 bg-secondary border border-border-subtle rounded-xl text-center">
      <p className="text-sm text-secondary-text mb-4">🧘 4-7-8 Breathing Exercise</p>
      {phase === 'idle' ? (
        <>
          <p className="text-secondary-text text-sm mb-4">Takes 60 seconds. Reduces anxiety immediately.</p>
          <button onClick={start} className="px-6 py-2.5 bg-accent text-black font-bold rounded-lg hover:bg-accent/90 transition-all">
            Start Breathing Exercise
          </button>
        </>
      ) : (
        <>
          <div className={`text-5xl font-bold mb-2 ${current?.color}`}>{count}</div>
          <div className={`text-xl font-semibold mb-4 ${current?.color}`}>{current?.label}</div>
          <div className="flex justify-center gap-1 mb-4">
            {[0, 1, 2].map(i => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < cycles ? 'bg-accent' : 'bg-secondary border border-border-subtle'}`} />
            ))}
          </div>
          <p className="text-xs text-secondary-text">Cycle {cycles + 1} of 3</p>
        </>
      )}
    </div>
  );
}

// ── Custom Markdown Renderer ──────────────────────────────────────────────────

function WrpContent({ content, video }: { content: string; video?: string | null }) {
  // Split content on custom tags and render each segment
  const segments = content.split(/(<video-embed[^>]*\/?>|<mock-interview-bot\s*\/>|<email-practice[^>]*\/>|<cv-builder\s*\/>|<img-block[^>]*\/>)/g);

  return (
    <div className="flex flex-col">
      {segments.map((seg, i) => {
        if (seg.startsWith('<video-embed')) {
          const srcMatch = seg.match(/src="([^"]+)"/);
          const titleMatch = seg.match(/title="([^"]+)"/);
          const src = srcMatch?.[1] || video || '';
          const title = titleMatch?.[1] || 'Video';
          return src ? <VideoEmbed key={i} src={src} title={title} /> : null;
        }
        if (seg.startsWith('<mock-interview-bot')) {
          return <MockInterviewBot key={i} />;
        }
        if (seg.startsWith('<email-practice')) {
          const scenarioMatch = seg.match(/scenario="([^"]+)"/);
          return <EmailPractice key={i} scenario={scenarioMatch?.[1] || ''} />;
        }
        if (seg.startsWith('<img-block')) {
          const srcMatch = seg.match(/src="([^"]+)"/);
          const captionMatch = seg.match(/caption="([^"]+)"/);
          const src = srcMatch?.[1] || '';
          const caption = captionMatch?.[1] || '';
          return src ? (
            <figure key={i} className="my-6">
              <img src={src} alt={caption} className="w-full rounded-xl border border-border-subtle object-cover max-h-72" />
              {caption && <figcaption className="text-center text-xs text-secondary-text mt-2 italic">{caption}</figcaption>}
            </figure>
          ) : null;
        }
        if (seg.startsWith('<cv-builder')) {
          return <CvBuilder key={i} />;
        }
        if (!seg.trim()) return null;
        return (
          <div key={i} className="prose prose-invert prose-cyan max-w-none
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
            prose-table:text-sm prose-th:text-accent prose-th:font-bold prose-td:text-gray-300
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{seg}</ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Lesson Client ────────────────────────────────────────────────────────

interface WrpLessonClientProps {
  pageId: string;
  title: string;
  type: string;
  content: string;
  video?: string | null;
  prev: WrpPage | null;
  next: WrpPage | null;
  isLast: boolean;
}

export default function WrpLessonClient({ pageId, title, type, content, video, prev, next, isLast }: WrpLessonClientProps) {
  const { markCompleted, completedPages } = useProgress();
  const router = useRouter();
  const isCompleted = !!completedPages[pageId];

  const handleNext = () => {
    markCompleted(pageId);
    if (isLast) router.push('/wrp/certificate');
    else if (next) router.push(`/wrp/lesson/${next.id}`);
  };

  const handlePrev = () => {
    if (prev) router.push(`/wrp/lesson/${prev.id}`);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-accent font-bold uppercase tracking-widest mb-2">Work Readiness Program</p>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>

        {/* Breathing timer for mindfulness pages */}
        {(content.includes('4-7-8') || content.includes('box breathing') || content.includes('Breathing Exercise')) && (
          <BreathingTimer />
        )}

        {/* Content */}
        <WrpContent content={content} video={video} />

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-border-subtle flex items-center justify-between">
          {prev ? (
            <button onClick={handlePrev}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border-subtle text-secondary-text hover:text-white hover:border-accent transition-all">
              <ChevronLeft className="w-4 h-4" />
              <div className="flex flex-col items-start px-2">
                <span className="text-[10px] uppercase tracking-wider font-bold mb-0.5">Previous</span>
                <span className="text-sm font-medium">{prev.title}</span>
              </div>
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              isLast
                ? 'bg-accent text-black hover:bg-accent/90'
                : 'bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 hover:border-accent'
            }`}
          >
            {isCompleted && !isLast ? <CheckCircle2 className="w-4 h-4" /> : null}
            {isLast ? <><Award className="w-5 h-5" /> Get Certificate</> : (
              <div className="flex flex-col items-end px-2">
                <span className="text-[10px] uppercase tracking-wider font-bold mb-0.5">
                  {isCompleted ? 'Completed ·' : 'Mark Complete &'} Next
                </span>
                <span className="text-sm font-medium">{next?.title}</span>
              </div>
            )}
            {!isLast && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
