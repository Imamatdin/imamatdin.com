import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import { PropsWithChildren } from 'react';
import { Eyebrow } from '../Eyebrow';

export { Eyebrow };

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
