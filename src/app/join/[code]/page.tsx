"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Briefcase, BookOpen, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface Cohort {
  id: string; name: string; platform: string;
  description?: string; location?: string; start_date?: string;
}

export default function JoinPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ login_id: string; plainPassword: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/join?code=${code}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setLoadError(d.error);
        else setCohort(d);
        setLoading(false);
      })
      .catch(() => { setLoadError('Failed to load cohort.'); setLoading(false); });
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !cohort) return;
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim() || undefined,
          platform: cohort.platform,
          cohort_id: cohort.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed.'); setSubmitting(false); return; }
      setResult({ login_id: data.login_id, plainPassword: data.plainPassword });
    } catch { setError('Something went wrong. Please try again.'); }
    setSubmitting(false);
  };

  const platformName = cohort?.platform === 'wrp' ? 'Work Readiness Program' : 'Digital Inclusion Program';
  const loginPath = cohort?.platform === 'wrp' ? '/wrp/login' : '/dip/login';
  const Icon = cohort?.platform === 'wrp' ? Briefcase : BookOpen;

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
  );

  if (loadError) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md text-center bg-secondary border border-error/30 rounded-2xl p-8">
        <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Invalid Invite Link</h2>
        <p className="text-secondary-text text-sm">{loadError}</p>
      </div>
    </div>
  );

  if (result) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-secondary border border-accent/30 rounded-2xl p-8 text-center">
        <CheckCircle className="w-14 h-14 text-accent mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-1">You're registered!</h2>
        <p className="text-secondary-text text-sm mb-6">Welcome to <span className="text-accent font-semibold">{cohort?.name}</span>. Save your login credentials below.</p>

        <div className="bg-background border border-border-subtle rounded-xl p-5 font-mono text-sm mb-6 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-secondary-text">Login ID</span>
            <span className="text-accent font-bold text-lg tracking-widest">{result.login_id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary-text">Password</span>
            <span className="text-warning font-bold text-lg tracking-widest">{result.plainPassword}</span>
          </div>
        </div>

        <p className="text-xs text-secondary-text mb-6">Screenshot or write these down — you'll need them to log in. You can change your password after logging in.</p>

        <button onClick={() => router.push(loginPath)}
          className="w-full py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all">
          Go to Login →
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-accent/20 p-4 rounded-2xl mb-4">
            <Icon className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-1">{platformName}</h1>
          <p className="text-accent font-semibold text-sm">WeThinkCode_</p>
        </div>

        {/* Cohort info card */}
        <div className="bg-secondary border border-border-subtle rounded-2xl p-5 mb-6">
          <p className="text-xs text-secondary-text uppercase tracking-wider mb-1">You've been invited to join</p>
          <h2 className="text-xl font-bold text-foreground mb-1">{cohort?.name}</h2>
          {cohort?.description && <p className="text-secondary-text text-sm mb-2">{cohort.description}</p>}
          <div className="flex flex-wrap gap-3 mt-2">
            {cohort?.location && (
              <span className="text-xs bg-background border border-border-subtle px-3 py-1 rounded-full text-secondary-text">
                Location: {cohort.location}
              </span>
            )}
            {cohort?.start_date && (
              <span className="text-xs bg-background border border-border-subtle px-3 py-1 rounded-full text-secondary-text">
                Start Date: {new Date(cohort.start_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="bg-secondary border border-border-subtle rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-bold text-foreground">Create your account</h3>
          {error && <p className="text-error text-sm bg-error/10 border border-error/20 rounded-lg px-4 py-2">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-1">Full Name *</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
              placeholder="e.g. Thabo Nkosi"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-1">Email (optional)</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="thabo@email.com"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-all" />
          </div>
          <button type="submit" disabled={submitting || !fullName.trim()}
            className="w-full py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-40 flex items-center justify-center gap-2 mt-1">
            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" />Registering...</> : 'Register & Get My Login'}
          </button>
          <p className="text-xs text-secondary-text text-center">Your login credentials will be shown immediately after registration.</p>
        </form>
      </div>
    </div>
  );
}
