import { Box, Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';
import { ArrowBackIcon } from '@chakra-ui/icons';

export type BackLinkVariant = 'terminal' | 'standard';

interface BackLinkProps {
  /** URL to navigate to */
  href: string;
  /** Link text */
  label: string;
  /** Styling variant */
  variant?: BackLinkVariant;
}

/**
 * Consistent back navigation link for content detail pages.
 */
export function BackLink({ href, label, variant = 'terminal' }: BackLinkProps) {
  if (variant === 'standard') {
    return (
      <Box
        mt={12}
        pt={6}
        borderTop="1px solid"
        borderColor="gray.200"
        _dark={{ borderColor: 'gray.700' }}
      >
        <NextLink href={href} passHref legacyBehavior>
          <ChakraLink
            display="inline-flex"
            alignItems="center"
            gap={2}
            fontSize="lg"
            fontWeight="medium"
            color="accent"
            transition="all 0.2s"
            _hover={{
              textDecoration: 'none',
              transform: 'translateX(-4px)',
            }}
          >
            <ArrowBackIcon />
            {label}
          </ChakraLink>
        </NextLink>
      </Box>
    );
  }

  // Terminal variant
  return (
    <Box pt={6} borderTop="1px solid" borderColor="border">
      <NextLink href={href} passHref legacyBehavior>
        <ChakraLink
          fontFamily="mono"
          fontSize="sm"
          color="subtle"
          _hover={{ color: 'text' }}
        >
          ← {label}
        </ChakraLink>
      </NextLink>
    </Box>
  );
}

export default BackLink;
