"use client";

import React, { useState } from 'react';
import { ShieldCheck, LogIn } from 'lucide-react';

export default function SupervisorLoginPage() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/supervisor/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: loginId.trim(), password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError('Invalid credentials.'); setLoading(false); return; }
      // Store supervisor session in localStorage + cookie
      localStorage.setItem('supervisor_id', data.id);
      localStorage.setItem('supervisor_name', data.full_name);
      localStorage.setItem('supervisor_platform', data.platform);
      document.cookie = `supervisor_id=${data.id}; path=/; max-age=86400`;
      window.location.href = '/supervisor';
    } catch { setError('Something went wrong.'); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground">
      <div className="w-full max-w-md bg-secondary border border-border-subtle rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-accent/20 p-4 rounded-2xl mb-4">
            <ShieldCheck className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Supervisor Portal</h1>
          <p className="text-accent text-sm font-semibold mb-1">WeThinkCode_</p>
          <p className="text-secondary-text text-sm text-center">Manage your cohorts and track student progress.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-2">Supervisor ID</label>
            <input type="text" value={loginId} onChange={e => setLoginId(e.target.value.toUpperCase())}
              placeholder="e.g. SUP-2025-001"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-all uppercase"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-all"
              required />
          </div>
          {error && <p className="text-error text-sm bg-error/10 border border-error/20 rounded-lg px-4 py-2">{error}</p>}
          <button type="submit" disabled={loading || !loginId.trim() || !password.trim()}
            className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><LogIn className="w-5 h-5" />Sign In</>}
          </button>
        </form>
      </div>
    </div>
  );
}
