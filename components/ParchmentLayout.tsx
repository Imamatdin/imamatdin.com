import { Box, Container, Text, useColorModeValue } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface ParchmentLayoutProps extends PropsWithChildren {
  showBinding?: boolean;
  maxW?: string;
  pageNumber?: string | number;
}

export function ParchmentLayout({
  children,
  showBinding = false,
  maxW = "container.lg",
  pageNumber,
}: ParchmentLayoutProps) {
  const bgColor = useColorModeValue('#f5f0e8', '#1a1612');
  const overlayColor = useColorModeValue('rgba(139, 90, 43, 0.05)', 'rgba(168, 144, 96, 0.03)');
  const shadowColor = useColorModeValue('rgba(139, 90, 43, 0.1)', 'rgba(0, 0, 0, 0.3)');
  const bindingGradient = useColorModeValue(
    'linear(to-r, #8b7355, #a89060, transparent)',
    'linear(to-r, #3a2a1a, #5a4a3a, transparent)'
  );
  const pageNumColor = useColorModeValue('#6b5c4a', '#a89060');

  return (
    <Box
      minH="100vh"
      bg={bgColor}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(to bottom, ${overlayColor} 0%, ${overlayColor} 50%, ${overlayColor} 100%)`,
        pointerEvents: 'none',
      }}
      _after={{
        content: '""',
        position: 'absolute',
        inset: 0,
        boxShadow: `inset 0 0 100px ${shadowColor}`,
        pointerEvents: 'none',
      }}
    >
      {/* Notebook binding effect */}
      {showBinding && (
        <Box
          position="fixed"
          left={0}
          top={0}
          bottom={0}
          w="20px"
          bgGradient={bindingGradient}
          boxShadow="inset -2px 0 4px rgba(0,0,0,0.2)"
          zIndex={10}
          display={{ base: 'none', lg: 'block' }}
        />
      )}

      {/* Main content */}
      <Container maxW={maxW} py={16} position="relative" zIndex={1}>
        {children}
      </Container>

      {/* Page number */}
      {pageNumber && (
        <Text
          position="fixed"
          bottom={4}
          right={8}
          fontFamily="handwriting"
          fontSize="sm"
          color={pageNumColor}
          zIndex={10}
        >
          {typeof pageNumber === 'number' ? `folio ${pageNumber}` : pageNumber}
        </Text>
      )}
    </Box>
  );
}

export default ParchmentLayout;
