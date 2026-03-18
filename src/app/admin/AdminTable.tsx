"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Trash2, UserPlus, Loader2, Copy, Check, X, KeyRound, RefreshCw } from 'lucide-react';

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

export default function AdminTable({ totalSaaioPages, totalDipPages }: { totalSaaioPages: number; totalDipPages: number }) {
  const [platform, setPlatform] = useState<'saaio' | 'dip'>('saaio');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [newCred, setNewCred] = useState<{ login_id: string; full_name: string; plainPassword: string; isReset?: boolean; emailSent?: boolean } | null>(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/students?platform=${platform}`);
      if (res.ok) setUsers(await res.json());
    } finally {
      setIsLoading(false);
    }
  }, [platform]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setIsAdding(true);
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
      }
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

  const totalPages = platform === 'saaio' ? totalSaaioPages : totalDipPages;

  return (
    <>
      {newCred && <CredentialModal cred={newCred} isReset={!!newCred.isReset} onClose={() => setNewCred(null)} />}

      <div className="bg-secondary border border-border-subtle rounded-xl overflow-hidden shadow-2xl">
        {/* Platform Tabs */}
        <div className="flex border-b border-border-subtle">
          {(['saaio', 'dip'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all ${platform === p ? 'bg-accent/10 text-accent border-b-2 border-accent' : 'text-secondary-text hover:text-foreground'}`}
            >
              {p === 'saaio' ? 'SAAIO Training Grounds' : 'IDC SEF / DIP'}
            </button>
          ))}
        </div>

        {/* Register Form */}
        <form onSubmit={handleAdd} className="p-4 border-b border-border-subtle bg-background/50 flex flex-col sm:flex-row gap-3 items-end">
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
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-secondary-text gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading students...
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
