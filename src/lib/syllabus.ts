import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const bookDirectory = path.join(process.cwd(), 'book');

export interface PageData {
  id: string; // The URL slug e.g. "1.1" or "page1_your_first_python_program"
  title: string;
  type: 'read' | 'practice';
  order: number;
  completed: boolean; // Mocked for now
}

export interface ChapterData {
  id: string;
  title: string;
  order: number;
  pages: PageData[];
}

export interface PartData {
  id: string;
  title: string;
  order: number;
  chapters: ChapterData[];
}

// Parses a simple title from directory/file names
function formatTitle(name: string) {
  return name
    .replace(/^part\d+_|^chapter\d+_|^page\d+_/, '') // Remove prefix
    .replace(/_/g, ' ')
    .replace(/\.md$/, '')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function getSyllabus(): PartData[] {
  if (!fs.existsSync(bookDirectory)) return [];

  const partsDir = fs.readdirSync(bookDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('part'))
    .sort((a, b) => a.name.localeCompare(b.name));

  return partsDir.map((partDirent, partIndex) => {
    const partPath = path.join(bookDirectory, partDirent.name);
    const chaptersDir = fs.readdirSync(partPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('chapter'))
      .sort((a, b) => a.name.localeCompare(b.name));

    const chapters: ChapterData[] = chaptersDir.map((chapterDirent, chapterIndex) => {
      const chapterPath = path.join(partPath, chapterDirent.name);
      const pagesFiles = fs.readdirSync(chapterPath)
        .filter(file => file.endsWith('.md'))
        .sort((a, b) => {
          // Extract page number if present (e.g. page1_... vs page2_...)
          const aMatch = a.match(/^page(\d+)/);
          const bMatch = b.match(/^page(\d+)/);
          if (aMatch && bMatch) return parseInt(aMatch[1]) - parseInt(bMatch[1]);
          return a.localeCompare(b);
        });

      const pages: PageData[] = pagesFiles.map((file, pageIndex) => {
        const filePath = path.join(chapterPath, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        // We can parse frontmatter if it exists, otherwise fallback to guessing
        const { data } = matter(fileContents);
        
        const isPractice = file.includes('practice');
        const pageId = file.replace('.md', ''); // e.g. "page1_..."

        return {
          id: pageId,
          title: data.title || formatTitle(file),
          type: data.type || (isPractice ? 'practice' : 'read'),
          order: pageIndex + 1,
          completed: false
        };
      });

      return {
        id: chapterDirent.name,
        title: "Chapter " + (chapterIndex + 1) + ": " + formatTitle(chapterDirent.name),
        order: chapterIndex + 1,
        pages
      };
    });

    return {
      id: partDirent.name,
      title: "Part " + (partIndex + 1) + ": " + formatTitle(partDirent.name),
      order: partIndex + 1,
      chapters
    };
  });
}

export function getPageContent(pageId: string) {
  // A simple find-by-pageId across the whole book
  if (!fs.existsSync(bookDirectory)) return null;
  
  const parts = fs.readdirSync(bookDirectory).filter(p => p.startsWith('part'));
  for (const part of parts) {
    const partPath = path.join(bookDirectory, part);
    const chapters = fs.readdirSync(partPath).filter(c => c.startsWith('chapter'));
    
    for (const chapter of chapters) {
      const chapterPath = path.join(partPath, chapter);
      const filePath = path.join(chapterPath, pageId + ".md");
      
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        return {
          id: pageId,
          content: content,
          theoryContent: fileContents,
          isPractice: pageId.includes('practice'),
          initialCode: extractInitialCode(content)
        };
      }
    }
  }
  return null;
}

function extractInitialCode(content: string) {
  // Try to find code under "### Initial Code"
  const match = content.match(/### Initial Code\n+```python\n([\s\S]*?)```/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
}
