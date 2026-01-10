import {
  VStack,
  Heading,
  Text,
  Box,
  Container,
  useColorModeValue,
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
  const textColor = useColorModeValue('#1a1a1a', '#e0e0e0');
  const subtleColor = useColorModeValue('#666666', '#999999');
  const borderColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)');
  const accentColor = useColorModeValue('#0066cc', '#66b3ff');
  const codeBg = useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)');

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

      <Container maxW="650px" py={8}>
        {/* Back link */}
        <NextLink href="/deep-dives">
          <Text
            fontFamily="mono"
            fontSize="sm"
            color={subtleColor}
            mb={6}
            cursor="pointer"
            _hover={{ color: textColor }}
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
          color={textColor}
          mb={2}
        >
          {dive.title}
        </Heading>

        {/* Date, category, and status */}
        <Text fontFamily="mono" fontSize="12px" color={subtleColor} mb={4}>
          {formatDate(dive.date)} • {dive.category} • [{dive.status}]
        </Text>

        {/* The Question */}
        <Text
          fontFamily="mono"
          fontSize="14px"
          fontStyle="italic"
          color={subtleColor}
          lineHeight="1.8"
          mb={6}
        >
          {dive.question}
        </Text>

        {/* Tags */}
        {dive.tags && dive.tags.length > 0 && (
          <Text fontFamily="mono" fontSize="12px" color={subtleColor} mb={6}>
            Tags: {dive.tags.join(', ')}
          </Text>
        )}

        {/* Body content */}
        <Box
          fontFamily="mono"
          fontSize="14px"
          color={textColor}
          lineHeight="1.8"
          sx={{
            'h2': {
              fontFamily: 'mono',
              fontSize: 'md',
              fontWeight: 'bold',
              color: textColor,
              mt: 6,
              mb: 3,
            },
            'h3': {
              fontFamily: 'mono',
              fontSize: 'md',
              fontWeight: 'bold',
              color: textColor,
              mt: 4,
              mb: 2,
            },
            'p': {
              mb: 4,
            },
            'blockquote': {
              borderLeft: '2px solid',
              borderColor: borderColor,
              fontStyle: 'italic',
              pl: 4,
              my: 4,
              color: subtleColor,
            },
            'code': {
              fontFamily: 'mono',
              bg: codeBg,
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
              color: accentColor,
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
