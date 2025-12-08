import { Container, Heading, Text, VStack, Box, HStack, Badge } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

export default function Now() {
  return (
    <>
      <NextSeo
        title="Now | Imamatdin"
        description="What I'm working on right now"
      />
      
      <Container maxW="2xl" py={12}>
        <VStack align="stretch" spacing={8}>
          <Box>
            <Heading size="2xl" mb={2}>Now</Heading>
            <Text fontSize="md" color="gray.600" _dark={{ color: "gray.400" }}>
              Last updated: December 8, 2025
            </Text>
          </Box>

          <Text fontSize="lg" lineHeight="tall">
            I'm in crunch mode. University applications are due in January, and I'm 
            simultaneously building, researching, and writing at full speed.
          </Text>

          {/* Current Focus Section */}
          <Box>
            <Heading size="lg" mb={4}>Current Focus</Heading>
            <VStack align="stretch" spacing={4}>
              
              {/* Deadline Item 1 */}
              <Box 
                p={4} 
                borderLeft="3px solid" 
                borderColor="orange.500"
                bg="orange.50"
                _dark={{ bg: "gray.800", borderColor: "orange.400" }}
              >
                <HStack mb={2}>
                  <Badge colorScheme="red" fontSize="xs">DUE TONIGHT</Badge>
                  <Text fontSize="sm" fontWeight="bold" color="red.600" _dark={{ color: "red.400" }}>
                    December 13, 2025
                  </Text>
                </HStack>
                <Text fontWeight="bold" fontSize="lg" mb={1}>
                  AI & Environment Project
                </Text>
                <Text fontSize="md">
                  Creating an AI-generated video/short film on the environmental effects 
                  of overusing AI. The irony isn't lost on me.
                </Text>
              </Box>

              {/* Deadline Item 2 */}
              <Box 
                p={4} 
                borderLeft="3px solid" 
                borderColor="orange.500"
                bg="orange.50"
                _dark={{ bg: "gray.800", borderColor: "orange.400" }}
              >
                <HStack mb={2}>
                  <Badge colorScheme="red" fontSize="xs">DUE TONIGHT</Badge>
                  <Text fontSize="sm" fontWeight="bold" color="red.600" _dark={{ color: "red.400" }}>
                    December 13, 2025
                  </Text>
                </HStack>
                <Text fontWeight="bold" fontSize="lg" mb={1}>
                  Deep Analysis Article
                </Text>
                <Text fontSize="md">
                  Not a quick Medium piece—this is a full problem analysis with a real, 
                  actionable solution proposal.
                </Text>
              </Box>

              {/* Deadline Item 3 */}
              <Box 
                p={4} 
                borderLeft="3px solid" 
                borderColor="orange.500"
                bg="orange.50"
                _dark={{ bg: "gray.800", borderColor: "orange.400" }}
              >
                <HStack mb={2}>
                  <Badge colorScheme="red" fontSize="xs">DUE TONIGHT</Badge>
                  <Text fontSize="sm" fontWeight="bold" color="red.600" _dark={{ color: "red.400" }}>
                    December 13, 2025
                  </Text>
                </HStack>
                <Text fontWeight="bold" fontSize="lg" mb={1}>
                  Personal Statement
                </Text>
                <Text fontSize="md">
                  The essay that ties everything together for my university applications.
                </Text>
              </Box>

              {/* Deadline Item 4 */}
              <Box 
                p={4} 
                borderLeft="3px solid" 
                borderColor="orange.500"
              >
                <HStack mb={2}>
                  <Badge colorScheme="orange" fontSize="xs">URGENT</Badge>
                  <Text fontSize="sm" fontWeight="bold">
                    December 13, 2025
                  </Text>
                </HStack>
                <Text fontWeight="bold" fontSize="lg" mb={1}>
                  ARCT Research Simulation
                </Text>
                <Text fontSize="md">
                  Proof-of-concept simulation for my Adaptive Radiative Cooling Tiles research. 
                  Can't submit completed work without starting today.
                </Text>
              </Box>

            </VStack>
          </Box>

          {/* Ongoing Work */}
          <Box>
            <Heading size="lg" mb={4}>Ongoing</Heading>
            <VStack align="stretch" spacing={3}>
              <Text fontSize="md">
                • <strong>TKS Pitch (Dec 13):</strong> Major presentation that will inform my essay narrative
              </Text>
              <Text fontSize="md">
                • <strong>11 University Applications:</strong> Stanford, Harvard, Princeton, UPenn ED2, and 7 others—30 essays total, almost zero drafted
              </Text>
              <Text fontSize="md">
                • <strong>Agora Writing:</strong> Content creation and technical projects, including the Telegram bot library system
              </Text>
            </VStack>
          </Box>

          {/* Reading/Thinking */}
          <Box>
            <Heading size="lg" mb={4}>Currently Reading</Heading>
            <Text fontSize="md" lineHeight="tall">
              Still working through Russian literature and philosophy—Dostoevsky, 
              Nietzsche, Camus. Trying to maintain intellectual routine despite deadline chaos.
            </Text>
          </Box>

          <Box pt={4} borderTop="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }}>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              This page is a snapshot of my life right now. It changes as I do.
            </Text>
          </Box>

        </VStack>
      </Container>
    </>
  );
}