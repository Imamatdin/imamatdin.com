import { Container, VStack, Flex, HStack, Link, useColorModeValue, Spacer } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { ThemeToggleButton } from "./ThemeToggleButton";

function NavLink({ href, children }: { href: string; children: string }) {
  const router = useRouter();
  const isActive = router.asPath === href;
  const activeColor = useColorModeValue("accent", "accent");
  const inactiveColor = useColorModeValue("text", "text");

  return (
    <Link href={href} fontWeight={isActive ? "bold" : "normal"} color={isActive ? activeColor : inactiveColor} _hover={{ color: activeColor }} fontSize="lg">
      {children}
    </Link>
  );
}

function Layout({ children }: PropsWithChildren) {
  const borderColor = useColorModeValue("brand.subtle", "brand.subtle");

  return (
    <Container maxW="container.md" centerContent>
      <Flex as="nav" width="100%" px={4} py={3} mb={8} align="center" borderBottom="1px solid" borderColor={borderColor}>
        <HStack spacing={8}>
          <NavLink href="/">Home</NavLink>
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