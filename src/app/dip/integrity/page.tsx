"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function IntegrityContent() {
  const [agreed, setAgreed] = useState(false);
  const [loginId, setLoginId] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dip/lesson/page1_your_first_python_program';

  useEffect(() => {
    const id = localStorage.getItem('ioai_user');
    if (!id) { router.replace('/dip/login'); return; }
    setLoginId(id);
    if (localStorage.getItem(`integrity_agreed_${id}`)) {
      router.replace(next);
    }
  }, []);

  const handleAgree = () => {
    if (!agreed || !loginId) return;
    localStorage.setItem(`integrity_agreed_${loginId}`, new Date().toISOString());
    router.replace(next);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
      <div className="w-full max-w-lg bg-secondary border border-border-subtle rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-accent/20 p-4 rounded-2xl mb-4">
            <ShieldCheck className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-center">Academic Integrity Agreement</h1>
          <p className="text-secondary-text text-sm text-center">IDC SEF Digital Inclusion Program</p>
        </div>

        <div className="bg-background border border-border-subtle rounded-xl p-5 mb-6 text-sm text-secondary-text leading-relaxed space-y-3">
          <p>Before you begin, please read and agree to the following:</p>
          <ul className="space-y-2 list-none">
            {[
              'I will complete all lessons, challenges, and the final exam using my own knowledge and effort.',
              'I will not copy code from AI tools (ChatGPT, Copilot, etc.) or paste solutions from the internet.',
              'I will not share my login credentials or allow anyone else to complete work on my behalf.',
              'I understand that my certificate reflects my own skills — and that employers may test me in person.',
              'I understand that violations may result in my certificate being revoked.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-accent font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-6 group">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="mt-1 accent-accent w-4 h-4 shrink-0"
          />
          <span className="text-sm text-foreground leading-relaxed">
            I have read and agree to the Academic Integrity Agreement. I commit to completing this program with honesty and genuine effort.
          </span>
        </label>

        <button
          onClick={handleAgree}
          disabled={!agreed}
          className="w-full bg-accent text-black font-bold py-3 rounded-xl hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          I Agree — Start Learning
        </button>
      </div>
    </div>
  );
}

export default function DipIntegrityPage() {
  return (
    <Suspense>
      <IntegrityContent />
    </Suspense>
  );
}
