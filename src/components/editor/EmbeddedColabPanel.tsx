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
}

export default function EmbeddedColabPanel({ notebookPath, onMarkComplete }: EmbeddedColabPanelProps) {
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const colabUrl = getColabUrl(notebookPath);

  // Show fallback banner after 8s if iframe still hasn't loaded
  useEffect(() => {
    if (loaded) return;
    const t = setTimeout(() => setShowFallback(true), 8000);
    return () => clearTimeout(t);
  }, [loaded]);

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
          {onMarkComplete && (
            <button
              onClick={onMarkComplete}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-black text-xs font-semibold transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark Complete
            </button>
          )}
          <a
            href={colabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F9AB00]/10 border border-[#F9AB00]/30 text-[#F9AB00] hover:bg-[#F9AB00] hover:text-black text-xs font-semibold transition-all"
            title="Open in Google Colab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in Colab
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

      {/* Fallback banner — shown after 8s if iframe hasn't loaded */}
      {showFallback && !loaded && (
        <div className="shrink-0 flex items-center justify-between gap-4 px-4 py-3 bg-[#F9AB00]/10 border-b border-[#F9AB00]/30">
          <p className="text-xs text-[#F9AB00]">
            The notebook isn't loading — this is usually a browser restriction (Firefox blocks Colab iframes).
          </p>
          <a
            href={colabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F9AB00] text-black text-xs font-bold hover:bg-[#F9AB00]/90 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in Google Colab
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
              <p className="text-xs text-[#555] max-w-xs">
                If the notebook doesn't appear below, click the button above to open it directly in Google Colab.
              </p>
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
