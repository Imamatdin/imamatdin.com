import { Box, Text, VStack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Home() {
  return (
    <VStack align="flex-start" spacing={6} width="100%" fontFamily="mono" fontSize="14px">
      <Text color="text" lineHeight="1.8">
        Gap year. Building.
      </Text>

      <Text color="text" lineHeight="1.8">
        I grew up in Karakalpakstan - the region most affected by the Aral Sea disaster.
        The dried lakebed generates toxic dust storms across our communities. That background
        drives most of my technical work.
      </Text>

      <Text color="text" lineHeight="1.8">
        Applying to study mechanical engineering with a focus on security engineering.
      </Text>

      <Box>
        <Text fontWeight="bold" mb={2} color="text">I build across:</Text>
        <Box as="ul" pl={4} listStyleType="disc">
          <Text as="li" mb={1} color="subtle" lineHeight="1.8">AI security (autonomous pentesting agents)</Text>
          <Text as="li" mb={1} color="subtle" lineHeight="1.8">Environmental AI (satellite pipelines, foundation models, RL for agriculture)</Text>
          <Text as="li" mb={1} color="subtle" lineHeight="1.8">Datacenter cooling optimization (deep reinforcement learning)</Text>
          <Text as="li" mb={1} color="subtle" lineHeight="1.8">VR thermal haptics research</Text>
          <Text as="li" color="subtle" lineHeight="1.8">Custom developer tooling (agentic OS)</Text>
        </Box>
      </Box>

      <Text color="text" lineHeight="1.8">
        I read Russian literature (Dostoevsky, Tolstoy, Chekhov), philosophy (Nietzsche,
        Camus, Aristotle), and Karakalpak poetry - Ibrayim Yusupov especially.
      </Text>

      <Text color="text" lineHeight="1.8">
        Long-term plan: build skills and capital abroad, then return to Karakalpakstan
        and apply everything to local problems.
      </Text>

      <Text color="text" lineHeight="1.8">
        I'm looking for compute sponsorship and research funding to scale my environmental
        and security AI projects. If any of this resonates, reach out.
      </Text>

      <Text color="subtle" lineHeight="1.8">
        For what I'm working on right now, see{' '}
        <Link as={NextLink} href="/now" color="accent">now</Link>
        {'. Things I’ve built live under '}
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
