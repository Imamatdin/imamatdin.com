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
  const textColor = useColorModeValue("#1a1a1a", "#e0e0e0");
  const subtleColor = useColorModeValue("#666666", "#999999");
  const borderColor = useColorModeValue("rgba(0,0,0,0.1)", "rgba(255,255,255,0.1)");
  const accentColor = useColorModeValue("#0066cc", "#66b3ff");

  return (
    <>
      <NextSeo
        title={`${book.title} | Reading`}
        description={`My notes and reflections on ${book.title} by ${book.author}`}
      />

      <Container maxW="650px" py={8}>
        <VStack align="stretch" spacing={6}>
          {/* Book Header */}
          <VStack align="flex-start" spacing={2}>
            <Heading
              fontFamily="mono"
              fontSize="xl"
              fontWeight="bold"
              lineHeight="1.3"
              color={textColor}
            >
              {book.title}
            </Heading>

            <Text fontFamily="mono" fontSize="14px" color={subtleColor}>
              by {book.author}
            </Text>

            {book.date && (
              <Text fontFamily="mono" fontSize="12px" color={subtleColor}>
                Read in {new Date(book.date).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
            )}

            {book.rating && (
              <Text fontFamily="mono" fontSize="12px" color={subtleColor}>
                Rating: {book.rating}/10
              </Text>
            )}

            {book.category && (
              <Text fontFamily="mono" fontSize="12px" color={subtleColor}>
                {Array.isArray(book.category) ? book.category.join(', ') : book.category}
              </Text>
            )}
          </VStack>

          <Divider borderColor={borderColor} />

          {/* Book Notes/Content */}
          <Box
            fontFamily="mono"
            fontSize="14px"
            lineHeight="1.8"
            color={textColor}
            sx={{
              '& h1, & h2, & h3': {
                fontFamily: 'mono',
                color: textColor,
                mt: 6,
                mb: 3
              },
              '& h1': { fontSize: 'lg', fontWeight: 'bold' },
              '& h2': { fontSize: 'md', fontWeight: 'bold' },
              '& h3': { fontSize: 'md', fontWeight: 'semibold' },
              '& p': { mb: 4, lineHeight: 1.8 },
              '& ul, & ol': { pl: 5, mb: 4 },
              '& li': { mb: 1 },
              '& blockquote': {
                borderLeft: '2px solid',
                borderColor: borderColor,
                pl: 4,
                py: 1,
                fontStyle: 'italic',
                color: subtleColor
              },
              '& code': {
                fontFamily: 'mono',
                fontSize: 'sm',
                color: textColor
              },
              '& a': {
                color: accentColor,
                textDecoration: 'underline',
                _hover: { opacity: 0.7 }
              }
            }}
          >
            <MDXRemote {...mdxSource} />
          </Box>

          {/* Back to Library Link */}
          <Box pt={6} borderTop="1px solid" borderColor={borderColor}>
            <NextLink href="/reading" passHref legacyBehavior>
              <ChakraLink
                fontFamily="mono"
                fontSize="sm"
                color={subtleColor}
                _hover={{ color: textColor }}
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
