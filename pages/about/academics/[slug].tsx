import { GetStaticPaths, GetStaticProps } from 'next';
import { Container, Heading, Text, VStack, Box, Badge, Link as ChakraLink } from '@chakra-ui/react';
import { getAllAcademics, getAcademicBySlug, Academic } from "../../../lib/academics";
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { NextSeo } from 'next-seo';
import NextLink from 'next/link';
import { ArrowBackIcon } from '@chakra-ui/icons';

interface AcademicPageProps {
  academic: Academic;
  mdxSource: MDXRemoteSerializeResult;
}

export default function AcademicPage({ academic, mdxSource }: AcademicPageProps) {
  return (
    <>
      <NextSeo
        title={`${academic.name} | Academics`}
        description={`About ${academic.name} and their influence on my path`}
      />
      
      <Container maxW="3xl" py={16}>
        <VStack align="stretch" spacing={8}>
          <VStack align="flex-start" spacing={4}>
            <Heading fontSize="4xl" fontWeight="bold" lineHeight="1.2">
              {academic.name}
            </Heading>
            
            {academic.field && (
              <Text fontSize="xl" color="gray.600" _dark={{ color: "gray.400" }}>
                {academic.field}
              </Text>
            )}

            {academic.category && (
              <Badge colorScheme="blue" fontSize="sm">
                {academic.category === 'forgotten-scientist' ? 'Forgotten Scientist' : 
                 academic.category === 'professor' ? 'Professor' : 'Academic Influence'}
              </Badge>
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

          {/* Back to Academic Influences Button */}
          <Box 
            mt={12}
            pt={6}
            borderTop="1px solid"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.700" }}
          >
            <NextLink href="/about/academics" passHref legacyBehavior>
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
                Back to Academic Influences
              </ChakraLink>
            </NextLink>
          </Box>
        </VStack>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const academics = getAllAcademics();
  
  const paths = academics.map((academic) => ({
    params: { slug: academic.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<AcademicPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const academic = getAcademicBySlug(slug);

  if (!academic) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await serialize(academic.content || '');

  const { content, ...academicWithoutContent } = academic;

  return {
    props: {
      academic: academicWithoutContent as Academic,
      mdxSource,
    },
  };
};