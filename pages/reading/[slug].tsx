import { GetStaticPaths, GetStaticProps } from 'next';
import { Box, Container, Heading, Text, VStack, Divider, Link as ChakraLink, useColorModeValue } from '@chakra-ui/react';
import { getAllBooks, getBookBySlug, Book } from '../../lib/books';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { NextSeo } from 'next-seo';
import NextLink from 'next/link';

interface BookPageProps {
  book: Book;
  mdxSource: MDXRemoteSerializeResult;
}

export default function BookPage({ book, mdxSource }: BookPageProps) {
  const inkColor = useColorModeValue("#3a2a1a", "#e8dfd0");
  const inkLight = useColorModeValue("#6b5c4a", "#a89060");
  const borderColor = useColorModeValue(
    "rgba(139, 90, 43, 0.2)",
    "rgba(168, 144, 96, 0.15)"
  );

  return (
    <>
      <NextSeo
        title={`${book.title} | Reading`}
        description={`My notes and reflections on ${book.title} by ${book.author}`}
      />

      <Container maxW="650px" py={12}>
        <VStack align="stretch" spacing={8}>
          {/* Book Header */}
          <VStack align="flex-start" spacing={3}>
            <Heading
              fontFamily="heading"
              fontSize="3xl"
              fontWeight="bold"
              lineHeight="1.3"
              color={inkColor}
            >
              {book.title}
            </Heading>

            <Text fontFamily="body" fontSize="lg" color={inkLight}>
              by {book.author}
            </Text>

            {book.date && (
              <Text fontFamily="handwriting" fontSize="sm" color={inkLight}>
                Read in {new Date(book.date).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
            )}

            {book.rating && (
              <Text fontFamily="body" fontSize="sm" color={inkLight}>
                Rating: {book.rating}/10
              </Text>
            )}

            {book.category && (
              <Text fontFamily="body" fontSize="sm" color={inkLight}>
                {Array.isArray(book.category) ? book.category.join(', ') : book.category}
              </Text>
            )}
          </VStack>

          <Divider borderColor={borderColor} borderStyle="dashed" />

          {/* Book Notes/Content */}
          <Box
            fontFamily="body"
            fontSize="md"
            lineHeight="tall"
            color={inkColor}
            sx={{
              '& h1, & h2, & h3': {
                fontFamily: 'heading',
                color: inkColor,
                mt: 6,
                mb: 3
              },
              '& h1': { fontSize: '2xl', fontWeight: 'bold' },
              '& h2': { fontSize: 'xl', fontWeight: 'bold' },
              '& h3': { fontSize: 'lg', fontWeight: 'semibold' },
              '& p': { mb: 4, lineHeight: 1.8 },
              '& ul, & ol': { pl: 6, mb: 4 },
              '& li': { mb: 2 },
              '& blockquote': {
                borderLeft: '2px solid',
                borderColor: inkLight,
                pl: 4,
                py: 2,
                fontStyle: 'italic',
                color: inkLight
              },
              '& code': {
                fontFamily: 'mono',
                fontSize: 'sm',
                color: inkColor
              },
              '& a': {
                color: inkColor,
                borderBottom: '1px dashed',
                borderColor: inkLight,
                textDecoration: 'none',
                _hover: { borderStyle: 'solid' }
              }
            }}
          >
            <MDXRemote {...mdxSource} />
          </Box>

          {/* Back to Library Link */}
          <Box
            mt={8}
            pt={6}
            borderTop="1px dashed"
            borderColor={borderColor}
          >
            <NextLink href="/reading" passHref legacyBehavior>
              <ChakraLink
                fontFamily="body"
                fontSize="md"
                color={inkColor}
                borderBottom="1px dashed"
                borderColor={inkLight}
                textDecoration="none"
                _hover={{
                  borderStyle: "solid"
                }}
              >
                ← Back to Library
              </ChakraLink>
            </NextLink>
          </Box>
        </VStack>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const books = getAllBooks();

  const paths = books.map((book) => ({
    params: { slug: book.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BookPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const book = getBookBySlug(slug);

  if (!book) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await serialize(book.content || '');

  const { content, ...bookWithoutContent } = book;

  return {
    props: {
      book: bookWithoutContent as Book,
      mdxSource,
    },
  };
};
