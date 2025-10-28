import { Container, VStack, Flex, HStack, Link, useColorModeValue, Spacer, Box } from "@chakra-ui/react";
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
    'none', // Light mode: no filter
    'invert(1) brightness(0.9)' // Dark mode: invert colors
  );

  return (
    <Link href="/">
      <Box
        position="relative"
        width="40px"
        height="40px"
        cursor="pointer"
        transition="all 0.2s"
        opacity={isActive ? 1 : 0.7}
        _hover={{ opacity: 1, transform: 'scale(1.05)' }}
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
    </Link>
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