import React from 'react';
import { Users, BookOpen, Activity } from 'lucide-react';
import { getSyllabus } from '@/lib/syllabus';
import AdminTable, { AdminUser } from './AdminTable';
import { supabase } from '@/lib/supabase';

// Server Action to read DB directly
async function getDbData() {
  const { data, error } = await supabase.from('user_progress').select('*');
  if (error || !data) return { users: {} };
  
  const formattedUsers: Record<string, any> = {};
  data.forEach((row: any) => {
    formattedUsers[row.username] = {
      completedPages: row.completed_pages || {},
      createdAt: row.created_at,
      lastActive: row.last_active
    };
  });
  
  return { users: formattedUsers };
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

  const users: AdminUser[] = Object.entries(db.users).map(([username, data]: [string, any]) => {
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

        {/* Interactive Interactive User Table */}
        <AdminTable initialUsers={users} />

      </div>
    </div>
  );
}
