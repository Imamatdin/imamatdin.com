import { Box, Text, VStack, Link as ChakraLink, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Signature } from '../components/Signature';

export default function Home() {
  const textColor = useColorModeValue('#1a1a1a', '#e0e0e0');
  const subtleColor = useColorModeValue('#666666', '#999999');
  const accentColor = useColorModeValue('#0066cc', '#66b3ff');

  return (
    <VStack align="flex-start" spacing={8} width="100%">
      {/* Signature Animation */}
      <Box display="flex" alignItems="center" gap={3}>
        <Signature size={32} />
        <Text fontFamily="mono" fontSize="14px" color={subtleColor}>
          Imamatdin Sultaniyazov
        </Text>
      </Box>

      {/* Content */}
      <VStack align="flex-start" spacing={6} fontFamily="mono" fontSize="14px">
        <Box>
          <Text fontWeight="bold" mb={2}>Some things about me:</Text>
          <Text color={textColor} lineHeight="1.8">
            Currently I am penning my journey, scripting my story, composing my harmony,
            painting my vision, engineering my future.
          </Text>
        </Box>

        <Box as="ul" pl={4} listStyleType="disc">
          <Text as="li" mb={2}>
            I'm doing Activate at TKS where I am working on quantum computing and AR engineering design.
          </Text>
          <Text as="li" mb={2}>
            Before this, I was in Innovate where I worked on Autonomous vehicles.
          </Text>
          <Text as="li">
            I love creating things, especially software, art, poems, interesting projects.
          </Text>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={2}>Some things I'm interested in:</Text>
        </Box>

        <Box as="ul" pl={4} listStyleType="disc">
          <Text as="li" mb={2}>
            Environmental science. I live in an area that is suffering the consequences of a natural disaster
            that happened in 1950s. Some of my work was inspired by it.
          </Text>
          <Text as="li" mb={2}>
            Health and fitness. I had been playing basketball for 5 years, and I like optimizing for
            athleticism as the balance between aesthetics and functionality.
          </Text>
          <Text as="li" mb={2}>
            I like learning new things, especially from people who see beauty in their subject.
            I am interested in learning about everything important and am trying to stay curious.
          </Text>
          <Text as="li">
            Animated movies. I am a big fan of Arcane: League of Legends. Even though I stopped
            playing video games 5-6 years ago and never played LL, I loved the animation and the story.
          </Text>
        </Box>

        <Text>
          Checkout my{' '}
          <NextLink href="/reading" passHref>
            <ChakraLink color={accentColor} textDecoration="underline">reading</ChakraLink>
          </NextLink>
          ,{' '}
          <NextLink href="/writing" passHref>
            <ChakraLink color={accentColor} textDecoration="underline">writing</ChakraLink>
          </NextLink>
          .
        </Text>
      </VStack>
    </VStack>
  );
}
