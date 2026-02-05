import { GetStaticProps } from "next";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Divider,
  useColorModeValue
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Book, getAllBooks } from "../lib/content";
import { NextSeo } from "next-seo";

interface PageProps {
  books: Book[];
  booksByCategory: { [key: string]: Book[] };
}

export default function Reading({ books, booksByCategory }: PageProps) {
  const textColor = useColorModeValue("#1a1a1a", "#e0e0e0");
  const subtleColor = useColorModeValue("#666666", "#999999");
  const borderColor = useColorModeValue("rgba(0,0,0,0.1)", "rgba(255,255,255,0.1)");
  const accentColor = useColorModeValue("#0066cc", "#66b3ff");

  const categories = Object.keys(booksByCategory);

  return (
    <>
      <NextSeo
        title="Library | Imamatdin"
        description="Books I've read and my notes on them"
      />

      <Container maxW="650px" py={8}>
        <VStack align="stretch" spacing={6}>
          <Box>
            <Heading fontFamily="mono" size="lg" mb={2} color={textColor}>
              Library
            </Heading>
            <Text fontFamily="mono" fontSize="14px" color={subtleColor}>
              Books I've read.
            </Text>
          </Box>

          {categories.length > 0 ? (
            categories.map((category, idx) => (
              <Box key={category}>
                {idx > 0 && (
                  <Divider borderColor={borderColor} mb={6} />
                )}
                <VStack align="stretch" spacing={2}>
                  <Heading
                    fontFamily="mono"
                    fontSize="md"
                    color={textColor}
                    mb={2}
                  >
                    {category}
                  </Heading>

                  {booksByCategory[category].map((book) => {
                    const year = book.date
                      ? new Date(book.date).getFullYear()
                      : "";
                    return (
                      <Text
                        key={book.slug}
                        fontFamily="mono"
                        fontSize="14px"
                        color={textColor}
                      >
                        <NextLink href={`/reading/${book.slug}`} passHref>
                          <Text
                            as="span"
                            fontWeight="bold"
                            color={accentColor}
                            textDecoration="underline"
                            _hover={{ opacity: 0.7 }}
                            cursor="pointer"
                          >
                            {book.title}
                          </Text>
                        </NextLink>
                        {" — "}
                        <Text as="span" color={subtleColor}>{book.author}</Text>
                        {year && <Text as="span" color={subtleColor}>, {year}</Text>}
                      </Text>
                    );
                  })}
                </VStack>
              </Box>
            ))
          ) : (
            <VStack align="stretch" spacing={2}>
              {books.map((book) => {
                const year = book.date
                  ? new Date(book.date).getFullYear()
                  : "";
                return (
                  <Text
                    key={book.slug}
                    fontFamily="mono"
                    fontSize="14px"
                    color={textColor}
                  >
                    <NextLink href={`/reading/${book.slug}`} passHref>
                      <Text
                        as="span"
                        fontWeight="bold"
                        color={accentColor}
                        textDecoration="underline"
                        _hover={{ opacity: 0.7 }}
                        cursor="pointer"
                      >
                        {book.title}
                      </Text>
                    </NextLink>
                    {" — "}
                    <Text as="span" color={subtleColor}>{book.author}</Text>
                    {year && <Text as="span" color={subtleColor}>, {year}</Text>}
                  </Text>
                );
              })}
            </VStack>
          )}
        </VStack>
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
