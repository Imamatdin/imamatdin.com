import { GetStaticPaths, GetStaticProps } from 'next';
import { Container, VStack, Text } from '@chakra-ui/react';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { NextSeo } from 'next-seo';
import { getAllAcademics, getAcademicBySlug, Academic } from '../../../lib/content';
import { ProseContent, ContentHeader, BackLink } from '../../../components/content';

interface AcademicPageProps {
  academic: Academic;
  mdxSource: MDXRemoteSerializeResult;
}

function getCategoryLabel(category: Academic['category']): string | null {
  if (!category) return null;
  switch (category) {
    case 'forgotten-scientist':
      return 'Forgotten Scientist';
    case 'professor':
      return 'Professor';
    default:
      return 'Academic Influence';
  }
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
          <ContentHeader
            title={academic.name}
            subtitle={academic.field}
            badge={getCategoryLabel(academic.category)}
            variant="standard"
          />

          <ProseContent source={mdxSource} variant="standard" />

          <BackLink
            href="/about/academics"
            label="Back to Academic Influences"
            variant="standard"
          />
        </VStack>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const academics = getAllAcademics();
  const paths = academics.map((academic) => ({ params: { slug: academic.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<AcademicPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const academic = getAcademicBySlug(slug);

  if (!academic) {
    return { notFound: true };
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
