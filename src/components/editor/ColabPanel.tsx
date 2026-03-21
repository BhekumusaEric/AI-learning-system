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
}

export default function ColabPanel({ notebookPath, onMarkComplete }: ColabPanelProps) {
  const [opened, setOpened] = useState(false);
  const colabUrl = getColabUrl(notebookPath);

  const handleOpen = () => {
    window.open(colabUrl, '_blank', 'noopener,noreferrer');
    setOpened(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-l border-border-subtle">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-border-subtle shrink-0">
        <div className="w-2 h-2 rounded-full bg-[#F9AB00]" />
        <span className="text-sm font-semibold text-[#cccccc]">Google Colab Exercise</span>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-center gap-6">

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
              This exercise uses PyTorch or TensorFlow which require a full Python environment.
              Click below to open the notebook in Google Colab — it's free and runs in the cloud.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="w-full max-w-xs text-left space-y-2">
          {[
            'Click "Open in Colab" below',
            'Sign in with your Google account',
            'Run each cell from top to bottom',
            'Fill in the blanks and run the test cell',
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
        <button
          onClick={handleOpen}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F9AB00] text-black font-bold text-sm hover:bg-[#F9AB00]/90 transition-all shadow-lg shadow-[#F9AB00]/20"
        >
          <ExternalLink className="w-4 h-4" />
          Open in Google Colab
        </button>

        {/* Mark complete — only shows after they've opened Colab */}
        {opened && onMarkComplete && (
          <div className="flex flex-col items-center gap-2 mt-2">
            <p className="text-xs text-secondary-text">Finished the notebook?</p>
            <button
              onClick={onMarkComplete}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-black text-sm font-semibold transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark as Complete
            </button>
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
