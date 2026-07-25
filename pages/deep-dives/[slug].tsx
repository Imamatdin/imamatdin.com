import {
  VStack,
  Heading,
  Text,
  Box,
  Container,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';
import { DeepDive, getDeepDives, getDeepDiveBySlug } from '../../lib/deep-dives';
import ReactMarkdown from 'react-markdown';

interface PageProps {
  dive: DeepDive;
}

const DeepDiveDetailPage = ({ dive }: PageProps) => {

  if (!dive) {
    return <Text>Loading...</Text>;
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <NextSeo
        title={`${dive.title} | Deep Dives`}
        description={dive.question}
      />

      <Container maxW="650px" py={4}>
        {/* Back link */}
        <NextLink href="/deep-dives">
          <Text
            fontFamily="mono"
            fontSize="sm"
            color="subtle"
            mb={6}
            cursor="pointer"
            _hover={{ color: "text" }}
            display="inline-block"
          >
            ← Back to Deep Dives
          </Text>
        </NextLink>

        {/* Title */}
        <Heading
          as="h1"
          fontFamily="mono"
          fontSize="xl"
          color="text"
          mb={2}
        >
          {dive.title}
        </Heading>

        {/* Date, category, and status */}
        <Text fontFamily="mono" fontSize="12px" color="subtle" mb={4}>
          {formatDate(dive.date)} • {dive.category} • [{dive.status}]
        </Text>

        {/* The Question */}
        <Text
          fontFamily="mono"
          fontSize="14px"
          fontStyle="italic"
          color="subtle"
          lineHeight="1.8"
          mb={6}
        >
          {dive.question}
        </Text>

        {/* Tags */}
        {dive.tags && dive.tags.length > 0 && (
          <Text fontFamily="mono" fontSize="12px" color="subtle" mb={6}>
            Tags: {dive.tags.join(', ')}
          </Text>
        )}

        {/* Body content */}
        <Box
          fontFamily="mono"
          fontSize="14px"
          color="text"
          lineHeight="1.8"
          sx={{
            'h2': {
              fontFamily: 'mono',
              fontSize: 'md',
              fontWeight: 'bold',
              color: "text",
              mt: 6,
              mb: 3,
            },
            'h3': {
              fontFamily: 'mono',
              fontSize: 'md',
              fontWeight: 'bold',
              color: "text",
              mt: 4,
              mb: 2,
            },
            'p': {
              mb: 4,
            },
            'blockquote': {
              borderLeft: '2px solid',
              "border": "border",
              fontStyle: 'italic',
              pl: 4,
              my: 4,
              color: "subtle",
            },
            'code': {
              fontFamily: 'mono',
              bg: "highlight",
              px: 1,
            },
            'ul, ol': {
              pl: 5,
              mb: 4,
            },
            'li': {
              mb: 1,
            },
            'a': {
              color: "accent",
              textDecoration: 'underline',
              _hover: { opacity: 0.7 }
            }
          }}
        >
          <ReactMarkdown>{dive.content || ''}</ReactMarkdown>
        </Box>
      </Container>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const dives = getDeepDives();
  const paths = dives.map((dive) => ({
    params: { slug: dive.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const dive = getDeepDiveBySlug(params?.slug as string);

  return {
    props: {
      dive,
    },
  };
};

export default DeepDiveDetailPage;
