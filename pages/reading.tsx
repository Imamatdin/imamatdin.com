import { GetStaticProps } from "next";
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { Book, getAllBooks } from "../lib/books";
import { NextSeo } from "next-seo";

interface PageProps {
  books: Book[];
}

export default function Reading({ books }: PageProps) {
  return (
    <>
      <NextSeo
        title="Library | Imamatdin"
        description="Books I've read and found worth rereading"
      />

      <Container maxW="650px" py={4}>
        <VStack align="stretch" spacing={6}>
          <Box>
            <Heading fontFamily="mono" size="lg" mb={2} color="text">
              Library
            </Heading>
            <Text fontFamily="mono" fontSize="14px" color="subtle">
              Books I&apos;ve read and found worth rereading.
            </Text>
          </Box>

          <VStack align="stretch" spacing={2}>
            {books.map((book) => (
              <Text
                key={book.slug}
                as="div"
                fontFamily="mono"
                fontSize="14px"
                color="text"
              >
                <NextLink href={`/reading/${book.slug}`} passHref>
                  <Text
                    as="span"
                    fontWeight="bold"
                    color="accent"
                    textDecoration="underline"
                    _hover={{ opacity: 0.7 }}
                    cursor="pointer"
                  >
                    {book.title}
                  </Text>
                </NextLink>
                {", "}
                <Text as="span" color="subtle">{book.author}</Text>
              </Text>
            ))}
          </VStack>
        </VStack>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const books = getAllBooks()
    .map(({ content, ...book }) => book)
    .sort((a, b) => a.title.localeCompare(b.title));

  return {
    props: { books },
  };
};
