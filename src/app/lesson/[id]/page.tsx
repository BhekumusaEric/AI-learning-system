import { getPageContent, getAdjacentPages } from '@/lib/syllabus';
import LessonClient from './LessonClient';

export default async function LessonServerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageData = getPageContent(id);
  const adjacent = getAdjacentPages(id);

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
      pageId={id}
      content={pageData.content} 
      initialCodeProp={pageData.initialCode}
      testCodeProp={pageData.testCode}
      isPractice={pageData.isPractice}
      pageType={pageData.pageType || null}
      resources={pageData.resources || []}
      prevPage={adjacent.prev}
      nextPage={adjacent.next}
      colabNotebook={pageData.colabNotebook || null}
      video={pageData.video || null}
    />
  );
}
