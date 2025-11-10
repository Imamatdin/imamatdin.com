import { GetStaticPaths, GetStaticProps } from 'next';
import { Box, Container, Heading, Text, VStack, HStack, Tag, Link as ChakraLink } from '@chakra-ui/react';
import { getAllBooks, getBookBySlug, Book } from '../../lib/books';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { NextSeo } from 'next-seo';
import NextLink from 'next/link';
import { ArrowBackIcon } from '@chakra-ui/icons';

interface BookPageProps {
  book: Book;
  mdxSource: MDXRemoteSerializeResult;
}

export default function BookPage({ book, mdxSource }: BookPageProps) {
  return (
    <>
      <NextSeo
        title={`${book.title} | Reading`}
        description={`My notes and reflections on ${book.title} by ${book.author}`}
      />
      
      <Container maxW="3xl" py={16}>
        <VStack align="stretch" spacing={8}>
          {/* Book Header */}
          <VStack align="flex-start" spacing={4}>
            <Heading 
              fontSize={{ base: "3xl", md: "4xl" }} 
              fontWeight="bold"
              lineHeight="1.2"
            >
              {book.title}
            </Heading>
            
            <HStack spacing={4} flexWrap="wrap">
              <Text fontSize="xl" color="gray.600" _dark={{ color: "gray.400" }}>
                by {book.author}
              </Text>
              
              {book.rating && (
                <Text fontSize="lg" fontWeight="medium" color="accent">
                  Rating: {book.rating}/10
                </Text>
              )}
            </HStack>

            {book.date && (
              <Text fontSize="sm" color="gray.500">
                Read in {new Date(book.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Text>
            )}

            {book.category && (
              <HStack spacing={2}>
                {(Array.isArray(book.category) ? book.category : [book.category]).map(cat => (
                  <Tag key={cat} size="md" colorScheme="blue">
                    {cat}
                  </Tag>
                ))}
              </HStack>
            )}
          </VStack>

          {/* Divider */}
          <Box 
            height="1px" 
            bg="gray.200" 
            _dark={{ bg: "gray.700" }}
            my={4}
          />

          {/* Book Notes/Content */}
          <Box
            className="prose prose-lg dark:prose-invert"
            sx={{
              '& h1': { fontSize: '2xl', fontWeight: 'bold', mt: 8, mb: 4 },
              '& h2': { fontSize: 'xl', fontWeight: 'bold', mt: 6, mb: 3 },
              '& h3': { fontSize: 'lg', fontWeight: 'semibold', mt: 4, mb: 2 },
              '& p': { mb: 4, lineHeight: 1.7 },
              '& ul, & ol': { pl: 6, mb: 4 },
              '& li': { mb: 2 },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'blue.500',
                pl: 4,
                py: 2,
                fontStyle: 'italic',
                color: 'gray.600',
                _dark: { color: 'gray.400' }
              },
              '& code': {
                bg: 'gray.100',
                _dark: { bg: 'gray.800' },
                px: 2,
                py: 1,
                borderRadius: 'md',
                fontSize: 'sm'
              },
              '& a': {
                color: 'blue.500',
                _dark: { color: 'blue.400' },
                textDecoration: 'underline'
              }
            }}
          >
            <MDXRemote {...mdxSource} />
          </Box>

          {/* Back to Bookshelf Button */}
          <Box 
            mt={12}
            pt={6}
            borderTop="1px solid"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.700" }}
          >
            <NextLink href="/reading" passHref legacyBehavior>
              <ChakraLink
                display="inline-flex"
                alignItems="center"
                gap={2}
                fontSize="lg"
                fontWeight="medium"
                color="accent"
                transition="all 0.2s"
                _hover={{
                  textDecoration: "none",
                  transform: "translateX(-4px)"
                }}
              >
                <ArrowBackIcon />
                Back to Bookshelf
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