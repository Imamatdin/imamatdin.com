import { Box, useColorMode, Icon } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

export const ThemeToggleButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isLight = colorMode === 'light';

  return (
    <Box
      onClick={toggleColorMode}
      onKeyDown={(e) => e.key === 'Enter' && toggleColorMode()}
      tabIndex={0}
      bg={isLight ? 'gray.200' : 'gray.600'}
      width="48px"
      height="24px"
      borderRadius="full"
      p="2px"
      cursor="pointer"
      transition="background-color 0.3s ease"
      display="flex"
      alignItems="center"
      role="button"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      _focus={{ outline: 'none', boxShadow: 'none' }}
      _focusVisible={{ outline: 'none', boxShadow: 'none' }}
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
      >
        <Icon 
          as={isLight ? SunIcon : MoonIcon} 
          color={isLight ? 'yellow.500' : 'blue.300'} 
          boxSize="14px"
          transition="filter 0.2s ease"
          _hover={{ 
            filter: 'drop-shadow(0 0 8px currentColor)'
          }}
        />
      </Box>
    </Box>
  );
};