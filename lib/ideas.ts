import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ideasDirectory = path.join(process.cwd(), 'content/about/ideas');

export interface Idea {
  slug: string;
  title: string;
  date?: string | null;
  tags?: string[] | null;
  content?: string | null;
}

export function getAllIdeas(): Idea[] {
  if (!fs.existsSync(ideasDirectory)) {
    console.warn('Ideas directory not found');
    return [];
  }

  const fileNames = fs.readdirSync(ideasDirectory);
  
  const ideas = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(ideasDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || null,
        tags: data.tags || null,
        content: content || null,
        ...data,
      } as Idea;
    });

  return ideas.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.title.localeCompare(b.title);
  });
}

export function getIdeaBySlug(slug: string): Idea | null {
  const ideas = getAllIdeas();
  return ideas.find(idea => idea.slug === slug) || null;
}