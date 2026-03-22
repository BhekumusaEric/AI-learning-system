import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const wrpDirectory = path.join(process.cwd(), 'book', 'part_wrp', 'chapter1_work_readiness');

export interface WrpPage {
  id: string;
  title: string;
  type: 'read' | 'interview' | 'email-practice' | 'games' | 'cv-builder';
  order: number;
  video?: string;
}

// Sorts page1 < page2 < page2b < page3 < page6 < page6b etc.
function pageOrder(filename: string): number {
  const m = filename.match(/^page(\d+)(b?)/);
  if (!m) return 999;
  return parseInt(m[1], 10) * 10 + (m[2] === 'b' ? 5 : 0);
}

export function getWrpSyllabus(): WrpPage[] {
  if (!fs.existsSync(wrpDirectory)) return [];
  return fs.readdirSync(wrpDirectory)
    .filter(f => f.endsWith('.md'))
    .sort((a, b) => pageOrder(a) - pageOrder(b))
    .map((file, i) => {
      const { data } = matter(fs.readFileSync(path.join(wrpDirectory, file), 'utf8'));
      return {
        id: file.replace('.md', ''),
        title: data.title || file.replace('.md', '').replace(/_/g, ' '),
    type: (data.type || 'read') as WrpPage['type'],
        order: i + 1,
        video: data.video,
      };
    });
}

export function getWrpPage(pageId: string) {
  const filePath = path.join(wrpDirectory, pageId + '.md');
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return {
    id: pageId,
    title: data.title || pageId,
    type: (data.type || 'read') as WrpPage['type'],
    video: data.video || null,
    content,
  };
}
