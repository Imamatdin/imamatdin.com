import { Container, Heading, Text } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

export default function Now() {
  return (
    <>
      <NextSeo
        title="Now | Imamatdin"
        description="What I'm working on right now"
      />

      <Container maxW="650px" py={4}>
        <Heading fontFamily="mono" fontSize="xl" color="text" mb={4}>
          Now
        </Heading>

        <Text fontFamily="mono" fontSize="14px" color="text" lineHeight="1.8">
          Cooking cool stuff on AI and robotics engineering. Will update soon.
        </Text>
      </Container>
    </>
  );
}
