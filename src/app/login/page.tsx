"use client";

import React, { useState } from 'react';
import { BookOpen, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [loginId, setLoginId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim()) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: loginId.trim(), platform: 'saaio' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError('Student ID not found. Please contact your administrator.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('ioai_user', data.login_id);
      localStorage.setItem('ioai_name', data.full_name);
      window.location.href = '/lesson/page1_your_first_python_program';
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
      <div className="w-full max-w-md bg-secondary border border-border-subtle rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-accent/20 p-4 rounded-2xl mb-4">
            <BookOpen className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">SAAIO Training Grounds</h1>
          <p className="text-secondary-text text-center text-sm">Enter your student ID to access the platform.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-2">Student ID</label>
            <input
              type="text"
              value={loginId}
              onChange={e => setLoginId(e.target.value.toUpperCase())}
              placeholder="e.g. SAAIO-2025-001"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all uppercase"
              autoComplete="off"
              required
            />
          </div>

          {error && (
            <p className="text-error text-sm bg-error/10 border border-error/20 rounded-lg px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || !loginId.trim()}
            className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <><LogIn className="w-5 h-5" />Access Training Grounds</>
            )}
          </button>
        </form>

        <p className="text-center text-secondary-text text-xs mt-6">
          Don&apos;t have an ID? Contact your program administrator.
        </p>
      </div>
    </div>
  );
}
