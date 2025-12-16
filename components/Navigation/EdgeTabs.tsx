import {
  Box,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  { label: 'Deep Dives', href: '/deep-dives' },
  { label: 'Projects', href: '/projects' },
  { label: 'Library', href: '/reading' },
  { label: 'Writing', href: '/writing' },
  { label: 'Stack', href: '/about/stack' },
];

export function EdgeTabs() {
  const router = useRouter();
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const bgColor = useColorModeValue('#e8dfd0', '#2a1a0a');
  const hoverBg = useColorModeValue('#f5f0e8', '#1a1612');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.3)', 'rgba(168, 144, 96, 0.3)');

  return (
    <VStack
      position="fixed"
      right={0}
      top="50%"
      transform="translateY(-50%)"
      zIndex={100}
      spacing={1}
      display={{ base: 'none', md: 'flex' }}
    >
      {navItems.map((item) => {
        const isActive = router.asPath.startsWith(item.href);

        return (
          <NextLink href={item.href} key={item.href}>
            <Box
              display="flex"
              alignItems="center"
              bg={isActive ? hoverBg : bgColor}
              border="1px solid"
              borderColor={borderColor}
              borderRight="none"
              borderTopLeftRadius="sm"
              borderBottomLeftRadius="sm"
              py={2}
              px={2}
              w="40px"
              overflow="hidden"
              transition="all 0.3s ease"
              cursor="pointer"
              _hover={{
                w: 'auto',
                minW: '120px',
                bg: hoverBg,
              }}
            >
              <Text
                fontFamily="handwriting"
                fontSize="sm"
                color={isActive ? inkColor : inkLight}
                fontWeight={isActive ? 'medium' : 'normal'}
                whiteSpace="nowrap"
              >
                {item.label}
              </Text>
            </Box>
          </NextLink>
        );
      })}
    </VStack>
  );
}

export default EdgeTabs;
