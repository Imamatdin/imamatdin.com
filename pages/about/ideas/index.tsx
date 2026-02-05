import { GetStaticProps } from "next";
import { Container, Heading, Text, VStack, HStack, Box } from "@chakra-ui/react";
import NextLink from "next/link";
import { Idea, getAllIdeas } from "../../../lib/content";
import { NextSeo } from "next-seo";

interface PageProps {
  ideas: Idea[];
}

export default function Ideas({ ideas }: PageProps) {
  const byYear: { [key: string]: Idea[] } = {};
  
  ideas.forEach(idea => {
    const year = idea.date ? new Date(idea.date).getFullYear().toString() : 'Undated';
    if (!byYear[year]) {
      byYear[year] = [];
    }
    byYear[year].push(idea);
  });

  const years = Object.keys(byYear).sort((a, b) => {
    if (a === 'Undated') return 1;
    if (b === 'Undated') return -1;
    return parseInt(b) - parseInt(a);
  });

  return (
    <>
      <NextSeo
        title="Idea Diary | Imamatdin"
        description="Reflections on ideas and how I came to learn about them"
      />
      
      <Container maxW="4xl" py={12}>
        <Heading size="2xl" mb={2}>Idea Diary</Heading>
        <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }} mb={12}>
          Reflections on ideas I&apos;ve had and how I came to realize and learn about them.
        </Text>

        <VStack spacing={10} align="stretch">
          {years.map(year => (
            <Box key={year}>
              <Heading size="md" mb={4} color="gray.500" _dark={{ color: "gray.400" }}>
                {year}
              </Heading>
              <VStack spacing={3} align="stretch">
                {byYear[year].map((idea) => {
                  const date = idea.date ? new Date(idea.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
                  
                  return (
                    <HStack key={idea.slug} justify="space-between" align="center">
                      <NextLink href={`/about/ideas/${idea.slug}`}>
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                          color="red.600"
                          _dark={{ color: "red.400" }}
                          cursor="pointer"
                          transition="opacity 0.2s"
                          style={{ opacity: 1 }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          {idea.title}
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

        {ideas.length === 0 && (
          <Text color="gray.500">No ideas added yet.</Text>
        )}
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const allIdeas = getAllIdeas();
  
  const ideas = allIdeas.map((idea) => ({
    slug: idea.slug,
    title: idea.title,
    date: idea.date,
    tags: idea.tags,
    content: null,
  }));
  
  return {
    props: {
      ideas,
    },
  };
};