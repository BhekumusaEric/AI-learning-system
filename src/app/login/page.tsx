"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    
    // Normalize username
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // 1. Set local identity
    localStorage.setItem('ioai_user', cleanUsername);
    
    // 2. Ping backend to ensure user profile exists
    try {
      const res = await fetch(`/api/progress?username=${encodeURIComponent(cleanUsername)}`);
      if (!res.ok) {
         console.warn("Backend not ready or failed to sync user. Proceeding anyway.");
      }
    } catch (e) {
      console.error("Failed to initialize user on backend", e);
    }
    
    // 3. Redirect to the first lesson
    router.push('/lesson/page1_your_first_python_program');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
      <div className="w-full max-w-md bg-secondary border border-border-subtle rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-accent/20 p-4 rounded-2xl mb-4">
            <BookOpen className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">IOAI Training Grounds</h1>
          <p className="text-secondary-text text-center">Enter your student ID or username to pick up where you left off.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-secondary-text mb-2">
              Student Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alice_smith"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              autoComplete="off"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 focus:ring-4 focus:ring-accent/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Access Training Grounds
              </>
            )}
          </button>
        </form>
        
      </div>
    </div>
  );
}
