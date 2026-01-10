import {
  Container,
  VStack,
  HStack,
  useColorModeValue,
  Spacer,
  Box,
  Text,
  Link as ChakraLink,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { ThemeToggleButton } from "./ThemeToggleButton";
import NextLink from "next/link";
import {
  FaGithub,
  FaEnvelope,
  FaXTwitter,
} from "react-icons/fa6";

// NavLink with terminal styling
function NavLink({ href, children }: { href: string; children: string }) {
  const router = useRouter();
  const isActive = router.asPath === href || router.asPath.startsWith(href + '/');
  const activeColor = useColorModeValue("#1a1a1a", "#e0e0e0");
  const inactiveColor = useColorModeValue("#666666", "#999999");

  return (
    <NextLink href={href} passHref>
      <Box
        as="span"
        fontFamily="mono"
        fontWeight={isActive ? "bold" : 400}
        color={isActive ? activeColor : inactiveColor}
        fontSize="14px"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          color: activeColor,
        }}
      >
        {children}
      </Box>
    </NextLink>
  );
}

// Simple text logo
function Logo() {
  const router = useRouter();
  const isActive = router.asPath === "/";
  const textColor = useColorModeValue("#1a1a1a", "#e0e0e0");

  return (
    <NextLink href="/" passHref>
      <Text
        fontFamily="mono"
        fontWeight="bold"
        fontSize="14px"
        color={textColor}
        cursor="pointer"
        opacity={isActive ? 1 : 0.7}
        transition="opacity 0.2s"
        _hover={{ opacity: 1 }}
      >
        IM
      </Text>
    </NextLink>
  );
}

function Layout({ children }: PropsWithChildren) {
  const borderColor = useColorModeValue("rgba(0, 0, 0, 0.1)", "rgba(255, 255, 255, 0.1)");
  const textColor = useColorModeValue("#1a1a1a", "#e0e0e0");
  const subtleColor = useColorModeValue("#666666", "#999999");

  return (
    <Container maxW="72ch" centerContent>
      <Box
        as="nav"
        display="flex"
        width="100%"
        px={6}
        py={4}
        mb={12}
        alignItems="center"
        borderBottom={`1px solid`}
        borderColor={borderColor}
      >
        <HStack spacing={4} align="center">
          <Logo />
        </HStack>
        <Spacer />
        <HStack spacing={4} align="center">
          <NavLink href="/about">about</NavLink>
          <NavLink href="/writing">writing</NavLink>
          <NavLink href="/now">now</NavLink>
          <ThemeToggleButton />
        </HStack>
      </Box>

      <VStack width="100%" py={12} align="flex-start" spacing={8}>
        {children}
      </VStack>

      {/* Footer */}
      <VStack
        width="100%"
        py={8}
        spacing={4}
        borderTop="1px solid"
        borderColor={borderColor}
        align="center"
      >
        {/* Social Icons */}
        <HStack spacing={4}>
          <ChakraLink href="https://github.com/Imamatdin" isExternal>
            <Icon
              as={FaGithub}
              boxSize={4}
              color={subtleColor}
              _hover={{ color: textColor }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="https://twitter.com/Imamatdin_S" isExternal>
            <Icon
              as={FaXTwitter}
              boxSize={4}
              color={subtleColor}
              _hover={{ color: textColor }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="mailto:imamatdinsultaniyazov@gmail.com" isExternal>
            <Icon
              as={FaEnvelope}
              boxSize={4}
              color={subtleColor}
              _hover={{ color: textColor }}
              transition="color 0.2s"
            />
          </ChakraLink>
        </HStack>

        <Text fontFamily="mono" fontSize="12px" color={subtleColor}>
          {new Date().getFullYear()} Imamatdin Sultaniyazov
        </Text>
      </VStack>
    </Container>
  );
}

export default Layout;
