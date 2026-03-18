"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Award, Download, BookOpen } from 'lucide-react';

export default function DipCertificatePage() {
  const [username, setUsername] = useState('');
  const [date, setDate] = useState('');
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ioai_user') || 'Student';
    setUsername(stored.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
    setDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col items-center justify-start h-full overflow-y-auto p-8 bg-background">
      <div className="mb-6 flex gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all"
        >
          <Download className="w-5 h-5" />
          Download / Print Certificate
        </button>
        <a
          href="/dip/lesson/page1_your_first_python_program"
          className="flex items-center gap-2 px-6 py-3 bg-secondary border border-border-subtle text-foreground font-bold rounded-xl hover:border-accent transition-all"
        >
          <BookOpen className="w-5 h-5" />
          Back to Course
        </a>
      </div>

      {/* Certificate */}
      <div
        ref={certRef}
        className="w-full max-w-3xl bg-white text-black rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none"
        style={{ fontFamily: 'Georgia, serif', minHeight: '500px' }}
      >
        {/* Top accent bar */}
        <div className="h-3 bg-gradient-to-r from-[#00ff9d] to-[#00b0f0]" />

        <div className="p-12 flex flex-col items-center text-center">
          {/* Logo area */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-black p-3 rounded-xl">
              <BookOpen className="w-8 h-8 text-[#00ff9d]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Digital Inclusion Program</p>
              <p className="text-lg font-bold text-black leading-tight">SAAIO Training Grounds</p>
            </div>
          </div>

          <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">Certificate of Completion</p>

          <div className="w-24 h-px bg-gray-300 mb-6" />

          <p className="text-base text-gray-600 mb-3">This certifies that</p>

          <h1 className="text-4xl font-bold text-black mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            {username || 'Student Name'}
          </h1>

          <div className="w-48 h-px bg-gray-300 mb-6" />

          <p className="text-base text-gray-600 mb-2">has successfully completed</p>

          <h2 className="text-2xl font-bold text-black mb-2">
            Foundational AI & Machine Learning
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Part 1 of the SAAIO Training Grounds Curriculum · 40 Hours
          </p>

          <div className="flex gap-8 mb-8 text-sm text-gray-600">
            <div className="text-center">
              <p className="font-bold text-black">Python Programming</p>
              <p>Fundamentals</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-black">NumPy · Pandas</p>
              <p>Data Handling</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-black">Machine Learning</p>
              <p>Supervised & Unsupervised</p>
            </div>
          </div>

          {/* Award icon */}
          <div className="mb-8">
            <Award className="w-16 h-16 text-[#00ff9d] mx-auto" strokeWidth={1.5} />
          </div>

          <div className="flex items-center justify-between w-full border-t border-gray-200 pt-6">
            <div className="text-left">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Date Issued</p>
              <p className="text-sm font-semibold text-black">{date}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Program</p>
              <p className="text-sm font-semibold text-black">Digital Inclusion Program</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Issued by</p>
              <p className="text-sm font-semibold text-black">SAAIO Training Grounds</p>
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className="h-3 bg-gradient-to-r from-[#00b0f0] to-[#00ff9d]" />
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
