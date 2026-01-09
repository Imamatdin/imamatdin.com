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
import { Book, getAllBooks } from "../lib/books";
import { NextSeo } from "next-seo";

interface PageProps {
  books: Book[];
  booksByCategory: { [key: string]: Book[] };
}

export default function Reading({ books, booksByCategory }: PageProps) {
  const inkColor = useColorModeValue("#3a2a1a", "#e8dfd0");
  const inkLight = useColorModeValue("#6b5c4a", "#a89060");
  const borderColor = useColorModeValue(
    "rgba(139, 90, 43, 0.2)",
    "rgba(168, 144, 96, 0.15)"
  );

  const categories = Object.keys(booksByCategory);

  return (
    <>
      <NextSeo
        title="Library | Imamatdin"
        description="Books I've read and my notes on them"
      />

      <Container maxW="650px" py={12}>
        <VStack align="stretch" spacing={8}>
          <Box>
            <Heading fontFamily="heading" size="xl" mb={2} color={inkColor}>
              Library
            </Heading>
            <Text fontFamily="body" color={inkLight}>
              Books I've read.
            </Text>
          </Box>

          {categories.length > 0 ? (
            categories.map((category, idx) => (
              <Box key={category}>
                {idx > 0 && (
                  <Divider
                    borderColor={borderColor}
                    borderStyle="dashed"
                    mb={8}
                  />
                )}
                <VStack align="stretch" spacing={3}>
                  <Heading
                    fontFamily="handwriting"
                    fontSize="2xl"
                    color={inkColor}
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
                        fontFamily="body"
                        fontSize="md"
                        color={inkColor}
                      >
                        <NextLink href={`/reading/${book.slug}`} passHref>
                          <Text
                            as="span"
                            fontWeight="bold"
                            borderBottom="1px dashed"
                            borderColor={inkLight}
                            _hover={{ borderStyle: "solid" }}
                            cursor="pointer"
                          >
                            {book.title}
                          </Text>
                        </NextLink>
                        {" — "}
                        {book.author}
                        {year && `, ${year}`}
                      </Text>
                    );
                  })}
                </VStack>
              </Box>
            ))
          ) : (
            <VStack align="stretch" spacing={3}>
              {books.map((book) => {
                const year = book.date
                  ? new Date(book.date).getFullYear()
                  : "";
                return (
                  <Text
                    key={book.slug}
                    fontFamily="body"
                    fontSize="md"
                    color={inkColor}
                  >
                    <NextLink href={`/reading/${book.slug}`} passHref>
                      <Text
                        as="span"
                        fontWeight="bold"
                        borderBottom="1px dashed"
                        borderColor={inkLight}
                        _hover={{ borderStyle: "solid" }}
                        cursor="pointer"
                      >
                        {book.title}
                      </Text>
                    </NextLink>
                    {" — "}
                    {book.author}
                    {year && `, ${year}`}
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
