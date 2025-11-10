import { GetStaticPaths, GetStaticProps } from 'next';
import { Container, Heading, Text, VStack, Box } from '@chakra-ui/react';
import { getAllIdeas, getIdeaBySlug, Idea } from "../../../lib/ideas";
import { NextSeo } from 'next-seo';

interface IdeaPageProps {
  idea: Idea;
}

export default function IdeaPage({ idea }: IdeaPageProps) {
  return (
    <>
      <NextSeo
        title={`${idea.title} | Ideas`}
        description={`My reflections on ${idea.title}`}
      />
      
      <Container maxW="3xl" py={16}>
        <VStack align="stretch" spacing={8}>
          <VStack align="flex-start" spacing={4}>
            <Heading fontSize="4xl" fontWeight="bold" lineHeight="1.2">
              {idea.title}
            </Heading>

            {idea.date && (
              <Text fontSize="sm" color="gray.500">
                {new Date(idea.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric' 
                })}
              </Text>
            )}
          </VStack>

          <Box 
            height="1px" 
            bg="gray.200" 
            _dark={{ bg: "gray.700" }}
            my={4}
          />

          <Box>
            <Text 
              fontSize="md" 
              lineHeight="1.7" 
              whiteSpace="pre-wrap"
              dangerouslySetInnerHTML={{ __html: idea.content || 'No content available.' }}
            />
          </Box>
        </VStack>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ideas = getAllIdeas();
  
  const paths = ideas.map((idea) => ({
    params: { slug: idea.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<IdeaPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const idea = getIdeaBySlug(slug);

  if (!idea) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      idea,
    },
  };
};