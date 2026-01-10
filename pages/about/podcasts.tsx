import { Container, Heading, Text, VStack, Link as ChakraLink, useColorModeValue } from "@chakra-ui/react";
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
  const textColor = useColorModeValue('#1a1a1a', '#e0e0e0');
  const subtleColor = useColorModeValue('#666666', '#999999');
  const accentColor = useColorModeValue('#0066cc', '#66b3ff');

  return (
    <>
      <NextSeo
        title="Podcasts | Imamatdin"
        description="Podcasts that shape my thinking and keep me curious"
      />

      <Container maxW="650px" py={8}>
        <VStack align="stretch" spacing={6}>
          <Heading fontFamily="mono" fontSize="xl" color={textColor} mb={2}>
            Podcasts
          </Heading>

          <Text fontFamily="mono" fontSize="14px" color={subtleColor} mb={2}>
            Audio companions for long walks, gym sessions, and late-night coding. These shows have shaped how I think about technology, business, science, and life.
          </Text>

          <VStack spacing={4} align="stretch">
            {podcasts.map((podcast) => (
              <VStack key={podcast.name} align="stretch" spacing={1}>
                {podcast.link ? (
                  <ChakraLink href={podcast.link} isExternal>
                    <Text
                      fontFamily="mono"
                      fontSize="14px"
                      fontWeight="bold"
                      color={accentColor}
                      textDecoration="underline"
                      _hover={{ opacity: 0.7 }}
                    >
                      {podcast.name}
                    </Text>
                  </ChakraLink>
                ) : (
                  <Text fontFamily="mono" fontSize="14px" fontWeight="bold" color={textColor}>
                    {podcast.name}
                  </Text>
                )}
                <Text fontFamily="mono" fontSize="12px" color={subtleColor}>
                  {podcast.host}
                </Text>

                <Text fontFamily="mono" fontSize="14px" lineHeight="1.8" color={textColor}>
                  {podcast.description}
                </Text>

                {podcast.favoriteEpisode && (
                  <Text fontFamily="mono" fontSize="12px" color={subtleColor} fontStyle="italic">
                    Favorite episode: {podcast.favoriteEpisode}
                  </Text>
                )}
              </VStack>
            ))}
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
