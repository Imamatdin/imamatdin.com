import {
  Box,
  HStack,
  useColorModeValue,
  keyframes,
} from '@chakra-ui/react';
import { BookCover } from './BookCover';
import { Book } from '../../lib/books';

interface RunningBookshelfProps {
  books: Book[];
  speed?: number; // seconds per full cycle
}

export function RunningBookshelf({ books, speed = 60 }: RunningBookshelfProps) {
  const bgColor = useColorModeValue('#f5f0e8', '#1a1612');
  const shelfColor = useColorModeValue(
    'linear-gradient(to bottom, #8b7355, #5a4a3a)',
    'linear-gradient(to bottom, #5a4a3a, #3a2a1a)'
  );

  // Duplicate books for seamless loop
  const displayBooks = [...books, ...books];

  // Calculate animation distance based on number of books
  const bookWidth = 120; // px
  const bookSpacing = 24; // gap in px (spacing={6} = 24px)
  const totalWidth = books.length * (bookWidth + bookSpacing);

  const scroll = keyframes`
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-${totalWidth}px);
    }
  `;

  return (
    <Box position="relative" overflow="hidden">
      {/* Fade edges */}
      <Box
        position="absolute"
        left={0}
        top={0}
        bottom={0}
        w="100px"
        bgGradient={`linear(to-r, ${bgColor}, transparent)`}
        zIndex={2}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        right={0}
        top={0}
        bottom={0}
        w="100px"
        bgGradient={`linear(to-l, ${bgColor}, transparent)`}
        zIndex={2}
        pointerEvents="none"
      />

      {/* Animated container */}
      <HStack
        spacing={6}
        pb={4}
        animation={`${scroll} ${speed}s linear infinite`}
        _hover={{ animationPlayState: 'paused' }}
      >
        {displayBooks.map((book, i) => (
          <BookCover
            key={`${book.slug}-${i}`}
            book={book}
            width="120px"
            height="180px"
          />
        ))}
      </HStack>

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
