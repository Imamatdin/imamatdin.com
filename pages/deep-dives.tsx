import {
  VStack,
  Heading,
  Text,
  Container,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';
import { DeepDive, getDeepDives } from '../lib/deep-dives';

interface PageProps {
  dives: DeepDive[];
}

const DeepDivesListPage = ({ dives }: PageProps) => {
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.2)', 'rgba(168, 144, 96, 0.15)');

  return (
    <>
      <NextSeo
        title="Deep Dives | Imamatdin"
        description="A collection of independent research project proposals."
      />

      <Container maxW="650px" py={12}>
        <Heading
          fontFamily="heading"
          fontSize="3xl"
          color={inkColor}
          mb={2}
        >
          Deep Dives
        </Heading>

        <Text
          fontFamily="body"
          fontSize="md"
          color={inkLight}
          mb={8}
        >
          Independent research proposals exploring the intersection of history, engineering, and cognition.
        </Text>

        <VStack align="stretch" spacing={6}>
          {dives.map((dive) => (
            <NextLink href={`/deep-dives/${dive.slug}`} key={dive.slug}>
              <Box
                py={4}
                borderBottom="1px dashed"
                borderColor={borderColor}
                cursor="pointer"
                transition="opacity 0.2s"
                _hover={{ opacity: 0.7 }}
              >
                <Text
                  fontFamily="body"
                  fontSize="lg"
                  fontWeight="bold"
                  color={inkColor}
                  mb={1}
                >
                  {dive.title} ({dive.status})
                </Text>
                <Text
                  fontFamily="body"
                  fontSize="md"
                  color={inkLight}
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
