"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, Award } from 'lucide-react';
import Image from 'next/image';

interface CertData {
  valid: boolean;
  name?: string;
  program?: string;
  platform?: string;
  issued_at?: string;
}

export default function VerifyPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/verify?token=${token}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setData({ valid: false }); setLoading(false); });
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0047AB] px-8 py-6 flex items-center gap-4">
          <Image src="/wtc-logo.png" alt="WeThinkCode_" width={40} height={40} className="rounded" />
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">Certificate Verification</p>
            <p className="text-white font-bold text-lg">WeThinkCode_</p>
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="w-8 h-8 text-[#0047AB] animate-spin" />
              <p className="text-gray-500 text-sm">Verifying certificate...</p>
            </div>
          ) : data?.valid ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-9 h-9 text-emerald-500" />
              </div>
              <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-2">✓ Verified & Authentic</p>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.name}</h1>
              <p className="text-gray-500 text-sm mb-6">has successfully completed the</p>

              <div className="w-full bg-[#f0f7ff] border border-[#bfdbfe] rounded-xl p-5 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-[#0047AB] shrink-0" />
                  <p className="text-[#0047AB] font-bold text-sm">{data.program}</p>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Issued by: <span className="font-semibold text-gray-700">WeThinkCode_ / IDC SEF</span></p>
                  <p>Verification ID: <span className="font-mono text-gray-700">{token}</span></p>
                  <p>Verified on: <span className="font-semibold text-gray-700">{new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                This certificate was issued by WeThinkCode_ and is verified as authentic.
                The holder has met all program requirements including coursework and assessment.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <XCircle className="w-9 h-9 text-red-500" />
              </div>
              <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-2">Invalid Certificate</p>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Certificate Not Found</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                This verification link is invalid or the certificate has not been issued.
                If you believe this is an error, please contact the program administrator.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4">
          <p className="text-gray-400 text-xs text-center">
            Verified by WeThinkCode_ · <a href="https://ai-learning-system-ten.vercel.app" className="text-[#0047AB] hover:underline">ai-learning-system-ten.vercel.app</a>
          </p>
        </div>
      </div>
    </div>
  );
}
