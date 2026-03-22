"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, Trash2, UserPlus, Loader2, Copy, Check, X, KeyRound, RefreshCw, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from 'lucide-react';
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
          <span className="text-accent text-sm font-bold">✓ {passed.length} registered</span>
          {failed.length > 0 && <span className="text-error text-sm font-bold">✗ {failed.length} failed</span>}
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
                    {r.emailSent ? '📧 sent' : r.email ? 'not sent' : '—'}
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

export default function AdminTable({ totalSaaioPages, totalDipPages, totalWrpPages }: { totalSaaioPages: number; totalDipPages: number; totalWrpPages: number }) {
  const [platform, setPlatform] = useState<'saaio' | 'dip' | 'wrp'>('saaio');
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

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/admin/students?platform=${platform}`);
      const data = await res.json();
      if (res.ok) {
        setUsers(Array.isArray(data) ? data : []);
      } else {
        setFetchError(data.error || `Error ${res.status}`);
      }
    } catch (e: any) {
      setFetchError(e.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  }, [platform]);

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

  const totalPages = platform === 'saaio' ? totalSaaioPages : platform === 'dip' ? totalDipPages : totalWrpPages;

  return (
    <>
      {newCred && <CredentialModal cred={newCred} isReset={!!newCred.isReset} onClose={() => setNewCred(null)} />}

      <div className="bg-secondary border border-border-subtle rounded-xl overflow-hidden shadow-2xl">
        {/* Platform Tabs */}
        <div className="flex border-b border-border-subtle">
          {(['saaio', 'dip', 'wrp'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all ${platform === p ? 'bg-accent/10 text-accent border-b-2 border-accent' : 'text-secondary-text hover:text-foreground'}`}
            >
              {p === 'saaio' ? 'SAAIO Training Grounds' : p === 'dip' ? 'IDC SEF / DIP' : 'WRP'}
            </button>
          ))}
        </div>

        {/* Bulk Import */}
        {showBulk && <BulkImport platform={platform} onDone={fetchStudents} />}

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
                          {user.examScore !== null ? (
                            <span className={`font-bold ${user.examPassed ? 'text-accent' : 'text-error'}`}>
                              {user.examScore}% {user.examPassed ? '✓' : '✗'}
                            </span>
                          ) : <span className="text-secondary-text">—</span>}
                        </td>
                      )}
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
      </div>
    </>
  );
}
