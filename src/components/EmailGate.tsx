"use client";

import React, { useState } from 'react';
import { Mail, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';

interface Props {
  loginId: string;
  platform: string;
  onVerified: () => void;
}

export default function EmailGate({ loginId, platform, onVerified }: Props) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/add-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: loginId, platform, email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return; }
      setStep('otp');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: loginId, platform, otp }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return; }
      onVerified();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-secondary border border-border-subtle rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-background/50 border-b border-border-subtle px-6 py-5 flex items-center gap-3">
          {step === 'email'
            ? <Mail className="w-5 h-5 text-accent flex-shrink-0" />
            : <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0" />
          }
          <div>
            <h2 className="font-bold text-foreground text-base">
              {step === 'email' ? 'Add your email address' : 'Check your inbox'}
            </h2>
            <p className="text-secondary-text text-xs mt-0.5">
              {step === 'email'
                ? 'Required to access the platform'
                : `We sent a 6-digit code to ${email}`}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {step === 'email' ? (
            <>
              <p className="text-secondary-text text-sm leading-relaxed mb-5">
                Your account doesn't have an email address yet. Add one so we can send you important updates, reminders, and your certificate when you complete the program.
              </p>
              <form onSubmit={submitEmail} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-all text-sm"
                  />
                </div>
                {error && <p className="text-error text-xs bg-error/10 border border-error/20 rounded-lg px-3 py-2">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {isLoading ? 'Sending code...' : 'Send Verification Code'}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-secondary-text text-sm leading-relaxed mb-5">
                Enter the 6-digit code from your email. It expires in 15 minutes.
              </p>
              <form onSubmit={submitOtp} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1.5">Verification code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    required
                    className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-all text-center text-2xl font-mono tracking-[0.5em]"
                  />
                </div>
                {error && <p className="text-error text-xs bg-error/10 border border-error/20 rounded-lg px-3 py-2">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('email'); setOtp(''); setError(''); }}
                  className="flex items-center justify-center gap-1.5 text-secondary-text hover:text-foreground text-xs transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Wrong email? Go back
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
