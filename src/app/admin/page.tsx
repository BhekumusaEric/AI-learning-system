import React from 'react';
import { Users, BookOpen } from 'lucide-react';
import { getSyllabus } from '@/lib/syllabus';
import { getWrpSyllabus } from '@/lib/wrpSyllabus';
import AdminTable from './AdminTable';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [saaioRes, dipRes, wrpRes] = await Promise.all([
    supabase.from('saaio_students').select('*', { count: 'exact', head: true }),
    supabase.from('dip_students').select('*', { count: 'exact', head: true }),
    supabase.from('wrp_students').select('*', { count: 'exact', head: true }),
  ]);
  return {
    saaioCount: saaioRes.count || 0,
    dipCount: dipRes.count || 0,
    wrpCount: wrpRes.count || 0,
  };
}

export default async function AdminDashboard() {
  const syllabus = getSyllabus();
  const stats = await getStats();

  let totalSaaioPages = 0;
  syllabus.forEach(part => part.chapters.forEach(ch => { totalSaaioPages += ch.pages.length; }));

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
            <p className="text-secondary-text mt-1">Register students and track performance across all platforms.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-secondary border border-border-subtle p-6 rounded-xl flex items-center gap-4">
            <div className="bg-accent/10 p-3 rounded-lg"><Users className="w-6 h-6 text-accent" /></div>
            <div>
              <p className="text-sm font-medium text-secondary-text">SAAIO Students</p>
              <h3 className="text-2xl font-bold">{stats.saaioCount}</h3>
            </div>
          </div>
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
            <div className="bg-blue-500/10 p-3 rounded-lg"><BookOpen className="w-6 h-6 text-blue-500" /></div>
            <div>
              <p className="text-sm font-medium text-secondary-text">SAAIO Pages</p>
              <h3 className="text-2xl font-bold">{totalSaaioPages}</h3>
            </div>
          </div>
        </div>

        <AdminTable totalSaaioPages={totalSaaioPages} totalDipPages={totalDipPages} totalWrpPages={totalWrpPages} />
      </div>
    </div>
  );
}
