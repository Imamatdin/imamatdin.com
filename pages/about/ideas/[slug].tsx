import { GetStaticPaths, GetStaticProps } from 'next';
import { Container, VStack } from '@chakra-ui/react';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { NextSeo } from 'next-seo';
import { getAllIdeas, getIdeaBySlug, Idea } from '../../../lib/content';
import { ProseContent, ContentHeader, BackLink } from '../../../components/content';

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
          <ContentHeader
            title={idea.title}
            date={idea.date}
            dateFormat="full"
            variant="standard"
          />

          <ProseContent source={mdxSource} variant="standard" />

          <BackLink href="/about/ideas" label="Back to Ideas" variant="standard" />
        </VStack>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ideas = getAllIdeas();
  const paths = ideas.map((idea) => ({ params: { slug: idea.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<IdeaPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const idea = getIdeaBySlug(slug);

  if (!idea) {
    return { notFound: true };
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
