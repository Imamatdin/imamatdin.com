import { Container, Heading, Text, VStack, Box, Icon, HStack, Link } from "@chakra-ui/react";
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
      
      <Container maxW="4xl" py={12}>
        <VStack align="stretch" spacing={12}>
          <Box>
            <Heading size="2xl" mb={4}>About Me</Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }} mb={4}>
              Welcome! I'm Imamatdin, an 18-year-old passionate about emerging tech, engineering, and culture.
            </Text>
            <Text fontSize="md" color="gray.600" _dark={{ color: "gray.400" }}>
              Explore different aspects of my life, interests, and the people and ideas that have shaped my journey.
            </Text>
          </Box>

          {/* Main Content Sections */}
          <Box>
            <Heading size="lg" mb={6} color="gray.500" _dark={{ color: "gray.400" }}>
              Main Sections
            </Heading>
            <VStack align="stretch" spacing={4}>
              {mainSections.map((section) => (
                <NextLink key={section.href} href={section.href}>
                  <Box cursor="pointer">
                    <HStack spacing={3} mb={1}>
                      <Text fontSize="xl">{section.emoji}</Text>
                      <Text
                        fontSize="lg"
                        fontWeight="medium"
                        color="red.600"
                        _dark={{ color: "red.400" }}
                        transition="opacity 0.2s"
                        _hover={{ opacity: 0.7 }}
                      >
                        {section.title}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.500" }} pl={10}>
                      {section.description}
                    </Text>
                  </Box>
                </NextLink>
              ))}
            </VStack>
          </Box>

          {/* About Me Sections */}
          <Box>
            <Heading size="lg" mb={6} color="gray.500" _dark={{ color: "gray.400" }}>
              More About Me
            </Heading>
            <VStack align="stretch" spacing={4}>
              {aboutSections.map((section) => (
                <NextLink key={section.href} href={section.href}>
                  <Box cursor="pointer">
                    <HStack spacing={3} mb={1}>
                      <Text fontSize="xl">{section.emoji}</Text>
                      <Text
                        fontSize="lg"
                        fontWeight="medium"
                        color="red.600"
                        _dark={{ color: "red.400" }}
                        transition="opacity 0.2s"
                        _hover={{ opacity: 0.7 }}
                      >
                        {section.title}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.500" }} pl={10}>
                      {section.description}
                    </Text>
                  </Box>
                </NextLink>
              ))}
            </VStack>
          </Box>

          {/* Social Links Section */}
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
        </VStack>
      </Container>
    </>
  );
}