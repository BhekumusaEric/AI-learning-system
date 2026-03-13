"use client";

import React, { useState } from 'react';
import { Clock, Trash2, UserPlus, Loader2 } from 'lucide-react';

export interface AdminUser {
  username: string;
  createdAt: string;
  lastActive: string;
  completedCount: number;
  progressPerc: number;
}

export default function AdminTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [newUsername, setNewUsername] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    setIsAdding(true);
    const cleanUsername = newUsername.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername })
      });

      if (res.ok) {
        // Optimistically add to top of list
        setUsers(prev => [
          {
            username: cleanUsername,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            completedCount: 0,
            progressPerc: 0
          },
          ...prev.filter(u => u.username !== cleanUsername)
        ]);
        setNewUsername("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (!confirm(`Are you sure you want to permanently delete the student: ${username}?`)) return;
    
    setDeletingUser(username);
    
    try {
      const res = await fetch(`/api/progress?username=${encodeURIComponent(username)}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setUsers(prev => prev.filter(u => u.username !== username));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingUser(null);
    }
  };

  return (
    <div className="bg-secondary border border-border-subtle rounded-xl overflow-hidden shadow-2xl">
      {/* Action Bar */}
      <div className="p-4 border-b border-border-subtle bg-background/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="font-bold text-foreground">Registered Students</h2>
        <form onSubmit={handleAddUser} className="flex items-center gap-2 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="New student username..." 
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="flex-1 sm:w-48 bg-background border border-border-subtle rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-accent"
          />
          <button 
            type="submit" 
            disabled={isAdding || !newUsername.trim()}
            className="flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-black px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            <span className="hidden sm:inline">Add Student</span>
          </button>
        </form>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background/30 border-b border-border-subtle">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-secondary-text">Student Username</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-secondary-text">Syllabus Progress</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-secondary-text">Last Active</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-secondary-text text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-secondary-text">
                  No students found. Add one above.
                </td>
              </tr>
            ) : (
              users.sort((a,b) => b.progressPerc - a.progressPerc).map((user) => (
                <tr key={user.username} className={`hover:bg-background/30 transition-colors ${deletingUser === user.username ? 'opacity-50' : ''}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold capitalize">
                        {user.username.charAt(0)}
                      </div>
                      <span className="font-semibold text-foreground">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 w-48">
                      <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent relative" 
                          style={{ width: `${user.progressPerc}%` }} 
                        />
                      </div>
                      <span className="text-sm font-bold text-accent min-w-[3ch]">{user.progressPerc}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-secondary-text">
                      <Clock className="w-4 h-4" />
                      {new Date(user.lastActive).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleDeleteUser(user.username)}
                      disabled={deletingUser === user.username || user.username === 'guest'}
                      className="text-secondary-text hover:text-error transition-colors p-2 rounded-lg hover:bg-error/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={user.username === 'guest' ? "Cannot delete guest" : "Delete user"}
                    >
                      {deletingUser === user.username ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
