import { GetStaticPaths, GetStaticProps } from 'next';
import { Container, Heading, Text, VStack, Box } from '@chakra-ui/react';
import { getAllPoems, getPoemBySlug, Poem } from "../../../lib/poetry";
import { NextSeo } from 'next-seo';

interface PoemPageProps {
  poem: Poem;
}

export default function PoemPage({ poem }: PoemPageProps) {
  return (
    <>
      <NextSeo
        title={`${poem.title} | Poetry`}
        description={`My reflections on ${poem.title} by ${poem.author}`}
      />
      
      <Container maxW="3xl" py={16}>
        <VStack align="stretch" spacing={8}>
          <VStack align="flex-start" spacing={4}>
            <Heading fontSize="4xl" fontWeight="bold" lineHeight="1.2">
              {poem.title}
            </Heading>
            
            <Text fontSize="xl" color="gray.600" _dark={{ color: "gray.400" }}>
              by {poem.author}
            </Text>

            {poem.date && (
              <Text fontSize="sm" color="gray.500">
                Encountered in {new Date(poem.date).toLocaleDateString('en-US', { 
                  month: 'long', 
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
              dangerouslySetInnerHTML={{ __html: poem.content || 'No content available.' }}
            />
          </Box>
        </VStack>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const poems = getAllPoems();
  
  const paths = poems.map((poem) => ({
    params: { slug: poem.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PoemPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const poem = getPoemBySlug(slug);

  if (!poem) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      poem,
    },
  };
};