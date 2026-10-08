import { Box, Container, Grid, Link as ChakraLink, Text } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';
import { Eyebrow } from '../../components/Eyebrow';
import { getAllPostData, Post } from '../../lib/writing';
import { getDeepDives } from '../../lib/deep-dives';

interface Question {
  slug: string;
  title: string;
  question: string;
  tags: string[];
}

interface WritingProps {
  posts: Post[];
  questions: Question[];
}

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '').split('.')[0];
  } catch {
    return '';
  }
};

export default function Writing({ posts, questions }: WritingProps) {
  return (
    <>
      <NextSeo title="Writing | Imamatdin" description="Essays, and the questions I haven't answered yet." />

      <Container maxW="650px" py={4}>
        <Eyebrow mb={3}>index / writing</Eyebrow>
        <Text as="div" fontFamily="mono" fontSize="28px" fontWeight={400} letterSpacing="-0.04em" lineHeight="1.1" color="text">
          Writing
        </Text>
        <Text as="div" fontFamily="mono" fontSize="13px" color="subtle" mt={3}>
          I write to understand what I think.
        </Text>

        <Box as="section" mt={12}>
          <Eyebrow mb={4}>essays</Eyebrow>
          <Box borderTop="1px solid" borderColor="border">
            {posts.map((post) => (
              <Grid
                key={post.url || post.title}
                templateColumns="1fr auto"
                gap={4}
                py={4}
                borderBottom="1px solid"
                borderColor="border"
                alignItems="baseline"
              >
                <Text as="div" fontFamily="mono" fontSize="14px" fontWeight={500} lineHeight="1.5">
                  <ChakraLink href={post.url} isExternal={post.external} className="ink-link">
                    {post.title}
                    {post.external ? ' ↗' : ''}
                  </ChakraLink>
                </Text>
                <Eyebrow whiteSpace="nowrap">
                  {post.external && post.url ? `${host(post.url)} · ` : ''}
                  {post.date?.slice(0, 7)}
                </Eyebrow>
              </Grid>
            ))}
          </Box>
        </Box>

        <Box as="section" id="questions" mt={14} sx={{ scrollMarginTop: '24px' }}>
          <Eyebrow mb={2}>open questions</Eyebrow>
          <Text as="div" fontFamily="mono" fontSize="12px" color="subtle" mb={4}>
            Things I want to work out. Each one becomes an essay once I have.
          </Text>
          <Box borderTop="1px solid" borderColor="border">
            {questions.map((q, i) => (
              <Grid
                key={q.slug}
                templateColumns="3.5ch 1fr"
                gap={3}
                py={4}
                borderBottom="1px solid"
                borderColor="border"
              >
                <Text as="div" fontFamily="mono" fontSize="12px" color="subtle" pt="1px">
                  q{String(i + 1).padStart(2, '0')}
                </Text>
                <Box>
                  <Text as="div" fontFamily="mono" fontSize="14px" fontWeight={500} color="text">
                    {q.title}
                  </Text>
                  <Text as="div" fontFamily="mono" fontSize="13px" color="subtle" lineHeight="1.75" mt={1}>
                    {q.question}
                  </Text>
                  {q.tags.length > 0 && <Eyebrow mt={2}>{q.tags.slice(0, 3).join(' / ')}</Eyebrow>}
                </Box>
              </Grid>
            ))}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps<WritingProps> = async () => {
  const posts = getAllPostData();
  const questions = getDeepDives()
    .filter((d) => d.question)
    .map((d) => ({ slug: d.slug, title: d.title, question: d.question, tags: d.tags ?? [] }));
  return { props: { posts, questions } };
};
