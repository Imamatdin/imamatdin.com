import { Container, VStack, Flex, HStack, useColorModeValue, Spacer, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { ThemeToggleButton } from "./ThemeToggleButton";
import Image from "next/image";
import NextLink from "next/link";

function NavLink({ href, children }: { href: string; children: string }) {
  const router = useRouter();
  const isActive = router.asPath === href;
  const activeColor = useColorModeValue("accent", "accent");
  const inactiveColor = useColorModeValue("text", "text");

  return (
    <NextLink href={href}>
      <Box
        as="span"
        fontWeight={isActive ? "bold" : "normal"}
        color={isActive ? activeColor : inactiveColor}
        fontSize="lg"
        cursor="pointer"
        transition="color 0.2s"
        onMouseEnter={(e) => e.currentTarget.style.color = activeColor}
        onMouseLeave={(e) => e.currentTarget.style.color = isActive ? activeColor : inactiveColor}
      >
        {children}
      </Box>
    </NextLink>
  );
}

function MuseumIcon() {
  const router = useRouter();
  const isActive = router.asPath === "/";
  const filter = useColorModeValue(
    'none',
    'invert(1) brightness(0.9)'
  );

  return (
    <NextLink href="/">
      <Box
        position="relative"
        width="40px"
        height="40px"
        cursor="pointer"
        transition="all 0.2s"
        style={{ opacity: isActive ? 1 : 0.7 }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = isActive ? '1' : '0.7';
          e.currentTarget.style.transform = 'scale(1)';
        }}
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

function Layout({ children }: PropsWithChildren) {
  const borderColor = useColorModeValue("brand.subtle", "brand.subtle");

  return (
    <Container maxW="container.md" centerContent>
      <Flex as="nav" width="100%" px={4} py={3} mb={8} align="center" borderBottom="1px solid" borderColor={borderColor}>
        <HStack spacing={8}>
          <MuseumIcon />
          <NavLink href="/reading">Reading</NavLink>
          <NavLink href="/writing">Writing</NavLink>
          <NavLink href="/deep-dives">Deep Dives</NavLink>
          <NavLink href="/about">About</NavLink>
        </HStack>
        <Spacer />
        <ThemeToggleButton />
      </Flex>

      <VStack width="100%" pb={16} align="flex-start">
        {children}
      </VStack>
    </Container>
  );
}

export default Layout;