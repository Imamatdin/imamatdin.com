import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const poetryDirectory = path.join(process.cwd(), 'content/about/poetry');

export interface Poem {
  slug: string;
  title: string;
  author: string;
  date?: string | null;
  category?: string | null;
  content?: string | null;
}

export function getAllPoems(): Poem[] {
  if (!fs.existsSync(poetryDirectory)) {
    console.warn('Poetry directory not found');
    return [];
  }

  const fileNames = fs.readdirSync(poetryDirectory);
  
  const poems = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(poetryDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        author: data.author || 'Unknown',
        date: data.date || null,
        category: data.category || null,
        content: content || null,
        ...data,
      } as Poem;
    });

  return poems.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.title.localeCompare(b.title);
  });
}

export function getPoemBySlug(slug: string): Poem | null {
  const poems = getAllPoems();
  return poems.find(poem => poem.slug === slug) || null;
}