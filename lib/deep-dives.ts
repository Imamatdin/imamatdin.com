// FILE: lib/deep-dives.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const deepDivesDirectory = path.join(process.cwd(), 'content/deep-dives');

export interface DeepDive {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: 'research' | 'engineering' | 'design';
  status: 'coming-soon' | 'in-progress' | 'completed' | 'archived';
  question: string;
  tags?: string[];
  thumbnail?: string;
  content?: string;
}

export function getDeepDives(): DeepDive[] {
  // Check if deep-dives directory exists
  if (!fs.existsSync(deepDivesDirectory)) {
    console.warn('Deep dives directory not found at:', deepDivesDirectory);
    return [];
  }

  const fileNames = fs.readdirSync(deepDivesDirectory);

  const deepDives = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(deepDivesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: data.date || '',
        category: data.category || 'research',
        status: data.status || 'coming-soon',
        question: data.question || '',
        tags: data.tags || [],
        thumbnail: data.thumbnail || null,
        content: content || null,
      } as DeepDive;
    });

  // Sort by date (newest first)
  return deepDives.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.title.localeCompare(b.title);
  });
}

export function getDeepDiveBySlug(slug: string): DeepDive | null {
  const deepDives = getDeepDives();
  return deepDives.find(dive => dive.slug === slug) || null;
}

export function getDeepDivesByCategory(category: DeepDive['category']): DeepDive[] {
  return getDeepDives().filter(dive => dive.category === category);
}

export function getDeepDivesByStatus(status: DeepDive['status']): DeepDive[] {
  return getDeepDives().filter(dive => dive.status === status);
}
