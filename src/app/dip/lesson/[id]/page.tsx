import { getPageContent, getSyllabus } from '@/lib/syllabus';
import DipLessonClient from '@/components/dip/DipLessonClient';

export default async function DipLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageData = getPageContent(id);

  // Build adjacent pages scoped to Part 1 only
  const fullSyllabus = getSyllabus();
  const part1 = fullSyllabus.find(p => p.id === 'part1_foundational_skills_classical_ml');
  const part1Pages = part1?.chapters
    .sort((a, b) => a.order - b.order)
    .flatMap(c => [...c.pages].sort((a, b) => a.order - b.order)) ?? [];

  const currentIndex = part1Pages.findIndex(p => p.id === id);
  const prev = currentIndex > 0 ? part1Pages[currentIndex - 1] : null;
  const next = currentIndex < part1Pages.length - 1 ? part1Pages[currentIndex + 1] : null;
  const isLastPage = currentIndex === part1Pages.length - 1;

  if (!pageData) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8 text-center bg-background text-foreground">
        <div>
          <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
          <p className="text-secondary-text">Could not load content for: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <DipLessonClient
      pageId={id}
      content={pageData.content}
      initialCodeProp={pageData.initialCode}
      testCodeProp={pageData.testCode}
      isPractice={pageData.isPractice}
      resources={pageData.resources || []}
      prevPageId={prev?.id ?? null}
      prevPageTitle={prev?.title ?? null}
      nextPageId={next?.id ?? null}
      nextPageTitle={next?.title ?? null}
      isLastPage={isLastPage}
    />
  );
}
