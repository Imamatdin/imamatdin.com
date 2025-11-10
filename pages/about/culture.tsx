import { Container, Heading, Text, VStack, Box } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

export default function Culture() {
  return (
    <>
      <NextSeo
        title="My Culture | Imamatdin"
        description="My Karakalpak heritage and cultural background"
      />
      
      <Container maxW="3xl" py={12}>
        <VStack align="stretch" spacing={8}>
          <Box>
            <Heading size="2xl" mb={4}>My Culture</Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }}>
              My unique Karakalpak background
            </Text>
          </Box>

          <Box>
            <Heading size="lg" mb={4}>Karakalpak Heritage</Heading>
            <Text fontSize="md" lineHeight="1.7" mb={4}>
              [Replace this with your story about your Karakalpak background]
            </Text>
            <Text fontSize="md" lineHeight="1.7" mb={4}>
              I&apos;m incredibly proud of my heritage. During our cultural discussions, I had the honor of sharing my background and reading two poems from Ibrayim Yusupov to an audience of 30+ people.
            </Text>
          </Box>

          <Box>
            <Heading size="lg" mb={4}>Ibrayim Yusupov</Heading>
            <Text fontSize="md" lineHeight="1.7" mb={4}>
              [Add information about Ibrayim Yusupov and why his work is meaningful to you]
            </Text>
          </Box>

          <Box>
            <Heading size="lg" mb={4}>The Two Poems I Shared</Heading>
            <Box
              p={6}
              bg="gray.50"
              _dark={{ bg: "gray.800" }}
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="blue.500"
              mb={4}
            >
              <Text fontStyle="italic" fontSize="md" lineHeight="1.7">
                [Poem 1 - Replace with the actual poem]
              </Text>
            </Box>

            <Box
              p={6}
              bg="gray.50"
              _dark={{ bg: "gray.800" }}
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="blue.500"
            >
              <Text fontStyle="italic" fontSize="md" lineHeight="1.7">
                [Poem 2 - Replace with the actual poem]
              </Text>
            </Box>
          </Box>
        </VStack>
      </Container>
    </>
  );
}