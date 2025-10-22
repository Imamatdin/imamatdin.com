import { VStack, Heading, Text, Divider, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { DeepDive, getDeepDives } from 'lib/deep-dives';

interface PageProps {
  dives: DeepDive[];
}

const DeepDivesListPage = ({ dives }: PageProps) => {
  return (
    <>
      <NextSeo title="Deep Dives | Your Name" description="A collection of independent research project proposals." />
      <VStack spacing={8} w="full" align="flex-start">
        <VStack spacing={3} align="flex-start">
          <Heading as="h1" size="xl">Deep Dives</Heading>
          <Text>A collection of independent research projects. Click on any title to see the full proposal.</Text>
        </VStack>

        <VStack spacing={6} w="full" align="flex-start">
          {dives.map((dive) => (
            <VStack key={dive.slug} w="full" align="flex-start" spacing={2}>
              <Divider />
              <Link as={NextLink} href={`/deep-dives/${dive.slug}`} pt={4}>
                <Heading as="h2" size="lg">{dive.title}</Heading>
              </Link>
              <Text color="gray.600">{dive.description}</Text>
            </VStack>
          ))}
        </VStack>
      </VStack>
    </>
  );
};

export async function getStaticProps() {
  const dives = getDeepDives();
  return { props: { dives } };
}

export default DeepDivesListPage;