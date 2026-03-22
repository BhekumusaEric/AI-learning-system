import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const wrpDirectory = path.join(process.cwd(), 'book', 'part_wrp', 'chapter1_work_readiness');

export interface WrpPage {
  id: string;
  title: string;
  type: 'read' | 'interview' | 'email-practice';
  order: number;
  video?: string;
}

export function getWrpSyllabus(): WrpPage[] {
  if (!fs.existsSync(wrpDirectory)) return [];
  return fs.readdirSync(wrpDirectory)
    .filter(f => f.endsWith('.md'))
    .sort((a, b) => {
      const n = (s: string) => parseInt(s.match(/^page(\d+)/)?.[1] || '0', 10);
      return n(a) - n(b);
    })
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
