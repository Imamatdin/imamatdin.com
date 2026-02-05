import { GetStaticPaths, GetStaticProps } from 'next';
import { Container, VStack } from '@chakra-ui/react';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { NextSeo } from 'next-seo';
import { getAllPoems, getPoemBySlug, Poem } from '../../../lib/content';
import { ProseContent, ContentHeader, BackLink } from '../../../components/content';

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
          <ContentHeader
            title={poem.title}
            subtitle={poem.author}
            date={poem.date}
            datePrefix="Encountered in"
            variant="standard"
          />

          <ProseContent source={mdxSource} variant="standard" />

          <BackLink href="/about/poetry" label="Back to Poetry" variant="standard" />
        </VStack>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const poems = getAllPoems();
  const paths = poems.map((poem) => ({ params: { slug: poem.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PoemPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const poem = getPoemBySlug(slug);

  if (!poem) {
    return { notFound: true };
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
