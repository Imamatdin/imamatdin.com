import { Container, Heading, Text, VStack, Box, Link } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

export default function Now() {
  return (
    <>
      <NextSeo
        title="Now | Imamatdin"
        description="What I'm working on right now"
      />

      <Container maxW="650px" py={4}>
        <Heading
          fontFamily="mono"
          fontSize="xl"
          color="text"
          mb={2}
        >
          Now
        </Heading>

        <Text fontFamily="mono" fontSize="12px" color="subtle" mb={6}>
          Last updated: February 2026
        </Text>

        <VStack align="stretch" spacing={8}>

          {/* Building */}
          <VStack align="stretch" spacing={4}>
            <Text fontFamily="mono" fontSize="md" fontWeight="bold" color="text">
              Building:
            </Text>

            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontFamily="mono" fontWeight="bold" fontSize="14px" mb={1} color="text">
                  SENTINEL
                </Text>
                <Text fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.8">
                  Tier 4 (FastAPI + WebSocket backend) in development. Red team and blue team
                  AI agents attack and defend web applications in real-time. Cerebras inference at
                  1000-1700 tok/s. Shipping this month.
                </Text>
                <Link
                  href="https://github.com/Imamatdin/sentinel"
                  isExternal
                  fontFamily="mono"
                  fontSize="12px"
                  color="accent"
                >
                  github.com/Imamatdin/sentinel
                </Link>
              </Box>

              <Box>
                <Text fontFamily="mono" fontWeight="bold" fontSize="14px" mb={1} color="text">
                  Aral Basin Environmental Platform
                </Text>
                <Text fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.8">
                  Fine-tuning Prithvi-EO-2.0 (NASA/IBM's 600M param geospatial foundation model)
                  for Aral Sea monitoring. Building dust storm prediction, irrigation optimization
                  (deep RL), crop yield forecasting, salinity mapping. Processing Sentinel-1/2,
                  MODIS, VIIRS, Landsat, GRACE-FO, ERA5, MERRA-2, Uzhydromet records.
                  Targeting real users in Karakalpakstan by mid-2026.
                </Text>
              </Box>

              <Box>
                <Text fontFamily="mono" fontWeight="bold" fontSize="14px" mb={1} color="text">
                  Datacenter cooling expansion
                </Text>
                <Text fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.8">
                  Decision Transformers and Dreamer-style world models on EnergyBench
                  (1.2 billion observations). No published work exists using modern sequence
                  models for datacenter HVAC. Extends my prior multi-climate DDPG research
                  (94.4% water savings).
                </Text>
              </Box>

              <Box>
                <Text fontFamily="mono" fontWeight="bold" fontSize="14px" mb={1} color="text">
                  Agentic OS
                </Text>
                <Text fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.8">
                  Building a custom Linux workstation on Arch + Hyprland with AI tools
                  wired directly into the desktop workflow. Cursor, Claude Code, Obsidian, custom
                  automation scripts - all integrated. Designed for deep locked-in engineering
                  sessions. Ready to ship but blocked on hardware/compute.
                </Text>
              </Box>

              <Box>
                <Text fontFamily="mono" fontWeight="bold" fontSize="14px" mb={1} color="text">
                  AI automation client work (proprietary)
                </Text>
                <Text fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.8">
                  CRM pipelines, workflow automation, AI-assisted document drafting for a
                  Canadian consulting firm.
                </Text>
              </Box>
            </VStack>
          </VStack>

          {/* Learning */}
          <VStack align="stretch" spacing={2}>
            <Text fontFamily="mono" fontSize="md" fontWeight="bold" color="text">
              Learning:
            </Text>
            <Text fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.8">
              Self-studying Stanford's first-year mechanical engineering curriculum
              (Math 51-53, Physics 41/43, core ME courses).
            </Text>
          </VStack>

          {/* Reading */}
          <VStack align="stretch" spacing={2}>
            <Text fontFamily="mono" fontSize="md" fontWeight="bold" color="text">
              Reading:
            </Text>
            <Box as="ul" pl={4} listStyleType="disc">
              <Text as="li" fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.8">
                Pieces of the Action - Vannevar Bush
              </Text>
              <Text as="li" fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.8">
                Advice for a Young Investigator - Santiago Ramon y Cajal
              </Text>
              <Text as="li" fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.8">
                Poor Charlie's Almanack - Charlie Munger
              </Text>
            </Box>
          </VStack>

          {/* Looking for */}
          <VStack align="stretch" spacing={2}>
            <Text fontFamily="mono" fontSize="md" fontWeight="bold" color="text">
              Looking for:
            </Text>
            <Box as="ul" pl={4} listStyleType="disc">
              <Text as="li" fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.8">
                Compute credits (GPU time for foundation model fine-tuning and RL training)
              </Text>
              <Text as="li" fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.8">
                Research funding for the Aral Basin platform
              </Text>
              <Text as="li" fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.8">
                Collaborators with satellite data or Central Asian environmental expertise
              </Text>
              <Text as="li" fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.8">
                A proper laptop to deploy the agentic OS on
              </Text>
            </Box>
          </VStack>

        </VStack>
      </Container>
    </>
  );
}
