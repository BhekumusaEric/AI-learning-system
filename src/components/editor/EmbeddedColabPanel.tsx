"use client";

import React, { useState } from 'react';
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
  const colabUrl = getColabUrl(notebookPath);

  return (
    <div className={`flex flex-col bg-[#0a0a0a] border-l border-[#333] transition-all ${expanded ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-[#333] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#F9AB00]" />
          <span className="text-sm font-semibold text-[#cccccc]">Live Colab Notebook</span>
          {!loaded && (
            <span className="text-xs text-[#666] animate-pulse">Loading...</span>
          )}
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
          <button
            onClick={() => window.open(colabUrl, '_blank', 'noopener,noreferrer')}
            className="p-1.5 rounded-lg text-[#666] hover:text-white hover:bg-[#222] transition-all"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-1.5 rounded-lg text-[#666] hover:text-white hover:bg-[#222] transition-all"
            title={expanded ? 'Exit fullscreen' : 'Fullscreen'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iframe */}
      <div className="flex-1 relative">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0a0a] z-10">
            <div className="w-10 h-10 rounded-full border-2 border-[#F9AB00] border-t-transparent animate-spin" />
            <p className="text-sm text-[#666]">Opening notebook in Colab...</p>
            <p className="text-xs text-[#444] max-w-xs text-center">
              If the notebook doesn't load, click the external link button above to open it in a new tab.
            </p>
          </div>
        )}
        <iframe
          src={colabUrl}
          className="w-full h-full border-0"
          onLoad={() => setLoaded(true)}
          allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi"
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
          title="Google Colab Notebook"
        />
      </div>
    </div>
  );
}
