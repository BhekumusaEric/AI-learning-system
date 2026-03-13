"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedPages, setCompletedPages] = useState<Record<string, boolean>>({});
  const [username, setUsername] = useState<string>('guest');

  // Load username and fetch remote progress
  useEffect(() => {
    const loadUserAndProgress = async () => {
      let activeUser = 'guest';
      try {
        const storedUser = localStorage.getItem('ioai_user');
        if (storedUser) activeUser = storedUser;
        setUsername(activeUser);
      } catch(e) { console.error(e) }

      // Try local cache first for instant load
      try {
        const localProgress = localStorage.getItem(`ioai_progress_${activeUser}`);
        if (localProgress) setCompletedPages(JSON.parse(localProgress));
      } catch (e) { console.error(e) }

      // Fetch source-of-truth from backend
      try {
        const res = await fetch(`/api/progress?username=${encodeURIComponent(activeUser)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.completedPages) {
            setCompletedPages(data.completedPages);
            localStorage.setItem(`ioai_progress_${activeUser}`, JSON.stringify(data.completedPages));
          }
        }
      } catch (e) {
        console.error("Failed to sync with backend database", e);
      }
    };

    loadUserAndProgress();
  }, []);

  const markCompleted = (pageId: string) => {
    setCompletedPages((prev) => {
      if (prev[pageId]) return prev;
      
      const nextProgress = { ...prev, [pageId]: true };
      
      // Save locally
      try {
        localStorage.setItem(`ioai_progress_${username}`, JSON.stringify(nextProgress));
      } catch (e) { console.error(e); }
      
      // Save remotely
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          completedPages: { [pageId]: true }
        })
      }).catch(e => console.error("Failed to persist progress to backend database", e));

      return nextProgress;
    });
  };

  return (
    <ProgressContext.Provider value={{ completedPages, markCompleted }}>
      {children}
    </ProgressContext.Provider>
  );
}
