import { getPageContent, getSyllabus } from '@/lib/syllabus';
import DipLessonClient from '@/components/dip/DipLessonClient';

export default async function DipLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageData = getPageContent(id);

  // DIP navigation scoped to chapter 1 (Python Fundamentals) + chapter 2 (Battle Grounds)
  const fullSyllabus = getSyllabus();
  const part1 = fullSyllabus.find(p => p.id === 'part1_foundational_skills_classical_ml');
  const chapter1 = part1?.chapters.find(c => c.id === 'chapter1_python_programming_fundamentals');
  const chapter2 = part1?.chapters.find(c => c.id === 'chapter2_battle_grounds');
  const ch1Pages = chapter1 ? [...chapter1.pages].sort((a, b) => a.order - b.order) : [];
  const ch2Pages = chapter2 ? [...chapter2.pages].sort((a, b) => a.order - b.order) : [];
  const dipPages = [...ch1Pages, ...ch2Pages];

  const currentIndex = dipPages.findIndex(p => p.id === id);
  const prev = currentIndex > 0 ? dipPages[currentIndex - 1] : null;
  const next = currentIndex < dipPages.length - 1 ? dipPages[currentIndex + 1] : null;
  const isLastPage = currentIndex === dipPages.length - 1;

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
      pageType={pageData.pageType || null}
      resources={pageData.resources || []}
      prevPageId={prev?.id ?? null}
      prevPageTitle={prev?.title ?? null}
      nextPageId={next?.id ?? null}
      nextPageTitle={next?.title ?? null}
      isLastPage={isLastPage}
      colabNotebook={pageData.colabNotebook || null}
      video={id === 'page1_your_first_python_program' ? "https://www.youtube.com/watch?v=kqtD5dpn9C8" : (pageData.video || null)}
    />
  );
}
