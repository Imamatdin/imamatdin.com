import { GetStaticProps } from "next";
import { Container, Heading, Text, VStack, Box } from "@chakra-ui/react";
import NextLink from "next/link";
import { Academic, getAllAcademics } from "../../../lib/academics";
import { NextSeo } from "next-seo";

interface PageProps {
  academics: Academic[];
}

export default function Academics({ academics }: PageProps) {
  const byCategory: { [key: string]: Academic[] } = {
    'professor': [],
    'forgotten-scientist': [],
    'influence': [],
    'other': []
  };
  
  academics.forEach(academic => {
    const category = academic.category || 'other';
    byCategory[category].push(academic);
  });

  const categoryTitles: { [key: string]: string } = {
    'professor': 'Professors Who Shaped My Path',
    'forgotten-scientist': 'Forgotten Scientists',
    'influence': 'Academic Influences',
    'other': 'Others'
  };

  return (
    <>
      <NextSeo
        title="Academic Influences | Imamatdin"
        description="Professors and forgotten scientists who shaped my academic path"
      />
      
      <Container maxW="4xl" py={12}>
        <Heading size="2xl" mb={2}>Academic Influences</Heading>
        <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }} mb={12}>
          People who have greatly contributed to society but didn&apos;t get the recognition they deserved, 
          and professors who shaped my academic journey.
        </Text>

        <VStack spacing={10} align="stretch">
          {Object.keys(byCategory).map(category => {
            if (byCategory[category].length === 0) return null;
            
            return (
              <Box key={category}>
                <Heading size="md" mb={4} color="gray.500" _dark={{ color: "gray.400" }}>
                  {categoryTitles[category]}
                </Heading>
                <VStack spacing={3} align="stretch">
                  {byCategory[category].map((academic) => {
                    return (
                      <Box 
                        key={academic.slug}
                        p={4}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                        _dark={{ borderColor: "gray.700" }}
                        transition="all 0.2s"
                      >
                        <NextLink href={`/about/academics/${academic.slug}`}>
                          <Text
                            fontSize="lg"
                            fontWeight="medium"
                            color="red.600"
                            _dark={{ color: "red.400" }}
                            cursor="pointer"
                            transition="opacity 0.2s"
                            mb={1}
                            style={{ opacity: 1 }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            {academic.name}
                          </Text>
                        </NextLink>
                        {academic.field && (
                          <Text fontSize="sm" color="gray.500">
                            {academic.field}
                          </Text>
                        )}
                      </Box>
                    );
                  })}
                </VStack>
              </Box>
            );
          })}
        </VStack>

        {academics.length === 0 && (
          <Text color="gray.500">No academic influences added yet.</Text>
        )}
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const allAcademics = getAllAcademics();
  
  const academics = allAcademics.map(({ content, ...academic }) => academic);
  
  return {
    props: {
      academics,
    },
  };
};