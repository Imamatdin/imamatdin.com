import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const academicsDirectory = path.join(process.cwd(), 'content/about/academics');

export interface Academic {
  slug: string;
  name: string;
  field?: string | null;
  category?: 'professor' | 'forgotten-scientist' | 'influence' | null;
  date?: string | null;
  content?: string | null;
}

export function getAllAcademics(): Academic[] {
  if (!fs.existsSync(academicsDirectory)) {
    console.warn('Academics directory not found');
    return [];
  }

  const fileNames = fs.readdirSync(academicsDirectory);
  
  const academics = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(academicsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        name: data.name || slug,
        field: data.field || null,
        category: data.category || null,
        date: data.date || null,
        content: content || null,
        ...data,
      } as Academic;
    });

  return academics.sort((a, b) => a.name.localeCompare(b.name));
}

export function getAcademicBySlug(slug: string): Academic | null {
  const academics = getAllAcademics();
  return academics.find(academic => academic.slug === slug) || null;
}