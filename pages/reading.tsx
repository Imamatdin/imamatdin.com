import { GetStaticProps } from "next";
import { Box, Heading, Link, Text, VStack, Container } from "@chakra-ui/react";
import NextLink from "next/link";
import { Book, getAllBooks } from "../lib/books";

interface PageProps {
  books: Book[];
}

export default function Reading({ books }: PageProps) {
  const currentlyReading = books.filter(b => b.status === 'reading');
  const finished = books.filter(b => b.status === 'finished');
  const wantToRead = books.filter(b => b.status === 'want-to-read');

  const BookList = ({ books, title }: { books: Book[], title: string }) => (
    <Box mb={12}>
      <Heading size="lg" mb={6}>{title}</Heading>
      <VStack align="stretch" spacing={4}>
        {books.map((book) => (
          <Box key={book.slug}>
            <NextLink href={book.link || `/books/${book.slug}`} passHref legacyBehavior>
              <Link 
                fontSize="lg" 
                fontWeight="medium"
                _hover={{ textDecoration: 'none', opacity: 0.7 }}
              >
                {book.title}
              </Link>
            </NextLink>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              {book.author}
              {book.year && ` • ${book.year}`}
              {book.rating && ` • ${"⭐".repeat(book.rating)}`}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );

  return (
    <Container maxW="3xl" py={12}>
      <Heading size="2xl" mb={2}>Reading</Heading>
      <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }} mb={12}>
        Books I'm reading and reflections on what I've learned.
      </Text>

      {currentlyReading.length > 0 && (
        <BookList books={currentlyReading} title="Currently Reading" />
      )}

      {finished.length > 0 && (
        <BookList books={finished} title="Finished" />
      )}

      {wantToRead.length > 0 && (
        <BookList books={wantToRead} title="Want to Read" />
      )}

      {books.length === 0 && (
        <Text color="gray.500">No books added yet.</Text>
      )}
    </Container>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const books = getAllBooks();
  
  return {
    props: {
      books,
    },
  };
};