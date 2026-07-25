import { Box, HStack, Text } from '@chakra-ui/react';

export function KeyboardHint() {
  return (
    <Box
      position="fixed"
      bottom="16px"
      left="50%"
      transform="translateX(-50%)"
      px={4}
      py={2}
      display={{ base: 'none', md: 'block' }}
    >
      <HStack spacing={4} fontFamily="mono" fontSize="12px" color="subtle" opacity={0.6}>
        <Text>[j] next</Text>
        <Text>[k] prev</Text>
        <Text>[Enter] open</Text>
        <Text>[Cmd+K] search</Text>
      </HStack>
    </Box>
  );
}
