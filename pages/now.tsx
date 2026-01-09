import { Container, Heading, Text, VStack, Box, useColorModeValue } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

export default function Now() {
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.3)', 'rgba(168, 144, 96, 0.3)');

  return (
    <>
      <NextSeo
        title="Now | Imamatdin"
        description="What I'm working on right now"
      />

      <Container maxW="650px" py={12}>
        <Heading
          fontFamily="heading"
          fontSize="3xl"
          color={inkColor}
          mb={2}
        >
          Now
        </Heading>

        <Text fontFamily="handwriting" fontSize="sm" color={inkLight} mb={8}>
          Last updated: December 17, 2025
        </Text>

        <VStack align="stretch" spacing={8}>
          <Text fontFamily="body" fontSize="md" lineHeight="tall" color={inkColor}>
            I'm in crunch mode. University applications are due in January, and I'm
            simultaneously building, researching, and writing at full speed.
          </Text>

          {/* Current Focus */}
          <VStack align="stretch" spacing={4}>
            <Text fontFamily="handwriting" fontSize="xl" color={inkColor}>
              Current Focus
            </Text>

            <VStack align="stretch" spacing={3}>
              <Box>
                <Text fontFamily="body" fontWeight="bold" fontSize="md" mb={1} color={inkColor}>
                  University Applications
                </Text>
                <Text fontFamily="body" fontSize="md" color={inkLight}>
                  Stanford, Harvard, Princeton, UPenn, and 7 others. 30 essays total, grinding through them.
                </Text>
              </Box>

              <Box>
                <Text fontFamily="body" fontWeight="bold" fontSize="md" mb={1} color={inkColor}>
                  ARCT Research
                </Text>
                <Text fontFamily="body" fontSize="md" color={inkLight}>
                  Proof-of-concept simulation for my Adaptive Radiative Cooling Tiles research.
                </Text>
              </Box>

              <Box>
                <Text fontFamily="body" fontWeight="bold" fontSize="md" mb={1} color={inkColor}>
                  Agora Library
                </Text>
                <Text fontFamily="body" fontSize="md" color={inkLight}>
                  Building a Telegram bot library system for knowledge sharing.
                </Text>
              </Box>
            </VStack>
          </VStack>

          {/* Reading */}
          <VStack align="stretch" spacing={2}>
            <Text fontFamily="handwriting" fontSize="xl" color={inkColor}>
              Currently Reading
            </Text>
            <Text fontFamily="body" fontSize="md" lineHeight="tall" color={inkColor}>
              Working through Russian literature and philosophy — Dostoevsky,
              Nietzsche, Camus. Trying to maintain intellectual routine despite deadline chaos.
            </Text>
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
