"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Download, XCircle, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WrpCertificatePage() {
  const [studentName, setStudentName] = useState('');
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [requested, setRequested] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const date = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const loginId = localStorage.getItem('ioai_user');
    if (!loginId) { router.replace('/wrp/login'); return; }
    const name = localStorage.getItem('ioai_name') || '';
    setStudentName(name.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase()));

    fetch(`/api/student/request-certificate?login_id=${loginId}&platform=wrp`)
      .then(r => r.json())
      .then(data => {
        setAllowed(data.certificate_unlocked ?? false);
        setRequested(data.certificate_requested ?? false);
      })
      .catch(() => setAllowed(false));
  }, []);

  const handleRequest = async () => {
    const loginId = localStorage.getItem('ioai_user');
    if (!loginId) return;
    setRequesting(true);
    await fetch('/api/student/request-certificate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login_id: loginId, platform: 'wrp' }),
    });
    setRequested(true);
    setRequesting(false);
  };

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(certRef.current, {
        scale: 2, useCORS: true, backgroundColor: '#ffffff',
        width: certRef.current.scrollWidth,
        height: certRef.current.scrollHeight,
      });
      // Portrait A4
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`WRP-Certificate-${(studentName || 'student').replace(/\s+/g, '-')}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  if (allowed === null) return (
    <div className="flex h-full items-center justify-center">
      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!allowed) return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-md text-center bg-secondary border border-border-subtle rounded-2xl p-8">
        {requested ? (
          <>
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-4">
              <Download className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-xl font-bold mb-2">Request Submitted</h2>
            <p className="text-secondary-text text-sm leading-relaxed">
              Your certificate request has been received. Once your completion is verified by the program team, you will receive an email with your certificate link.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-4">
              <Download className="w-7 h-7 text-[#d4af37]" />
            </div>
            <h2 className="text-xl font-bold mb-2">Request Your Certificate</h2>
            <p className="text-secondary-text text-sm leading-relaxed mb-6">
              Once you submit your request, the program team will verify your completion and unlock your certificate. You will receive an email notification when it is ready.
            </p>
            <button
              onClick={handleRequest}
              disabled={requesting}
              className="w-full py-3 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#d4af37]/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {requesting
                ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />Submitting...</>
                : 'Request Certificate'
              }
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (!ready) return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="w-full max-w-md bg-secondary border border-border-subtle rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-1">Generate Your Certificate</h2>
        <p className="text-secondary-text text-sm mb-6">Confirm your name as it should appear on the certificate.</p>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-1">Full Name *</label>
            <input type="text" value={studentName} onChange={e => setStudentName(e.target.value.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()))}
              placeholder="e.g. Thabo Nkosi"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-all" />
          </div>
          <button onClick={() => setReady(true)} disabled={!studentName.trim()}
            className="w-full py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-40 mt-2">
            Preview Certificate
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-start min-h-full overflow-y-auto p-6 bg-[#0a0a0a]">
      {/* Action bar */}
      <div className="mb-6 flex gap-3 print:hidden w-full max-w-2xl justify-between items-center">
        <button onClick={() => setReady(false)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border-subtle text-secondary-text font-semibold rounded-xl hover:border-accent hover:text-accent transition-all text-sm">
          <ChevronLeft className="w-4 h-4" /> Edit Name
        </button>
        <button onClick={handleDownload} disabled={downloading}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50">
          <Download className="w-5 h-5" />
          {downloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      {/* Certificate — portrait A4 ratio (1:√2) */}
      <div
        ref={certRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 600,
          aspectRatio: '1 / 1.414',
          overflow: 'hidden',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Background template image */}
        <img
          src="/wrp-cert-bg.png"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          crossOrigin="anonymous"
        />

        {/* Student name — baseline anchored just above underline at 55.90% */}
        <div style={{
          position: 'absolute',
          top: '55.50%',
          left: '28.23%',
          width: '43.76%',
          transform: 'translateY(-100%)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 700,
            color: '#1a1a1a',
            letterSpacing: 1,
            lineHeight: 1,
            whiteSpace: 'nowrap',
            fontSize: 'clamp(10px, 2.8vw, 28px)',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {studentName}
          </div>
        </div>

        {/* Date — bottom-right footer */}
        <div style={{
          position: 'absolute',
          bottom: '4.5%',
          right: '8%',
          textAlign: 'right',
          fontFamily: "'Georgia', serif",
          fontSize: 'clamp(8px, 1vw, 11px)',
          color: '#444',
          letterSpacing: 0.5,
        }}>
          {date}
        </div>
      </div>

      <p className="text-secondary-text text-xs mt-4 print:hidden">
        Download as PDF to share with employers or add to your LinkedIn profile.
      </p>
    </div>
  );
}
