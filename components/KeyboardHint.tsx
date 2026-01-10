import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';

export function KeyboardHint() {
  const color = useColorModeValue('#666666', '#999999');

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
      <HStack spacing={4} fontFamily="mono" fontSize="12px" color={color} opacity={0.6}>
        <Text>[j] next</Text>
        <Text>[k] prev</Text>
        <Text>[Enter] open</Text>
        <Text>[Cmd+K] search</Text>
      </HStack>
    </Box>
  );
}
