"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Download, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Template image natural dimensions
const IMG_W = 1414;
const IMG_H = 2000;
// Underline top edge in template pixels
const UNDERLINE_Y = 1118;
// Name text baseline = just above underline
const NAME_BASELINE_Y = UNDERLINE_Y - 6;
// Name horizontal centre
const NAME_CENTER_X = 2134825 / 7562100 * IMG_W + (3309000 / 7562100 * IMG_W) / 2; // ~778px

function toTitleCase(str: string) {
  return str.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export default function WrpCertificatePage() {
  const [studentName, setStudentName] = useState('');
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [requested, setRequested] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const date = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const loginId = localStorage.getItem('ioai_user');
    if (!loginId) { router.replace('/wrp/login'); return; }
    const name = localStorage.getItem('ioai_name') || '';
    setStudentName(toTitleCase(name));
    fetch(`/api/student/request-certificate?login_id=${loginId}&platform=wrp`)
      .then(r => r.json())
      .then(data => {
        setAllowed(data.certificate_unlocked ?? false);
        setRequested(data.certificate_requested ?? false);
      })
      .catch(() => setAllowed(false));
  }, []);

  const drawCertificate = useCallback((canvas: HTMLCanvasElement, name: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = IMG_W;
    canvas.height = IMG_H;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, IMG_W, IMG_H);

      // Fit font size so name never overflows the box width (max 580px)
      const maxWidth = 580;
      let fontSize = 72;
      ctx.font = `bold ${fontSize}px Georgia, "Times New Roman", serif`;
      while (ctx.measureText(name).width > maxWidth && fontSize > 24) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px Georgia, "Times New Roman", serif`;
      }

      ctx.fillStyle = '#1a1a1a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(name, NAME_CENTER_X, NAME_BASELINE_Y);

      // Date — bottom right
      ctx.font = '28px Georgia, serif';
      ctx.fillStyle = '#444444';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(date, IMG_W - 110, IMG_H - 88);
    };
    img.src = '/wrp-cert-bg.png';
  }, [date]);

  useEffect(() => {
    if (ready && canvasRef.current) {
      drawCertificate(canvasRef.current, studentName);
    }
  }, [ready, studentName, drawCertificate]);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgData = canvasRef.current.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`WRP-Certificate-${(studentName || 'student').replace(/\s+/g, '-')}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

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
            <input
              type="text"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              onBlur={e => setStudentName(toTitleCase(e.target.value))}
              placeholder="e.g. Thabo Nkosi"
              className="w-full bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-all"
            />
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

      {/* Canvas renders at full template resolution — displayed scaled via CSS */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          maxWidth: 600,
          height: 'auto',
          display: 'block',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
        }}
      />

      <p className="text-secondary-text text-xs mt-4 print:hidden">
        Download as PDF to share with employers or add to your LinkedIn profile.
      </p>
    </div>
  );
}
