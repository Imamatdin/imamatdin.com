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
  const cardBg = useColorModeValue('rgba(139, 90, 43, 0.03)', 'rgba(139, 90, 43, 0.08)');

  return (
    <>
      <NextSeo
        title="Deep Dives | Imamatdin"
        description="A collection of independent research project proposals."
      />

      <Container maxW="container.lg" px={{ base: 4, md: 8, lg: 12 }}>
        <Box w="100%" maxW={{ base: "100%", md: "800px", lg: "900px" }} mx="auto">
          {/* Header */}
          <Box mb={10}>
            <Heading
              as="h1"
              fontFamily="heading"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="600"
              color={inkColor}
              mb={2}
            >
              Deep Dives
            </Heading>
            <Text fontFamily="body" fontSize="md" color={inkLight}>
              Independent research proposals exploring the intersection of history, engineering, and cognition.
            </Text>
          </Box>

          {/* Research Cards */}
          <VStack align="stretch" spacing={6}>
            {dives.map((dive, index) => (
              <NextLink href={`/deep-dives/${dive.slug}`} key={dive.slug}>
                <Box
                  p={{ base: 4, md: 6 }}
                  bg={cardBg}
                  border="1px solid"
                  borderColor={borderColor}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    borderColor: inkLight,
                    transform: 'translateX(4px)'
                  }}
                  position="relative"
                >
                  {/* Index number */}
                  <Text
                    position="absolute"
                    top={2}
                    right={3}
                    fontFamily="handwriting"
                    fontSize="sm"
                    color={inkLight}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Text>

                  {/* Category */}
                  <Text
                    fontFamily="handwriting"
                    fontSize="xs"
                    color={inkLight}
                    textTransform="uppercase"
                    letterSpacing="wider"
                    mb={2}
                  >
                    {dive.category}
                  </Text>

                  {/* Title */}
                  <Heading
                    as="h2"
                    fontFamily="heading"
                    fontSize={{ base: 'lg', md: 'xl' }}
                    fontWeight="500"
                    color={inkColor}
                    mb={2}
                    pr={8}
                  >
                    {dive.title}
                  </Heading>

                  {/* Question */}
                  <Text
                    fontFamily="body"
                    fontSize="sm"
                    color={inkLight}
                    fontStyle="italic"
                    mb={3}
                  >
                    "{dive.question}"
                  </Text>

                  {/* Footer */}
                  <HStack justify="space-between" align="center">
                    <Badge
                      bg="transparent"
                      color={inkLight}
                      fontFamily="handwriting"
                      fontSize="xs"
                      border="1px dashed"
                      borderColor={borderColor}
                      borderRadius="none"
                      px={2}
                      textTransform="lowercase"
                    >
                      {dive.status}
                    </Badge>
                    <Text
                      fontFamily="handwriting"
                      fontSize="xs"
                      color={inkLight}
                    >
                      read more →
                    </Text>
                  </HStack>
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
