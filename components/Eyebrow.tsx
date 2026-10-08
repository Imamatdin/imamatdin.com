import { Text, TextProps } from '@chakra-ui/react';

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
