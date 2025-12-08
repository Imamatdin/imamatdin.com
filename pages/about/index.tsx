import { Container, Heading, Text, VStack, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { NextSeo } from "next-seo";

export default function About() {
  return (
    <>
      <NextSeo
        title="About | Imamatdin"
        description="Learn more about me, my culture, interests, and influences"
      />
      
      <Container maxW="2xl" py={12}>
        <VStack align="stretch" spacing={8}>
          <Heading size="2xl">About</Heading>
          
          <Text fontSize="lg" lineHeight="tall">
            I'm Imamatdin, an 18-year-old from Karakalpakstan passionate about emerging tech, 
            engineering, and culture. I'm currently in a gap year preparing university applications 
            while working on technical projects and content creation.
          </Text>

          <Text fontSize="lg" lineHeight="tall">
            I spend my time building things—from reinforcement learning simulations for datacenter 
            cooling to Telegram bots for digital libraries. I'm drawn to systems that bridge 
            theory and practice, whether that's in code, research, or writing.
          </Text>

          <Text fontSize="lg" lineHeight="tall">
            You can explore my{" "}
            <Link as={NextLink} href="/reading" color="accent">
              reading notes
            </Link>
            ,{" "}
            <Link as={NextLink} href="/writing" color="accent">
              essays and reflections
            </Link>
            , or{" "}
            <Link as={NextLink} href="/deep-dives" color="accent">
              deep dives
            </Link>
            {" "}into topics I care about.
          </Text>

          <Text fontSize="lg" lineHeight="tall">
            I'm fascinated by Russian literature—Dostoevsky, Tolstoy, Chekhov—and 
            philosophy from Nietzsche to Camus to Aristotle. I perform Ibrayim Yusupov poems 
            reflecting my Karakalpak heritage. You can read about{" "}
            <Link as={NextLink} href="/about/culture" color="accent">
              my culture
            </Link>
            {" "}and the{" "}
            <Link as={NextLink} href="/about/poetry" color="accent">
              poetry and art
            </Link>
            {" "}that moves me.
          </Text>

          <Text fontSize="lg" lineHeight="tall">
            I keep an{" "}
            <Link as={NextLink} href="/about/ideas" color="accent">
              idea diary
            </Link>
            {" "}documenting how I encounter and develop thoughts. I write about{" "}
            <Link as={NextLink} href="/about/academics" color="accent">
              professors and forgotten scientists
            </Link>
            {" "}who've shaped my path, and share{" "}
            <Link as={NextLink} href="/about/podcasts" color="accent">
              podcasts
            </Link>
            {" "}I listen to and{" "}
            <Link as={NextLink} href="/about/facts" color="accent">
              interesting things
            </Link>
            {" "}about myself.
          </Text>

          <Text fontSize="lg" lineHeight="tall" color="gray.600" _dark={{ color: "gray.400" }}>
            You are here, in the wilderness of my mind.
          </Text>
        </VStack>
      </Container>
    </>
  );
}