import {
  Box,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  useColorModeValue,
  Link as ChakraLink,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FaGithub, FaLinkedin, FaEnvelope, FaTelegram, FaXTwitter } from 'react-icons/fa6';
import { SiSubstack } from 'react-icons/si';

const navItems = [
  { label: 'Deep Dives', href: '/deep-dives' },
  { label: 'Projects', href: '/projects' },
  { label: 'Library', href: '/reading' },
  { label: 'Writing', href: '/writing' },
  { label: 'Stack', href: '/about/stack' },
  { label: 'About', href: '/about' },
];

export function CornerNav() {
  const router = useRouter();
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const menuBg = useColorModeValue('#f5f0e8', '#1a1612');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.3)', 'rgba(168, 144, 96, 0.3)');
  const hoverBg = useColorModeValue('rgba(139, 90, 43, 0.1)', 'rgba(168, 144, 96, 0.1)');

  // Get current page name for bottom-left indicator
  const getCurrentPage = () => {
    const path = router.asPath;
    if (path === '/') return 'home';
    const item = navItems.find(nav => path.startsWith(nav.href));
    return item?.label.toLowerCase() || 'page';
  };

  return (
    <>
      {/* Top-left: Home/Logo */}
      <NextLink href="/">
        <Box
          position="fixed"
          top={4}
          left={4}
          zIndex={100}
          fontFamily="handwriting"
          fontSize="xl"
          color={inkColor}
          cursor="pointer"
          transition="color 0.2s"
          _hover={{ color: 'accent' }}
        >
          I.M.
        </Box>
      </NextLink>

      {/* Top-right: Menu */}
      <Box
        position="fixed"
        top={4}
        right={4}
        zIndex={100}
      >
        <Menu>
          <MenuButton
            as={Text}
            fontFamily="handwriting"
            fontSize="sm"
            color={inkLight}
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: inkColor }}
          >
            index
          </MenuButton>
          <MenuList
            bg={menuBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="none"
            fontFamily="handwriting"
            boxShadow="4px 4px 0 rgba(139, 90, 43, 0.1)"
            py={2}
          >
            {navItems.map((item) => (
              <NextLink href={item.href} key={item.href}>
                <MenuItem
                  bg="transparent"
                  color={router.asPath.startsWith(item.href) ? inkColor : inkLight}
                  fontWeight={router.asPath.startsWith(item.href) ? 'medium' : 'normal'}
                  _hover={{ bg: hoverBg }}
                  px={4}
                  py={2}
                >
                  {item.label}
                </MenuItem>
              </NextLink>
            ))}
          </MenuList>
        </Menu>
      </Box>

      {/* Bottom-left: Current page indicator */}
      <Text
        position="fixed"
        bottom={4}
        left={4}
        zIndex={100}
        fontFamily="handwriting"
        fontSize="xs"
        color={inkLight}
        transform="rotate(-90deg)"
        transformOrigin="left bottom"
      >
        {getCurrentPage()}
      </Text>

      {/* Bottom-right: Social/Contact */}
      <HStack
        position="fixed"
        bottom={4}
        right={4}
        zIndex={100}
        spacing={3}
      >
        <ChakraLink href="https://github.com/Imamatdin" isExternal>
          <Icon
            as={FaGithub}
            boxSize={4}
            color={inkLight}
            _hover={{ color: inkColor }}
            transition="color 0.2s"
          />
        </ChakraLink>
        <ChakraLink href="https://twitter.com/Imamatdin_S" isExternal>
          <Icon
            as={FaXTwitter}
            boxSize={4}
            color={inkLight}
            _hover={{ color: inkColor }}
            transition="color 0.2s"
          />
        </ChakraLink>
        <ChakraLink href="https://www.linkedin.com/in/imamatdin-sultaniyazov" isExternal>
          <Icon
            as={FaLinkedin}
            boxSize={4}
            color={inkLight}
            _hover={{ color: inkColor }}
            transition="color 0.2s"
          />
        </ChakraLink>
        <ChakraLink href="https://t.me/Imamatdin_Sultaniyazov" isExternal>
          <Icon
            as={FaTelegram}
            boxSize={4}
            color={inkLight}
            _hover={{ color: inkColor }}
            transition="color 0.2s"
          />
        </ChakraLink>
      </HStack>
    </>
  );
}

export default CornerNav;
