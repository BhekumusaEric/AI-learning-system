import DipDashboardLayout from '@/components/dip/DipDashboardLayout';
import { getSyllabus } from '@/lib/syllabus';

export default function DipCertificateLayout({ children }: { children: React.ReactNode }) {
  const fullSyllabus = getSyllabus();
  const part1 = fullSyllabus.filter(p => p.id === 'part1_foundational_skills_classical_ml');
  return <DipDashboardLayout syllabus={part1}>{children}</DipDashboardLayout>;
}
