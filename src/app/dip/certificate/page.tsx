"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Award, Download, BookOpen, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DipCertificatePage() {
  const [studentName, setStudentName] = useState('');
  const [institution, setInstitution] = useState('');
  const [score, setScore] = useState<string | null>(null);
  const [total, setTotal] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null); // null = loading
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const passed = localStorage.getItem('dip_exam_passed');
    if (passed !== 'true') {
      setAllowed(false);
      return;
    }
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
      const canvas = await html2canvas(certRef.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width / 3, canvas.height / 3] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
      pdf.save(`IDC-SEF-Certificate-${(studentName || 'student').replace(/\s+/g, '-')}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  // ── Loading ──
  if (allowed === null) {
    return (
      <div className="flex h-full items-center justify-center text-secondary-text">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Blocked ──
  if (!allowed) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="max-w-md text-center bg-secondary border border-error/30 rounded-2xl p-8">
          <XCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Certificate Not Available</h2>
          <p className="text-secondary-text text-sm mb-6">
            You need to pass the Final Exam with at least 70% to earn your certificate.
          </p>
          <button
            onClick={() => router.push('/dip/exam')}
            className="px-6 py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all"
          >
            Go to Exam
          </button>
        </div>
      </div>
    );
  }

  const pct = score && total ? Math.round((parseInt(score) / parseInt(total)) * 100) : null;

  // ── Step 1: Enter name ──
  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="w-full max-w-md bg-secondary border border-border-subtle rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-accent/20 p-2 rounded-lg"><Award className="w-6 h-6 text-accent" /></div>
            <div>
              <h2 className="text-xl font-bold">Generate Your Certificate</h2>
              <p className="text-secondary-text text-sm">Personalise it before downloading</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-text mb-1">Full Name *</label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-text mb-1">Institution / Organisation (optional)</label>
              <input
                type="text"
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                placeholder="e.g. Greenfield High School"
                className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>
            <button
              onClick={() => setReady(true)}
              disabled={!studentName.trim()}
              className="w-full py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              Preview Certificate
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Preview + download ──
  return (
    <div className="flex flex-col items-center justify-start h-full overflow-y-auto p-8 bg-background">
      <div className="mb-6 flex gap-4 print:hidden">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          {downloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
        <button
          onClick={() => setReady(false)}
          className="flex items-center gap-2 px-6 py-3 bg-secondary border border-border-subtle text-foreground font-bold rounded-xl hover:border-accent transition-all"
        >
          Edit Details
        </button>
        <button
          onClick={() => router.push('/dip/lesson/page1_your_first_python_program')}
          className="flex items-center gap-2 px-6 py-3 bg-secondary border border-border-subtle text-foreground font-bold rounded-xl hover:border-accent transition-all"
        >
          <BookOpen className="w-5 h-5" /> Back to Course
        </button>
      </div>

      {/* Certificate */}
      <div
        ref={certRef}
        className="w-full max-w-3xl bg-white text-black rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        <div style={{ height: 12, background: 'linear-gradient(to right, #00ff9d, #00b0f0)' }} />

        <div className="p-12 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-black p-3 rounded-xl">
              <BookOpen className="w-8 h-8 text-[#00ff9d]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Digital Inclusion Program</p>
              <p className="text-lg font-bold text-black leading-tight">IDC SEF</p>
            </div>
          </div>

          <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">Certificate of Completion</p>
          <div className="w-24 h-px bg-gray-300 mb-6" />
          <p className="text-base text-gray-600 mb-3">This certifies that</p>

          <h1 className="text-4xl font-bold text-black mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            {studentName}
          </h1>
          {institution && <p className="text-sm text-gray-500 mb-3">{institution}</p>}

          <div className="w-48 h-px bg-gray-300 mb-6" />
          <p className="text-base text-gray-600 mb-2">has successfully completed</p>
          <h2 className="text-2xl font-bold text-black mb-2">Python Programming Fundamentals</h2>
          <p className="text-gray-500 text-sm mb-2">Digital Inclusion Program · IDC SEF</p>
          {pct !== null && (
            <p className="text-gray-400 text-sm mb-6">
              Final Exam Score: {score}/{total} ({pct}%)
            </p>
          )}

          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-8">
            <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
          </svg>

          <div className="flex items-center justify-between w-full border-t border-gray-200 pt-6 text-sm">
            <div className="text-left">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date Issued</p>
              <p className="font-semibold text-black">{date}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Program</p>
              <p className="font-semibold text-black">Digital Inclusion Program</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Issued by</p>
              <p className="font-semibold text-black">IDC SEF</p>
            </div>
          </div>
        </div>

        <div style={{ height: 12, background: 'linear-gradient(to right, #00b0f0, #00ff9d)' }} />
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:shadow-none, .print\\:shadow-none * { visibility: visible; }
          .print\\:shadow-none { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
