import {
  Box,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { BookCover } from './BookCover';
import { Book } from '../../lib/books';

interface RunningBookshelfProps {
  books: Book[];
}

export function RunningBookshelf({ books }: RunningBookshelfProps) {
  const shelfColor = useColorModeValue(
    'linear-gradient(to bottom, #8b7355, #5a4a3a)',
    'linear-gradient(to bottom, #5a4a3a, #3a2a1a)'
  );

  return (
    <Box position="relative">
      {/* Scrollable container - manual scroll only */}
      <Box
        overflowX="auto"
        pb={4}
        css={{
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(139, 90, 43, 0.3)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(139, 90, 43, 0.5)',
          },
        }}
      >
        <HStack spacing={6} minW="max-content">
          {books.map((book) => (
            <BookCover
              key={book.slug}
              book={book}
              width="120px"
              height="180px"
            />
          ))}
        </HStack>
      </Box>

      {/* Shelf base */}
      <Box
        h="12px"
        bgGradient={shelfColor}
        boxShadow="0 4px 8px rgba(0,0,0,0.2)"
        borderRadius="sm"
      />
    </Box>
  );
}

export default RunningBookshelf;
