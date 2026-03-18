"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, LogIn } from 'lucide-react';

export default function DipLoginPage() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setIsLoading(true);
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    localStorage.setItem('ioai_user', clean);
    try {
      await fetch(`/api/progress?username=${encodeURIComponent(clean)}`);
    } catch {}
    window.location.href = '/dip/lesson/page1_your_first_python_program';
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
      <div className="w-full max-w-md bg-secondary border border-border-subtle rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-accent/20 p-4 rounded-2xl mb-4">
            <BookOpen className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Digital Inclusion Program</h1>
          <p className="text-accent text-sm font-semibold mb-2">Foundational AI & Machine Learning</p>
          <p className="text-secondary-text text-center text-sm">Enter your student ID to begin or continue your learning journey.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-secondary-text mb-2">Student Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. alice_smith"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              autoComplete="off"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <><LogIn className="w-5 h-5" />Start Learning</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
