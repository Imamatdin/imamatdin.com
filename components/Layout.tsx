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
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { ThemeToggleButton } from "./ThemeToggleButton";
import NextLink from "next/link";
import {
  FaGithub,
  FaXTwitter,
  FaLinkedin,
  FaTelegram,
  FaEnvelope,
} from "react-icons/fa6";
import { SiSubstack } from "react-icons/si";

// NavLink with terminal styling and keyboard hint
function NavLink({ href, children, shortcut }: { href: string; children: string; shortcut?: string }) {
  const router = useRouter();
  const isActive = router.asPath === href || router.asPath.startsWith(href + '/');

  return (
    <NextLink href={href} passHref>
      <HStack spacing={1} as="span">
        <Box
          as="span"
          fontFamily="mono"
          fontWeight={isActive ? "bold" : 400}
          color={isActive ? "text" : "subtle"}
          fontSize="14px"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            color: "text",
          }}
        >
          {children}
        </Box>
        {shortcut && (
          <Box
            as="span"
            fontFamily="mono"
            fontSize="11px"
            color="subtle"
            opacity={0.5}
            display={{ base: "none", md: "inline" }}
          >
            [{shortcut}]
          </Box>
        )}
      </HStack>
    </NextLink>
  );
}

// Logo with icon and name
function Logo() {
  const iconFilter = useColorModeValue("none", "invert(1)");

  return (
    <NextLink href="/" passHref>
      <HStack spacing={2} cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.2s">
        <Image
          src="/icons/museum-savitsky.png"
          alt="Museum icon"
          boxSize="24px"
          objectFit="contain"
          filter={iconFilter}
          className="logo-icon"
        />
        <Text
          fontFamily="mono"
          fontWeight="bold"
          fontSize="14px"
          color="text"
        >
          Imamatdin
        </Text>
      </HStack>
    </NextLink>
  );
}

function Layout({ children }: PropsWithChildren) {
  return (
    <Container maxW="72ch" centerContent>
      {/* Header: Logo + Now + Theme Toggle */}
      <Box
        display="flex"
        width="100%"
        px={6}
        py={4}
        alignItems="center"
      >
        <Logo />
        <Spacer />
        <HStack spacing={3}>
          <NavLink href="/now" shortcut="g n">now</NavLink>
          <ThemeToggleButton />
        </HStack>
      </Box>

      {/* Divider */}
      <Box
        width="100%"
        borderBottom="1px solid"
        borderColor="border"
      />

      {/* Navigation below divider */}
      <Box
        as="nav"
        width="100%"
        px={6}
        py={3}
        mb={0}
      >
        <HStack spacing={{ base: 4, md: 6 }} justify="center" flexWrap="wrap">
          <NavLink href="/writing" shortcut="g w">writing</NavLink>
          <NavLink href="/projects" shortcut="g p">projects</NavLink>
          <NavLink href="/deep-dives" shortcut="g d">deep-dives</NavLink>
        </HStack>
      </Box>

      {/* Main content */}
      <VStack width="100%" pt={0} pb={8} align="flex-start" spacing={4}>
        {children}
      </VStack>

      {/* Footer */}
      <VStack
        width="100%"
        py={6}
        spacing={3}
        borderTop="1px solid"
        borderColor="border"
        align="center"
      >
        {/* Social Icons */}
        <HStack spacing={4}>
          <ChakraLink href="https://x.com/Imamatdin_S" isExternal>
            <Icon
              as={FaXTwitter}
              boxSize={4}
              color="subtle"
              _hover={{ color: "text" }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="https://www.substack.com/@imamatdinsultaniyazov" isExternal>
            <Icon
              as={SiSubstack}
              boxSize={4}
              color="subtle"
              _hover={{ color: "text" }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="https://www.linkedin.com/in/imamatdin-sultaniyazov" isExternal>
            <Icon
              as={FaLinkedin}
              boxSize={4}
              color="subtle"
              _hover={{ color: "text" }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="https://t.me/Imamatdin_Sultaniyazov" isExternal>
            <Icon
              as={FaTelegram}
              boxSize={4}
              color="subtle"
              _hover={{ color: "text" }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="https://github.com/Imamatdin" isExternal>
            <Icon
              as={FaGithub}
              boxSize={4}
              color="subtle"
              _hover={{ color: "text" }}
              transition="color 0.2s"
            />
          </ChakraLink>
          <ChakraLink href="mailto:imamatdinsultaniyazov@gmail.com">
            <Icon
              as={FaEnvelope}
              boxSize={4}
              color="subtle"
              _hover={{ color: "text" }}
              transition="color 0.2s"
            />
          </ChakraLink>
        </HStack>

        <Text fontFamily="mono" fontSize="12px" color="subtle">
          {new Date().getFullYear()} Imamatdin Sultaniyazov
        </Text>
      </VStack>
    </Container>
  );
}

export default Layout;
