import {
  VStack,
  Heading,
  Text,
  Container,
  Box,
} from '@chakra-ui/react';
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

      <Container maxW="650px" py={4}>
        <Heading
          fontFamily="mono"
          fontSize="xl"
          color="text"
          mb={2}
        >
          Deep Dives
        </Heading>

        <Text
          fontFamily="mono"
          fontSize="14px"
          color="subtle"
          mb={6}
        >
          Independent research proposals exploring the intersection of history, engineering, and cognition.
        </Text>

        <VStack align="stretch" spacing={4}>
          {dives.map((dive) => (
            <NextLink href={`/deep-dives/${dive.slug}`} key={dive.slug}>
              <Box
                py={3}
                borderBottom="1px solid"
                borderColor="border"
                cursor="pointer"
                transition="opacity 0.2s"
                _hover={{ opacity: 0.7 }}
              >
                <Text
                  fontFamily="mono"
                  fontSize="14px"
                  fontWeight="bold"
                  color="text"
                  mb={1}
                >
                  {dive.title} [{dive.status}]
                </Text>
                <Text
                  fontFamily="mono"
                  fontSize="14px"
                  color="subtle"
                >
                  {dive.question}
                </Text>
              </Box>
            </NextLink>
          ))}
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
