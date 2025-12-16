// FILE: lib/projects.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

export interface Project {
  slug: string;
  title: string;
  description: string;
  date: string;
  status: 'in-progress' | 'completed' | 'archived';
  tags?: string[];
  thumbnail?: string;
  links?: { label: string; href: string }[];
  content?: string;
}

export function getProjects(): Project[] {
  // Check if projects directory exists
  if (!fs.existsSync(projectsDirectory)) {
    console.warn('Projects directory not found at:', projectsDirectory);
    return [];
  }

  const fileNames = fs.readdirSync(projectsDirectory);

  const projects = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(projectsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: data.date || '',
        status: data.status || 'in-progress',
        tags: data.tags || [],
        thumbnail: data.thumbnail || null,
        links: data.links || [],
        content: content || null,
      } as Project;
    });

  // Sort by date (newest first)
  return projects.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.title.localeCompare(b.title);
  });
}

export function getProjectBySlug(slug: string): Project | null {
  const projects = getProjects();
  return projects.find(project => project.slug === slug) || null;
}

export function getProjectsByStatus(status: Project['status']): Project[] {
  return getProjects().filter(project => project.status === status);
}
