import DipDashboardLayout from '@/components/dip/DipDashboardLayout';
import { getSyllabus } from '@/lib/syllabus';

export default function DipLessonLayout({ children }: { children: React.ReactNode }) {
  // Only pass Part 1 to the DIP layout
  const fullSyllabus = getSyllabus();
  const part1 = fullSyllabus.filter(p => p.id === 'part1_foundational_skills_classical_ml');
  return <DipDashboardLayout syllabus={part1}>{children}</DipDashboardLayout>;
}
