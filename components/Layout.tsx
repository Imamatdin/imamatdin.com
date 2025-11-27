import { Container, VStack, Flex, HStack, useColorModeValue, Spacer, Box, Text, Link as ChakraLink, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { ThemeToggleButton } from "./ThemeToggleButton";
import Image from "next/image";
import NextLink from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope, FaTelegram, FaXTwitter } from "react-icons/fa6";
import { SiSubstack } from "react-icons/si";

// NavLink with Flexoki colors
function NavLink({ href, children }: { href: string; children: string }) {
  const router = useRouter();
  const isActive = router.asPath === href;
  const activeColor = useColorModeValue("#BC5215", "#DA702C"); // Flexoki orange-600 / orange-400
  const inactiveColor = useColorModeValue("#6F6E69", "#878580"); // Flexoki base-600 / base-500

  return (
    <NextLink href={href} passHref>
      <Box
        as="span"
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

// Smaller, less dominant icon
function MuseumIcon() {
  const router = useRouter();
  const isActive = router.asPath === "/";
  const filter = useColorModeValue('none', 'invert(1) brightness(0.9)');

  return (
    <NextLink href="/" passHref>
      <Box
        position="relative"
        width="32px"
        height="32px"
        mr={2}
        cursor="pointer"
        style={{ opacity: isActive ? 1 : 0.7, transition: "opacity 0.2s, transform 0.2s" }}
        _hover={{ opacity: 1, transform: "scale(1.08)" }}
      >
        <Image
          src="/icons/museum-savitsky.png"
          alt="Home"
          fill
          style={{
            objectFit: 'contain',
            filter: filter,
            transition: 'filter 0.3s ease'
          }}
        />
      </Box>
    </NextLink>
  );
}

// Footer link component with Flexoki colors
function FooterLink({ href, children }: { href: string; children: string }) {
  const linkColor = useColorModeValue("#BC5215", "#DA702C"); // Flexoki orange-600 / orange-400

  return (
    <NextLink href={href} passHref legacyBehavior>
      <ChakraLink
        fontSize="md"
        fontWeight="medium"
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
  const borderColor = useColorModeValue("#E6E4D9", "#282726"); // Flexoki base-100 / base-900

  return (
    <Container maxW="container.md" centerContent>
      <Flex
        as="nav"
        width="100%"
        px={6} py={3} mb={8}
        align="center"
        borderBottom="1px solid"
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
      </Flex>

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
        <HStack spacing={4}>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/writing">Writing</FooterLink>
          <FooterLink href="/reading">Bookshelf</FooterLink>
          <FooterLink href="/deep-dives">Projects</FooterLink>
        </HStack>
        
        {/* Social Icons */}
        <HStack spacing={5} pt={1}>
          <ChakraLink href="https://twitter.com/Imamatdin_S" isExternal>
            <Icon
              as={FaXTwitter}
              boxSize={5}
              color="gray.500"
              _hover={{ color: "gray.700" }}
              _dark={{ color: "gray.500", _hover: { color: "gray.300" } }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="https://github.com/Imamatdin" isExternal>
            <Icon
              as={FaGithub}
              boxSize={5}
              color="gray.500"
              _hover={{ color: "gray.700" }}
              _dark={{ color: "gray.500", _hover: { color: "gray.300" } }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="https://www.linkedin.com/in/imamatdin-sultaniyazov" isExternal>
            <Icon
              as={FaLinkedin}
              boxSize={5}
              color="gray.500"
              _hover={{ color: "gray.700" }}
              _dark={{ color: "gray.500", _hover: { color: "gray.300" } }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="https://www.substack.com/@imamatdinsultaniyazov" isExternal>
            <Icon
              as={SiSubstack}
              boxSize={5}
              color="gray.500"
              _hover={{ color: "gray.700" }}
              _dark={{ color: "gray.500", _hover: { color: "gray.300" } }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="https://t.me/Imamatdin_Sultaniyazov" isExternal>
            <Icon
              as={FaTelegram}
              boxSize={5}
              color="gray.500"
              _hover={{ color: "gray.700" }}
              _dark={{ color: "gray.500", _hover: { color: "gray.300" } }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="mailto:imamatdinsultniyazov@gmail.com" isExternal>
            <Icon
              as={FaEnvelope}
              boxSize={5}
              color="gray.500"
              _hover={{ color: "gray.700" }}
              _dark={{ color: "gray.500", _hover: { color: "gray.300" } }}
              transition="color 0.2s"
            />
          </ChakraLink>
        </HStack>
        
        <Text fontSize="sm" color="gray.500">
          © {new Date().getFullYear()} Imamatdin Sultaniyazov
        </Text>
      </VStack>
    </Container>
  );
}

export default Layout;