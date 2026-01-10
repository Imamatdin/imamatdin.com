import { Container, Heading, Text, VStack, Box, useColorModeValue } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

export default function Now() {
  const textColor = useColorModeValue('#1a1a1a', '#e0e0e0');
  const subtleColor = useColorModeValue('#666666', '#999999');

  return (
    <>
      <NextSeo
        title="Now | Imamatdin"
        description="What I'm working on right now"
      />

      <Container maxW="650px" py={8}>
        <Heading
          fontFamily="mono"
          fontSize="xl"
          color={textColor}
          mb={2}
        >
          Now
        </Heading>

        <Text fontFamily="mono" fontSize="12px" color={subtleColor} mb={6}>
          Last updated: December 17, 2025
        </Text>

        <VStack align="stretch" spacing={6}>
          <Text fontFamily="mono" fontSize="14px" lineHeight="1.8" color={textColor}>
            I'm in crunch mode. University applications are due in January, and I'm
            simultaneously building, researching, and writing at full speed.
          </Text>

          {/* Current Focus */}
          <VStack align="stretch" spacing={4}>
            <Text fontFamily="mono" fontSize="md" fontWeight="bold" color={textColor}>
              Current Focus
            </Text>

            <VStack align="stretch" spacing={3}>
              <Box>
                <Text fontFamily="mono" fontWeight="bold" fontSize="14px" mb={1} color={textColor}>
                  University Applications
                </Text>
                <Text fontFamily="mono" fontSize="14px" color={subtleColor}>
                  Stanford, Harvard, Princeton, UPenn, and 7 others. 30 essays total, grinding through them.
                </Text>
              </Box>

              <Box>
                <Text fontFamily="mono" fontWeight="bold" fontSize="14px" mb={1} color={textColor}>
                  ARCT Research
                </Text>
                <Text fontFamily="mono" fontSize="14px" color={subtleColor}>
                  Proof-of-concept simulation for my Adaptive Radiative Cooling Tiles research.
                </Text>
              </Box>

              <Box>
                <Text fontFamily="mono" fontWeight="bold" fontSize="14px" mb={1} color={textColor}>
                  Agora Library
                </Text>
                <Text fontFamily="mono" fontSize="14px" color={subtleColor}>
                  Building a Telegram bot library system for knowledge sharing.
                </Text>
              </Box>
            </VStack>
          </VStack>

          {/* Reading */}
          <VStack align="stretch" spacing={2}>
            <Text fontFamily="mono" fontSize="md" fontWeight="bold" color={textColor}>
              Currently Reading
            </Text>
            <Text fontFamily="mono" fontSize="14px" lineHeight="1.8" color={textColor}>
              Working through Russian literature and philosophy — Dostoevsky,
              Nietzsche, Camus. Trying to maintain intellectual routine despite deadline chaos.
            </Text>
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
