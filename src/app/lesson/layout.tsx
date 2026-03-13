import DashboardLayout from "@/components/layout/DashboardLayout";
import { getSyllabus } from "@/lib/syllabus";

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const syllabus = getSyllabus();

  return <DashboardLayout syllabus={syllabus}>{children}</DashboardLayout>;
}
