import { Box, Text, VStack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Home() {
  return (
    <VStack align="flex-start" spacing={6} width="100%" fontFamily="mono" fontSize="14px">
      <Text color="text" lineHeight="1.8">
        Hi, I&apos;m Imamatdin. Building, reading, and figuring things out from Nukus,
        Karakalpakstan.
      </Text>

      <Text color="text" lineHeight="1.8">
        I love building systems at the intersection of AI, robotics, and mechanical
        engineering. On a gap year right now, spending it building.
      </Text>

      <Text color="text" lineHeight="1.8">
        I write to understand what I think. If I can&apos;t explain something in writing,
        I don&apos;t really understand it.
      </Text>

      <Box>
        <Text fontWeight="bold" mb={2} color="text">What I&apos;m building:</Text>
        <Box as="ul" pl={4} listStyleType="disc">
          <Text as="li" mb={1} color="subtle" lineHeight="1.8">AI security — autonomous pentesting agents</Text>
          <Text as="li" mb={1} color="subtle" lineHeight="1.8">Environmental AI — satellite pipelines, foundation models, RL for agriculture</Text>
          <Text as="li" mb={1} color="subtle" lineHeight="1.8">Datacenter cooling — deep reinforcement learning</Text>
          <Text as="li" color="subtle" lineHeight="1.8">Developer tooling — a custom agentic OS</Text>
        </Box>
      </Box>

      <Text color="text" lineHeight="1.8">
        I read several books at once — usually one fiction, one non-fiction, and something
        philosophical. Russian literature mostly (Dostoevsky, Tolstoy, Chekhov), plus
        Nietzsche, Camus, Aristotle, and Karakalpak poetry — Ibrayim Yusupov especially.
      </Text>

      <Text color="text" lineHeight="1.8">
        Karakalpak, Russian, Uzbek, English, and Turkish in progress. Each one unlocks a
        different way of thinking.
      </Text>

      <Text color="text" lineHeight="1.8">
        I&apos;m looking for compute sponsorship and research funding. If any of this is
        interesting to you, say hi.
      </Text>

      <Text color="subtle" lineHeight="1.8">
        What I&apos;m on right now is under{' '}
        <Link as={NextLink} href="/now" color="accent">now</Link>
        {'. Things I’ve built are under '}
        <Link as={NextLink} href="/projects" color="accent">projects</Link>
        {'.'}
      </Text>

      <Box>
        <Text color="subtle" fontSize="12px">
          Also:{' '}
          <Link as={NextLink} href="/about/ideas" color="accent">ideas</Link>
          {', '}
          <Link as={NextLink} href="/about/stack" color="accent">stack</Link>
          {', '}
          <Link as={NextLink} href="/about/facts" color="accent">facts</Link>
        </Text>
      </Box>
    </VStack>
  );
}
