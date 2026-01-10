import { IconButton, useColorMode } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

export const ThemeToggleButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={toggleColorMode}
      icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
      variant="ghost"
      size="sm"
      colorScheme="gray"
      _focus={{ boxShadow: 'none', outline: 'none' }}
      _focusVisible={{ boxShadow: 'none', outline: 'none' }}
      _active={{ transform: 'scale(0.95)' }}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    />
  );
};
