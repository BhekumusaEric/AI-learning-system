import { getPageContent } from '@/lib/syllabus';
import LessonClient from './LessonClient';

export default async function LessonServerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageData = getPageContent(id);

  if (!pageData) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8 text-center bg-background text-foreground">
        <div>
          <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
          <p className="text-secondary-text">Could not load syllabus content for: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <LessonClient 
      content={pageData.content} 
      initialCodeProp={pageData.initialCode} 
      isPractice={pageData.isPractice}
    />
  );
}
