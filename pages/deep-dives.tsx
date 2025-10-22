import { VStack, Heading, Text, Divider, Link, Container } from '@chakra-ui/react';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';
import { DeepDive, getDeepDives } from '../lib/deep-dives';

interface PageProps {
  dives: DeepDive[];
}

const DeepDivesListPage = ({ dives }: PageProps) => {
  return (
    <>
      <NextSeo 
        title="Deep Dives | Imamatdin" 
        description="A collection of independent research project proposals." 
      />
      <Container maxW="4xl" py={12}>
        <VStack spacing={8} w="full" align="flex-start">
          <VStack spacing={3} align="flex-start">
            <Heading as="h1" size="xl">Deep Dives</Heading>
            <Text>
              A collection of independent research projects. Click on any title to see the full proposal.
            </Text>
          </VStack>

          <VStack spacing={6} w="full" align="flex-start">
            {dives.map((dive) => (
              <VStack key={dive.slug} w="full" align="flex-start" spacing={2}>
                <Divider />
                <NextLink href={`/deep-dives/${dive.slug}`} passHref legacyBehavior>
                  <Link pt={4} _hover={{ opacity: 0.8 }}>
                    <Heading as="h2" size="lg">{dive.title}</Heading>
                  </Link>
                </NextLink>
                <Text color="gray.600" _dark={{ color: "gray.400" }}>
                  {dive.question}
                </Text>
              </VStack>
            ))}
          </VStack>
        </VStack>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const dives = getDeepDives();
  
  return {
    props: {
      dives,
    },
  };
};

export default DeepDivesListPage;