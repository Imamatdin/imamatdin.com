import { GetStaticProps } from "next";
import { Container, Heading, Text, VStack, HStack, Box } from "@chakra-ui/react";
import NextLink from "next/link";
import { Poem, getAllPoems } from "../../../lib/poetry";
import { NextSeo } from "next-seo";

interface PageProps {
  poems: Poem[];
}

export default function Poetry({ poems }: PageProps) {
  // Group by author or date
  const byAuthor: { [key: string]: Poem[] } = {};
  
  poems.forEach(poem => {
    const author = poem.author;
    if (!byAuthor[author]) {
      byAuthor[author] = [];
    }
    byAuthor[author].push(poem);
  });

  const authors = Object.keys(byAuthor);

  return (
    <>
      <NextSeo
        title="Poetry & Art | Imamatdin"
        description="Poems I've read and my reflections on them"
      />
      
      <Container maxW="4xl" py={12}>
        <Heading size="2xl" mb={2}>Poetry & Art</Heading>
        <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }} mb={12}>
          Poems I&apos;ve encountered and my reflections on them.
        </Text>

        <VStack spacing={10} align="stretch">
          {authors.map(author => (
            <Box key={author}>
              <Heading size="md" mb={4} color="gray.500" _dark={{ color: "gray.400" }}>
                {author}
              </Heading>
              <VStack spacing={3} align="stretch">
                {byAuthor[author].map((poem) => {
                  const date = poem.date ? new Date(poem.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
                  
                  return (
                    <HStack key={poem.slug} justify="space-between" align="center">
                      <NextLink href={`/about/poetry/${poem.slug}`}>
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                          color="red.600"
                          _dark={{ color: "red.400" }}
                          cursor="pointer"
                          _hover={{ opacity: 0.7 }}
                          transition="opacity 0.2s"
                        >
                          {poem.title}
                        </Text>
                      </NextLink>
                      <Text fontSize="sm" color="gray.500" flexShrink={0}>
                        {date}
                      </Text>
                    </HStack>
                  );
                })}
              </VStack>
            </Box>
          ))}
        </VStack>

        {poems.length === 0 && (
          <Text color="gray.500">No poems added yet.</Text>
        )}
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const allPoems = getAllPoems();
  
  const poems = allPoems.map(({ content, ...poem }) => poem);
  
  return {
    props: {
      poems,
    },
  };
};