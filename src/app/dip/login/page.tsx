"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { BookOpen, LogIn, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import EmailGate from '@/components/EmailGate';
import { useSearchParams } from 'next/navigation';

function DipLoginContent() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailGate, setEmailGate] = useState<{ loginId: string; fullName: string; destination: string } | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'expired') setError('Your session has expired. Please log in again.');
    else if (reason === 'concurrent_session') setError('Your account was logged in from another device. Please log in again.');
    else if (reason === 'no_session') setError('Session not found. Please log in.');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim()) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: loginId.trim(), password, platform: 'dip' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials. Please contact your administrator.');
        setIsLoading(false);
        return;
      }

      if (!data.has_email) {
        setEmailGate({ loginId: data.login_id, fullName: data.full_name, destination: '/dip/lesson/page1_your_first_python_program' });
        setIsLoading(false);
        return;
      }

      localStorage.setItem('ioai_user', data.login_id);
      localStorage.setItem('ioai_name', data.full_name);
      const sessionRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: data.login_id }),
      });
      const sessionData = await sessionRes.json();
      if (sessionData.token) {
        localStorage.setItem('ioai_session', sessionData.token);
        localStorage.setItem('ioai_session_expires', sessionData.expires_at);
      }
      const agreed = localStorage.getItem(`integrity_agreed_${data.login_id}`);
      if (!agreed) {
        window.location.href = `/dip/integrity?next=/dip/lesson/page1_your_first_python_program`;
      } else {
        window.location.href = '/dip/lesson/page1_your_first_python_program';
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 text-foreground">
      {emailGate && (
        <EmailGate
          loginId={emailGate.loginId}
          platform="dip"
          onVerified={() => {
            localStorage.setItem('ioai_user', emailGate.loginId);
            localStorage.setItem('ioai_name', emailGate.fullName);
            window.location.href = emailGate.destination;
          }}
        />
      )}
      <div className="w-full max-w-md bg-secondary border border-border-subtle rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-accent/20 p-4 rounded-2xl mb-4">
            <BookOpen className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Digital Inclusion Program</h1>
          <p className="text-accent text-sm font-semibold mb-3">IDC SEF</p>
          <p className="text-secondary-text text-center text-sm">Enter your student ID and password to access the platform.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-2">Student ID</label>
            <input
              type="text"
              value={loginId}
              onChange={e => setLoginId(e.target.value.toUpperCase())}
              placeholder="e.g. DIP-2025-001"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all uppercase"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-text mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 pr-12 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-error text-sm bg-error/10 border border-error/20 rounded-lg px-4 py-3 flex flex-col gap-2">
              <p>{error}</p>
              {error.toLowerCase().includes('invalid') && (
                <p className="text-xs opacity-90 border-t border-error/20 pt-2 mt-1">
                  Migrated from our old platform? <Link href="/dip/register" className="underline font-bold hover:text-white transition-colors">Re-register here</Link> to restore your access.
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !loginId.trim()}
            className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <><LogIn className="w-5 h-5" />Start Learning</>
            )}
          </button>
        </form>

        <p className="text-center text-secondary-text text-xs mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/dip/register" className="text-accent hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default function DipLoginPage() {
  return (
    <Suspense>
      <DipLoginContent />
    </Suspense>
  );
}
