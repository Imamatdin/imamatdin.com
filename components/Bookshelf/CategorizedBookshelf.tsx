import {
  Box,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { BookCover } from './BookCover';
import { Book } from '../../lib/books';

interface Category {
  name: string;
  books: Book[];
}

interface CategorizedBookshelfProps {
  books: Book[];
}

export function CategorizedBookshelf({ books }: CategorizedBookshelfProps) {
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const shelfColor = useColorModeValue(
    'linear-gradient(to bottom, #8b7355, #5a4a3a)',
    'linear-gradient(to bottom, #5a4a3a, #3a2a1a)'
  );
  const scrollbarBg = useColorModeValue('#e8dfd0', '#2a1a0a');
  const scrollbarThumb = useColorModeValue('#6b5c4a', '#5a4a3a');

  // Group books by category
  const categories: Category[] = [];
  const categoryMap = new Map<string, Book[]>();

  books.forEach((book) => {
    const cats = Array.isArray(book.category)
      ? book.category
      : book.category
      ? [book.category]
      : ['Uncategorized'];

    cats.forEach((cat) => {
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat)!.push(book);
    });
  });

  categoryMap.forEach((categoryBooks, name) => {
    categories.push({ name, books: categoryBooks });
  });

  // Sort categories by number of books
  categories.sort((a, b) => b.books.length - a.books.length);

  return (
    <VStack spacing={12} align="stretch">
      {categories.map((category) => (
        <Box key={category.name}>
          {/* Category header */}
          <HStack justify="space-between" mb={4}>
            <Text
              fontFamily="handwriting"
              fontSize="2xl"
              color={inkColor}
            >
              {category.name}
            </Text>
            <Text
              fontFamily="handwriting"
              fontSize="sm"
              color={inkLight}
            >
              {category.books.length} {category.books.length === 1 ? 'volume' : 'volumes'}
            </Text>
          </HStack>

          {/* Horizontal scroll container */}
          <Box
            overflowX="auto"
            pb={4}
            css={{
              '&::-webkit-scrollbar': {
                height: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: scrollbarBg,
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: scrollbarThumb,
                borderRadius: '3px',
              },
            }}
          >
            <HStack spacing={4} w="max-content" pb={2}>
              {category.books.map((book) => (
                <BookCover
                  key={book.slug}
                  book={book}
                  width="120px"
                  height="180px"
                />
              ))}
            </HStack>
          </Box>

          {/* Shelf line */}
          <Box
            h="8px"
            bgGradient={shelfColor}
            boxShadow="0 4px 8px rgba(0,0,0,0.2)"
            borderRadius="sm"
          />
        </Box>
      ))}
    </VStack>
  );
}

export default CategorizedBookshelf;
