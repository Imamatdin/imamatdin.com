import { Container, Heading, Text, VStack, Link, Box, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { NextSeo } from "next-seo";

export default function About() {
  const textColor = useColorModeValue('#1a1a1a', '#e0e0e0');
  const subtleColor = useColorModeValue('#666666', '#999999');
  const accentColor = useColorModeValue('#0066cc', '#66b3ff');

  return (
    <>
      <NextSeo
        title="About | Imamatdin"
        description="Learn more about me, my work, and what drives it"
      />

      <Container maxW="650px" py={4}>
        <VStack align="stretch" spacing={6} fontFamily="mono" fontSize="14px">
          <Heading fontFamily="mono" fontSize="xl" color={textColor} mb={2}>
            About
          </Heading>

          <Text color={textColor} lineHeight="1.8">
            I grew up in Karakalpakstan - the region most affected by the Aral Sea disaster.
            The dried lakebed generates toxic dust storms across our communities. That background
            drives most of my technical work.
          </Text>

          <Text color={textColor} lineHeight="1.8">
            Gap year. Applying to study mechanical engineering with a focus on security engineering.
            40+ taekwondo medals, still teach locally.
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

          <Text color={subtleColor} lineHeight="1.8">
            Programs: TKS, Nexus AI Fellowship, LaunchX, Agora Writing.
          </Text>

          <Text color={textColor} lineHeight="1.8">
            Long-term plan: build skills and capital abroad, then return to Karakalpakstan
            and apply everything to local problems.
          </Text>

          <Text color={textColor} lineHeight="1.8">
            I'm looking for compute sponsorship and funding to scale my research. If any of
            this resonates, reach out.
          </Text>

          <Box>
            <Text fontWeight="bold" mb={2} color={textColor}>Links:</Text>
            <VStack align="stretch" spacing={1}>
              <Link href="https://github.com/Imamatdin" isExternal color={accentColor} fontFamily="mono" fontSize="14px">
                GitHub: github.com/Imamatdin
              </Link>
              <Link href="https://linkedin.com/in/imamatdin-sultaniyazov" isExternal color={accentColor} fontFamily="mono" fontSize="14px">
                LinkedIn: linkedin.com/in/imamatdin-sultaniyazov
              </Link>
              <Link href="https://x.com/Imamatdin_S" isExternal color={accentColor} fontFamily="mono" fontSize="14px">
                X: x.com/Imamatdin_S
              </Link>
              <Link href="https://substack.com/@imamatdinsultaniyazov" isExternal color={accentColor} fontFamily="mono" fontSize="14px">
                Substack: substack.com/@imamatdinsultaniyazov
              </Link>
            </VStack>
          </Box>

          <Box mt={4}>
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
      </Container>
    </>
  );
}
