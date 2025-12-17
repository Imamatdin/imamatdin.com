import { GetStaticProps } from "next";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Link as ChakraLink,
  Image,
  useColorModeValue
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Book, getAllBooks } from "../lib/books";
import { NextSeo } from "next-seo";

interface PageProps {
  books: Book[];
  booksByCategory: { [key: string]: Book[] };
}

function BookCover({ book }: { book: Book }) {
  const fallbackBg = useColorModeValue("#5a4a3a", "#2a2520");
  const fallbackText = useColorModeValue("#f5f0e8", "#d4c4a8");

  return (
    <NextLink href={`/reading/${book.slug}`} passHref legacyBehavior>
      <ChakraLink
        _hover={{ transform: "translateY(-6px)" }}
        transition="transform 0.2s ease"
        display="block"
        flexShrink={0}
      >
        <Box
          w={{ base: "90px", sm: "100px", md: "120px" }}
          h={{ base: "135px", sm: "150px", md: "180px" }}
          borderRadius="2px"
          overflow="hidden"
          boxShadow="2px 4px 12px rgba(0,0,0,0.25)"
        >
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              w="100%"
              h="100%"
              objectFit="cover"
            />
          ) : (
            <Box
              w="100%"
              h="100%"
              bg={book.spineColor || fallbackBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={2}
              position="relative"
            >
              <Box
                position="absolute"
                top={2}
                left={2}
                right={2}
                h="1px"
                bg="rgba(255,255,255,0.15)"
              />
              <Box
                position="absolute"
                bottom={2}
                left={2}
                right={2}
                h="1px"
                bg="rgba(255,255,255,0.15)"
              />
              <Text
                fontSize={{ base: "2xs", md: "xs" }}
                color={book.textColor || fallbackText}
                textAlign="center"
                noOfLines={4}
                fontFamily="body"
                sx={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
              >
                {book.title}
              </Text>
            </Box>
          )}
        </Box>
      </ChakraLink>
    </NextLink>
  );
}

function CategoryShelf({ name, books }: { name: string; books: Book[] }) {
  const shelfBg = useColorModeValue(
    "linear-gradient(180deg, #8b7355 0%, #6b5545 100%)",
    "linear-gradient(180deg, #4a3a2a 0%, #2a1a10 100%)"
  );
  const subtleText = useColorModeValue("subtle", "gray.500");

  return (
    <Box mb={8}>
      <HStack justify="space-between" mb={3} px={1}>
        <Text
          fontFamily="heading"
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="500"
        >
          {name}
        </Text>
        <Text
          fontFamily="handwriting"
          fontSize="sm"
          color={subtleText}
        >
          {books.length} {books.length === 1 ? 'volume' : 'volumes'}
        </Text>
      </HStack>

      {/* Horizontal scroll - MOBILE FIXED */}
      <Box
        overflowX="auto"
        overflowY="hidden"
        mx={{ base: -4, md: 0 }}
        px={{ base: 4, md: 0 }}
        pb={4}
        sx={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <HStack
          spacing={{ base: 3, md: 4 }}
          w="max-content"
          pr={{ base: 4, md: 0 }}
        >
          {books.map((book) => (
            <BookCover key={book.slug} book={book} />
          ))}
        </HStack>
      </Box>

      {/* Shelf */}
      <Box
        h={{ base: "6px", md: "8px" }}
        bg={shelfBg}
        borderRadius="2px"
        boxShadow="0 3px 6px rgba(0,0,0,0.2)"
      />
    </Box>
  );
}

export default function Reading({ books, booksByCategory }: PageProps) {
  const thisYear = new Date().getFullYear().toString();
  const booksThisYear = books.filter(b =>
    b.date && new Date(b.date).getFullYear().toString() === thisYear
  ).length;

  const categories = Object.keys(booksByCategory);

  return (
    <>
      <NextSeo
        title="Library | Imamatdin"
        description="Books I've read and my notes on them"
      />

      <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 8, lg: 12 }}>
        <Box w="100%" maxW={{ base: "100%", lg: "1100px" }} mx="auto">
          <VStack align="stretch" spacing={6} mb={8}>
            <Box>
              <Heading fontFamily="heading" size="xl" mb={2}>
                Library
              </Heading>
              <Text color="subtle">
                Books I've read and my notes on them.
              </Text>
            </Box>

            <HStack spacing={8}>
              <Box>
                <Text fontSize="2xl" fontWeight="bold">{booksThisYear}</Text>
                <Text fontSize="sm" color="subtle">this year</Text>
              </Box>
              <Box>
                <Text fontSize="2xl" fontWeight="bold">{books.length}</Text>
                <Text fontSize="sm" color="subtle">total volumes</Text>
              </Box>
            </HStack>
          </VStack>

        {categories.length > 0 ? (
          categories.map(category => (
            <CategoryShelf
              key={category}
              name={category}
              books={booksByCategory[category]}
            />
          ))
        ) : (
          <CategoryShelf name="All Books" books={books} />
        )}
        </Box>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const allBooks = getAllBooks();
  const books = allBooks.map(({ content, ...book }) => book);

  const booksByCategory: { [key: string]: Book[] } = {};

  books.forEach(book => {
    const category = book.category
      ? (Array.isArray(book.category) ? book.category[0] : book.category)
      : 'Uncategorized';

    if (!booksByCategory[category]) {
      booksByCategory[category] = [];
    }
    booksByCategory[category].push(book);
  });

  return {
    props: { books, booksByCategory },
  };
};
