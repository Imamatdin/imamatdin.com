import { GetStaticProps } from "next";
import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { Book, getAllBooks } from "../lib/books";
import { CategorizedBookshelf } from "../components/Bookshelf";

interface PageProps {
  books: Book[];
}

export default function Reading({ books }: PageProps) {
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.3)', 'rgba(168, 144, 96, 0.3)');

  // Stats
  const thisYear = new Date().getFullYear().toString();
  const booksThisYear = books.filter(b =>
    b.date && new Date(b.date).getFullYear().toString() === thisYear
  ).length;

  return (
    <>
      <NextSeo
        title="Library | Imamatdin"
        description="Books I've read and my notes on them."
      />

      <Container maxW="container.lg" px={4}>
        <Heading
          as="h1"
          fontFamily="handwriting"
          fontSize={{ base: '2xl', md: '3xl' }}
          color={inkColor}
          mb={2}
        >
          Library
        </Heading>

        <Text
          fontFamily="body"
          fontSize="md"
          color={inkLight}
          mb={4}
        >
          Books I've read and my notes on them.
        </Text>

        {/* Stats */}
        <HStack spacing={6} mb={8}>
          <VStack spacing={0} align="flex-start">
            <Text fontFamily="handwriting" fontSize="2xl" color={inkColor}>
              {booksThisYear}
            </Text>
            <Text
              fontFamily="handwriting"
              fontSize="xs"
              color={inkLight}
              borderBottom="1px dashed"
              borderColor={borderColor}
            >
              this year
            </Text>
          </VStack>
          <VStack spacing={0} align="flex-start">
            <Text fontFamily="handwriting" fontSize="2xl" color={inkColor}>
              {books.length}
            </Text>
            <Text
              fontFamily="handwriting"
              fontSize="xs"
              color={inkLight}
              borderBottom="1px dashed"
              borderColor={borderColor}
            >
              total volumes
            </Text>
          </VStack>
        </HStack>

        {/* Categorized Bookshelf with horizontal scroll per category */}
        <CategorizedBookshelf books={books} />

        {books.length === 0 && (
          <Text
            fontFamily="handwriting"
            fontSize="lg"
            color={inkLight}
            textAlign="center"
            py={12}
          >
            The library is empty...
          </Text>
        )}
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const allBooks = getAllBooks();

  // Remove content to reduce page size
  const books = allBooks.map(({ content, ...book }) => book);

  return {
    props: {
      books,
    },
  };
};
