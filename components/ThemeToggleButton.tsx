import { Box, useColorMode, Icon } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

export const ThemeToggleButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isLight = colorMode === 'light';

  return (
    <Box 
      as="button"  // Makes it a proper button element
      onClick={toggleColorMode} 
      bg={isLight ? 'gray.200' : 'gray.600'} 
      width="48px" 
      height="24px" 
      borderRadius="full" 
      p="2px" 
      cursor="pointer" 
      transition="background-color 0.3s ease" 
      display="flex" 
      alignItems="center"
      border="none"  // Removes default button border
      outline="none"  // Removes the blue focus outline
      _focus={{
        boxShadow: 'none'  // Removes focus box shadow
      }}
      _active={{
        transform: 'scale(0.95)'  // Adds a nice press effect
      }}
      _hover={{
        opacity: 0.8  // Subtle hover feedback
      }}
    >
      <Box 
        as="div" 
        width="20px" 
        height="20px" 
        borderRadius="full" 
        bg="transparent" 
        transform={isLight ? 'translateX(0px)' : 'translateX(24px)'} 
        transition="transform 0.3s ease-in-out" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        pointerEvents="none"  // Prevents the inner box from intercepting clicks
      >
        <Icon 
          as={isLight ? SunIcon : MoonIcon} 
          color={isLight ? 'yellow.500' : 'blue.300'} 
          boxSize="14px"
          transition="filter 0.2s ease"
        />
      </Box>
    </Box>
  );
};