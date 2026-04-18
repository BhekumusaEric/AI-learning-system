"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Maximize2, ExternalLink } from 'lucide-react';

const GITHUB_REPO = "BhekumusaEric/AI-learning-system";
const GITHUB_BRANCH = "main";

function getColabUrl(notebookPath: string) {
  return `https://colab.research.google.com/github/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${notebookPath}`;
}

interface EmbeddedColabPanelProps {
  notebookPath: string;
  onMarkComplete?: () => void;
  pageId?: string;
}

export default function EmbeddedColabPanel({ notebookPath, onMarkComplete, pageId }: EmbeddedColabPanelProps) {
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [colabUrlInput, setColabUrlInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const colabUrl = getColabUrl(notebookPath);

  // Show fallback banner after 8s if iframe still hasn't loaded
  useEffect(() => {
    if (loaded) return;
    const t = setTimeout(() => setShowFallback(true), 8000);
    return () => clearTimeout(t);
  }, [loaded]);

  const handleSubmit = async () => {
    if (!colabUrlInput.trim()) {
      setError('Please paste your Colab link.');
      return;
    }

    if (!colabUrlInput.includes('colab.research.google.com')) {
      setError('Invalid link.');
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
      setShowSubmitModal(false);
      if (onMarkComplete) onMarkComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col bg-[#0a0a0a] border-l border-[#333] transition-all ${expanded ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-[#333] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#F9AB00]" />
          <span className="text-sm font-semibold text-[#cccccc]">Live Colab Notebook</span>
          {!loaded && <span className="text-xs text-[#666] animate-pulse">Loading...</span>}
        </div>
        <div className="flex items-center gap-2">
          {onMarkComplete && !submitted && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-black text-xs font-semibold transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Finish & Submit
            </button>
          )}
          {submitted && (
            <span className="flex items-center gap-1 text-xs text-green-500 font-bold px-3 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
            </span>
          )}
          <a
            href={colabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F9AB00]/10 border border-[#F9AB00]/30 text-[#F9AB00] hover:bg-[#F9AB00] hover:text-black text-xs font-bold transition-all"
            title="Open in Google Colab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Full
          </a>
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-1.5 rounded-lg text-[#666] hover:text-white hover:bg-[#222] transition-all"
            title={expanded ? 'Exit fullscreen' : 'Fullscreen'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Submission Modal Overlay */}
      {showSubmitModal && (
        <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Submit your Work</h3>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-500 hover:text-white"
              >✕</button>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              To complete this exercise, please paste your <b>Google Colab Share Link</b> below. 
              Make sure you've set sharing to "Anyone with the link".
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                autoFocus
                value={colabUrlInput}
                onChange={(e) => setColabUrlInput(e.target.value)}
                placeholder="https://colab.research.google.com/drive/..."
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-accent/50"
              />
              {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-accent text-black font-bold text-sm hover:bg-accent/90 transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit & Mark Complete'}
              {!submitting && <CheckCircle2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Fallback banner — shown after 8s if iframe hasn't loaded */}
      {showFallback && !loaded && (
        <div className="shrink-0 flex items-center justify-between gap-4 px-4 py-3 bg-[#F9AB00]/10 border-b border-[#F9AB00]/30">
          <p className="text-xs text-[#F9AB00]">
            The notebook isn't loading — check your browser settings or click below.
          </p>
          <a
            href={colabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F9AB00] text-black text-xs font-bold hover:bg-[#F9AB00]/90 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in Colab
          </a>
        </div>
      )}

      {/* iframe */}
      <div className="flex-1 relative">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#0a0a0a] z-10 p-6">
            <div className="w-10 h-10 rounded-full border-2 border-[#F9AB00] border-t-transparent animate-spin" />
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-[#888]">Opening notebook in Colab...</p>
              <a
                href={colabUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F9AB00] text-black font-bold text-sm hover:bg-[#F9AB00]/90 transition-all shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Google Colab
              </a>
            </div>
          </div>
        )}
        <iframe
          src={colabUrl}
          className="w-full h-full border-0"
          onLoad={() => { setLoaded(true); setShowFallback(false); }}
          allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi"
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
          title="Google Colab Notebook"
        />
      </div>
    </div>
  );
}
