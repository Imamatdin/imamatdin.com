import { Box, useColorMode, Icon } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

export const ThemeToggleButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isLight = colorMode === 'light';

  return (
    <Box
      as="button"
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
      border="none"
      outline="none"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      _focus={{ boxShadow: 'none' }}
      _active={{ transform: 'scale(0.95)' }}
      _hover={{ opacity: 0.8 }}
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