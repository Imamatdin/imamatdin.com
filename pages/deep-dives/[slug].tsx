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
        <Container maxW="800px" py={16}>
          {/* Back link */}
          <NextLink href="/deep-dives">
            <Text
              fontFamily="handwriting"
              fontSize="sm"
              color={inkLight}
              mb={8}
              cursor="pointer"
              _hover={{ color: inkColor }}
            >
              back to index
            </Text>
          </NextLink>

          {/* Title as handwritten header */}
          <Heading
            as="h1"
            fontFamily="handwriting"
            fontSize={{ base: '3xl', md: '4xl' }}
            color={inkColor}
            mb={2}
            transform="rotate(-1deg)"
          >
            {dive.title}
          </Heading>

          {/* Date and category notation */}
          <HStack spacing={4} mb={6}>
            <Text
              fontFamily="handwriting"
              fontSize="sm"
              color={inkLight}
            >
              {formatDate(dive.date)}
            </Text>
            <Text fontFamily="handwriting" fontSize="sm" color={inkLight}>
              |
            </Text>
            <Text
              fontFamily="handwriting"
              fontSize="sm"
              color={inkLight}
              textTransform="capitalize"
            >
              {dive.category}
            </Text>
          </HStack>

          {/* Status badge */}
          <Badge
            bg="transparent"
            color={sepiaAccent}
            fontFamily="handwriting"
            fontSize="sm"
            border="1px solid"
            borderColor={sepiaAccent}
            borderRadius="none"
            px={3}
            py={1}
            mb={8}
            textTransform="lowercase"
          >
            {dive.status}
          </Badge>

          {/* The Question */}
          <Box
            my={8}
            p={6}
            border="1px dashed"
            borderColor={borderColor}
            position="relative"
          >
            <Text
              fontFamily="handwriting"
              fontSize="xs"
              color={inkLight}
              position="absolute"
              top={2}
              right={2}
            >
              the question
            </Text>
            <Text
              fontFamily="body"
              fontSize="lg"
              fontStyle="italic"
              color={inkColor}
              lineHeight="tall"
            >
              {dive.question}
            </Text>
          </Box>

          {/* Tags */}
          {dive.tags && dive.tags.length > 0 && (
            <Wrap spacing={2} mb={8}>
              {dive.tags.map((tag) => (
                <WrapItem key={tag}>
                  <Text
                    fontFamily="handwriting"
                    fontSize="xs"
                    color={inkLight}
                    px={2}
                    py={1}
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    {tag}
                  </Text>
                </WrapItem>
              ))}
            </Wrap>
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
