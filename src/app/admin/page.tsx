import React from 'react';
import fs from 'fs';
import path from 'path';
import { Users, BookOpen, Clock, Activity } from 'lucide-react';
import { getSyllabus } from '@/lib/syllabus';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

// Server Action to read DB directly
async function getDbData() {
  if (!fs.existsSync(dbPath)) return { users: {} };
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

export default async function AdminDashboard() {
  const db = await getDbData();
  const syllabus = getSyllabus();
  
  // Calculate total course pages for percentages
  let totalPages = 0;
  syllabus.forEach(part => {
    part.chapters.forEach(chapter => {
      totalPages += chapter.pages.length;
    });
  });

  const users = Object.entries(db.users).map(([username, data]: [string, any]) => {
    const completedCount = Object.keys(data.completedPages || {}).filter(k => data.completedPages[k]).length;
    const progressPerc = totalPages > 0 ? Math.min(100, Math.round((completedCount / totalPages) * 100)) : 0;
    
    return {
      username,
      createdAt: data.createdAt,
      lastActive: data.lastActive,
      completedCount,
      progressPerc
    };
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-accent/20 p-3 rounded-xl">
            <Users className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-secondary-text mt-1">Manage student progress and track completions.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-secondary border border-border-subtle p-6 rounded-xl flex items-center gap-4">
            <div className="bg-accent/10 p-3 rounded-lg"><Users className="w-6 h-6 text-accent" /></div>
            <div>
              <p className="text-sm font-medium text-secondary-text">Total Students</p>
              <h3 className="text-2xl font-bold">{users.length}</h3>
            </div>
          </div>
          <div className="bg-secondary border border-border-subtle p-6 rounded-xl flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-lg"><BookOpen className="w-6 h-6 text-emerald-500" /></div>
            <div>
              <p className="text-sm font-medium text-secondary-text">Total Course Pages</p>
              <h3 className="text-2xl font-bold">{totalPages}</h3>
            </div>
          </div>
          <div className="bg-secondary border border-border-subtle p-6 rounded-xl flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-lg"><Activity className="w-6 h-6 text-blue-500" /></div>
            <div>
              <p className="text-sm font-medium text-secondary-text">Active Today</p>
              <h3 className="text-2xl font-bold">
                {users.filter(u => new Date(u.lastActive).toDateString() === new Date().toDateString()).length}
              </h3>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-secondary border border-border-subtle rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border-subtle">
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-secondary-text">Student Username</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-secondary-text">Syllabus Progress</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-secondary-text">Last Active</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-secondary-text">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-secondary-text">
                      No students have logged in yet.
                    </td>
                  </tr>
                ) : (
                  users.sort((a,b) => b.progressPerc - a.progressPerc).map((user) => (
                    <tr key={user.username} className="hover:bg-background/30 transition-colors">
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
                      <td className="py-4 px-6 text-sm text-secondary-text">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
