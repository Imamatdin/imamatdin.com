import { Container, Heading, Text, VStack, Box, Link as ChakraLink, HStack } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

interface Podcast {
  name: string;
  host: string;
  description: string;
  favoriteEpisode?: string;
  link?: string;
}

const podcasts: Podcast[] = [
  {
    name: "Lex Fridman Podcast",
    host: "Lex Fridman",
    description: "Long-form conversations about AI, science, philosophy, and the nature of intelligence. Lex's genuine curiosity and depth make every episode feel like sitting in on a conversation between two brilliant minds.",
    favoriteEpisode: "Andrej Karpathy on Tesla AI, Neural Networks, and the Future",
    link: "https://lexfridman.com/podcast/"
  },
  {
    name: "Huberman Lab",
    host: "Andrew Huberman",
    description: "Neuroscience-backed protocols for optimizing performance, sleep, focus, and health. I've implemented several of his protocols into my daily routine.",
    favoriteEpisode: "Master Your Sleep & Be More Alert When Awake",
    link: "https://hubermanlab.com/"
  },
  {
    name: "The Knowledge Project",
    host: "Shane Parrish",
    description: "Mental models, decision-making, and wisdom from experts across fields. Shane has a talent for extracting timeless principles from his guests.",
    link: "https://fs.blog/knowledge-project-podcast/"
  },
  {
    name: "My First Million",
    host: "Sam Parr & Shaan Puri",
    description: "Business ideas, entrepreneurship stories, and startup brainstorming. Their energy is infectious and they make business discussions genuinely fun.",
    link: "https://www.mfmpod.com/"
  },
  {
    name: "All-In Podcast",
    host: "Chamath, Jason, Sacks & Friedberg",
    description: "Tech, politics, economics from Silicon Valley's perspective. Four brilliant minds debating the biggest issues of our time.",
    link: "https://www.allinpodcast.co/"
  }
];

export default function Podcasts() {
  return (
    <>
      <NextSeo
        title="Podcasts | Imamatdin"
        description="Podcasts that shape my thinking and keep me curious"
      />

      <Container maxW="3xl" py={12}>
        <VStack align="stretch" spacing={8}>
          <Box>
            <Heading size="2xl" mb={2}>Podcasts</Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }}>
              Audio companions for long walks, gym sessions, and late-night coding. These shows have shaped how I think about technology, business, science, and life.
            </Text>
          </Box>

          <VStack spacing={6} align="stretch">
            {podcasts.map((podcast) => (
              <Box
                key={podcast.name}
                p={5}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                _dark={{ borderColor: "gray.700" }}
              >
                <HStack justify="space-between" align="flex-start" mb={2}>
                  <Box>
                    {podcast.link ? (
                      <ChakraLink href={podcast.link} isExternal>
                        <Heading size="md" color="accent" _hover={{ opacity: 0.8 }}>
                          {podcast.name}
                        </Heading>
                      </ChakraLink>
                    ) : (
                      <Heading size="md">{podcast.name}</Heading>
                    )}
                    <Text fontSize="sm" color="gray.500">
                      {podcast.host}
                    </Text>
                  </Box>
                </HStack>

                <Text fontSize="md" lineHeight="tall" mb={2}>
                  {podcast.description}
                </Text>

                {podcast.favoriteEpisode && (
                  <Text fontSize="sm" color="gray.500" fontStyle="italic">
                    Favorite episode: {podcast.favoriteEpisode}
                  </Text>
                )}
              </Box>
            ))}
          </VStack>

          <Box pt={4} borderTop="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }}>
            <Text fontSize="sm" color="gray.500">
              Always looking for recommendations. If you have a podcast that changed how you think, let me know.
            </Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
}
