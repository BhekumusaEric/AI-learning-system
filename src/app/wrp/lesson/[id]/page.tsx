import { getWrpPage, getWrpSyllabus } from '@/lib/wrpSyllabus';
import WrpLessonClient from '@/components/wrp/WrpLessonClient';

export default async function WrpLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = getWrpPage(id);
  const all = getWrpSyllabus();
  const idx = all.findIndex(p => p.id === id);

  if (!page) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center bg-background text-foreground">
        <div>
          <h2 className="text-2xl font-bold mb-4">Module Not Found</h2>
          <p className="text-secondary-text">Could not load content for: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <WrpLessonClient
      pageId={id}
      title={page.title}
      type={page.type}
      content={page.content}
      video={page.video}
      prev={idx > 0 ? all[idx - 1] : null}
      next={idx < all.length - 1 ? all[idx + 1] : null}
      isLast={idx === all.length - 1}
    />
  );
}
