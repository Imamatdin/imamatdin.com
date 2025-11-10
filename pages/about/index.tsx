import { Container, Heading, Text, VStack, SimpleGrid, Box, Icon } from "@chakra-ui/react";
import NextLink from "next/link";
import { NextSeo } from "next-seo";

const sections = [
  {
    title: "My Culture",
    emoji: "📜",
    href: "/about/culture",
    description: "My Karakalpak heritage and cultural background"
  },
  {
    title: "Poetry & Art",
    emoji: "🎨",
    href: "/about/poetry",
    description: "Poems I've read and reflections on art"
  },
  {
    title: "Idea Diary",
    emoji: "💡",
    href: "/about/ideas",
    description: "Reflections on ideas and how I came to learn about them"
  },
  {
    title: "Academic Influences",
    emoji: "🎓",
    href: "/about/academics",
    description: "Professors and forgotten scientists who shaped my path"
  },
  {
    title: "Podcasts",
    emoji: "🎙️",
    href: "/about/podcasts",
    description: "Podcasts I listen to and recommend"
  },
  {
    title: "Fun Facts",
    emoji: "✨",
    href: "/about/facts",
    description: "Interesting things about me"
  }
];

export default function About() {
  return (
    <>
      <NextSeo
        title="About | Imamatdin"
        description="Learn more about me, my culture, interests, and influences"
      />
      
      <Container maxW="5xl" py={12}>
        <VStack align="stretch" spacing={8} mb={12}>
          <Box>
            <Heading size="2xl" mb={4}>About Me</Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }} mb={4}>
              Welcome! I&apos;m Imamatdin, an 18-year-old passionate about emerging tech, engineering, and culture.
            </Text>
            <Text fontSize="md" color="gray.600" _dark={{ color: "gray.400" }}>
              Explore different aspects of my life, interests, and the people and ideas that have shaped my journey.
            </Text>
          </Box>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {sections.map((section) => (
            <NextLink key={section.href} href={section.href}>
              <Box
                p={6}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                _dark={{ borderColor: "gray.700" }}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "lg",
                  borderColor: "blue.400"
                }}
              >
                <Text fontSize="4xl" mb={3}>{section.emoji}</Text>
                <Heading size="md" mb={2}>{section.title}</Heading>
                <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                  {section.description}
                </Text>
              </Box>
            </NextLink>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}