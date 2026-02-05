import { GetStaticPaths, GetStaticProps } from 'next';
import { Container, VStack, Text } from '@chakra-ui/react';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { NextSeo } from 'next-seo';
import { getAllBooks, getBookBySlug, Book } from '../../lib/content';
import { ProseContent, ContentHeader, BackLink } from '../../components/content';

interface BookPageProps {
  book: Book;
  mdxSource: MDXRemoteSerializeResult;
}

export default function BookPage({ book, mdxSource }: BookPageProps) {
  return (
    <>
      <NextSeo
        title={`${book.title} | Reading`}
        description={`My notes and reflections on ${book.title} by ${book.author}`}
      />

      <Container maxW="650px" py={8}>
        <VStack align="stretch" spacing={6}>
          <ContentHeader
            title={book.title}
            subtitle={book.author}
            date={book.date}
            datePrefix="Read in"
            variant="terminal"
          >
            {book.rating && (
              <Text fontFamily="mono" fontSize="12px" color="subtle">
                Rating: {book.rating}/10
              </Text>
            )}
            {book.category && (
              <Text fontFamily="mono" fontSize="12px" color="subtle">
                {Array.isArray(book.category) ? book.category.join(', ') : book.category}
              </Text>
            )}
          </ContentHeader>

          <ProseContent source={mdxSource} variant="terminal" />

          <BackLink href="/reading" label="Back to Library" variant="terminal" />
        </VStack>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const books = getAllBooks();
  const paths = books.map((book) => ({ params: { slug: book.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<BookPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const book = getBookBySlug(slug);

  if (!book) {
    return { notFound: true };
  }

  const mdxSource = await serialize(book.content || '');
  const { content, ...bookWithoutContent } = book;

  return {
    props: {
      book: bookWithoutContent as Book,
      mdxSource,
    },
  };
};
