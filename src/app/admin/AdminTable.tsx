"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, Trash2, UserPlus, Loader2, Copy, Check, X, KeyRound, RefreshCw, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, Bell, Send, Award, FolderPlus, Archive, Users, ShieldCheck, Link2, Plus, RotateCcw, Ban, ExternalLink } from 'lucide-react';
import * as XLSX from 'xlsx';

export interface AdminUser {
  login_id: string;
  full_name: string;
  email: string | null;
  created_at: string;
  completedCount: number;
  lastActive: string | null;
  examScore: number | null;
  examPassed: boolean | null;
  cohortId: string | null;
}

export interface Cohort {
  id: string;
  name: string;
  platform: string;
  archived: boolean;
  created_at: string;
}

function CredentialModal({ cred, onClose, isReset = false }: { cred: { login_id: string; full_name: string; plainPassword: string; emailSent?: boolean }; onClose: () => void; isReset?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    navigator.clipboard.writeText(`Login ID: ${cred.login_id}\nPassword: ${cred.plainPassword}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary border border-border-subtle rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-foreground">{isReset ? 'New Password' : 'Student Credentials'}</h3>
          </div>
          <button onClick={onClose} className="text-secondary-text hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        <p className="text-secondary-text text-sm mb-4">
          {isReset ? 'Password has been reset for' : 'Share these credentials with'}{' '}
          <span className="text-foreground font-semibold">{cred.full_name}</span>. The password cannot be retrieved again.
        </p>

        <div className="bg-background rounded-xl p-4 font-mono text-sm space-y-2 border border-border-subtle mb-4">
          <div className="flex justify-between items-center">
            <span className="text-secondary-text">Login ID</span>
            <span className="text-accent font-bold">{cred.login_id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary-text">Password</span>
            <span className="text-warning font-bold tracking-widest">{cred.plainPassword}</span>
          </div>
        </div>

        {cred.emailSent && (
          <p className="text-accent text-xs text-center mb-3">✓ Credentials emailed to student</p>
        )}
        <button
          onClick={copyAll}
          className="w-full flex items-center justify-center gap-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-black py-2 rounded-lg text-sm font-semibold transition-all"
        >
          {copied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy Credentials</>}
        </button>
      </div>
    </div>
  );
}

interface BulkResult {
  full_name: string;
  login_id: string;
  plainPassword: string;
  email: string | null;
  success: boolean;
  error?: string;
  emailSent?: boolean;
}

function BulkImport({ platform, onDone }: { platform: 'saaio' | 'dip' | 'wrp'; onDone: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<BulkResult[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setParseError(null);
    setResults(null);

    const ext = file.name.split('.').pop()?.toLowerCase();
    let students: { full_name: string; email?: string }[] = [];

    try {
      if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (rows.length === 0) { setParseError('File is empty or has no data rows.'); return; }

        // Flexible column detection: look for name/email columns case-insensitively
        const firstRow = rows[0];
        const keys = Object.keys(firstRow);
        const nameKey = keys.find(k => /name/i.test(k));
        const emailKey = keys.find(k => /email/i.test(k));

        if (!nameKey) { setParseError(`No "name" column found. Columns detected: ${keys.join(', ')}`); return; }

        students = rows
          .map(r => ({ full_name: String(r[nameKey] || '').trim(), email: emailKey ? String(r[emailKey] || '').trim() || undefined : undefined }))
          .filter(s => s.full_name);
      } else {
        setParseError('Unsupported file type. Use .xlsx, .xls, or .csv');
        return;
      }
    } catch (e: any) {
      setParseError(`Failed to parse file: ${e.message}`);
      return;
    }

    if (students.length === 0) { setParseError('No valid student rows found.'); return; }

    setIsUploading(true);
    try {
      const res = await fetch('/api/admin/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, students }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data.results);
        onDone();
      } else {
        setParseError(data.error || `Error ${res.status}`);
      }
    } catch (e: any) {
      setParseError(e.message || 'Network error');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([['full_name', 'email'], ['Alice Smith', 'alice@school.com'], ['Bob Jones', '']]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'students_template.xlsx');
  };

  if (results) {
    const passed = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    const copyAllCsv = () => {
      const rows = passed.map(r => `${r.login_id},${r.full_name},${r.plainPassword},${r.email || ''}`);
      navigator.clipboard.writeText(['login_id,full_name,password,email', ...rows].join('\n'));
    };

    return (
      <div className="p-4 border-b border-border-subtle bg-background/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-foreground">Bulk Import Results</h4>
          <div className="flex items-center gap-3">
            <button onClick={copyAllCsv} className="text-xs text-accent hover:underline flex items-center gap-1"><Copy className="w-3 h-3" />Copy CSV</button>
            <button onClick={() => setResults(null)} className="text-xs text-secondary-text hover:text-accent">Import another</button>
          </div>
        </div>
        <div className="flex gap-4 mb-3">
          <span className="text-accent text-sm font-bold">{passed.length} registered</span>
          {failed.length > 0 && <span className="text-error text-sm font-bold">{failed.length} failed</span>}
          <span className="text-secondary-text text-sm">{passed.filter(r => r.emailSent).length} emails sent</span>
        </div>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-secondary-text border-b border-border-subtle">
                <th className="text-left py-1 px-2">Status</th>
                <th className="text-left py-1 px-2">Login ID</th>
                <th className="text-left py-1 px-2">Name</th>
                <th className="text-left py-1 px-2">Password</th>
                <th className="text-left py-1 px-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className={`border-b border-border-subtle/50 ${r.success ? '' : 'bg-error/5'}`}>
                  <td className="py-1 px-2">
                    {r.success ? <CheckCircle className="w-3 h-3 text-accent" /> : <AlertCircle className="w-3 h-3 text-error" />}
                  </td>
                  <td className="py-1 px-2 text-accent">{r.login_id || '—'}</td>
                  <td className="py-1 px-2 text-foreground">{r.full_name}</td>
                  <td className="py-1 px-2 text-warning">{r.plainPassword || (r.error ? <span className="text-error">{r.error}</span> : '—')}</td>
                  <td className="py-1 px-2 text-secondary-text">
                    {r.emailSent ? 'sent' : r.email ? 'not sent' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-border-subtle bg-background/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-accent" />
          <span className="text-sm font-bold text-foreground">Bulk Import from Excel / CSV</span>
        </div>
        <button onClick={downloadTemplate} className="text-xs text-secondary-text hover:text-accent transition-colors">↓ Download template</button>
      </div>

      {parseError && <p className="text-error text-xs bg-error/10 border border-error/20 rounded-lg px-3 py-2 mb-3">{parseError}</p>}

      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging ? 'border-accent bg-accent/10' : 'border-border-subtle hover:border-accent/50 hover:bg-accent/5'
        }`}
      >
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ''; }} />
        {isUploading ? (
          <div className="flex items-center justify-center gap-2 text-accent">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Registering students...</span>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-secondary-text mx-auto mb-2" />
            <p className="text-sm text-foreground">Drop your Excel or CSV file here</p>
            <p className="text-xs text-secondary-text mt-1">Needs a <code className="text-accent">full_name</code> column. <code className="text-accent">email</code> column is optional.</p>
          </>
        )}
      </div>
    </div>
  );
}

function CohortManager({ platform, cohorts, selectedCohortId, onSelect, onRefresh }: {
  platform: 'saaio' | 'dip' | 'wrp';
  cohorts: Cohort[];
  selectedCohortId: string | null;
  onSelect: (id: string | null) => void;
  onRefresh: () => void;
}) {
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/cohorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), platform }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to create cohort'); return; }
      setNewName('');
      setShowCreate(false);
      onRefresh();
      onSelect(data.id);
    } catch { setError('Network error'); }
    finally { setIsCreating(false); }
  };

  const toggleArchive = async (cohort: Cohort) => {
    await fetch('/api/admin/cohorts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: cohort.id, archived: !cohort.archived }),
    });
    onRefresh();
    if (selectedCohortId === cohort.id) onSelect(null);
  };

  const active = cohorts.filter(c => !c.archived);
  const archived = cohorts.filter(c => c.archived);

  return (
    <div className="p-4 border-b border-border-subtle bg-background/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          <span className="text-sm font-bold text-foreground">Cohorts</span>
        </div>
        <button
          onClick={() => setShowCreate(v => !v)}
          className="flex items-center gap-1.5 text-xs text-secondary-text hover:text-accent transition-colors"
        >
          <FolderPlus className="w-3.5 h-3.5" /> New Cohort
        </button>
      </div>

      {showCreate && (
        <form onSubmit={createCohort} className="flex gap-2 mb-3">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="e.g. Cohort 2026 Q1"
            className="flex-1 bg-background border border-border-subtle rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-accent"
            required
          />
          <button
            type="submit"
            disabled={isCreating || !newName.trim()}
            className="flex items-center gap-1.5 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-black px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Create'}
          </button>
          <button type="button" onClick={() => setShowCreate(false)} className="text-secondary-text hover:text-foreground px-2">
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {error && <p className="text-error text-xs mb-2">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
            selectedCohortId === null
              ? 'bg-accent/10 border-accent text-accent'
              : 'border-border-subtle text-secondary-text hover:border-accent/40 hover:text-foreground'
          }`}
        >
          All Students
        </button>
        <button
          onClick={() => onSelect('unassigned')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
            selectedCohortId === 'unassigned'
              ? 'bg-accent/10 border-accent text-accent'
              : 'border-border-subtle text-secondary-text hover:border-accent/40 hover:text-foreground'
          }`}
        >
          Unassigned
        </button>
        {active.map(c => (
          <div key={c.id} className="flex items-center gap-1">
            <button
              onClick={() => onSelect(c.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                selectedCohortId === c.id
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-border-subtle text-secondary-text hover:border-accent/40 hover:text-foreground'
              }`}
            >
              {c.name}
            </button>
            <button
              onClick={() => toggleArchive(c)}
              title="Archive cohort"
              className="text-secondary-text hover:text-warning transition-colors"
            >
              <Archive className="w-3 h-3" />
            </button>
          </div>
        ))}
        {archived.length > 0 && (
          <details className="text-xs text-secondary-text">
            <summary className="cursor-pointer hover:text-foreground">Archived ({archived.length})</summary>
            <div className="flex flex-wrap gap-2 mt-2">
              {archived.map(c => (
                <div key={c.id} className="flex items-center gap-1">
                  <span className="px-3 py-1 rounded-lg border border-border-subtle text-secondary-text opacity-50">{c.name}</span>
                  <button onClick={() => toggleArchive(c)} title="Restore" className="text-secondary-text hover:text-accent transition-colors text-xs">Restore</button>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

function downloadReport(users: AdminUser[], platform: 'saaio' | 'dip' | 'wrp', totalPages: number) {
  // Sort by completedCount desc for ranking
  const sorted = [...users].sort((a, b) => b.completedCount - a.completedCount);

  const rows = sorted.map((u, i) => {
    const pct = totalPages > 0 ? Math.min(100, Math.round((u.completedCount / totalPages) * 100)) : 0;
    const row: Record<string, any> = {
      'Rank': i + 1,
      'Login ID': u.login_id,
      'Full Name': u.full_name,
      'Email': u.email || '—',
      'Completed Topics': u.completedCount,
      'Total Topics': totalPages,
      'Completion %': `${pct}%`,
      'Last Active': u.lastActive ? new Date(u.lastActive).toLocaleString() : '—',
      'Registered': new Date(u.created_at).toLocaleDateString(),
    };
    if (platform === 'dip') {
      row['Exam Score'] = u.examScore !== null ? `${u.examScore}%` : '—';
      row['Exam Passed'] = u.examPassed === true ? 'Yes' : u.examPassed === false ? 'No' : '—';
    }
    return row;
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws['!cols'] = [
    { wch: 6 }, { wch: 12 }, { wch: 24 }, { wch: 28 },
    { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 14 },
    ...(platform === 'dip' ? [{ wch: 12 }, { wch: 12 }] : []),
  ];

  const wb = XLSX.utils.book_new();
  const sheetName = platform === 'dip' ? 'DIP Students' : 'SAAIO Students';
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Summary sheet
  const completed = users.filter(u => u.completedCount >= totalPages).length;
  const avgPct = users.length > 0
    ? Math.round(users.reduce((s, u) => s + Math.min(100, (u.completedCount / totalPages) * 100), 0) / users.length)
    : 0;
  const summaryData = [
    ['Report Generated', new Date().toLocaleString()],
    ['Platform', platform === 'dip' ? 'IDC SEF / DIP' : 'SAAIO Training Grounds'],
    ['Total Students', users.length],
    ['Total Topics', totalPages],
    ['Avg Completion', `${avgPct}%`],
    ['Fully Completed', completed],
    ...(platform === 'dip' ? [
      ['Exam Pass Rate', users.length > 0 ? `${Math.round((users.filter(u => u.examPassed).length / users.length) * 100)}%` : '—'],
    ] : []),
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 20 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${platform}_students_report_${date}.xlsx`);
}

function CongratulatePanel({ platform, onClose }: { platform: 'dip' | 'wrp'; onClose: () => void }) {
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const platformName = platform === 'dip' ? 'IDC SEF Digital Inclusion Program' : 'WeThinkCode_ Work Readiness Program';
  const certUrl = platform === 'dip'
    ? 'https://ai-learning-system-ten.vercel.app/dip/certificate'
    : 'https://ai-learning-system-ten.vercel.app/wrp/certificate';

  const send = async () => {
    setIsSending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/admin/congratulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || `Error ${res.status}`);
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 border-b border-border-subtle bg-background/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#d4af37]" />
          <span className="text-sm font-bold text-foreground">Send Congratulations & Certificate</span>
          <span className="text-xs text-secondary-text">(emails all {platformName} students with email addresses)</span>
        </div>
        <button onClick={onClose} className="text-secondary-text hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>

      <div className="bg-[#0d0d0d] border border-[#d4af37]/30 rounded-xl p-4 mb-4">
        <p className="text-sm text-secondary-text leading-relaxed mb-2">
          Each student will receive a personalised congratulatory email that includes:
        </p>
        <ul className="text-sm text-secondary-text space-y-1 list-disc list-inside">
          <li><span className="text-foreground">A warm congratulations</span> addressed to them by first name</li>
          <li><span className="text-foreground">A list of skills</span> they've earned through the program</li>
          <li><span className="text-foreground">A direct link</span> to download their Certificate of Completion</li>
        </ul>
        <p className="text-xs text-secondary-text mt-3">
          Certificate link: <span className="text-accent font-mono">{certUrl}</span>
        </p>
      </div>

      {error && <p className="text-error text-xs bg-error/10 border border-error/20 rounded-lg px-3 py-2 mb-3">{error}</p>}

      {result && (
        <div className="flex items-center gap-4 mb-3 text-sm">
          <span className="text-[#d4af37] font-bold">{result.sent} sent</span>
          {result.failed > 0 && <span className="text-error font-bold">{result.failed} failed</span>}
          <span className="text-secondary-text">out of {result.total} students with emails</span>
        </div>
      )}

      <button
        onClick={send}
        disabled={isSending}
        className="flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {isSending ? 'Sending...' : 'Send Congratulatory Emails'}
      </button>
    </div>
  );
}

function NotifyPanel({ platform, onClose }: { platform: 'saaio' | 'dip' | 'wrp'; onClose: () => void }) {
  const [type, setType] = useState<'reminder' | 'mark_done' | 'kaggle'>('reminder');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const BUTTONS: { type: 'reminder' | 'mark_done' | 'kaggle'; label: string; desc: string }[] = [
    { type: 'reminder', label: 'Course Reminder', desc: 'Nudge students to continue their course content' },
    { type: 'mark_done', label: 'Mark Done Reminder', desc: 'Remind students to click Mark as Done to save progress' },
    { type: 'kaggle', label: 'Kaggle Challenges', desc: 'Announce new Kaggle challenges have been added' },
  ];

  const send = async () => {
    setIsSending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, platform, message: customMessage.trim() || undefined }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || `Error ${res.status}`);
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 border-b border-border-subtle bg-background/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent" />
          <span className="text-sm font-bold text-foreground">Notify Students</span>
          <span className="text-xs text-secondary-text">(sends to all {platform.toUpperCase()} students with email addresses)</span>
        </div>
        <button onClick={onClose} className="text-secondary-text hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        {BUTTONS.map(b => (
          <button
            key={b.type}
            onClick={() => setType(b.type)}
            className={`text-left p-3 rounded-lg border text-sm transition-all ${
              type === b.type
                ? 'border-accent bg-accent/10 text-foreground'
                : 'border-border-subtle text-secondary-text hover:border-accent/40 hover:text-foreground'
            }`}
          >
            <div className="font-semibold mb-0.5">{b.label}</div>
            <div className="text-xs opacity-70">{b.desc}</div>
          </button>
        ))}
      </div>

      {/* Optional custom message */}
      <div className="mb-4">
        <label className="block text-xs text-secondary-text mb-1">Custom message (optional — overrides the default email body)</label>
        <textarea
          rows={3}
          placeholder="Leave blank to use the default message for the selected type..."
          value={customMessage}
          onChange={e => setCustomMessage(e.target.value)}
          className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent resize-none font-mono"
        />
      </div>

      {error && <p className="text-error text-xs bg-error/10 border border-error/20 rounded-lg px-3 py-2 mb-3">{error}</p>}

      {result && (
        <div className="flex items-center gap-4 mb-3 text-sm">
          <span className="text-accent font-bold">{result.sent} sent</span>
          {result.failed > 0 && <span className="text-error font-bold">{result.failed} failed</span>}
          <span className="text-secondary-text">out of {result.total} students with emails</span>
        </div>
      )}

      <button
        onClick={send}
        disabled={isSending}
        className="flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {isSending ? 'Sending...' : 'Send Notification'}
      </button>
    </div>
  );
}

interface InviteLink {
  id: string; token: string; type: 'supervisor' | 'student';
  platform: string | null; label: string | null;
  expires_at: string | null; max_uses: number | null;
  use_count: number; revoked: boolean; created_at: string;
}

function InviteLinksPanel() {
  const [links, setLinks] = useState<InviteLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'supervisor' | 'student'>('supervisor');
  const [platform, setPlatform] = useState('');
  const [label, setLabel] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/invite-links');
    const data = await res.json();
    setLinks(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const res = await fetch('/api/admin/invite-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type, platform: platform || null, label: label.trim() || null,
        expires_at: expiresAt || null, max_uses: maxUses ? parseInt(maxUses) : null,
      }),
    });
    const data = await res.json();
    if (res.ok) { setLinks(prev => [data, ...prev]); setLabel(''); setExpiresAt(''); setMaxUses(''); }
    setCreating(false);
  };

  const copyLink = (link: InviteLink) => {
    const url = `${window.location.origin}/register/${link.token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const refresh = async (link: InviteLink) => {
    if (!confirm('Refresh this link? The old URL will stop working immediately.')) return;
    const res = await fetch('/api/admin/invite-links', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: link.id, refresh: true }),
    });
    const data = await res.json();
    if (res.ok) setLinks(prev => prev.map(l => l.id === link.id ? data : l));
  };

  const revoke = async (link: InviteLink) => {
    if (!confirm(link.revoked ? 'Re-activate this link?' : 'Revoke this link? It will stop working immediately.')) return;
    const res = await fetch('/api/admin/invite-links', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: link.id, revoked: !link.revoked }),
    });
    const data = await res.json();
    if (res.ok) setLinks(prev => prev.map(l => l.id === link.id ? data : l));
  };

  const hardDelete = async (link: InviteLink) => {
    if (!confirm('Permanently delete this link and its history?')) return;
    await fetch(`/api/admin/invite-links?id=${link.id}&hard=true`, { method: 'DELETE' });
    setLinks(prev => prev.filter(l => l.id !== link.id));
  };

  const isExpired = (link: InviteLink) => !!(link.expires_at && new Date(link.expires_at) < new Date());
  const isMaxed = (link: InviteLink) => !!(link.max_uses !== null && link.use_count >= link.max_uses);
  const isActive = (link: InviteLink) => !link.revoked && !isExpired(link) && !isMaxed(link);

  const active = links.filter(l => isActive(l));
  const inactive = links.filter(l => !isActive(l));

  return (
    <div className="flex flex-col gap-0">
      {/* Create form */}
      <form onSubmit={handleCreate} className="p-4 border-b border-border-subtle bg-background/50 flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-secondary-text">Generate Invite Link</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-secondary-text mb-1">Type *</label>
            <select value={type} onChange={e => setType(e.target.value as any)}
              className="bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent">
              <option value="supervisor">Supervisor</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-secondary-text mb-1">Platform restriction</label>
            <select value={platform} onChange={e => setPlatform(e.target.value)}
              className="bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent">
              <option value="">Any platform</option>
              {type === 'supervisor'
                ? <>
                    <option value="dip">DIP only</option>
                    <option value="wrp">WRP only</option>
                    <option value="both">Both DIP + WRP</option>
                  </>
                : <>
                    <option value="dip">DIP only</option>
                    <option value="wrp">WRP only</option>
                    <option value="saaio">SAAIO only</option>
                  </>
              }
            </select>
          </div>
          <div className="flex-1 min-w-40">
            <label className="block text-xs text-secondary-text mb-1">Label (optional)</label>
            <input value={label} onChange={e => setLabel(e.target.value)}
              placeholder="e.g. Soweto supervisors batch 1"
              className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-xs text-secondary-text mb-1">Expires</label>
            <input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
              className="bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent" />
          </div>
          <div className="w-24">
            <label className="block text-xs text-secondary-text mb-1">Max uses</label>
            <input type="number" min={1} value={maxUses} onChange={e => setMaxUses(e.target.value)}
              placeholder="∞"
              className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </div>
          <button type="submit" disabled={creating}
            className="flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 whitespace-nowrap">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Generate Link
          </button>
        </div>
      </form>

      {/* Links table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-secondary-text">
            <Loader2 className="w-5 h-5 animate-spin" />Loading...
          </div>
        ) : links.length === 0 ? (
          <p className="text-center py-10 text-secondary-text text-sm">No invite links yet. Generate one above.</p>
        ) : (
          <>
            {[{ title: 'Active', items: active }, { title: 'Inactive', items: inactive }].map(group =>
              group.items.length === 0 ? null : (
                <div key={group.title}>
                  <p className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-secondary-text bg-background/30 border-b border-border-subtle">{group.title}</p>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-background/20 border-b border-border-subtle">
                        <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-secondary-text">Link</th>
                        <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-secondary-text">Type</th>
                        <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-secondary-text">Platform</th>
                        <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-secondary-text">Uses</th>
                        <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-secondary-text">Expires</th>
                        <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-secondary-text">Status</th>
                        <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-secondary-text text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {group.items.map(link => {
                        const url = typeof window !== 'undefined' ? `${window.location.origin}/register/${link.token}` : `/register/${link.token}`;
                        const active = isActive(link);
                        return (
                          <tr key={link.id} className={`hover:bg-background/30 transition-colors ${!active ? 'opacity-50' : ''}`}>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-0.5">
                                {link.label && <span className="text-xs font-semibold text-foreground">{link.label}</span>}
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-accent truncate max-w-48">{url}</span>
                                  <button onClick={() => copyLink(link)} className="text-secondary-text hover:text-accent transition-colors shrink-0">
                                    {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                  <a href={url} target="_blank" rel="noreferrer" className="text-secondary-text hover:text-accent transition-colors shrink-0">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                link.type === 'supervisor' ? 'bg-accent/10 text-accent' : 'bg-blue-500/10 text-blue-400'
                              }`}>{link.type}</span>
                            </td>
                            <td className="py-3 px-4 text-xs text-secondary-text">{link.platform || 'any'}</td>
                            <td className="py-3 px-4 text-sm font-semibold text-foreground">
                              {link.use_count}{link.max_uses !== null ? ` / ${link.max_uses}` : ''}
                            </td>
                            <td className="py-3 px-4 text-xs text-secondary-text">
                              {link.expires_at ? new Date(link.expires_at).toLocaleDateString('en-ZA') : '—'}
                            </td>
                            <td className="py-3 px-4">
                              {link.revoked
                                ? <span className="text-xs text-error font-semibold">Revoked</span>
                                : isExpired(link) ? <span className="text-xs text-warning font-semibold">Expired</span>
                                : isMaxed(link) ? <span className="text-xs text-warning font-semibold">Maxed out</span>
                                : <span className="text-xs text-accent font-semibold">Active</span>}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => refresh(link)} title="Refresh token (old URL stops working)"
                                  className="p-1.5 text-secondary-text hover:text-accent hover:bg-accent/10 rounded-lg transition-all">
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                                <button onClick={() => revoke(link)} title={link.revoked ? 'Re-activate' : 'Revoke'}
                                  className={`p-1.5 rounded-lg transition-all ${
                                    link.revoked ? 'text-accent hover:bg-accent/10' : 'text-secondary-text hover:text-warning hover:bg-warning/10'
                                  }`}>
                                  <Ban className="w-4 h-4" />
                                </button>
                                <button onClick={() => hardDelete(link)} title="Delete permanently"
                                  className="p-1.5 text-secondary-text hover:text-error hover:bg-error/10 rounded-lg transition-all">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface Supervisor {
  id: string; login_id: string; full_name: string; email: string | null;
  platform: string; created_at: string; cohort_count: number;
}

function SupervisorsPanel() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState<'dip' | 'wrp' | 'both'>('dip');
  const [adding, setAdding] = useState(false);
  const [newCred, setNewCred] = useState<{ login_id: string; full_name: string; plainPassword: string } | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/supervisors');
    const data = await res.json();
    setSupervisors(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setAdding(true);
    const res = await fetch('/api/admin/supervisors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName.trim(), email: email.trim() || undefined, platform }),
    });
    const data = await res.json();
    if (res.ok) {
      setNewCred({ login_id: data.login_id, full_name: data.full_name, plainPassword: data.plainPassword });
      setFullName(''); setEmail('');
      load();
    }
    setAdding(false);
  };

  const handleReset = async (sup: Supervisor) => {
    if (!confirm(`Reset password for ${sup.full_name}?`)) return;
    setResettingId(sup.id);
    const res = await fetch('/api/admin/supervisors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login_id: sup.login_id }),
    });
    const data = await res.json();
    if (res.ok) setNewCred({ login_id: sup.login_id, full_name: sup.full_name, plainPassword: data.plainPassword });
    setResettingId(null);
  };

  const handleDelete = async (sup: Supervisor) => {
    if (!confirm(`Delete supervisor ${sup.full_name}? Their cohorts will remain but become unassigned.`)) return;
    setDeletingId(sup.id);
    await fetch(`/api/admin/supervisors?id=${sup.id}`, { method: 'DELETE' });
    setSupervisors(prev => prev.filter(s => s.id !== sup.id));
    setDeletingId(null);
  };

  const portalUrl = typeof window !== 'undefined' ? `${window.location.origin}/supervisor/login` : '/supervisor/login';

  return (
    <div className="flex flex-col gap-0">
      {newCred && <CredentialModal cred={newCred} onClose={() => setNewCred(null)} />}

      {/* Portal link */}
      <div className="px-5 py-3 bg-background/50 border-b border-border-subtle flex items-center gap-3">
        <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
        <span className="text-xs text-secondary-text">Supervisor portal:</span>
        <a href={portalUrl} target="_blank" rel="noreferrer" className="text-xs text-accent font-mono hover:underline">{portalUrl}</a>
        <CopyButton text={portalUrl} />
      </div>

      {/* Add supervisor form */}
      <form onSubmit={handleAdd} className="p-4 border-b border-border-subtle bg-background/50 flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-secondary-text">Add Supervisor</p>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-secondary-text mb-1">Full Name *</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
              placeholder="e.g. Nomsa Dlamini"
              className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-secondary-text mb-1">Email (optional)</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="nomsa@wethinkcode.co.za"
              className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-xs text-secondary-text mb-1">Platform Access</label>
            <select value={platform} onChange={e => setPlatform(e.target.value as any)}
              className="bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent">
              <option value="dip">DIP only</option>
              <option value="wrp">WRP only</option>
              <option value="both">Both DIP + WRP</option>
            </select>
          </div>
          <button type="submit" disabled={adding || !fullName.trim()}
            className="flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 whitespace-nowrap">
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Add Supervisor
          </button>
        </div>
      </form>

      {/* Supervisors table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-secondary-text">
            <Loader2 className="w-5 h-5 animate-spin" />Loading...
          </div>
        ) : supervisors.length === 0 ? (
          <p className="text-center py-10 text-secondary-text text-sm">No supervisors yet. Add one above.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/30 border-b border-border-subtle">
                <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-secondary-text">Login ID</th>
                <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-secondary-text">Name</th>
                <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-secondary-text">Platform</th>
                <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-secondary-text">Cohorts</th>
                <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-secondary-text">Added</th>
                <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-secondary-text text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {supervisors.map(sup => (
                <tr key={sup.id} className="hover:bg-background/30 transition-colors">
                  <td className="py-3 px-5 font-mono text-accent font-semibold text-sm">{sup.login_id}</td>
                  <td className="py-3 px-5">
                    <div className="font-semibold text-foreground text-sm">{sup.full_name}</div>
                    {sup.email && <div className="text-xs text-secondary-text">{sup.email}</div>}
                  </td>
                  <td className="py-3 px-5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      sup.platform === 'both' ? 'bg-accent/10 text-accent' :
                      sup.platform === 'dip' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                    }`}>{sup.platform.toUpperCase()}</span>
                  </td>
                  <td className="py-3 px-5 text-sm text-foreground font-semibold">{sup.cohort_count}</td>
                  <td className="py-3 px-5 text-xs text-secondary-text">{new Date(sup.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleReset(sup)} disabled={resettingId === sup.id} title="Reset password"
                        className="text-secondary-text hover:text-warning p-1.5 rounded-lg hover:bg-warning/10 transition-all disabled:opacity-50">
                        {resettingId === sup.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(sup)} disabled={deletingId === sup.id} title="Delete supervisor"
                        className="text-secondary-text hover:text-error p-1.5 rounded-lg hover:bg-error/10 transition-all disabled:opacity-50">
                        {deletingId === sup.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-xs text-secondary-text hover:text-accent transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function AdminTable({ totalSaaioPages, totalDipPages, totalWrpPages }: { totalSaaioPages: number; totalDipPages: number; totalWrpPages: number }) {
  const [platform, setPlatform] = useState<'saaio' | 'dip' | 'wrp' | 'supervisors' | 'invite-links'>('saaio');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [newCred, setNewCred] = useState<{ login_id: string; full_name: string; plainPassword: string; isReset?: boolean; emailSent?: boolean } | null>(null);
  const [showBulk, setShowBulk] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [showCongratulate, setShowCongratulate] = useState(false);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [examEditing, setExamEditing] = useState<string | null>(null);
  const [examInput, setExamInput] = useState({ score: '', passed: '' });

  const fetchCohorts = useCallback(async () => {
    if (platform === 'supervisors' || platform === 'invite-links') return;
    const res = await fetch(`/api/admin/cohorts?platform=${platform}`);
    if (res.ok) setCohorts(await res.json());
  }, [platform]);

  const fetchStudents = useCallback(async () => {
    if (platform === 'supervisors' || platform === 'invite-links') return;
    setIsLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams({ platform });
      if (selectedCohortId) params.set('cohort_id', selectedCohortId);
      const res = await fetch(`/api/admin/students?${params}`);
      const data = await res.json();
      if (res.ok) setUsers(Array.isArray(data) ? data : []);
      else setFetchError(data.error || `Error ${res.status}`);
    } catch (e: any) {
      setFetchError(e.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  }, [platform, selectedCohortId]);

  useEffect(() => { setSelectedCohortId(null); fetchCohorts(); }, [platform]);
  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setIsAdding(true);
    setAddError(null);
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName.trim(), email: email.trim() || undefined, platform }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewCred({ login_id: data.login_id, full_name: data.full_name, plainPassword: data.plainPassword, emailSent: data.emailSent });
        setFullName('');
        setEmail('');
        fetchStudents();
      } else {
        setAddError(data.error || `Error ${res.status}`);
      }
    } catch (e: any) {
      setAddError(e.message || 'Network error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleResetPassword = async (user: AdminUser) => {
    if (!confirm(`Reset password for ${user.full_name} (${user.login_id})?`)) return;
    setResettingId(user.login_id);
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: user.login_id, platform }),
      });
      const data = await res.json();
      if (res.ok) setNewCred({ login_id: user.login_id, full_name: user.full_name, plainPassword: data.plainPassword, isReset: true, emailSent: data.emailSent });
    } finally {
      setResettingId(null);
    }
  };

  const handleDelete = async (login_id: string) => {
    if (!confirm(`Permanently delete student ${login_id}?`)) return;
    setDeletingId(login_id);
    try {
      await fetch(`/api/admin/students?login_id=${encodeURIComponent(login_id)}&platform=${platform}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u.login_id !== login_id));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveExam = async (login_id: string) => {
    const score = examInput.score !== '' ? Number(examInput.score) : undefined;
    const passed = examInput.passed !== '' ? examInput.passed === 'true' : undefined;
    await fetch('/api/admin/students/exam', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login_id, exam_score: score, exam_passed: passed }),
    });
    setExamEditing(null);
    fetchStudents();
  };

  const handleAssignCohort = async (login_id: string, cohort_id: string | null) => {
    await fetch('/api/admin/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login_id, platform, cohort_id }),
    });
    fetchStudents();
  };

  const totalPages = platform === 'saaio' ? totalSaaioPages : platform === 'dip' ? totalDipPages : totalWrpPages;

  return (
    <>
      {newCred && <CredentialModal cred={newCred} isReset={!!newCred.isReset} onClose={() => setNewCred(null)} />}

      <div className="bg-secondary border border-border-subtle rounded-xl overflow-hidden shadow-2xl">
        {/* Platform Tabs */}
        <div className="flex border-b border-border-subtle overflow-x-auto">
          {(['saaio', 'dip', 'wrp', 'supervisors', 'invite-links'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap px-3 ${
                platform === p ? 'bg-accent/10 text-accent border-b-2 border-accent' : 'text-secondary-text hover:text-foreground'
              }`}
            >
              {p === 'saaio' ? 'SAAIO' : p === 'dip' ? 'IDC SEF / DIP' : p === 'wrp' ? 'WRP' : p === 'supervisors' ? '🛡 Supervisors' : '🔗 Invite Links'}
            </button>
          ))}
        </div>

        {/* Supervisors panel */}
        {platform === 'supervisors' && <SupervisorsPanel />}

        {/* Invite Links panel */}
        {platform === 'invite-links' && <InviteLinksPanel />}

        {/* Bulk Import */}
        {platform !== 'supervisors' && platform !== 'invite-links' && showBulk && <BulkImport platform={platform as 'saaio'|'dip'|'wrp'} onDone={fetchStudents} />}

        {/* Cohort Manager */}
        {platform !== 'supervisors' && platform !== 'invite-links' && <CohortManager
          platform={platform as 'saaio'|'dip'|'wrp'}
          cohorts={cohorts}
          selectedCohortId={selectedCohortId}
          onSelect={setSelectedCohortId}
          onRefresh={fetchCohorts}
        />}

        {/* Notify Panel — all platforms */}
        {platform !== 'supervisors' && platform !== 'invite-links' && showNotify && <NotifyPanel platform={platform as 'saaio'|'dip'|'wrp'} onClose={() => setShowNotify(false)} />}

        {/* Congratulate Panel — DIP and WRP only */}
        {platform !== 'supervisors' && platform !== 'invite-links' && showCongratulate && (platform === 'dip' || platform === 'wrp') && (
          <CongratulatePanel platform={platform as 'dip'|'wrp'} onClose={() => setShowCongratulate(false)} />
        )}

        {platform !== 'supervisors' && platform !== 'invite-links' && <>
        {/* Register Form */}
        <form onSubmit={handleAdd} className="p-4 border-b border-border-subtle bg-background/50 flex flex-col gap-3">
          {addError && <p className="text-error text-xs bg-error/10 border border-error/20 rounded-lg px-3 py-2">{addError}</p>}
          <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-secondary-text mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Alice Smith"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-secondary-text mb-1">Email (optional)</label>
            <input
              type="email"
              placeholder="alice@school.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>
            <button
              type="submit"
              disabled={isAdding || !fullName.trim()}
              className="flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Register Student
            </button>
            <button
              type="button"
              onClick={() => setShowBulk(v => !v)}
              className="flex items-center gap-2 bg-background border border-border-subtle text-secondary-text hover:text-accent hover:border-accent/50 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Bulk Import
            </button>
            <button
              type="button"
              onClick={() => setShowNotify(v => !v)}
              className="flex items-center gap-2 bg-background border border-border-subtle text-secondary-text hover:text-accent hover:border-accent/50 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
            >
              <Bell className="w-4 h-4" />
              Notify Students
            </button>
            {(platform === 'dip' || platform === 'wrp') && (
              <button
                type="button"
                onClick={() => setShowCongratulate(v => !v)}
                className="flex items-center gap-2 bg-background border border-border-subtle text-secondary-text hover:text-[#d4af37] hover:border-[#d4af37]/50 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
              >
                <Award className="w-4 h-4" />
                Send Certificates
              </button>
            )}
            <button
              type="button"
              onClick={() => downloadReport(users, platform, totalPages)}
              disabled={users.length === 0}
              className="flex items-center gap-2 bg-background border border-border-subtle text-secondary-text hover:text-accent hover:border-accent/50 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
              title="Download Excel report"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-secondary-text gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading students...
            </div>
          ) : fetchError ? (
            <div className="p-6 text-center">
              <p className="text-error text-sm mb-2">Failed to load students</p>
              <p className="text-secondary-text text-xs font-mono mb-4">{fetchError}</p>
              <p className="text-secondary-text text-xs">The database tables may not exist yet. Run the SQL in <code className="text-accent">scripts/setup-student-auth.sql</code> in your Supabase SQL editor.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/30 border-b border-border-subtle">
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-secondary-text">Login ID</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-secondary-text">Name</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-secondary-text">Progress</th>
                  {platform === 'dip' && <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-secondary-text">Exam</th>}
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-secondary-text">Cohort</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-secondary-text">Last Active</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-secondary-text text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-secondary-text">No students registered yet.</td></tr>
                ) : users.map(user => {
                  const perc = totalPages > 0 ? Math.min(100, Math.round((user.completedCount / totalPages) * 100)) : 0;
                  return (
                    <tr key={user.login_id} className="hover:bg-background/30 transition-colors">
                      <td className="py-3 px-5 font-mono text-accent font-semibold text-sm">{user.login_id}</td>
                      <td className="py-3 px-5">
                        <div className="font-semibold text-foreground text-sm">{user.full_name}</div>
                        {user.email && <div className="text-xs text-secondary-text">{user.email}</div>}
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2 w-36">
                          <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: `${perc}%` }} />
                          </div>
                          <span className="text-xs font-bold text-accent">{perc}%</span>
                        </div>
                      </td>
                      {platform === 'dip' && (
                        <td className="py-3 px-5 text-sm">
                          {examEditing === user.login_id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={0} max={100}
                                value={examInput.score}
                                onChange={e => setExamInput(v => ({ ...v, score: e.target.value }))}
                                placeholder="Score"
                                className="w-16 bg-background border border-border-subtle rounded px-2 py-1 text-xs focus:outline-none focus:border-accent"
                              />
                              <select
                                value={examInput.passed}
                                onChange={e => setExamInput(v => ({ ...v, passed: e.target.value }))}
                                className="bg-background border border-border-subtle rounded px-2 py-1 text-xs focus:outline-none focus:border-accent"
                              >
                                <option value="">—</option>
                                <option value="true">Pass</option>
                                <option value="false">Fail</option>
                              </select>
                              <button onClick={() => handleSaveExam(user.login_id)} className="text-accent hover:text-accent/80 text-xs font-bold"><Check className="w-3.5 h-3.5" /></button>
                              <button onClick={() => setExamEditing(null)} className="text-secondary-text hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setExamEditing(user.login_id); setExamInput({ score: user.examScore?.toString() ?? '', passed: user.examPassed !== null ? String(user.examPassed) : '' }); }}
                              className="group flex items-center gap-1.5 hover:text-foreground transition-colors"
                            >
                              {user.examScore !== null ? (
                                <span className={`font-bold ${user.examPassed ? 'text-accent' : 'text-error'}`}>
                                  {user.examScore}% — {user.examPassed ? 'Pass' : 'Fail'}
                                </span>
                              ) : <span className="text-secondary-text">Set score</span>}
                            </button>
                          )}
                        </td>
                      )}
                      <td className="py-3 px-5 text-xs">
                        <select
                          value={user.cohortId ?? ''}
                          onChange={e => handleAssignCohort(user.login_id, e.target.value || null)}
                          className="bg-background border border-border-subtle rounded px-2 py-1 text-xs text-secondary-text focus:outline-none focus:border-accent"
                        >
                          <option value="">Unassigned</option>
                          {cohorts.filter(c => !c.archived).map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-5 text-xs text-secondary-text">
                        {user.lastActive ? (
                          <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(user.lastActive).toLocaleDateString()}</div>
                        ) : '—'}
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleResetPassword(user)}
                            disabled={resettingId === user.login_id}
                            title="Reset password"
                            className="text-secondary-text hover:text-warning transition-colors p-1.5 rounded-lg hover:bg-warning/10 disabled:opacity-50"
                          >
                            {resettingId === user.login_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(user.login_id)}
                            disabled={deletingId === user.login_id}
                            title="Delete student"
                            className="text-secondary-text hover:text-error transition-colors p-1.5 rounded-lg hover:bg-error/10 disabled:opacity-50"
                          >
                            {deletingId === user.login_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </>
      }
      </div>
    </>
  );
}
