import { Box, Container, Grid, Link as ChakraLink, Text } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { Eyebrow } from '../components/Eyebrow';

const FACTS: [string, string][] = [
  ['Origin', "I'm from Nukus, Karakalpakstan - a place most people have never heard of. It's home to the second-largest collection of Russian avant-garde art in the world, hidden in the middle of the desert."],
  ['Languages', "I speak Karakalpak (native), Russian (fluent), Uzbek (fluent), English (fluent), and I'm learning Turkish. Each language unlocks a different way of thinking."],
  ['Basketball', "I've played basketball for 5+ years. It taught me that raw talent means nothing without discipline - and that the best players make everyone around them better."],
  ['Sleep', "I'm naturally a night owl but forcing myself to become a morning person. The quiet hours before sunrise are when my best thinking happens."],
  ['Memory', "I can't remember faces well, but I never forget a conversation. Ideas stick with me longer than names."],
  ['Reading', 'I read multiple books at once - usually one fiction, one non-fiction, and something philosophical. Switching between them keeps my mind fresh.'],
  ['Music', 'I code to lo-fi and classical. I think to ambient. I work out to everything else. Music is my context switch.'],
  ['Food', 'Karakalpak cuisine is underrated. Beshbarmaq (boiled meat with noodles) is comfort food that tells a story of nomadic survival.'],
  ['Writing', "I write to understand what I think. If I can't explain something in writing, I don't really understand it."],
  ['Aral Sea', "I grew up near one of the world's worst environmental disasters - the Aral Sea dried up in my grandparents' lifetime. It shaped my interest in environmental engineering."],
  ['Name', "Imamatdin means 'pillar of faith' in Arabic. My parents chose it hoping I'd be someone people could rely on."],
  ['Fear', "My biggest fear isn't failure - it's mediocrity. The thought of living a comfortable but unremarkable life terrifies me more than any risk."],
];

const STACK: { title: string; tools: [string, string?][] }[] = [
  { title: 'hardware', tools: [['HP Envy x360', 'daily driver'], ['Samsung A56', 'phone']] },
  {
    title: 'ai',
    tools: [
      ['Claude Pro', 'deep thinking, writing'],
      ['Perplexity Pro', 'research'],
      ['Gemini Pro', 'quick questions'],
      ['GPT', 'general tasks'],
      ['DeepSeek', 'code'],
      ['Grok', 'real-time'],
    ],
  },
  { title: 'browsers', tools: [['Comet', 'primary'], ['Chrome', 'extensions'], ['Edge', 'PDFs']] },
  { title: 'dev', tools: [['VS Code'], ['Terminal'], ['Python'], ['C++', 'learning']] },
  { title: 'productivity', tools: [['Obsidian', 'notes'], ['Physical notebook', 'tasks'], ['Google Calendar']] },
  { title: 'creative', tools: [['Figma Pro'], ['Scribble', 'flow state']] },
  { title: 'infra', tools: [['Vercel'], ['GitHub'], ['Namecheap']] },
];

const PODCASTS = [
  {
    name: 'Lex Fridman Podcast',
    host: 'Lex Fridman',
    description:
      "Long-form conversations about AI, science, philosophy, and the nature of intelligence. Lex's genuine curiosity and depth make every episode feel like sitting in on a conversation between two brilliant minds.",
    favourite: 'Andrej Karpathy on Tesla AI, Neural Networks, and the Future',
    link: 'https://lexfridman.com/podcast/',
  },
  {
    name: 'Huberman Lab',
    host: 'Andrew Huberman',
    description:
      "Neuroscience-backed protocols for optimizing performance, sleep, focus, and health. I've implemented several of his protocols into my daily routine.",
    favourite: 'Master Your Sleep & Be More Alert When Awake',
    link: 'https://hubermanlab.com/',
  },
  {
    name: 'The Knowledge Project',
    host: 'Shane Parrish',
    description:
      'Mental models, decision-making, and wisdom from experts across fields. Shane has a talent for extracting timeless principles from his guests.',
    link: 'https://fs.blog/knowledge-project-podcast/',
  },
  {
    name: 'My First Million',
    host: 'Sam Parr & Shaan Puri',
    description:
      'Business ideas, entrepreneurship stories, and startup brainstorming. Their energy is infectious and they make business discussions genuinely fun.',
    link: 'https://www.mfmpod.com/',
  },
  {
    name: 'All-In Podcast',
    host: 'Chamath, Jason, Sacks & Friedberg',
    description:
      "Tech, politics, economics from Silicon Valley's perspective. Four brilliant minds debating the biggest issues of our time.",
    link: 'https://www.allinpodcast.co/',
  },
];

const Section = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
  <Box as="section" id={id} mt={14} sx={{ scrollMarginTop: '24px' }}>
    <Eyebrow mb={4}>{label}</Eyebrow>
    {children}
  </Box>
);

export default function About() {
  return (
    <>
      <NextSeo title="About | Imamatdin" description="Facts, the tools I use, and what I listen to." />

      <Container maxW="650px" py={4}>
        <Eyebrow mb={3}>index / about</Eyebrow>
        <Text as="div" fontFamily="mono" fontSize="28px" fontWeight={400} letterSpacing="-0.04em" lineHeight="1.1" color="text">
          About
        </Text>
        <Text as="div" fontFamily="mono" fontSize="13px" color="subtle" mt={3}>
          Pieces of who I am that don&apos;t fit anywhere else.
        </Text>

        <Section id="facts" label="facts">
          <Box borderTop="1px solid" borderColor="border">
            {FACTS.map(([label, text]) => (
              <Grid
                key={label}
                templateColumns={{ base: '1fr', md: '120px 1fr' }}
                gap={{ base: 1, md: 4 }}
                py={3}
                borderBottom="1px solid"
                borderColor="border"
              >
                <Eyebrow pt="2px" color="text">
                  {label}
                </Eyebrow>
                <Text as="div" fontFamily="mono" fontSize="13px" color="subtle" lineHeight="1.75">
                  {text}
                </Text>
              </Grid>
            ))}
          </Box>
        </Section>

        <Section id="stack" label="stack">
          <Grid
            templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
            gap="1px"
            bg="border"
            border="1px solid"
            borderColor="border"
          >
            {STACK.map((group) => (
              <Box key={group.title} bg="background" p={4}>
                <Eyebrow mb={3}>{group.title}</Eyebrow>
                {group.tools.map(([name, note]) => (
                  <Text key={name} as="div" fontFamily="mono" fontSize="13px" color="text" lineHeight="1.8">
                    {name}
                    {note && (
                      <Box as="span" color="subtle">
                        {' '}
                        · {note}
                      </Box>
                    )}
                  </Text>
                ))}
              </Box>
            ))}
          </Grid>
        </Section>

        <Section id="podcasts" label="podcasts">
          <Box borderTop="1px solid" borderColor="border">
            {PODCASTS.map((p) => (
              <Box key={p.name} py={4} borderBottom="1px solid" borderColor="border">
                <Grid templateColumns="1fr auto" gap={4} alignItems="baseline">
                  <Text as="div" fontFamily="mono" fontSize="14px" fontWeight={500}>
                    <ChakraLink href={p.link} isExternal className="ink-link">
                      {p.name} ↗
                    </ChakraLink>
                  </Text>
                  <Eyebrow>{p.host}</Eyebrow>
                </Grid>
                <Text as="div" fontFamily="mono" fontSize="13px" color="subtle" lineHeight="1.75" mt={2}>
                  {p.description}
                </Text>
                {p.favourite && (
                  <Text as="div" fontFamily="mono" fontSize="12px" color="subtle" mt={2}>
                    <Box as="span" color="text">
                      favourite:
                    </Box>{' '}
                    {p.favourite}
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        </Section>
      </Container>
    </>
  );
}
