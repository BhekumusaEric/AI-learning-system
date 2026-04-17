"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, BookOpen, Loader2, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react';

interface LinkMeta {
  type: 'supervisor' | 'student';
  platform: string | null;
  label: string | null;
  expires_at: string | null;
  max_uses: number | null;
  use_count: number;
}

interface Result {
  login_id: string;
  full_name: string;
  plainPassword: string;
  type: 'supervisor' | 'student';
  platform?: string;
}

const PLATFORMS = [
  { value: 'dip', label: 'Digital Inclusion Program (DIP)' },
  { value: 'wrp', label: 'Work Readiness Program (WRP)' },
  { value: 'saaio', label: 'WeThinkCode_ IDC Curriculum' },
];

const SUPERVISOR_PLATFORMS = [
  { value: 'dip', label: 'DIP only' },
  { value: 'wrp', label: 'WRP only' },
  { value: 'both', label: 'Both DIP + WRP' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-xs text-secondary-text hover:text-accent transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function RegisterPage() {
  const { token } = useParams<{ token: string }>();
  const [meta, setMeta] = useState<LinkMeta | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    fetch(`/api/register/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setLoadError(d.error); }
        else {
          setMeta(d);
          // Pre-select platform if link locks it
          if (d.platform && d.platform !== 'both') setPlatform(d.platform);
        }
        setLoading(false);
      })
      .catch(() => { setLoadError('Failed to load registration link.'); setLoading(false); });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !platform) return;
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`/api/register/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName.trim(), email: email.trim() || undefined, platform }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed.'); setSubmitting(false); return; }
      setResult(data);
    } catch { setError('Something went wrong. Please try again.'); }
    setSubmitting(false);
  };

  const loginPath = result?.type === 'supervisor'
    ? '/supervisor/login'
    : result?.platform === 'wrp' ? '/wrp/login'
    : result?.platform === 'dip' ? '/dip/login'
    : '/login';

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
  );

  if (loadError) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-secondary border border-error/30 rounded-2xl p-8">
        <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Link Unavailable</h2>
        <p className="text-secondary-text text-sm">{loadError}</p>
      </div>
    </div>
  );

  if (result) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-secondary border border-accent/30 rounded-2xl p-8 text-center">
        <CheckCircle className="w-14 h-14 text-accent mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-1">You're registered!</h2>
        <p className="text-secondary-text text-sm mb-6">
          Welcome, <span className="text-foreground font-semibold">{result.full_name}</span>. Save your credentials below — you'll need them to log in.
        </p>

        <div className="bg-background border border-border-subtle rounded-xl p-5 font-mono text-sm mb-6 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-secondary-text">Login ID</span>
            <div className="flex items-center gap-2">
              <span className="text-accent font-bold text-lg tracking-widest">{result.login_id}</span>
              <CopyButton text={result.login_id} />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary-text">Password</span>
            <div className="flex items-center gap-2">
              <span className="text-warning font-bold text-lg tracking-widest">{result.plainPassword}</span>
              <CopyButton text={result.plainPassword} />
            </div>
          </div>
          {result.type === 'supervisor' && (
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Role</span>
              <span className="text-foreground font-semibold">Supervisor</span>
            </div>
          )}
        </div>

        <p className="text-xs text-secondary-text mb-6">Screenshot or write these down — this is the only time your password will be shown.</p>

        <button onClick={() => window.location.href = loginPath}
          className="w-full py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all">
          Go to Login →
        </button>
      </div>
    </div>
  );

  const isSupervisor = meta?.type === 'supervisor';
  const Icon = isSupervisor ? ShieldCheck : BookOpen;
  const title = isSupervisor ? 'Supervisor Registration' : 'Student Registration';
  const platformOptions = isSupervisor ? SUPERVISOR_PLATFORMS : PLATFORMS.filter(p =>
    !meta?.platform || meta.platform === 'both' || p.value === meta.platform
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex bg-accent/20 p-4 rounded-2xl mb-4">
            <Icon className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-1">{title}</h1>
          <p className="text-accent font-semibold text-sm">WeThinkCode_</p>
          {meta?.label && <p className="text-secondary-text text-sm mt-2">{meta.label}</p>}
        </div>

        {/* Link info */}
        <div className="bg-secondary border border-border-subtle rounded-xl px-4 py-3 mb-6 flex flex-wrap gap-4 text-xs text-secondary-text">
          {meta?.expires_at && (
            <span>⏱ Expires {new Date(meta.expires_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          )}
          {meta?.max_uses && (
            <span>👥 {meta.use_count} / {meta.max_uses} uses</span>
          )}
          {!meta?.expires_at && !meta?.max_uses && (
            <span className="text-accent">✓ Open registration link</span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-secondary border border-border-subtle rounded-2xl p-6 flex flex-col gap-4">
          {error && <p className="text-error text-sm bg-error/10 border border-error/20 rounded-lg px-4 py-2">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-secondary-text mb-1">Full Name *</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
              placeholder="e.g. Nomsa Dlamini"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-text mb-1">Email {isSupervisor ? '*' : '(optional)'}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required={isSupervisor}
              placeholder="you@example.com"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-text mb-1">Platform *</label>
            <select value={platform} onChange={e => setPlatform(e.target.value)} required
              disabled={!!(meta?.platform && meta.platform !== 'both' && !isSupervisor)}
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-all disabled:opacity-60">
              <option value="">Select platform...</option>
              {platformOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          <button type="submit" disabled={submitting || !fullName.trim() || !platform}
            className="w-full py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-40 flex items-center justify-center gap-2 mt-1">
            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" />Registering...</> : 'Register & Get My Credentials'}
          </button>
        </form>
      </div>
    </div>
  );
}
