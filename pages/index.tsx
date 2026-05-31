import { Box, Text, VStack, Link, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Home() {
  const textColor = useColorModeValue('#1a1a1a', '#e0e0e0');
  const subtleColor = useColorModeValue('#666666', '#999999');
  const accentColor = useColorModeValue('#0066cc', '#66b3ff');

  return (
    <VStack align="flex-start" spacing={6} width="100%" fontFamily="mono" fontSize="14px">
      <Text color={textColor} lineHeight="1.8">
        Gap year. Building.
      </Text>

      <Text color={textColor} lineHeight="1.8">
        I grew up in Karakalpakstan - the region most affected by the Aral Sea disaster.
        The dried lakebed generates toxic dust storms across our communities. That background
        drives most of my technical work.
      </Text>

      <Text color={textColor} lineHeight="1.8">
        Applying to study mechanical engineering with a focus on security engineering.
        I still teach taekwondo locally.
      </Text>

      <Box>
        <Text fontWeight="bold" mb={2} color={textColor}>I build across:</Text>
        <Box as="ul" pl={4} listStyleType="disc">
          <Text as="li" mb={1} color={subtleColor} lineHeight="1.8">AI security (autonomous pentesting agents)</Text>
          <Text as="li" mb={1} color={subtleColor} lineHeight="1.8">Environmental AI (satellite pipelines, foundation models, RL for agriculture)</Text>
          <Text as="li" mb={1} color={subtleColor} lineHeight="1.8">Datacenter cooling optimization (deep reinforcement learning)</Text>
          <Text as="li" mb={1} color={subtleColor} lineHeight="1.8">VR thermal haptics research</Text>
          <Text as="li" color={subtleColor} lineHeight="1.8">Custom developer tooling (agentic OS)</Text>
        </Box>
      </Box>

      <Text color={textColor} lineHeight="1.8">
        I read Russian literature (Dostoevsky, Tolstoy, Chekhov), philosophy (Nietzsche,
        Camus, Aristotle), and Karakalpak poetry - Ibrayim Yusupov especially.
      </Text>

      <Text color={textColor} lineHeight="1.8">
        Long-term plan: build skills and capital abroad, then return to Karakalpakstan
        and apply everything to local problems.
      </Text>

      <Text color={textColor} lineHeight="1.8">
        I'm looking for compute sponsorship and research funding to scale my environmental
        and security AI projects. If any of this resonates, reach out.
      </Text>

      <Text color={subtleColor} lineHeight="1.8">
        For what I'm working on right now, see{' '}
        <Link as={NextLink} href="/now" color={accentColor}>now</Link>
        {'. Things I’ve built live under '}
        <Link as={NextLink} href="/projects" color={accentColor}>projects</Link>
        {'.'}
      </Text>

      <Box>
        <Text color={subtleColor} fontSize="12px">
          Also:{' '}
          <Link as={NextLink} href="/about/culture" color={accentColor}>culture</Link>
          {', '}
          <Link as={NextLink} href="/about/poetry" color={accentColor}>poetry</Link>
          {', '}
          <Link as={NextLink} href="/about/ideas" color={accentColor}>ideas</Link>
          {', '}
          <Link as={NextLink} href="/about/stack" color={accentColor}>stack</Link>
          {', '}
          <Link as={NextLink} href="/about/facts" color={accentColor}>facts</Link>
        </Text>
      </Box>
    </VStack>
  );
}
