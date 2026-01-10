import { Box, Text, VStack, Container } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';

export default function Secret() {
  const textColor = useColorModeValue('#1a1a1a', '#e0e0e0');
  const subtleColor = useColorModeValue('#666666', '#999999');

  return (
    <Container maxW="72ch" py={16}>
      <VStack spacing={8} align="flex-start">
        <Text fontFamily="mono" fontSize="14px" color={subtleColor}>
          {'// You found the secret page'}
        </Text>

        <Box fontFamily="mono" fontSize="14px" color={textColor} lineHeight="1.8">
          <Text mb={6}>
            If you're here, you're probably someone who explores.
            Someone who looks under the hood. I like that.
          </Text>

          <Text mb={6}>
            Here's something I don't share often:
          </Text>

          <Box
            pl={4}
            borderLeft="2px solid"
            borderColor={subtleColor}
            fontStyle="italic"
            mb={6}
          >
            <Text mb={4}>
              "The best way to predict the future is to create it."
            </Text>
            <Text fontSize="12px" color={subtleColor}>
              - This isn't just a quote to me. It's a daily reminder.
            </Text>
          </Box>

          <Text mb={6}>
            I come from Karakalpakstan, a place most people have never heard of.
            Growing up, I didn't have access to the same resources as kids in
            Silicon Valley or London. But I had curiosity. And that turned out
            to be enough.
          </Text>

          <Text mb={6}>
            Every line of code I write, every project I build, every late night
            debugging sessions - they're all steps toward something bigger.
            I don't know exactly what yet. But I know the direction.
          </Text>

          <Text mb={6}>
            If you're building something interesting, or if you just want to
            talk about ideas, technology, or the future - reach out.
          </Text>

          <Text color={subtleColor}>
            → imamatdinsultniyazov@gmail.com
          </Text>
        </Box>

        <Text fontFamily="mono" fontSize="12px" color={subtleColor} mt={8}>
          {'// Press [g h] to go home'}
        </Text>
      </VStack>
    </Container>
  );
}
