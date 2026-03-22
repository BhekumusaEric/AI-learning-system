"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Download, XCircle, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Auto-uses /public/wtc-logo.png if present, otherwise SVG fallback
function WtcLogo() {
  const [useImg, setUseImg] = React.useState(true);
  if (useImg) {
    return (
      <img
        src="/wtc-logo.png"
        alt="WeThinkCode_"
        width={64} height={64}
        style={{ borderRadius: 8, objectFit: 'contain' }}
        onError={() => setUseImg(false)}
      />
    );
  }
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="8" fill="#000" />
      <path d="M7 13 L15 13 L22 38 L29 18 L35 18 L42 38 L49 13 L57 13 L46 51 L35 30 L29 30 L18 51 Z" fill="#FFFFFF" />
      <rect x="7" y="55" width="50" height="5" rx="2.5" fill="#00FF9D" />
    </svg>
  );
}

export default function DipCertificatePage() {
  const [studentName, setStudentName] = useState('');
  const [score, setScore] = useState<string | null>(null);
  const [total, setTotal] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const date = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
  const year = new Date().getFullYear();

  useEffect(() => {
    const passed = localStorage.getItem('dip_exam_passed');
    if (passed !== 'true') { setAllowed(false); return; }
    setAllowed(true);
    const stored = localStorage.getItem('ioai_name') || localStorage.getItem('ioai_user') || '';
    setStudentName(stored.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
    setScore(localStorage.getItem('dip_exam_score'));
    setTotal(localStorage.getItem('dip_exam_total'));
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
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`IDC-SEF-DIP-Certificate-${(studentName || 'student').replace(/\s+/g, '-')}.pdf`);
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

  const pct = score && total ? Math.round((parseInt(score) / parseInt(total)) * 100) : null;

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
      <div className="mb-6 flex gap-3 print:hidden w-full max-w-5xl justify-between items-center">
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

      {/* ── Certificate ── */}
      <div
        ref={certRef}
        className="w-full max-w-5xl bg-white text-black overflow-hidden"
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          aspectRatio: '297/210',
          position: 'relative',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Outer gold border */}
        <div style={{ position: 'absolute', inset: 12, border: '2px solid #b8960c', pointerEvents: 'none', zIndex: 10 }} />
        {/* Inner thin border */}
        <div style={{ position: 'absolute', inset: 18, border: '1px solid #d4af37', pointerEvents: 'none', zIndex: 10 }} />

        {/* Corner ornaments */}
        {[{ top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 }, { bottom: 8, right: 8 }].map((pos, i) => (
          <svg key={i} width="48" height="48" viewBox="0 0 48 48" style={{ position: 'absolute', ...pos, zIndex: 11 }}>
            <path d="M4 4 L20 4 L4 20 Z" fill="#d4af37" opacity="0.6" />
            <path d="M4 4 L4 20 M4 4 L20 4" stroke="#b8960c" strokeWidth="1.5" fill="none" />
            <circle cx="4" cy="4" r="2.5" fill="#d4af37" />
          </svg>
        ))}

        {/* Background watermark */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }}>
          <defs>
            <pattern id="cert-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="20" stroke="#000" strokeWidth="0.5" fill="none" />
              <circle cx="30" cy="30" r="10" stroke="#000" strokeWidth="0.5" fill="none" />
              <line x1="10" y1="30" x2="50" y2="30" stroke="#000" strokeWidth="0.3" />
              <line x1="30" y1="10" x2="30" y2="50" stroke="#000" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cert-pattern)" />
        </svg>

        {/* Top gold bar */}
        <div style={{ height: 6, background: 'linear-gradient(to right, #b8960c, #d4af37, #f0d060, #d4af37, #b8960c)' }} />

        {/* Main content */}
        <div style={{ padding: '28px 60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 5 }}>

          {/* Logos row — WeThinkCode_ + IDC SEF */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 14 }}>
            {/* WeThinkCode_ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <WtcLogo />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 0.5, color: '#000', fontFamily: 'monospace' }}>WeThinkCode_</div>
                <div style={{ fontSize: 9, letterSpacing: 3, color: '#666', textTransform: 'uppercase', marginTop: 1 }}>in partnership with</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 48, background: '#d4af37', opacity: 0.5 }} />

            {/* IDC SEF */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 1, color: '#000', fontFamily: 'Georgia, serif' }}>IDC SEF</div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: '#666', textTransform: 'uppercase', marginTop: 1 }}>Digital Inclusion Program</div>
            </div>
          </div>

          {/* Decorative divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, width: '70%' }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #d4af37)' }} />
            <svg width="20" height="20" viewBox="0 0 20 20"><polygon points="10,1 12.9,7 19.5,7.6 14.8,11.8 16.4,18.2 10,14.5 3.6,18.2 5.2,11.8 0.5,7.6 7.1,7" fill="#d4af37" /></svg>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #d4af37)' }} />
          </div>

          <div style={{ fontSize: 11, letterSpacing: 6, color: '#888', textTransform: 'uppercase', marginBottom: 8 }}>Certificate of Completion</div>
          <div style={{ fontSize: 11, color: '#555', marginBottom: 6, letterSpacing: 1 }}>This is to certify that</div>

          {/* Student Name */}
          <div style={{
            fontSize: 42, fontWeight: 700, color: '#0a0a0a', letterSpacing: 1,
            fontFamily: "'Georgia', serif", lineHeight: 1.1, marginBottom: 4,
            borderBottom: '2px solid #d4af37', paddingBottom: 6, minWidth: 300,
          }}>
            {studentName}
          </div>

          <div style={{ fontSize: 11, color: '#555', marginTop: 10, marginBottom: 8, letterSpacing: 1 }}>
            has successfully completed all requirements of the
          </div>

          <div style={{ fontSize: 20, fontWeight: 700, color: '#000', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>
            Python Programming Fundamentals
          </div>
          <div style={{ fontSize: 11, color: '#777', letterSpacing: 2, marginBottom: 4 }}>
            Digital Inclusion Program · IDC SEF · {year}
          </div>

          {/* Exam score badge */}
          {pct !== null && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1px solid #d4af37', borderRadius: 4,
              padding: '4px 16px', marginBottom: 12,
            }}>
              <span style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#888' }}>Final Exam Score</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#000' }}>{score}/{total}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#b8960c' }}>{pct}%</span>
            </div>
          )}

          {/* Competency badges */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 14, maxWidth: 560 }}>
            {['Variables & Data Types', 'Lists & Loops', 'Functions', 'Dictionaries', 'String Methods', 'Problem Solving'].map(c => (
              <span key={c} style={{
                fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
                border: '1px solid #d4af37', color: '#555', padding: '3px 8px', borderRadius: 2,
              }}>{c}</span>
            ))}
          </div>

          {/* Signature row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            width: '100%', borderTop: '1px solid #e5e5e5', paddingTop: 12, marginTop: 2,
          }}>
            {/* Date */}
            <div style={{ textAlign: 'center', minWidth: 140 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#000', marginBottom: 4 }}>{date}</div>
              <div style={{ height: 1, background: '#ccc', marginBottom: 4 }} />
              <div style={{ fontSize: 9, letterSpacing: 2, color: '#888', textTransform: 'uppercase' }}>Date of Issue</div>
            </div>

            {/* Seal */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                <circle cx="36" cy="36" r="34" fill="none" stroke="#d4af37" strokeWidth="1.5" />
                <circle cx="36" cy="36" r="29" fill="none" stroke="#d4af37" strokeWidth="0.5" />
                {Array.from({ length: 16 }).map((_, i) => {
                  const angle = (i * 360) / 16;
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 36 + 31 * Math.cos(rad), y1 = 36 + 31 * Math.sin(rad);
                  const x2 = 36 + 28 * Math.cos(rad), y2 = 36 + 28 * Math.sin(rad);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d4af37" strokeWidth="1" />;
                })}
                <circle cx="36" cy="36" r="26" fill="#fffdf5" />
                <text x="36" y="30" textAnchor="middle" fontFamily="monospace" fontWeight="bold" fontSize="9" fill="#000">IDC SEF</text>
                <text x="36" y="41" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#555" letterSpacing="1">CERTIFIED</text>
                <path id="seal-arc-dip" d="M 12 36 A 24 24 0 0 0 60 36" fill="none" />
                <text fontSize="6" fill="#888" letterSpacing="1">
                  <textPath href="#seal-arc-dip" startOffset="10%">WETHINKCODE_ · {year}</textPath>
                </text>
              </svg>
            </div>

            {/* Signature */}
            <div style={{ textAlign: 'center', minWidth: 160 }}>
              <svg width="160" height="36" viewBox="0 0 160 36" style={{ marginBottom: 4 }}>
                <path d="M10 28 C20 10, 35 8, 45 20 C55 32, 60 12, 75 18 C85 22, 90 14, 105 16 C118 18, 125 24, 140 20 C148 18, 152 22, 155 20"
                  stroke="#1a1a1a" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M30 26 C38 20, 42 22, 50 24" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
              </svg>
              <div style={{ height: 1, background: '#ccc', marginBottom: 4 }} />
              <div style={{ fontSize: 10, fontWeight: 700, color: '#000', letterSpacing: 1 }}>Programme Director</div>
              <div style={{ fontSize: 9, color: '#888', letterSpacing: 1 }}>WeThinkCode_ · IDC SEF</div>
            </div>
          </div>
        </div>

        {/* Bottom gold bar */}
        <div style={{ height: 6, background: 'linear-gradient(to right, #b8960c, #d4af37, #f0d060, #d4af37, #b8960c)', position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </div>

      <p className="text-secondary-text text-xs mt-4 print:hidden">
        Download as PDF to share with employers or add to your LinkedIn profile.
      </p>
    </div>
  );
}
