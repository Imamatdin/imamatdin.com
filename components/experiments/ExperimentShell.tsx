import { Box, Text, TextProps } from '@chakra-ui/react';
import NextLink from 'next/link';
import { PropsWithChildren } from 'react';

export const Eyebrow = (props: TextProps) => (
  <Text
    as="div"
    fontFamily="mono"
    fontSize="11px"
    textTransform="uppercase"
    letterSpacing="0.071em"
    color="subtle"
    {...props}
  />
);

export function ExperimentShell({ trail, children }: PropsWithChildren<{ trail?: string }>) {
  return (
    <Box width="100%">
      <Eyebrow mb={10}>
        <NextLink href="/design-experiments" className="ink-link">
          design-experiments
        </NextLink>
        {trail && ` / ${trail}`}
      </Eyebrow>
      {children}
    </Box>
  );
}
