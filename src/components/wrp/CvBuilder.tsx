"use client";

import React, { useState, useRef } from 'react';
import { FileText, Mail, Download, Plus, Trash2, ChevronDown, ChevronUp, Eye, Edit3 } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

interface EducationEntry {
  id: string;
  qualification: string;
  institution: string;
  year: string;
}

interface CvData {
  fullName: string;
  phone: string;
  email: string;
  linkedin: string;
  city: string;
  summary: string;
  skills: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: string;
}

interface CoverData {
  recipientName: string;
  company: string;
  role: string;
  whyRole: string;
  whyCompany: string;
  keyStrength: string;
}

const uid = () => Math.random().toString(36).slice(2, 9);

const EMPTY_CV: CvData = {
  fullName: '', phone: '', email: '', linkedin: '', city: '',
  summary: '',
  skills: '',
  experience: [{ id: uid(), title: '', company: '', startDate: '', endDate: '', current: false, bullets: ['', '', ''] }],
  education: [{ id: uid(), qualification: '', institution: '', year: '' }],
  certifications: '',
};

const EMPTY_COVER: CoverData = {
  recipientName: '', company: '', role: '', whyRole: '', whyCompany: '', keyStrength: '',
};

// ── Input helpers ─────────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, multiline = false, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; rows?: number;
}) {
  const cls = "w-full bg-[#0d0d0d] border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-all";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider">{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={cls + " resize-none"} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />}
    </div>
  );
}

// ── CV Preview (ATS-clean single column) ──────────────────────────────────────

function CvPreview({ cv }: { cv: CvData }) {
  return (
    <div className="bg-white text-black font-sans text-[13px] leading-relaxed p-8 min-h-[297mm]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b-2 border-black pb-3 mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-black">{cv.fullName || 'Your Full Name'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-[12px] text-gray-700">
          {cv.phone && <span>{cv.phone}</span>}
          {cv.email && <span>{cv.email}</span>}
          {cv.linkedin && <span>{cv.linkedin}</span>}
          {cv.city && <span>{cv.city}</span>}
        </div>
      </div>

      {/* Summary */}
      {cv.summary && (
        <div className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-2">Professional Summary</h2>
          <p className="text-gray-800">{cv.summary}</p>
        </div>
      )}

      {/* Skills */}
      {cv.skills && (
        <div className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-2">Core Skills</h2>
          <p className="text-gray-800">{cv.skills}</p>
        </div>
      )}

      {/* Experience */}
      {cv.experience.some(e => e.title || e.company) && (
        <div className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-2">Work Experience</h2>
          {cv.experience.map(exp => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-black">{exp.title || 'Job Title'}</span>
                <span className="text-gray-600 text-[11px]">
                  {exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-gray-700 italic mb-1">{exp.company}</div>
              <ul className="list-disc list-inside space-y-0.5">
                {exp.bullets.filter(b => b.trim()).map((b, i) => (
                  <li key={i} className="text-gray-800">{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {cv.education.some(e => e.qualification || e.institution) && (
        <div className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-2">Education</h2>
          {cv.education.map(ed => (
            <div key={ed.id} className="flex justify-between mb-1">
              <span><span className="font-bold">{ed.qualification || 'Qualification'}</span>{ed.institution ? ` — ${ed.institution}` : ''}</span>
              <span className="text-gray-600 text-[11px]">{ed.year}</span>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {cv.certifications && (
        <div className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-0.5 mb-2">Certifications & Courses</h2>
          <p className="text-gray-800 whitespace-pre-line">{cv.certifications}</p>
        </div>
      )}
    </div>
  );
}

// ── Cover Letter Preview ──────────────────────────────────────────────────────

function CoverPreview({ cover, cv }: { cover: CoverData; cv: CvData }) {
  const today = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="bg-white text-black font-sans text-[13px] leading-relaxed p-8 min-h-[297mm]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="mb-6">
        <p className="font-bold">{cv.fullName || 'Your Name'}</p>
        {cv.phone && <p>{cv.phone}</p>}
        {cv.email && <p>{cv.email}</p>}
        {cv.city && <p>{cv.city}</p>}
      </div>
      <p className="mb-4">{today}</p>
      <div className="mb-6">
        <p className="font-bold">{cover.recipientName || 'Hiring Manager'}</p>
        <p>{cover.company || 'Company Name'}</p>
      </div>
      <p className="mb-4">Dear {cover.recipientName || 'Hiring Manager'},</p>
      <p className="mb-4">
        I am writing to express my strong interest in the <strong>{cover.role || '[Role]'}</strong> position at <strong>{cover.company || '[Company]'}</strong>.
        {cover.whyRole ? ` ${cover.whyRole}` : ''}
      </p>
      {cover.whyCompany && (
        <p className="mb-4">{cover.whyCompany}</p>
      )}
      {cover.keyStrength && (
        <p className="mb-4">{cover.keyStrength}</p>
      )}
      <p className="mb-4">
        I have attached my CV for your consideration and would welcome the opportunity to discuss how my background aligns with your team's needs. Please feel free to contact me at {cv.phone || '[phone]'} or {cv.email || '[email]'}.
      </p>
      <p className="mb-6">Thank you for your time and consideration.</p>
      <p>Kind regards,</p>
      <p className="font-bold mt-4">{cv.fullName || 'Your Name'}</p>
    </div>
  );
}

// ── Main Builder ──────────────────────────────────────────────────────────────

export default function CvBuilder() {
  const [tab, setTab] = useState<'cv' | 'cover'>('cv');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [cv, setCv] = useState<CvData>(EMPTY_CV);
  const [cover, setCover] = useState<CoverData>(EMPTY_COVER);
  const [emailAddr, setEmailAddr] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const previewRef = useRef<HTMLDivElement>(null);

  const updateCv = (patch: Partial<CvData>) => setCv(prev => ({ ...prev, ...patch }));

  const addExp = () => setCv(prev => ({
    ...prev,
    experience: [...prev.experience, { id: uid(), title: '', company: '', startDate: '', endDate: '', current: false, bullets: ['', '', ''] }],
  }));

  const removeExp = (id: string) => setCv(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));

  const updateExp = (id: string, patch: Partial<ExperienceEntry>) =>
    setCv(prev => ({ ...prev, experience: prev.experience.map(e => e.id === id ? { ...e, ...patch } : e) }));

  const updateBullet = (expId: string, idx: number, val: string) =>
    setCv(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === expId
        ? { ...e, bullets: e.bullets.map((b, i) => i === idx ? val : b) }
        : e),
    }));

  const addEdu = () => setCv(prev => ({
    ...prev,
    education: [...prev.education, { id: uid(), qualification: '', institution: '', year: '' }],
  }));

  const removeEdu = (id: string) => setCv(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));

  const handleDownload = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const imgData = canvas.toDataURL('image/png');
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
    pdf.save(`${tab === 'cv' ? 'CV' : 'Cover-Letter'}-${cv.fullName.replace(/\s+/g, '-') || 'document'}.pdf`);
  };

  const handleEmail = async () => {
    if (!emailAddr.trim()) return;
    setEmailStatus('sending');
    try {
      const res = await fetch('/api/wrp/send-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emailAddr, type: tab, cv, cover }),
      });
      setEmailStatus(res.ok ? 'sent' : 'error');
    } catch {
      setEmailStatus('error');
    }
    setTimeout(() => setEmailStatus('idle'), 4000);
  };

  return (
    <div className="my-6 border border-border-subtle rounded-xl overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border-subtle flex-wrap gap-3">
        <div className="flex gap-1">
          {(['cv', 'cover'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-accent text-black' : 'text-secondary-text hover:text-foreground'}`}>
              {t === 'cv' ? 'CV / Resume' : 'Cover Letter'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode(m => m === 'edit' ? 'preview' : 'edit')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border-subtle rounded-lg text-secondary-text hover:text-accent hover:border-accent transition-all">
            {mode === 'edit' ? <><Eye className="w-3.5 h-3.5" />Preview</> : <><Edit3 className="w-3.5 h-3.5" />Edit</>}
          </button>
          <button onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-accent text-black rounded-lg hover:bg-accent/90 transition-all">
            <Download className="w-3.5 h-3.5" />Download PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Edit panel */}
        {mode === 'edit' && (
          <div className="flex-1 p-5 overflow-y-auto max-h-[700px] flex flex-col gap-5 border-r border-border-subtle">
            {tab === 'cv' ? (
              <>
                {/* Contact */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3 flex items-center gap-2"><FileText className="w-3.5 h-3.5" />Contact Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Full Name" value={cv.fullName} onChange={v => updateCv({ fullName: v })} placeholder="Thabo Nkosi" />
                    <Field label="Phone" value={cv.phone} onChange={v => updateCv({ phone: v })} placeholder="071 234 5678" />
                    <Field label="Email" value={cv.email} onChange={v => updateCv({ email: v })} placeholder="thabo@email.com" />
                    <Field label="LinkedIn URL" value={cv.linkedin} onChange={v => updateCv({ linkedin: v })} placeholder="linkedin.com/in/thabonkosi" />
                    <Field label="City" value={cv.city} onChange={v => updateCv({ city: v })} placeholder="Johannesburg, Gauteng" />
                  </div>
                </section>

                {/* Summary */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Professional Summary</h3>
                  <Field label="" value={cv.summary} onChange={v => updateCv({ summary: v })} multiline rows={3}
                    placeholder="Results-driven professional with 2 years of experience in customer service and data analysis. Passionate about using technology to solve real-world problems. Seeking a junior analyst role in Johannesburg." />
                  <p className="text-[11px] text-secondary-text mt-1">2–3 sentences. Who you are, what you offer, what you want.</p>
                </section>

                {/* Skills */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Core Skills</h3>
                  <Field label="" value={cv.skills} onChange={v => updateCv({ skills: v })} multiline rows={2}
                    placeholder="Python · Excel · Data Analysis · Customer Service · Communication · Problem Solving · Teamwork" />
                  <p className="text-[11px] text-secondary-text mt-1">Separate with · or commas. Include keywords from the job description.</p>
                </section>

                {/* Experience */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Work Experience</h3>
                  {cv.experience.map((exp, ei) => (
                    <div key={exp.id} className="mb-4 p-4 bg-[#0d0d0d] rounded-lg border border-border-subtle">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-foreground">Position {ei + 1}</span>
                        {cv.experience.length > 1 && (
                          <button onClick={() => removeExp(exp.id)} className="text-error hover:text-error/80 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <Field label="Job Title" value={exp.title} onChange={v => updateExp(exp.id, { title: v })} placeholder="Customer Service Representative" />
                        <Field label="Company" value={exp.company} onChange={v => updateExp(exp.id, { company: v })} placeholder="BrightPath Solutions" />
                        <Field label="Start Date" value={exp.startDate} onChange={v => updateExp(exp.id, { startDate: v })} placeholder="Jan 2023" />
                        <div className="flex flex-col gap-1">
                          <Field label="End Date" value={exp.endDate} onChange={v => updateExp(exp.id, { endDate: v })} placeholder="Dec 2024" />
                          <label className="flex items-center gap-2 text-xs text-secondary-text cursor-pointer mt-1">
                            <input type="checkbox" checked={exp.current} onChange={e => updateExp(exp.id, { current: e.target.checked })} className="accent-accent" />
                            Currently working here
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-secondary-text uppercase tracking-wider">Key Achievements (use action verbs + numbers)</label>
                        {exp.bullets.map((b, bi) => (
                          <input key={bi} type="text" value={b} onChange={e => updateBullet(exp.id, bi, e.target.value)}
                            placeholder={bi === 0 ? "Resolved 20+ customer complaints daily, maintaining 4.8/5 satisfaction rating" : bi === 1 ? "Trained 3 new team members on POS systems and procedures" : "Processed 150+ transactions daily with 99% accuracy"}
                            className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-all" />
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={addExp} className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors font-semibold">
                    <Plus className="w-3.5 h-3.5" />Add another position
                  </button>
                </section>

                {/* Education */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Education</h3>
                  {cv.education.map((ed, ei) => (
                    <div key={ed.id} className="mb-3 p-4 bg-[#0d0d0d] rounded-lg border border-border-subtle">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-foreground">Entry {ei + 1}</span>
                        {cv.education.length > 1 && (
                          <button onClick={() => removeEdu(ed.id)} className="text-error hover:text-error/80 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Field label="Qualification" value={ed.qualification} onChange={v => setCv(prev => ({ ...prev, education: prev.education.map(e => e.id === ed.id ? { ...e, qualification: v } : e) }))} placeholder="National Certificate IT" />
                        <Field label="Institution" value={ed.institution} onChange={v => setCv(prev => ({ ...prev, education: prev.education.map(e => e.id === ed.id ? { ...e, institution: v } : e) }))} placeholder="WeThinkCode_" />
                        <Field label="Year" value={ed.year} onChange={v => setCv(prev => ({ ...prev, education: prev.education.map(e => e.id === ed.id ? { ...e, year: v } : e) }))} placeholder="2024" />
                      </div>
                    </div>
                  ))}
                  <button onClick={addEdu} className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors font-semibold">
                    <Plus className="w-3.5 h-3.5" />Add another entry
                  </button>
                </section>

                {/* Certifications */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Certifications & Courses</h3>
                  <Field label="" value={cv.certifications} onChange={v => updateCv({ certifications: v })} multiline rows={3}
                    placeholder={"Work Readiness Program — WeThinkCode_ (2025)\nData Analysis Fundamentals — Coursera (2024)"} />
                </section>
              </>
            ) : (
              /* Cover Letter fields */
              <>
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3 flex items-center gap-2"><Mail className="w-3.5 h-3.5" />Cover Letter Details</h3>
                  <p className="text-xs text-secondary-text mb-4">Your contact details are pulled from your CV. Fill in the details below.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Recipient Name" value={cover.recipientName} onChange={v => setCover(p => ({ ...p, recipientName: v }))} placeholder="Ms. Priya Naidoo" />
                    <Field label="Company Name" value={cover.company} onChange={v => setCover(p => ({ ...p, company: v }))} placeholder="TechForward Solutions" />
                    <Field label="Role Applying For" value={cover.role} onChange={v => setCover(p => ({ ...p, role: v }))} placeholder="Junior Data Analyst" />
                  </div>
                </section>
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Paragraph 1 — Why This Role</h3>
                  <Field label="" value={cover.whyRole} onChange={v => setCover(p => ({ ...p, whyRole: v }))} multiline rows={3}
                    placeholder="Having completed a Data Analysis program and built hands-on projects in Python and Excel, I am confident that this role aligns perfectly with my skills and career goals." />
                </section>
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Paragraph 2 — Why This Company</h3>
                  <Field label="" value={cover.whyCompany} onChange={v => setCover(p => ({ ...p, whyCompany: v }))} multiline rows={3}
                    placeholder="I have followed TechForward's work in financial technology for the past year and am particularly impressed by your commitment to financial inclusion across Southern Africa. Your values align closely with my own." />
                </section>
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Paragraph 3 — Your Key Strength</h3>
                  <Field label="" value={cover.keyStrength} onChange={v => setCover(p => ({ ...p, keyStrength: v }))} multiline rows={3}
                    placeholder="My greatest strength is my ability to translate complex data into clear, actionable insights. In my previous role, I built dashboards that reduced reporting time by 40%, directly improving team decision-making." />
                </section>
              </>
            )}
          </div>
        )}

        {/* Preview panel */}
        <div className={`${mode === 'edit' ? 'hidden lg:block lg:w-[420px]' : 'w-full'} overflow-y-auto max-h-[700px] bg-gray-100`}>
          <div ref={previewRef}>
            {tab === 'cv' ? <CvPreview cv={cv} /> : <CoverPreview cover={cover} cv={cv} />}
          </div>
        </div>
      </div>

      {/* Email footer */}
      <div className="px-4 py-3 border-t border-border-subtle bg-secondary flex flex-wrap items-center gap-3">
        <Mail className="w-4 h-4 text-secondary-text shrink-0" />
        <input
          type="email"
          value={emailAddr}
          onChange={e => setEmailAddr(e.target.value)}
          placeholder="Email this document to yourself..."
          className="flex-1 min-w-0 bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
        />
        <button
          onClick={handleEmail}
          disabled={!emailAddr.trim() || emailStatus === 'sending'}
          className="px-4 py-2 bg-accent text-black font-bold text-sm rounded-lg hover:bg-accent/90 transition-all disabled:opacity-40 whitespace-nowrap"
        >
          {emailStatus === 'sending' ? 'Sending...' : emailStatus === 'sent' ? 'Sent!' : emailStatus === 'error' ? 'Failed — try again' : 'Send to Email'}
        </button>
      </div>
    </div>
  );
}
