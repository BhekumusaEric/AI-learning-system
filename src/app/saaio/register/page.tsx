"use client";

import React, { useState } from 'react';
import { Brain, CheckCircle2, UserPlus, LogIn } from 'lucide-react';
import Link from 'next/link';

type State = 'idle' | 'loading' | 'already_registered' | 'success' | 'error';

export default function SaaioRegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [result, setResult] = useState<{ login_id: string; full_name: string; plainPassword?: string; emailSent?: boolean } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName.trim(), email: email.trim(), platform: 'saaio' }),
      });
      const data = await res.json();

      if (!res.ok) { setErrorMsg(data.error || 'Something went wrong.'); setState('error'); return; }

      setResult(data);
      setState(data.already_registered ? 'already_registered' : 'success');
    } catch {
      setErrorMsg('Network error. Please try again.');
      setState('error');
    }
  };

  if (state === 'already_registered' && result) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
        <div className="w-full max-w-md bg-secondary border border-border-subtle rounded-2xl p-8 shadow-2xl text-center">
          <div className="bg-accent/20 p-4 rounded-2xl mb-4 inline-flex"><CheckCircle2 className="w-10 h-10 text-accent" /></div>
          <h2 className="text-xl font-bold mb-2">You're already registered!</h2>
          <p className="text-secondary-text text-sm mb-6">Welcome back, <span className="text-foreground font-semibold">{result.full_name}</span>. Your account already exists.</p>
          <div className="bg-background border border-border-subtle rounded-xl p-4 mb-6 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Your Login ID</span>
              <span className="text-accent font-bold text-lg">{result.login_id}</span>
            </div>
          </div>
          <p className="text-secondary-text text-xs mb-6">Use your existing password to log in. If you forgot it, contact your administrator.</p>
          <Link href="/saaio/login" className="w-full flex items-center justify-center gap-2 bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 transition-all">
            <LogIn className="w-5 h-5" /> Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (state === 'success' && result) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
        <div className="w-full max-w-md bg-secondary border border-border-subtle rounded-2xl p-8 shadow-2xl text-center">
          <div className="bg-accent/20 p-4 rounded-2xl mb-4 inline-flex"><CheckCircle2 className="w-10 h-10 text-accent" /></div>
          <h2 className="text-xl font-bold mb-2">Registration Successful!</h2>
          <p className="text-secondary-text text-sm mb-6">Welcome, <span className="text-foreground font-semibold">{result.full_name}</span>! Here are your credentials.</p>
          <div className="bg-background border border-border-subtle rounded-xl p-4 mb-4 font-mono text-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Login ID</span>
              <span className="text-accent font-bold text-lg">{result.login_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Password</span>
              <span className="text-warning font-bold text-lg tracking-widest">{result.plainPassword}</span>
            </div>
          </div>
          {result.emailSent
            ? <p className="text-accent text-xs mb-6">✓ Credentials have been sent to your email.</p>
            : <p className="text-warning text-xs mb-6">⚠ Save these credentials now — they won't be shown again.</p>
          }
          <Link href="/saaio/login" className="w-full flex items-center justify-center gap-2 bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 transition-all">
            <LogIn className="w-5 h-5" /> Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
      <div className="w-full max-w-md bg-secondary border border-border-subtle rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-accent/20 p-4 rounded-2xl mb-4"><Brain className="w-10 h-10 text-accent" /></div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">WeThinkCode_ IDC Curriculum</h1>
          <p className="text-accent text-sm font-semibold mb-3">International Olympiad in AI</p>
          <p className="text-secondary-text text-center text-sm">Create your student account to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-2">Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Alice Smith"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-2">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="alice@school.com"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              required
            />
          </div>

          {state === 'error' && (
            <p className="text-error text-sm bg-error/10 border border-error/20 rounded-lg px-4 py-2">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={state === 'loading' || !fullName.trim() || !email.trim()}
            className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state === 'loading'
              ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              : <><UserPlus className="w-5 h-5" />Register</>
            }
          </button>
        </form>

        <p className="text-center text-secondary-text text-xs mt-6">
          Already have an account?{' '}
          <Link href="/saaio/login" className="text-accent hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
}
