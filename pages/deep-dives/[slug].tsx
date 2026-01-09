// FILE: pages/deep-dives/[slug].tsx

import {
  VStack,
  Heading,
  Text,
  Box,
  Container,
  Badge,
  HStack,
  useColorModeValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';
import { DeepDive, getDeepDives, getDeepDiveBySlug } from '../../lib/deep-dives';
import ReactMarkdown from 'react-markdown';

interface PageProps {
  dive: DeepDive;
  pageNumber: number;
}

const DeepDiveDetailPage = ({ dive, pageNumber }: PageProps) => {
  const bgColor = useColorModeValue('#f5f0e8', '#1a1612');
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.2)', 'rgba(168, 144, 96, 0.15)');
  const sepiaAccent = useColorModeValue('#704214', '#8b4513');
  const codeBg = useColorModeValue('#e8dfd0', '#2a1a0a');

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

      <Box
        minH="100vh"
        bg={bgColor}
        position="relative"
        className="parchment-bg"
      >
        <Container maxW="650px" py={12}>
          {/* Back link */}
          <NextLink href="/deep-dives">
            <Text
              fontFamily="body"
              fontSize="sm"
              color={inkColor}
              mb={8}
              cursor="pointer"
              borderBottom="1px dashed"
              borderColor={inkLight}
              display="inline-block"
              _hover={{ borderStyle: 'solid' }}
            >
              ← Back to Deep Dives
            </Text>
          </NextLink>

          {/* Title */}
          <Heading
            as="h1"
            fontFamily="heading"
            fontSize="3xl"
            color={inkColor}
            mb={3}
          >
            {dive.title}
          </Heading>

          {/* Date, category, and status */}
          <Text fontFamily="handwriting" fontSize="sm" color={inkLight} mb={6}>
            {formatDate(dive.date)} • {dive.category} • ({dive.status})
          </Text>

          {/* The Question */}
          <Text
            fontFamily="body"
            fontSize="lg"
            fontStyle="italic"
            color={inkLight}
            lineHeight="tall"
            mb={8}
          >
            {dive.question}
          </Text>

          {/* Tags */}
          {dive.tags && dive.tags.length > 0 && (
            <Text fontFamily="body" fontSize="sm" color={inkLight} mb={8}>
              Tags: {dive.tags.join(', ')}
            </Text>
          )}

          {/* Body content - rendered MDX */}
          <Box
            fontFamily="body"
            color={inkColor}
            lineHeight="tall"
            sx={{
              'h2': {
                fontFamily: 'handwriting',
                fontSize: '2xl',
                color: inkColor,
                mt: 8,
                mb: 4,
                transform: 'rotate(-0.5deg)',
              },
              'h3': {
                fontFamily: 'handwriting',
                fontSize: 'xl',
                color: inkColor,
                mt: 6,
                mb: 3,
              },
              'p': {
                mb: 4,
              },
              'blockquote': {
                borderLeft: '2px solid',
                borderColor: sepiaAccent,
                fontStyle: 'italic',
                pl: 4,
                my: 4,
              },
              'code': {
                fontFamily: 'mono',
                bg: codeBg,
                px: 1,
                borderRadius: 'sm',
              },
              'ul, ol': {
                pl: 6,
                mb: 4,
              },
              'li': {
                mb: 2,
              },
            }}
          >
            <ReactMarkdown>{dive.content || ''}</ReactMarkdown>
          </Box>

        </Container>
      </Box>
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
  const dives = getDeepDives();
  const pageNumber = dives.findIndex((d) => d.slug === params?.slug) + 1;

  return {
    props: {
      dive,
      pageNumber,
    },
  };
};

export default DeepDiveDetailPage;
