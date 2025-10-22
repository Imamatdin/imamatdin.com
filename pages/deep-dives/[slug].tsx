// FILE: pages/deep-dives/[slug].tsx

import {
  VStack,
  Heading,
  Text,
  Divider,
  Link,
  Tag,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';
import { deepDives, DeepDive } from '../../lib/deep-dives'; // Import data

interface PageProps {
  dive: DeepDive;
}

const DeepDiveDetailPage = ({ dive }: PageProps) => {
  // If the page is not yet generated, this will be displayed
  // initially until static generation finishes
  if (!dive) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <NextSeo
        title={`${dive.title} | Deep Dives`}
        description={dive.question}
      />
      <VStack spacing={4} w="full" align="flex-start">
        <Heading as="h1" size="xl">
          {dive.title}
        </Heading>

        <Tag size="lg" colorScheme={dive.status === 'In Progress' ? 'green' : 'gray'}>
          Status: {dive.status}
        </Tag>

        <Divider pt={4} />

        <Heading as="h2" size="lg" pt={2}>
          The Premise
        </Heading>
        <Text>{dive.premise}</Text>

        <Heading as="h2" size="lg" pt={4}>
          The 2-Month Project
        </Heading>
        <Text>{dive.project}</Text>
        
        <Divider pt={4} />

        <Link as={NextLink} href="/deep-dives" color="blue.500" pt={4}>
          ← Back to all Deep Dives
        </Link>
      </VStack>
    </>
  );
};

// This function tells Next.js which paths to pre-render
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = deepDives.map((dive) => ({
    params: { slug: dive.slug },
  }));

  return { paths, fallback: false }; // fallback: false means pages not found will be 404
};

// This function gets the data for one specific dive
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const dive = deepDives.find((d) => d.slug === params?.slug);
  return { props: { dive } };
};

export default DeepDiveDetailPage;