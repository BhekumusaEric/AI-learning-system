import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const bookDirectory = path.join(process.cwd(), 'book');

export interface PageData {
  id: string; // The URL slug e.g. "1.1" or "page1_your_first_python_program"
  title: string;
  type: 'read' | 'practice' | 'lab';
  order: number;
  completed: boolean; // Mocked for now
  video: string | null;
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

export interface ResourceData {
  title: string;
  url: string;
}

export function getSyllabus(): PartData[] {
  if (!fs.existsSync(bookDirectory)) return [];

  const partsDir = fs.readdirSync(bookDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('part') && dirent.name !== 'part_wrp')
    .sort((a, b) => a.name.localeCompare(b.name));

  const parts: PartData[] = partsDir.map((partDirent, partIndex) => {
    const partPath = path.join(bookDirectory, partDirent.name);
    const chaptersDir = fs.readdirSync(partPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('chapter'))
      .sort((a, b) => a.name.localeCompare(b.name));

    const chapters: ChapterData[] = chaptersDir.map((chapterDirent, chapterIndex) => {
      const chapterPath = path.join(partPath, chapterDirent.name);
      const pagesFiles = fs.readdirSync(chapterPath)
        .filter(file => file.endsWith('.md'))
        .sort((a, b) => {
          const aMatch = a.match(/^page(\d+)(b?)/);
          const bMatch = b.match(/^page(\d+)(b?)/);
          if (aMatch && bMatch) {
            const aNum = parseInt(aMatch[1]) * 10 + (aMatch[2] === 'b' ? 5 : 0);
            const bNum = parseInt(bMatch[1]) * 10 + (bMatch[2] === 'b' ? 5 : 0);
            return aNum - bNum;
          }
          return a.localeCompare(b);
        });

      const pages: PageData[] = pagesFiles.map((file, pageIndex) => {
        const filePath = path.join(chapterPath, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        const isPractice = file.includes('practice');
        const pageId = file.replace('.md', '');
        return {
          id: pageId,
          title: data.title || formatTitle(file),
          type: data.type || (isPractice ? 'practice' : 'read') as 'read' | 'practice' | 'lab',
          order: pageIndex + 1,
          completed: false,
          video: data.video || null
        };
      });

      return {
        id: chapterDirent.name,
        title: 'Chapter ' + (chapterIndex + 1) + ': ' + formatTitle(chapterDirent.name),
        order: chapterIndex + 1,
        pages
      };
    });

    return {
      id: partDirent.name,
      title: 'Part ' + (partIndex + 1) + ': ' + formatTitle(partDirent.name),
      order: partIndex + 1,
      chapters
    };
  });

  // Append part_wrp as Part 7
  const wrpPath = path.join(bookDirectory, 'part_wrp', 'chapter1_work_readiness');
  if (fs.existsSync(wrpPath)) {
    const wrpFiles = fs.readdirSync(wrpPath)
      .filter(f => f.endsWith('.md'))
      .sort((a, b) => {
        const aMatch = a.match(/^page(\d+)(b?)/);
        const bMatch = b.match(/^page(\d+)(b?)/);
        if (aMatch && bMatch) {
          const aNum = parseInt(aMatch[1]) * 10 + (aMatch[2] === 'b' ? 5 : 0);
          const bNum = parseInt(bMatch[1]) * 10 + (bMatch[2] === 'b' ? 5 : 0);
          return aNum - bNum;
        }
        return a.localeCompare(b);
      });

    const wrpPages: PageData[] = wrpFiles.map((file, i) => {
      const { data } = matter(fs.readFileSync(path.join(wrpPath, file), 'utf8'));
      return {
        id: file.replace('.md', ''),
        title: data.title || formatTitle(file),
        type: (data.type || 'read') as 'read' | 'practice' | 'lab',
        order: i + 1,
        completed: false,
        video: data.video || null,
      };
    });

    parts.push({
      id: 'part_wrp',
      title: 'Part 7: Work Readiness Program',
      order: 7,
      chapters: [{
        id: 'chapter1_work_readiness',
        title: 'Chapter 1: Work Readiness',
        order: 1,
        pages: wrpPages,
      }],
    });
  }

  return parts;
}

export function getPageContent(pageId: string) {
  // A simple find-by-pageId across the whole book
  if (!fs.existsSync(bookDirectory)) return null;
  
  const syllabus = getSyllabus();
  
  for (const part of syllabus) {
    for (const chapter of part.chapters) {
      for (const page of chapter.pages) {
        if (page.id === pageId) {
          // Re-construct exactly where it is so we can read the file
          // Note: getting exact path again can be tricky if we don't store it in PageData
          // The previous mapping stripped chapter/part dir information for ids
          // Let's do a fast recursive file search
          return findAndReadFile(bookDirectory, pageId + ".md");
        }
      }
    }
  }
  return null;
}

function findAndReadFile(dir: string, filename: string): any {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      const found = findAndReadFile(fullPath, filename);
      if (found) return found;
    } else if (file.name === filename) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        id: filename.replace('.md', ''),
        content: content,
        theoryContent: fileContents,
        isPractice: filename.includes('practice') || filename.includes('challenge') || data.type === 'lab' || data.type === 'practice',
        pageType: data.type || null,
        initialCode: extractInitialCode(content),
        testCode: extractTestCode(content),
        resources: data.resources || [],
        colabNotebook: data.colab_notebook || null,
        video: data.video || null
      };
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

function extractTestCode(content: string) {
  // Try to find code under "### Evaluation Code"
  const match = content.match(/### Evaluation Code\n+```python\n([\s\S]*?)```/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
}

export function getAdjacentPages(pageId: string) {
  const syllabus = getSyllabus();
  const allPages = [];
  
  for (const part of syllabus) {
    for (const chapter of part.chapters) {
      for (const page of chapter.pages) {
        allPages.push(page);
      }
    }
  }
  
  const currentIndex = allPages.findIndex(p => p.id === pageId);
  if (currentIndex === -1) return { prev: null, next: null };
  
  return {
    prev: currentIndex > 0 ? allPages[currentIndex - 1] : null,
    next: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null
  };
}
