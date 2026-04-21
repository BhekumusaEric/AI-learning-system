"use client";

import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, BookOpen } from 'lucide-react';

const GITHUB_REPO = "BhekumusaEric/AI-learning-system";
const GITHUB_BRANCH = "main";

function getColabUrl(notebookPath: string) {
  return `https://colab.research.google.com/github/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${notebookPath}`;
}

interface ColabPanelProps {
  notebookPath: string;
  onMarkComplete?: () => void;
  pageId?: string;
}

export default function ColabPanel({ notebookPath, onMarkComplete, pageId }: ColabPanelProps) {
  const [opened, setOpened] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [colabUrlInput, setColabUrlInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colabUrl = getColabUrl(notebookPath);

  const handleOpen = () => {
    window.open(colabUrl, '_blank', 'noopener,noreferrer');
    setOpened(true);
  };

  const handleSubmit = async () => {
    if (!colabUrlInput.trim()) {
      setError('Please paste your Google Colab link first.');
      return;
    }

    if (!colabUrlInput.includes('colab.research.google.com')) {
      setError('Please provide a valid Google Colab URL.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const loginId = localStorage.getItem('ioai_user');

    try {
      const res = await fetch('/api/submit-colab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login_id: loginId,
          page_id: pageId || notebookPath,
          colab_url: colabUrlInput.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit');
      }

      setSubmitted(true);
      if (onMarkComplete) onMarkComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-l border-border-subtle">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-border-subtle shrink-0">
        <div className="w-2 h-2 rounded-full bg-[#F9AB00]" />
        <span className="text-sm font-semibold text-[#cccccc]">Google Colab Exercise</span>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-center gap-6 overflow-y-auto">

        {/* Colab logo + explanation */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-[#F9AB00]/10 border border-[#F9AB00]/30 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#F9AB00" opacity="0.15"/>
              <path d="M8.5 8.5L12 12l-3.5 3.5M15.5 8.5L12 12l3.5 3.5" stroke="#F9AB00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Run in Google Colab</h3>
            <p className="text-sm text-secondary-text max-w-xs leading-relaxed">
              This exercise requires a full Python environment.
              Click below to open the notebook in Google Colab.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="w-full max-w-xs text-left space-y-2">
          {[
            'Click "Open in Colab" below',
            'Sign in and complete your work',
            'File → Save a copy in Drive',
            'Click "Share" (top right) and set to "Anyone with the link"',
            'Paste your share link below to submit',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-secondary-text">
              <span className="shrink-0 w-4 h-4 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-[10px] mt-0.5">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>

        {/* Open button */}
        {!submitted && (
          <button
            onClick={handleOpen}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F9AB00] text-black font-bold text-sm hover:bg-[#F9AB00]/90 transition-all shadow-lg shadow-[#F9AB00]/20"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Google Colab
          </button>
        )}

        {/* Submission area */}
        {opened && !submitted && (
          <div className="w-full max-w-xs flex flex-col gap-3 mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs font-semibold text-white text-left">Paste your Colab Share Link:</p>
            <input
              type="text"
              value={colabUrlInput}
              onChange={(e) => setColabUrlInput(e.target.value)}
              placeholder="https://colab.research.google.com/drive/..."
              className="w-full bg-black/40 border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-accent/50"
            />
            {error && <p className="text-[10px] text-red-500 text-left">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-accent text-black font-bold text-xs hover:bg-accent/90 transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Work & Complete'}
              {!submitting && <CheckCircle2 className="w-4 h-4" />}
            </button>
          </div>
        )}

        {submitted && (
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <h4 className="text-sm font-bold text-white">Work Submitted!</h4>
            <p className="text-xs text-secondary-text">Your progress has been saved.</p>
          </div>
        )}

        {/* Direct notebook link */}
        <a
          href={`https://github.com/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${notebookPath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-secondary-text hover:text-accent transition-colors mt-1"
        >
          <BookOpen className="w-3 h-3" />
          View notebook on GitHub
        </a>
      </div>
    </div>
  );
}
