"use client";

import React, { useState } from 'react';
import { ShieldCheck, LogIn, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      window.location.href = '/admin';
    } else {
      const data = await res.json();
      setError(data.error || 'Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
      <div className="w-full max-w-sm bg-secondary border border-border-subtle rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-accent/20 p-4 rounded-2xl mb-4">
            <ShieldCheck className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Admin Access</h1>
          <p className="text-secondary-text text-sm text-center">SAAIO Training Grounds</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
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
                required
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
            <p className="text-error text-sm bg-error/10 border border-error/20 rounded-lg px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
            className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <><LogIn className="w-5 h-5" />Sign In</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
