import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Generic content loader for markdown/MDX files with frontmatter.
 * Consolidates the duplicate logic from books.ts, poetry.ts, ideas.ts, academics.ts
 */

export interface BaseContentItem {
  slug: string;
  content?: string | null;
}

export interface GetAllContentOptions {
  /** Sort by 'date' (newest first), 'title', 'name', or a custom field */
  sortBy?: 'date' | 'title' | 'name' | string;
  /** Sort order - defaults to 'desc' for date, 'asc' for title/name */
  sortOrder?: 'asc' | 'desc';
  /** Default values for frontmatter fields */
  defaults?: Record<string, unknown>;
}

/**
 * Get all content items from a directory
 */
export function getAllContent<T extends BaseContentItem>(
  directory: string,
  options: GetAllContentOptions = {}
): T[] {
  const contentDirectory = path.join(process.cwd(), directory);

  if (!fs.existsSync(contentDirectory)) {
    console.warn(`Content directory not found: ${directory}`);
    return [];
  }

  const fileNames = fs.readdirSync(contentDirectory);

  const items = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        content: content || null,
        ...options.defaults,
        ...data,
      } as T;
    });

  // Sort items
  const { sortBy = 'date', sortOrder } = options;

  return items.sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[sortBy];
    const bVal = (b as Record<string, unknown>)[sortBy];

    // Handle date sorting
    if (sortBy === 'date') {
      if (aVal && bVal) {
        const order = sortOrder ?? 'desc';
        const diff = new Date(bVal as string).getTime() - new Date(aVal as string).getTime();
        return order === 'desc' ? diff : -diff;
      }
      // Items without dates go to the end
      if (!aVal) return 1;
      if (!bVal) return -1;
    }

    // Handle string sorting (title, name, etc.)
    const aStr = String(aVal ?? '');
    const bStr = String(bVal ?? '');
    const order = sortOrder ?? 'asc';
    const comparison = aStr.localeCompare(bStr);
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Get a single content item by slug
 */
export function getContentBySlug<T extends BaseContentItem>(
  directory: string,
  slug: string,
  defaults?: Record<string, unknown>
): T | null {
  const contentDirectory = path.join(process.cwd(), directory);

  // Try both .md and .mdx extensions
  const extensions = ['.mdx', '.md'];

  for (const ext of extensions) {
    const fullPath = path.join(contentDirectory, `${slug}${ext}`);

    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        content: content || null,
        ...defaults,
        ...data,
      } as T;
    }
  }

  return null;
}

/**
 * Get all slugs for static path generation
 */
export function getAllSlugsFromDirectory(directory: string): string[] {
  const contentDirectory = path.join(process.cwd(), directory);

  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  return fs.readdirSync(contentDirectory)
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => fileName.replace(/\.mdx?$/, ''));
}

// =============================================================================
// Re-export existing types and create thin wrappers for backwards compatibility
// =============================================================================

// Books
export interface Book {
  slug: string;
  title: string;
  author: string;
  link?: string | null;
  status?: 'reading' | 'finished' | 'want-to-read' | null;
  year?: number | null;
  rating?: number | null;
  date?: string | null;
  content?: string | null;
  spineColor?: string | null;
  textColor?: string | null;
  coverImage?: string | null;
  category?: string | string[] | null;
}

export function getAllBooks(): Book[] {
  return getAllContent<Book>('content/books', {
    sortBy: 'date',
    defaults: { title: '', author: 'Unknown' }
  }).map(book => ({
    ...book,
    title: book.title || book.slug,
    link: book.link || `/reading/${book.slug}`,
  }));
}

export function getBookBySlug(slug: string): Book | null {
  const book = getContentBySlug<Book>('content/books', slug, { author: 'Unknown' });
  if (!book) return null;
  return {
    ...book,
    title: book.title || slug,
    link: book.link || `/reading/${slug}`,
  };
}

// Poetry
export interface Poem {
  slug: string;
  title: string;
  author: string;
  date?: string | null;
  category?: string | null;
  content?: string | null;
}

export function getAllPoems(): Poem[] {
  return getAllContent<Poem>('content/about/poetry', {
    sortBy: 'date',
    defaults: { author: 'Unknown' }
  }).map(poem => ({
    ...poem,
    title: poem.title || poem.slug,
  }));
}

export function getPoemBySlug(slug: string): Poem | null {
  const poem = getContentBySlug<Poem>('content/about/poetry', slug, { author: 'Unknown' });
  if (!poem) return null;
  return {
    ...poem,
    title: poem.title || slug,
  };
}

// Ideas
export interface Idea {
  slug: string;
  title: string;
  date?: string | null;
  tags?: string[] | null;
  content?: string | null;
}

export function getAllIdeas(): Idea[] {
  return getAllContent<Idea>('content/about/ideas', {
    sortBy: 'date',
  }).map(idea => ({
    ...idea,
    title: idea.title || idea.slug,
  }));
}

export function getIdeaBySlug(slug: string): Idea | null {
  const idea = getContentBySlug<Idea>('content/about/ideas', slug);
  if (!idea) return null;
  return {
    ...idea,
    title: idea.title || slug,
  };
}

// Academics
export interface Academic {
  slug: string;
  name: string;
  field?: string | null;
  category?: 'professor' | 'forgotten-scientist' | 'influence' | null;
  date?: string | null;
  content?: string | null;
}

export function getAllAcademics(): Academic[] {
  return getAllContent<Academic>('content/about/academics', {
    sortBy: 'name',
    sortOrder: 'asc',
  }).map(academic => ({
    ...academic,
    name: academic.name || academic.slug,
  }));
}

export function getAcademicBySlug(slug: string): Academic | null {
  const academic = getContentBySlug<Academic>('content/about/academics', slug);
  if (!academic) return null;
  return {
    ...academic,
    name: academic.name || slug,
  };
}
