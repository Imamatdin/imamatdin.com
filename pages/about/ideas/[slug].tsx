import { GetStaticPaths, GetStaticProps } from 'next';
import { Container, Heading, Text, VStack, Box, Link as ChakraLink } from '@chakra-ui/react';
import { getAllIdeas, getIdeaBySlug, Idea } from "../../../lib/ideas";
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { NextSeo } from 'next-seo';
import NextLink from 'next/link';
import { ArrowBackIcon } from '@chakra-ui/icons';

interface IdeaPageProps {
  idea: Idea;
  mdxSource: MDXRemoteSerializeResult;
}

export default function IdeaPage({ idea, mdxSource }: IdeaPageProps) {
  return (
    <>
      <NextSeo
        title={`${idea.title} | Ideas`}
        description={`My reflections on ${idea.title}`}
      />
      
      <Container maxW="3xl" py={16}>
        <VStack align="stretch" spacing={8}>
          <VStack align="flex-start" spacing={4}>
            <Heading fontSize="4xl" fontWeight="bold" lineHeight="1.2">
              {idea.title}
            </Heading>

            {idea.date && (
              <Text fontSize="sm" color="gray.500">
                {new Date(idea.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
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

          {/* Back to Ideas Button */}
          <Box 
            mt={12}
            pt={6}
            borderTop="1px solid"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.700" }}
          >
            <NextLink href="/about/ideas" passHref legacyBehavior>
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
                Back to Ideas
              </ChakraLink>
            </NextLink>
          </Box>
        </VStack>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ideas = getAllIdeas();
  
  const paths = ideas.map((idea) => ({
    params: { slug: idea.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<IdeaPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const idea = getIdeaBySlug(slug);

  if (!idea) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await serialize(idea.content || '');

  const { content, ...ideaWithoutContent } = idea;

  return {
    props: {
      idea: ideaWithoutContent as Idea,
      mdxSource,
    },
  };
};