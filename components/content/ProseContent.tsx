import { Box, BoxProps } from '@chakra-ui/react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { ReactNode } from 'react';

export type ProseVariant = 'terminal' | 'standard';

interface ProseContentProps extends Omit<BoxProps, 'children'> {
  /** MDX source to render */
  source?: MDXRemoteSerializeResult;
  /** Children to render (alternative to source) */
  children?: ReactNode;
  /** Styling variant */
  variant?: ProseVariant;
}

/**
 * Terminal variant styles - monospace, smaller, minimal
 */
const terminalStyles = {
  fontFamily: 'mono',
  fontSize: '14px',
  lineHeight: '1.8',
  color: 'text',
  '& h1, & h2, & h3': {
    fontFamily: 'mono',
    color: 'text',
    mt: 6,
    mb: 3,
  },
  '& h1': { fontSize: 'lg', fontWeight: 'bold' },
  '& h2': { fontSize: 'md', fontWeight: 'bold' },
  '& h3': { fontSize: 'md', fontWeight: 'semibold' },
  '& p': { mb: 4, lineHeight: 1.8 },
  '& ul, & ol': { pl: 5, mb: 4 },
  '& li': { mb: 1 },
  '& blockquote': {
    borderLeft: '2px solid',
    borderColor: 'border',
    pl: 4,
    py: 1,
    fontStyle: 'italic',
    color: 'subtle',
    my: 4,
    ml: 0,
  },
  '& code': {
    fontFamily: 'mono',
    fontSize: 'sm',
    color: 'text',
    bg: 'highlight',
    px: 1.5,
    py: 0.5,
  },
  '& pre': {
    bg: 'highlight',
    p: 4,
    overflow: 'auto',
    my: 4,
    '& code': {
      bg: 'transparent',
      p: 0,
    },
  },
  '& a': {
    color: 'accent',
    textDecoration: 'underline',
    _hover: { opacity: 0.7 },
  },
  '& img': {
    maxW: '100%',
    my: 6,
  },
  '& hr': {
    border: 'none',
    h: '1px',
    bg: 'border',
    my: 8,
  },
};

/**
 * Standard variant styles - larger, more readable
 */
const standardStyles = {
  '& h1': { fontSize: '2xl', fontWeight: 'bold', mt: 8, mb: 4 },
  '& h2': { fontSize: 'xl', fontWeight: 'bold', mt: 6, mb: 3 },
  '& h3': { fontSize: 'lg', fontWeight: 'semibold', mt: 4, mb: 2 },
  '& p': { mb: 4, lineHeight: 1.7 },
  '& strong': { fontWeight: 'bold' },
  '& em': { fontStyle: 'italic' },
  '& ul, & ol': { pl: 6, mb: 4 },
  '& li': { mb: 2 },
  '& blockquote': {
    borderLeft: '4px solid',
    borderColor: 'accent',
    pl: 4,
    py: 2,
    fontStyle: 'italic',
    color: 'subtle',
  },
  '& code': {
    bg: 'highlight',
    px: 2,
    py: 1,
    borderRadius: 'md',
    fontSize: 'sm',
  },
  '& a': {
    color: 'accent',
    textDecoration: 'underline',
    _hover: { opacity: 0.8 },
  },
};

const variantStyles: Record<ProseVariant, typeof terminalStyles | typeof standardStyles> = {
  terminal: terminalStyles,
  standard: standardStyles,
};

/**
 * Shared component for rendering MDX content with consistent styling.
 * Supports 'terminal' (monospace, compact) and 'standard' (larger, readable) variants.
 */
export function ProseContent({
  source,
  children,
  variant = 'terminal',
  ...boxProps
}: ProseContentProps) {
  const styles = variantStyles[variant];

  return (
    <Box
      className={variant === 'standard' ? 'prose prose-lg dark:prose-invert' : undefined}
      sx={styles}
      {...boxProps}
    >
      {source ? <MDXRemote {...source} /> : children}
    </Box>
  );
}

export default ProseContent;
