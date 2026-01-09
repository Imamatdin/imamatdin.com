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
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');

  return (
    <>
      <NextSeo
        title="Podcasts | Imamatdin"
        description="Podcasts that shape my thinking and keep me curious"
      />

      <Container maxW="650px" py={12}>
        <VStack align="stretch" spacing={8}>
          <Heading fontFamily="heading" fontSize="3xl" color={inkColor} mb={2}>
            Podcasts
          </Heading>

          <Text fontFamily="body" fontSize="md" color={inkLight} mb={4}>
            Audio companions for long walks, gym sessions, and late-night coding. These shows have shaped how I think about technology, business, science, and life.
          </Text>

          <VStack spacing={6} align="stretch">
            {podcasts.map((podcast) => (
              <VStack key={podcast.name} align="stretch" spacing={2}>
                {podcast.link ? (
                  <ChakraLink href={podcast.link} isExternal>
                    <Text
                      fontFamily="heading"
                      fontSize="lg"
                      fontWeight="bold"
                      color={inkColor}
                      borderBottom="1px dashed"
                      borderColor={inkLight}
                      display="inline-block"
                      _hover={{ borderStyle: 'solid' }}
                    >
                      {podcast.name}
                    </Text>
                  </ChakraLink>
                ) : (
                  <Text fontFamily="heading" fontSize="lg" fontWeight="bold" color={inkColor}>
                    {podcast.name}
                  </Text>
                )}
                <Text fontFamily="handwriting" fontSize="sm" color={inkLight}>
                  {podcast.host}
                </Text>

                <Text fontFamily="body" fontSize="md" lineHeight="tall" color={inkColor}>
                  {podcast.description}
                </Text>

                {podcast.favoriteEpisode && (
                  <Text fontFamily="body" fontSize="sm" color={inkLight} fontStyle="italic">
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
