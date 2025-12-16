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
import Image from "next/image";
import NextLink from "next/link";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaTelegram,
  FaXTwitter,
} from "react-icons/fa6";
import { SiSubstack } from "react-icons/si";

// NavLink with Da Vinci colors
function NavLink({ href, children }: { href: string; children: string }) {
  const router = useRouter();
  const isActive = router.asPath === href || router.asPath.startsWith(href + '/');
  const activeColor = useColorModeValue("#704214", "#8b4513");
  const inactiveColor = useColorModeValue("#6b5c4a", "#a89060");

  return (
    <NextLink href={href} passHref>
      <Box
        as="span"
        fontFamily="handwriting"
        fontWeight={isActive ? "bold" : 500}
        color={isActive ? activeColor : inactiveColor}
        fontSize="md"
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

// Museum Icon with Da Vinci styling
function MuseumIcon() {
  const router = useRouter();
  const isActive = router.asPath === "/";
  const filter = useColorModeValue(
    "sepia(30%)",
    "invert(1) brightness(0.9) sepia(20%)"
  );

  return (
    <NextLink href="/" passHref>
      <Box
        position="relative"
        width="32px"
        height="32px"
        mr={2}
        cursor="pointer"
        style={{
          opacity: isActive ? 1 : 0.7,
          transition: "opacity 0.2s, transform 0.2s",
        }}
        _hover={{ opacity: 1, transform: "scale(1.08)" }}
      >
        <Image
          src="/icons/museum-savitsky.png"
          alt="Home"
          fill
          style={{
            objectFit: "contain",
            filter: filter,
            transition: "filter 0.3s ease",
          }}
        />
      </Box>
    </NextLink>
  );
}

// Footer link with Da Vinci styling
function FooterLink({ href, children }: { href: string; children: string }) {
  const linkColor = useColorModeValue("#704214", "#8b4513");

  return (
    <NextLink href={href} passHref legacyBehavior>
      <ChakraLink
        fontSize="sm"
        fontFamily="handwriting"
        color={linkColor}
        transition="opacity 0.2s"
        _hover={{ opacity: 0.7 }}
      >
        {children}
      </ChakraLink>
    </NextLink>
  );
}

function Layout({ children }: PropsWithChildren) {
  const borderColor = useColorModeValue(
    "rgba(139, 90, 43, 0.2)",
    "rgba(168, 144, 96, 0.15)"
  );
  const inkLight = useColorModeValue("#6b5c4a", "#a89060");
  const inkColor = useColorModeValue("#3a2a1a", "#e8dfd0");

  return (
    <Container maxW="container.md" centerContent>
      <Box
        as="nav"
        display="flex"
        width="100%"
        px={6}
        py={3}
        mb={8}
        alignItems="center"
        borderBottom={`1px solid`}
        borderColor={borderColor}
      >
        <HStack spacing={4} align="center">
          <MuseumIcon />
        </HStack>
        <Spacer />
        <HStack spacing={3} align="center">
          <NavLink href="/about">About</NavLink>
          <Box display={{ base: "none", md: "block" }}>
            <NavLink href="/now">Now</NavLink>
          </Box>
          <ThemeToggleButton />
        </HStack>
      </Box>

      <VStack width="100%" pb={16} align="flex-start" spacing={8}>
        {children}
      </VStack>

      {/* Footer */}
      <VStack
        width="100%"
        py={8}
        spacing={3}
        borderTop="1px solid"
        borderColor={borderColor}
        align="center"
      >
        <HStack spacing={4} flexWrap="wrap" justify="center">
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/writing">Writing</FooterLink>
          <FooterLink href="/reading">Library</FooterLink>
          <FooterLink href="/deep-dives">Deep Dives</FooterLink>
          <FooterLink href="/projects">Projects</FooterLink>
        </HStack>

        {/* Social Icons */}
        <HStack spacing={5} pt={1}>
          <ChakraLink href="https://twitter.com/Imamatdin_S" isExternal>
            <Icon
              as={FaXTwitter}
              boxSize={5}
              color={inkLight}
              _hover={{ color: inkColor }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="https://github.com/Imamatdin" isExternal>
            <Icon
              as={FaGithub}
              boxSize={5}
              color={inkLight}
              _hover={{ color: inkColor }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink
            href="https://www.linkedin.com/in/imamatdin-sultaniyazov"
            isExternal
          >
            <Icon
              as={FaLinkedin}
              boxSize={5}
              color={inkLight}
              _hover={{ color: inkColor }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink
            href="https://www.substack.com/@imamatdinsultaniyazov"
            isExternal
          >
            <Icon
              as={SiSubstack}
              boxSize={5}
              color={inkLight}
              _hover={{ color: inkColor }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="https://t.me/Imamatdin_Sultaniyazov" isExternal>
            <Icon
              as={FaTelegram}
              boxSize={5}
              color={inkLight}
              _hover={{ color: inkColor }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="mailto:imamatdinsultniyazov@gmail.com" isExternal>
            <Icon
              as={FaEnvelope}
              boxSize={5}
              color={inkLight}
              _hover={{ color: inkColor }}
              transition="color 0.2s"
            />
          </ChakraLink>
        </HStack>

        <Text fontFamily="handwriting" fontSize="sm" color={inkLight}>
          {new Date().getFullYear()} Imamatdin Sultaniyazov
        </Text>
      </VStack>
    </Container>
  );
}

export default Layout;
