"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface ProgressContextType {
  completedPages: Record<string, boolean>;
  markCompleted: (pageId: string) => void;
}

const ProgressContext = createContext<ProgressContextType>({
  completedPages: {},
  markCompleted: () => {},
});

export function useProgress() {
  return useContext(ProgressContext);
}

async function fetchProgress(loginId: string): Promise<Record<string, boolean>> {
  try {
    const res = await fetch(`/api/progress?username=${encodeURIComponent(loginId)}`);
    if (res.ok) {
      const data = await res.json();
      return data.completedPages || {};
    }
  } catch (e) {
    console.error('Failed to fetch progress', e);
  }
  return {};
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedPages, setCompletedPages] = useState<Record<string, boolean>>({});
  const usernameRef = useRef<string>('guest');

  const loadProgress = async (loginId: string) => {
    usernameRef.current = loginId;

    // Instant load from local cache
    try {
      const cached = localStorage.getItem(`ioai_progress_${loginId}`);
      if (cached) setCompletedPages(JSON.parse(cached));
    } catch (e) { /* ignore */ }

    // Fetch source-of-truth from DB and update
    const remote = await fetchProgress(loginId);
    if (Object.keys(remote).length > 0) {
      setCompletedPages(remote);
      try {
        localStorage.setItem(`ioai_progress_${loginId}`, JSON.stringify(remote));
      } catch (e) { /* ignore */ }
    }
  };

  useEffect(() => {
    // Initial load
    const loginId = localStorage.getItem('ioai_user');
    if (loginId) {
      loadProgress(loginId);
    }

    // Re-fetch whenever another tab or the login page sets ioai_user
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'ioai_user' && e.newValue) {
        loadProgress(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);

    // Also poll every 2s for same-tab login (storage event doesn't fire in same tab)
    const interval = setInterval(() => {
      const current = localStorage.getItem('ioai_user');
      if (current && current !== usernameRef.current) {
        loadProgress(current);
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  const markCompleted = (pageId: string) => {
    setCompletedPages(prev => {
      if (prev[pageId]) return prev;
      const next = { ...prev, [pageId]: true };

      const loginId = usernameRef.current;

      // Save locally
      try {
        localStorage.setItem(`ioai_progress_${loginId}`, JSON.stringify(next));
      } catch (e) { /* ignore */ }

      // Save remotely
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginId, completedPages: { [pageId]: true } }),
      }).catch(e => console.error('Failed to persist progress', e));

      return next;
    });
  };

  return (
    <ProgressContext.Provider value={{ completedPages, markCompleted }}>
      {children}
    </ProgressContext.Provider>
  );
}
