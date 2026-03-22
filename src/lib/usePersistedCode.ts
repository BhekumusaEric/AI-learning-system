"use client";

import { useState, useEffect, useRef } from 'react';

function getKey(pageId: string, username: string) {
  return `ioai_code_${username}_${pageId}`;
}

function getUsername(): string {
  try { return localStorage.getItem('ioai_user') || 'guest'; } catch { return 'guest'; }
}

/**
 * Like useState for editor code, but persists to localStorage per user+page.
 * Falls back to initialCode if nothing saved yet.
 */
export function usePersistedCode(pageId: string, initialCode: string | null) {
  const defaultCode = initialCode || '# Write your python code here\n\n';
  const [code, setCodeState] = useState(defaultCode);
  const usernameRef = useRef<string>('guest');

  // On mount: load saved code for this user+page
  useEffect(() => {
    const username = getUsername();
    usernameRef.current = username;
    try {
      const saved = localStorage.getItem(getKey(pageId, username));
      if (saved !== null) setCodeState(saved);
      else setCodeState(defaultCode);
    } catch {
      setCodeState(defaultCode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  const setCode = (value: string) => {
    setCodeState(value);
    try {
      localStorage.setItem(getKey(pageId, usernameRef.current), value);
    } catch { /* storage full or unavailable */ }
  };

  const resetCode = () => {
    setCode(defaultCode);
  };

  return { code, setCode, resetCode };
}
