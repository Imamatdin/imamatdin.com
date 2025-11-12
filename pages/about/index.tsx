import { Container, Heading, Text, VStack, SimpleGrid, Box, Icon, HStack, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { NextSeo } from "next-seo";
import { FaGithub, FaLinkedin, FaEnvelope, FaTelegram, FaXTwitter } from "react-icons/fa6";
import { SiSubstack } from "react-icons/si";

const mainSections = [
  {
    title: "Reading",
    emoji: "📚",
    href: "/reading",
    description: "Books I'm reading and my notes on them"
  },
  {
    title: "Writing",
    emoji: "✍️",
    href: "/writing",
    description: "My essays, thoughts, and reflections"
  },
  {
    title: "Deep Dives",
    emoji: "🔍",
    href: "/deep-dives",
    description: "In-depth explorations of topics I'm passionate about"
  }
];

const aboutSections = [
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

const socialLinks = [
  {
    icon: FaXTwitter,
    href: "https://twitter.com/Imamatdin_S",
    label: "X (Twitter)",
    color: "#000000"
  },
  {
    icon: FaGithub,
    href: "https://github.com/Imamatdin",
    label: "GitHub",
    color: "#333"
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/in/imamatdin-sultaniyazov",
    label: "LinkedIn",
    color: "#0A66C2"
  },
  {
    icon: SiSubstack,
    href: "https://www.substack.com/@imamatdinsultaniyazov",
    label: "Substack",
    color: "#FF6719"
  },
  {
    icon: FaTelegram,
    href: "https://t.me/Imamatdin_Sultaniyazov",
    label: "Telegram",
    color: "#0088cc"
  },
  {
    icon: FaEnvelope,
    href: "mailto:imamatdinsultniyazov@gmail.com",
    label: "Email",
    color: "#EA4335"
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

        {/* Main Content Sections */}
        <Box mb={12}>
          <Heading size="lg" mb={6}>Main Sections</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {mainSections.map((section) => (
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
        </Box>

        {/* About Me Sections */}
        <Box mb={12}>
          <Heading size="lg" mb={6}>More About Me</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {aboutSections.map((section) => (
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
        </Box>

        {/* Social Links Section - At the bottom */}
        <Box borderTop="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }} pt={8}>
          <HStack spacing={6} justify="center" flexWrap="wrap">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                isExternal
                _hover={{ transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <Icon
                  as={social.icon}
                  boxSize={6}
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                  _hover={{ color: social.color }}
                  transition="color 0.2s"
                />
              </Link>
            ))}
          </HStack>
        </Box>
      </Container>
    </>
  );
}