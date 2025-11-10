import { GetStaticPaths, GetStaticProps } from 'next';
import { Container, Heading, Text, VStack, Box, Badge } from '@chakra-ui/react';
import { getAllAcademics, getAcademicBySlug, Academic } from "../../../lib/academics";
import { NextSeo } from 'next-seo';

interface AcademicPageProps {
  academic: Academic;
}

export default function AcademicPage({ academic }: AcademicPageProps) {
  return (
    <>
      <NextSeo
        title={`${academic.name} | Academics`}
        description={`About ${academic.name} and their influence on my path`}
      />
      
      <Container maxW="3xl" py={16}>
        <VStack align="stretch" spacing={8}>
          <VStack align="flex-start" spacing={4}>
            <Heading fontSize="4xl" fontWeight="bold" lineHeight="1.2">
              {academic.name}
            </Heading>
            
            {academic.field && (
              <Text fontSize="xl" color="gray.600" _dark={{ color: "gray.400" }}>
                {academic.field}
              </Text>
            )}

            {academic.category && (
              <Badge colorScheme="blue" fontSize="sm">
                {academic.category === 'forgotten-scientist' ? 'Forgotten Scientist' : 
                 academic.category === 'professor' ? 'Professor' : 'Academic Influence'}
              </Badge>
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
              dangerouslySetInnerHTML={{ __html: academic.content || 'No content available.' }}
            />
          </Box>
        </VStack>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const academics = getAllAcademics();
  
  const paths = academics.map((academic) => ({
    params: { slug: academic.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<AcademicPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const academic = getAcademicBySlug(slug);

  if (!academic) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      academic: {
        slug: academic.slug,
        name: academic.name,
        field: academic.field || null,
        category: academic.category || null,
        date: academic.date || null,
        content: academic.content || null,
      },
    },
  };
};