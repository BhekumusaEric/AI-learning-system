"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, Plus, Users, Copy, Check, ExternalLink,
  RotateCcw, ChevronDown, ChevronUp, Archive, Clock,
  TrendingUp, Award, KeyRound, LogOut, X, Loader2, RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Cohort {
  id: string; name: string; platform: string; description?: string;
  location?: string; start_date?: string; invite_code: string;
  archived: boolean; created_at: string; student_count: number;
}

interface Student {
  id: string; login_id: string; full_name: string; email: string | null;
  created_at: string; cohort_id: string; completedCount: number;
  lastActive: string | null; examScore: number | null; examPassed: boolean | null;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-xs text-secondary-text hover:text-accent transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function StatCard({ label, value, sub, color = 'accent' }: { label: string; value: string | number; sub?: string; color?: string }) {
  const colorMap: Record<string, string> = {
    accent: 'text-accent bg-accent/10',
    green: 'text-emerald-400 bg-emerald-400/10',
    orange: 'text-orange-400 bg-orange-400/10',
    blue: 'text-blue-400 bg-blue-400/10',
  };
  return (
    <div className="bg-secondary border border-border-subtle rounded-xl p-5">
      <p className="text-xs text-secondary-text uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bold ${colorMap[color]?.split(' ')[0] || 'text-accent'}`}>{value}</p>
      {sub && <p className="text-xs text-secondary-text mt-1">{sub}</p>}
    </div>
  );
}

function NewCohortModal({ platform, onClose, onCreated }: {
  platform: string; onClose: () => void; onCreated: (c: Cohort) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true); setError('');
    const res = await fetch('/api/supervisor/cohorts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), platform, description, location, start_date: startDate || undefined }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Failed to create cohort'); setSaving(false); return; }
    onCreated({ ...data, student_count: 0 });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary border border-border-subtle rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg">New Cohort</h3>
          <button onClick={onClose} className="text-secondary-text hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {error && <p className="text-error text-sm bg-error/10 border border-error/20 rounded-lg px-3 py-2">{error}</p>}
          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Cohort Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              placeholder="e.g. Soweto WRP Cohort 1 — 2025"
              className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              placeholder="Brief description of this cohort..."
              className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-all resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Johannesburg"
                className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-all" />
            </div>
          </div>
          <button type="submit" disabled={saving || !name.trim()}
            className="w-full py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-40 flex items-center justify-center gap-2 mt-1">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Create Cohort & Get Invite Link
          </button>
        </form>
      </div>
    </div>
  );
}

function CohortCard({
  cohort, platform, totalPages, onArchive,
}: {
  cohort: Cohort; platform: string; totalPages: number; onArchive: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [resetResult, setResetResult] = useState<{ login_id: string; name: string; password: string } | null>(null);

  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/join/${cohort.invite_code}` : `/join/${cohort.invite_code}`;

  const loadStudents = useCallback(async () => {
    setLoadingStudents(true);
    const res = await fetch(`/api/supervisor/students?cohort_id=${cohort.id}&platform=${platform}`);
    const data = await res.json();
    setStudents(Array.isArray(data) ? data : []);
    setLoadingStudents(false);
  }, [cohort.id, platform]);

  useEffect(() => { if (expanded) loadStudents(); }, [expanded, loadStudents]);

  const resetPassword = async (student: Student) => {
    if (!confirm(`Reset password for ${student.full_name}?`)) return;
    setResettingId(student.login_id);
    const res = await fetch('/api/supervisor/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login_id: student.login_id, platform }),
    });
    const data = await res.json();
    if (res.ok) setResetResult({ login_id: student.login_id, name: data.full_name, password: data.plainPassword });
    setResettingId(null);
  };

  const avgProgress = students.length > 0 && totalPages > 0
    ? Math.round(students.reduce((s, st) => s + Math.min(100, (st.completedCount / totalPages) * 100), 0) / students.length)
    : 0;

  const passedExam = students.filter(s => s.examPassed).length;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${cohort.archived ? 'border-border-subtle opacity-60' : 'border-border-subtle hover:border-accent/30'} bg-secondary`}>
      {/* Cohort header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-foreground text-base">{cohort.name}</h3>
              {cohort.archived && <span className="text-xs px-2 py-0.5 bg-secondary border border-border-subtle rounded-full text-secondary-text">Archived</span>}
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${platform === 'wrp' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                {platform.toUpperCase()}
              </span>
            </div>
            {cohort.description && <p className="text-sm text-secondary-text mb-2">{cohort.description}</p>}
            <div className="flex flex-wrap gap-3 text-xs text-secondary-text">
              {cohort.location && <span>📍 {cohort.location}</span>}
              {cohort.start_date && <span>📅 {new Date(cohort.start_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
              <span><Users className="w-3 h-3 inline mr-1" />{cohort.student_count} student{cohort.student_count !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!cohort.archived && (
              <button onClick={() => onArchive(cohort.id)} title="Archive cohort"
                className="p-2 text-secondary-text hover:text-warning hover:bg-warning/10 rounded-lg transition-all">
                <Archive className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1.5 px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-secondary-text hover:text-accent hover:border-accent transition-all">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {expanded ? 'Hide' : 'View Students'}
            </button>
          </div>
        </div>

        {/* Invite link */}
        {!cohort.archived && (
          <div className="mt-4 flex items-center gap-2 bg-background border border-border-subtle rounded-lg px-3 py-2.5 flex-wrap">
            <ExternalLink className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="text-xs text-accent font-mono flex-1 truncate min-w-0">{inviteUrl}</span>
            <CopyButton text={inviteUrl} />
            <span className="text-xs text-secondary-text border-l border-border-subtle pl-2 ml-1">Code: <span className="font-bold text-foreground">{cohort.invite_code}</span></span>
          </div>
        )}
      </div>

      {/* Students table */}
      {expanded && (
        <div className="border-t border-border-subtle">
          {/* Mini stats */}
          {students.length > 0 && (
            <div className="grid grid-cols-3 divide-x divide-border-subtle border-b border-border-subtle">
              <div className="px-4 py-3 text-center">
                <p className="text-lg font-bold text-accent">{students.length}</p>
                <p className="text-xs text-secondary-text">Students</p>
              </div>
              <div className="px-4 py-3 text-center">
                <p className="text-lg font-bold text-foreground">{avgProgress}%</p>
                <p className="text-xs text-secondary-text">Avg Progress</p>
              </div>
              <div className="px-4 py-3 text-center">
                <p className="text-lg font-bold text-emerald-400">{passedExam}</p>
                <p className="text-xs text-secondary-text">Passed Exam</p>
              </div>
            </div>
          )}

          {loadingStudents ? (
            <div className="flex items-center justify-center py-8 gap-2 text-secondary-text">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading students...
            </div>
          ) : students.length === 0 ? (
            <div className="py-8 text-center text-secondary-text text-sm">
              <p>No students yet.</p>
              <p className="text-xs mt-1">Share the invite link above for students to self-register.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-background/40 border-b border-border-subtle">
                    <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-secondary-text">Student</th>
                    <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-secondary-text">Login ID</th>
                    <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-secondary-text">Progress</th>
                    {platform === 'dip' && <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-secondary-text">Exam</th>}
                    <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-secondary-text">Last Active</th>
                    <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-secondary-text text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {students.map(s => {
                    const pct = totalPages > 0 ? Math.min(100, Math.round((s.completedCount / totalPages) * 100)) : 0;
                    return (
                      <tr key={s.login_id} className="hover:bg-background/30 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-foreground">{s.full_name}</p>
                          {s.email && <p className="text-xs text-secondary-text">{s.email}</p>}
                        </td>
                        <td className="py-3 px-4 font-mono text-accent text-xs font-semibold">{s.login_id}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 w-28">
                            <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                              <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-bold text-accent">{pct}%</span>
                          </div>
                        </td>
                        {platform === 'dip' && (
                          <td className="py-3 px-4 text-sm">
                            {s.examScore !== null
                              ? <span className={`font-bold ${s.examPassed ? 'text-accent' : 'text-error'}`}>{s.examScore}% {s.examPassed ? '✓' : '✗'}</span>
                              : <span className="text-secondary-text">—</span>}
                          </td>
                        )}
                        <td className="py-3 px-4 text-xs text-secondary-text">
                          {s.lastActive ? (
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(s.lastActive).toLocaleDateString('en-ZA')}</span>
                          ) : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button onClick={() => resetPassword(s)} disabled={resettingId === s.login_id}
                            title="Reset password"
                            className="p-1.5 text-secondary-text hover:text-warning hover:bg-warning/10 rounded-lg transition-all disabled:opacity-50">
                            {resettingId === s.login_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Reset result */}
          {resetResult && (
            <div className="m-4 p-4 bg-background border border-warning/30 rounded-xl flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-secondary-text mb-1">New password for <span className="text-foreground font-semibold">{resetResult.name}</span></p>
                <p className="font-mono font-bold text-warning text-lg tracking-widest">{resetResult.password}</p>
                <p className="text-xs text-secondary-text mt-1">Login ID: <span className="text-accent">{resetResult.login_id}</span></p>
              </div>
              <button onClick={() => setResetResult(null)} className="text-secondary-text hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
          )}

          <div className="px-4 py-3 border-t border-border-subtle flex justify-end">
            <button onClick={loadStudents} className="flex items-center gap-1.5 text-xs text-secondary-text hover:text-accent transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SupervisorDashboard() {
  const router = useRouter();
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorPlatform, setSupervisorPlatform] = useState('dip');
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCohort, setShowNewCohort] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'dip' | 'wrp'>('dip');

  // Total pages per platform (approximate — used for progress %)
  const totalPages: Record<string, number> = { dip: 38, wrp: 12 };

  useEffect(() => {
    const name = localStorage.getItem('supervisor_name') || '';
    const platform = localStorage.getItem('supervisor_platform') || 'dip';
    if (!localStorage.getItem('supervisor_id')) { router.push('/supervisor/login'); return; }
    setSupervisorName(name);
    setSupervisorPlatform(platform);
    setActivePlatform(platform === 'wrp' ? 'wrp' : 'dip');
    loadCohorts();
  }, []);

  const loadCohorts = async () => {
    setLoading(true);
    const res = await fetch('/api/supervisor/cohorts');
    const data = await res.json();
    setCohorts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Archive this cohort? Students will no longer be able to register via the invite link.')) return;
    await fetch(`/api/supervisor/cohorts?id=${id}`, { method: 'DELETE' });
    setCohorts(prev => prev.map(c => c.id === id ? { ...c, archived: true } : c));
  };

  const handleLogout = () => {
    localStorage.removeItem('supervisor_id');
    localStorage.removeItem('supervisor_name');
    localStorage.removeItem('supervisor_platform');
    document.cookie = 'supervisor_id=; path=/; max-age=0';
    router.push('/supervisor/login');
  };

  const filtered = cohorts.filter(c => c.platform === activePlatform);
  const active = filtered.filter(c => !c.archived);
  const archived = filtered.filter(c => c.archived);
  const totalStudents = filtered.reduce((s, c) => s + c.student_count, 0);
  const canShowPlatform = (p: 'dip' | 'wrp') =>
    supervisorPlatform === 'both' || supervisorPlatform === p;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border-subtle bg-secondary px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 p-2 rounded-xl"><ShieldCheck className="w-6 h-6 text-accent" /></div>
          <div>
            <h1 className="font-bold text-foreground">Supervisor Portal</h1>
            <p className="text-xs text-secondary-text">WeThinkCode_ · {supervisorName}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-secondary-text hover:text-error transition-colors">
          <LogOut className="w-4 h-4" />Sign Out
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Platform tabs (only if supervisor has both) */}
        {supervisorPlatform === 'both' && (
          <div className="flex gap-2 mb-6">
            {(['dip', 'wrp'] as const).map(p => (
              <button key={p} onClick={() => setActivePlatform(p)}
                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activePlatform === p ? 'bg-accent text-black' : 'bg-secondary border border-border-subtle text-secondary-text hover:text-foreground'}`}>
                {p === 'dip' ? 'Digital Inclusion Program' : 'Work Readiness Program'}
              </button>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Students" value={totalStudents} color="accent" />
          <StatCard label="Active Cohorts" value={active.length} color="green" />
          <StatCard label="Platform" value={activePlatform.toUpperCase()} color="blue" />
          <StatCard label="Archived" value={archived.length} color="orange" />
        </div>

        {/* Cohorts header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Your Cohorts</h2>
          <button onClick={() => setShowNewCohort(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all text-sm">
            <Plus className="w-4 h-4" />New Cohort
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-secondary-text">
            <Loader2 className="w-6 h-6 animate-spin" />Loading cohorts...
          </div>
        ) : active.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border-subtle rounded-2xl">
            <Users className="w-12 h-12 text-secondary-text/30 mx-auto mb-3" />
            <p className="text-secondary-text font-semibold mb-1">No cohorts yet</p>
            <p className="text-secondary-text text-sm mb-4">Create your first cohort to get a shareable invite link for students.</p>
            <button onClick={() => setShowNewCohort(true)}
              className="px-5 py-2.5 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all text-sm">
              Create First Cohort
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {active.map(c => (
              <CohortCard key={c.id} cohort={c} platform={activePlatform} totalPages={totalPages[activePlatform]} onArchive={handleArchive} />
            ))}
          </div>
        )}

        {/* Archived cohorts */}
        {archived.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-text mb-3">Archived Cohorts</p>
            <div className="flex flex-col gap-3">
              {archived.map(c => (
                <CohortCard key={c.id} cohort={c} platform={activePlatform} totalPages={totalPages[activePlatform]} onArchive={handleArchive} />
              ))}
            </div>
          </div>
        )}
      </div>

      {showNewCohort && (
        <NewCohortModal
          platform={activePlatform}
          onClose={() => setShowNewCohort(false)}
          onCreated={c => { setCohorts(prev => [c, ...prev]); setShowNewCohort(false); }}
        />
      )}
    </div>
  );
}
