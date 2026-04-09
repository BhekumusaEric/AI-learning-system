import React from 'react';
import { Users, BookOpen } from 'lucide-react';
import { getSyllabus } from '@/lib/syllabus';
import { getWrpSyllabus } from '@/lib/wrpSyllabus';
import AdminTable from './AdminTable';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [dipRes, wrpRes] = await Promise.all([
    supabase.from('dip_students').select('*', { count: 'exact', head: true }),
    supabase.from('wrp_students').select('*', { count: 'exact', head: true }),
  ]);
  return {
    dipCount: dipRes.count || 0,
    wrpCount: wrpRes.count || 0,
  };
}

export default async function AdminDashboard() {
  const syllabus = getSyllabus();
  const stats = await getStats();

  const part1 = syllabus.find(p => p.id === 'part1_foundational_skills_classical_ml');
  const ch1 = part1?.chapters.find(c => c.id === 'chapter1_python_programming_fundamentals');
  const ch2 = part1?.chapters.find(c => c.id === 'chapter2_battle_grounds');
  const totalDipPages = (ch1?.pages.length || 0) + (ch2?.pages.length || 0);

  const totalWrpPages = getWrpSyllabus().length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-accent/20 p-3 rounded-xl">
            <Users className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-secondary-text mt-1">Manage DIP and WRP programs, onboarding, and supervisors.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-secondary border border-border-subtle p-6 rounded-xl flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-lg"><Users className="w-6 h-6 text-emerald-500" /></div>
            <div>
              <p className="text-sm font-medium text-secondary-text">DIP Students</p>
              <h3 className="text-2xl font-bold">{stats.dipCount}</h3>
            </div>
          </div>
          <div className="bg-secondary border border-border-subtle p-6 rounded-xl flex items-center gap-4">
            <div className="bg-orange-500/10 p-3 rounded-lg"><Users className="w-6 h-6 text-orange-500" /></div>
            <div>
              <p className="text-sm font-medium text-secondary-text">WRP Students</p>
              <h3 className="text-2xl font-bold">{stats.wrpCount}</h3>
            </div>
          </div>
          <div className="bg-secondary border border-border-subtle p-6 rounded-xl flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-lg"><BookOpen className="w-6 h-6 text-emerald-500" /></div>
            <div>
              <p className="text-sm font-medium text-secondary-text">DIP Pages</p>
              <h3 className="text-2xl font-bold">{totalDipPages}</h3>
            </div>
          </div>
          <div className="bg-secondary border border-border-subtle p-6 rounded-xl flex items-center gap-4">
            <div className="bg-orange-500/10 p-3 rounded-lg"><BookOpen className="w-6 h-6 text-orange-500" /></div>
            <div>
              <p className="text-sm font-medium text-secondary-text">WRP Pages</p>
              <h3 className="text-2xl font-bold">{totalWrpPages}</h3>
            </div>
          </div>
        </div>

        <AdminTable 
          totalSaaioPages={0} 
          totalDipPages={totalDipPages} 
          totalWrpPages={totalWrpPages} 
          allowedTabs={['dip', 'wrp', 'onboarding', 'supervisors', 'invite-links']}
          defaultTab="dip"
        />
      </div>
    </div>
  );
}
