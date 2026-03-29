"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Download, XCircle, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DipCertificatePage() {
  const [studentName, setStudentName] = useState('');
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const date = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const passed = localStorage.getItem('dip_exam_passed');
    if (passed !== 'true') { setAllowed(false); return; }
    setAllowed(true);
    const stored = localStorage.getItem('ioai_name') || localStorage.getItem('ioai_user') || '';
    setStudentName(stored.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
  }, []);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(certRef.current, {
        scale: 3, useCORS: true, backgroundColor: '#ffffff',
        width: certRef.current.scrollWidth,
        height: certRef.current.scrollHeight,
      });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`IDC-DIP-Certificate-${(studentName || 'student').replace(/\s+/g, '-')}.pdf`);
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
      <div className="max-w-md text-center bg-secondary border border-error/30 rounded-2xl p-8">
        <XCircle className="w-12 h-12 text-error mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Certificate Not Yet Available</h2>
        <p className="text-secondary-text text-sm mb-6">
          You need to pass the Final Exam with at least 70% to earn your certificate.
        </p>
        <button onClick={() => router.push('/dip/exam')}
          className="px-6 py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all">
          Go to Exam
        </button>
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
            <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)}
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

      {/* Certificate — portrait A4 ratio */}
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
          src="/dip-cert-bg.png"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          crossOrigin="anonymous"
        />

        {/* Student name overlay — y≈51.1% from top matching pptx position */}
        <div style={{
          position: 'absolute',
          top: '51%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 'clamp(18px, 3.5vw, 32px)',
            fontWeight: 700,
            color: '#1a1a1a',
            letterSpacing: 1,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {studentName}
          </div>
        </div>

        {/* Date overlay */}
        <div style={{
          position: 'absolute',
          bottom: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          fontFamily: "'Georgia', serif",
          fontSize: 'clamp(9px, 1.2vw, 13px)',
          color: '#444',
          letterSpacing: 1,
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
