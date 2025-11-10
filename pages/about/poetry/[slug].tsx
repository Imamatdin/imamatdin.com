import { GetStaticPaths, GetStaticProps } from 'next';
import { Container, Heading, Text, VStack, Box, Link as ChakraLink } from '@chakra-ui/react';
import { getAllPoems, getPoemBySlug, Poem } from "../../../lib/poetry";
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { NextSeo } from 'next-seo';
import NextLink from 'next/link';
import { ArrowBackIcon } from '@chakra-ui/icons';

interface PoemPageProps {
  poem: Poem;
  mdxSource: MDXRemoteSerializeResult;
}

export default function PoemPage({ poem, mdxSource }: PoemPageProps) {
  return (
    <>
      <NextSeo
        title={`${poem.title} | Poetry`}
        description={`My reflections on ${poem.title} by ${poem.author}`}
      />
      
      <Container maxW="3xl" py={16}>
        <VStack align="stretch" spacing={8}>
          <VStack align="flex-start" spacing={4}>
            <Heading fontSize="4xl" fontWeight="bold" lineHeight="1.2">
              {poem.title}
            </Heading>
            
            <Text fontSize="xl" color="gray.600" _dark={{ color: "gray.400" }}>
              by {poem.author}
            </Text>

            {poem.date && (
              <Text fontSize="sm" color="gray.500">
                Encountered in {new Date(poem.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Text>
            )}
          </VStack>

          <Box 
            height="1px" 
            bg="gray.200" 
            _dark={{ bg: "gray.700" }}
            my={4}
          />

          {/* MDX Content */}
          <Box
            className="prose prose-lg dark:prose-invert"
            sx={{
              '& h1': { fontSize: '2xl', fontWeight: 'bold', mt: 8, mb: 4 },
              '& h2': { fontSize: 'xl', fontWeight: 'bold', mt: 6, mb: 3 },
              '& h3': { fontSize: 'lg', fontWeight: 'semibold', mt: 4, mb: 2 },
              '& p': { mb: 4, lineHeight: 1.7 },
              '& strong': { fontWeight: 'bold' },
              '& em': { fontStyle: 'italic' },
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
                color: 'accent',
                textDecoration: 'underline',
                _hover: { opacity: 0.8 }
              }
            }}
          >
            <MDXRemote {...mdxSource} />
          </Box>

          {/* Back to Poetry Button */}
          <Box 
            mt={12}
            pt={6}
            borderTop="1px solid"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.700" }}
          >
            <NextLink href="/about/poetry" passHref legacyBehavior>
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
                Back to Poetry
              </ChakraLink>
            </NextLink>
          </Box>
        </VStack>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const poems = getAllPoems();
  
  const paths = poems.map((poem) => ({
    params: { slug: poem.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PoemPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const poem = getPoemBySlug(slug);

  if (!poem) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await serialize(poem.content || '');

  const { content, ...poemWithoutContent } = poem;

  return {
    props: {
      poem: poemWithoutContent as Poem,
      mdxSource,
    },
  };
};