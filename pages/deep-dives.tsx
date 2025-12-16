import {
  VStack,
  Heading,
  Text,
  Container,
  Box,
  HStack,
  Grid,
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
  const bgColor = useColorModeValue('#f5f0e8', '#1a1612');
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.2)', 'rgba(168, 144, 96, 0.15)');
  const bindingGradient = useColorModeValue(
    'linear(to-r, #8b7355, #a89060, transparent)',
    'linear(to-r, #3a2a1a, #5a4a3a, transparent)'
  );

  return (
    <>
      <NextSeo
        title="Deep Dives | Imamatdin"
        description="A collection of independent research project proposals."
      />

      <Box
        minH="100vh"
        bg={bgColor}
        position="relative"
        className="parchment-bg"
      >
        {/* Notebook binding effect */}
        <Box
          position="fixed"
          left={0}
          top={0}
          bottom={0}
          w="20px"
          bgGradient={bindingGradient}
          boxShadow="inset -2px 0 4px rgba(0,0,0,0.2)"
          zIndex={10}
          display={{ base: 'none', lg: 'block' }}
        />

        <Container maxW="1200px" py={12}>
          <Grid
            templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
            gap={0}
            minH="80vh"
          >
            {/* Left page - Index */}
            <Box
              p={{ base: 6, md: 12 }}
              borderRight={{ lg: '1px solid' }}
              borderColor={borderColor}
              position="relative"
            >
              <Text
                fontFamily="handwriting"
                fontSize="sm"
                color={inkLight}
                position="absolute"
                top={4}
                right={4}
                transform="rotate(-5deg)"
              >
                Index of Studies
              </Text>

              <Heading
                as="h1"
                fontFamily="handwriting"
                fontSize={{ base: '3xl', md: '4xl' }}
                color={inkColor}
                mb={2}
                transform="rotate(-1deg)"
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

              {/* List of deep dives */}
              <VStack align="stretch" spacing={6} mt={8}>
                {dives.map((dive, i) => (
                  <NextLink href={`/deep-dives/${dive.slug}`} key={dive.slug}>
                    <Box
                      p={4}
                      border="1px dashed"
                      borderColor={borderColor}
                      transition="all 0.3s"
                      cursor="pointer"
                      _hover={{
                        borderStyle: 'solid',
                        boxShadow: '4px 4px 0 rgba(139, 90, 43, 0.1)',
                        transform: 'translate(-2px, -2px)',
                      }}
                    >
                      <HStack justify="space-between" align="flex-start">
                        <VStack align="flex-start" spacing={1}>
                          <Text
                            fontFamily="body"
                            fontSize="lg"
                            fontWeight="medium"
                            color={inkColor}
                          >
                            {dive.title}
                          </Text>
                          <Text
                            fontFamily="body"
                            fontSize="sm"
                            color={inkLight}
                            noOfLines={2}
                          >
                            {dive.question}
                          </Text>
                        </VStack>
                        <VStack align="flex-end" spacing={1}>
                          <Text
                            fontFamily="handwriting"
                            fontSize="sm"
                            color={inkLight}
                          >
                            pg. {i + 1}
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
                          >
                            {dive.status}
                          </Badge>
                        </VStack>
                      </HStack>
                    </Box>
                  </NextLink>
                ))}
              </VStack>
            </Box>

            {/* Right page - Featured annotation */}
            <Box
              p={{ base: 6, md: 12 }}
              position="relative"
              display={{ base: 'none', lg: 'block' }}
            >
              <Text
                fontFamily="handwriting"
                fontSize="xl"
                color={inkLight}
                position="absolute"
                top="20%"
                right="10%"
                transform="rotate(3deg)"
                maxW="200px"
                textAlign="center"
              >
                "The noblest pleasure is the joy of understanding."
              </Text>

              <Text
                fontFamily="handwriting"
                fontSize="sm"
                color={inkLight}
                position="absolute"
                top="35%"
                right="15%"
                transform="rotate(-2deg)"
              >
                - Leonardo da Vinci
              </Text>

              {/* Decorative sketch placeholder */}
              <Box
                position="absolute"
                bottom="20%"
                left="50%"
                transform="translateX(-50%)"
                w="200px"
                h="200px"
                border="1px dashed"
                borderColor={borderColor}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  fontFamily="handwriting"
                  fontSize="sm"
                  color={inkLight}
                  textAlign="center"
                >
                  [technical sketch]
                </Text>
              </Box>

              <Text
                fontFamily="handwriting"
                fontSize="xs"
                color={inkLight}
                position="absolute"
                bottom="10%"
                right="10%"
              >
                fig. i
              </Text>
            </Box>
          </Grid>

          {/* Page number */}
          <Text
            position="fixed"
            bottom={4}
            right={8}
            fontFamily="handwriting"
            fontSize="sm"
            color={inkLight}
            zIndex={10}
          >
            folio i
          </Text>
        </Container>
      </Box>
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
