import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const booksDirectory = path.join(process.cwd(), 'content/books');

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
  // Check if books directory exists
  if (!fs.existsSync(booksDirectory)) {
    console.warn('Books directory not found at:', booksDirectory);
    return [];
  }

  const fileNames = fs.readdirSync(booksDirectory);
  
  const books = fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(booksDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        author: data.author || 'Unknown',
        link: data.link || `/books/${slug}`,
        status: data.status || null,
        year: data.year || null,
        rating: data.rating || null,
        date: data.date || null,
        content: content || null,
        spineColor: data.spineColor || null,
        textColor: data.textColor || null,
        coverImage: data.coverImage || null,
        ...data,
      } as Book;
    });

  // Sort by date if available, otherwise by title
  return books.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.title.localeCompare(b.title);
  });
}

export function getBookBySlug(slug: string): Book | null {
  const books = getAllBooks();
  return books.find(book => book.slug === slug) || null;
}

export function getBooksByStatus(status: Book['status']): Book[] {
  return getAllBooks().filter(book => book.status === status);
}