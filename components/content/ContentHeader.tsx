import { Heading, Text, VStack, Badge, Box, Divider } from '@chakra-ui/react';
import { ReactNode } from 'react';

export type ContentHeaderVariant = 'terminal' | 'standard';

interface ContentHeaderProps {
  /** Main title */
  title: string;
  /** Optional subtitle (e.g., author name) */
  subtitle?: string | null;
  /** Optional date to display */
  date?: string | null;
  /** Date format - how to display the date */
  dateFormat?: 'full' | 'month-year' | 'year';
  /** Date prefix text (e.g., "Read in", "Encountered in") */
  datePrefix?: string;
  /** Optional badge text */
  badge?: string | null;
  /** Badge color scheme */
  badgeColorScheme?: string;
  /** Additional metadata to render */
  children?: ReactNode;
  /** Styling variant */
  variant?: ContentHeaderVariant;
  /** Whether to show divider below header */
  showDivider?: boolean;
}

function formatDate(
  dateStr: string,
  format: 'full' | 'month-year' | 'year' = 'month-year'
): string {
  const date = new Date(dateStr);

  switch (format) {
    case 'full':
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    case 'year':
      return date.getFullYear().toString();
    case 'month-year':
    default:
      return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
  }
}

/**
 * Consistent header for content detail pages.
 * Supports terminal (compact, monospace) and standard (larger) variants.
 */
export function ContentHeader({
  title,
  subtitle,
  date,
  dateFormat = 'month-year',
  datePrefix,
  badge,
  badgeColorScheme = 'blue',
  children,
  variant = 'terminal',
  showDivider = true,
}: ContentHeaderProps) {
  const isTerminal = variant === 'terminal';

  return (
    <>
      <VStack align="flex-start" spacing={isTerminal ? 2 : 4}>
        <Heading
          fontFamily={isTerminal ? 'mono' : undefined}
          fontSize={isTerminal ? 'xl' : '4xl'}
          fontWeight="bold"
          lineHeight={isTerminal ? '1.3' : '1.2'}
          color="text"
        >
          {title}
        </Heading>

        {subtitle && (
          <Text
            fontFamily={isTerminal ? 'mono' : undefined}
            fontSize={isTerminal ? '14px' : 'xl'}
            color="subtle"
          >
            {isTerminal ? `by ${subtitle}` : subtitle}
          </Text>
        )}

        {date && (
          <Text
            fontFamily={isTerminal ? 'mono' : undefined}
            fontSize={isTerminal ? '12px' : 'sm'}
            color="subtle"
          >
            {datePrefix ? `${datePrefix} ` : ''}
            {formatDate(date, dateFormat)}
          </Text>
        )}

        {badge && (
          <Badge colorScheme={badgeColorScheme} fontSize="sm">
            {badge}
          </Badge>
        )}

        {children}
      </VStack>

      {showDivider && (
        isTerminal ? (
          <Divider borderColor="border" />
        ) : (
          <Box
            height="1px"
            bg="gray.200"
            _dark={{ bg: 'gray.700' }}
            my={4}
          />
        )
      )}
    </>
  );
}

export default ContentHeader;
