import WrpDashboardLayout from '@/components/wrp/WrpDashboardLayout';
import { getWrpSyllabus } from '@/lib/wrpSyllabus';

export default function WrpCertificateLayout({ children }: { children: React.ReactNode }) {
  const pages = getWrpSyllabus();
  return <WrpDashboardLayout pages={pages}>{children}</WrpDashboardLayout>;
}
