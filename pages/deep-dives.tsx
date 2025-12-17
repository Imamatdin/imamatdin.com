import {
  VStack,
  Heading,
  Text,
  Container,
  Box,
  HStack,
  useColorModeValue,
  Badge,
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
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.3)', 'rgba(168, 144, 96, 0.3)');

  return (
    <>
      <NextSeo
        title="Deep Dives | Imamatdin"
        description="A collection of independent research project proposals."
      />

      <Container maxW="container.lg" px={{ base: 4, md: 8, lg: 12 }}>
        <Box w="100%" maxW={{ base: "100%", md: "700px", lg: "800px" }} mx="auto">
        <Heading
          as="h1"
          fontFamily="handwriting"
          fontSize={{ base: '2xl', md: '3xl' }}
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
                <HStack justify="space-between" align="flex-start" mb={1}>
                  <Text
                    fontFamily="body"
                    fontSize="lg"
                    fontWeight="medium"
                    color={inkColor}
                  >
                    {dive.title}
                  </Text>
                  <Badge
                    bg="transparent"
                    color={inkLight}
                    fontFamily="handwriting"
                    fontSize="xs"
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="none"
                    textTransform="lowercase"
                    flexShrink={0}
                  >
                    {dive.status}
                  </Badge>
                </HStack>
                <Text
                  fontFamily="body"
                  fontSize="sm"
                  color={inkLight}
                >
                  {dive.question}
                </Text>
              </Box>
            </NextLink>
          ))}
        </VStack>
        </Box>
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
