import { Container, Heading, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

interface Fact {
  category: string;
  content: string;
}

const facts: Fact[] = [
  {
    category: "Origin",
    content: "I'm from Nukus, Karakalpakstan—a place most people have never heard of. It's home to the second-largest collection of Russian avant-garde art in the world, hidden in the middle of the desert."
  },
  {
    category: "Languages",
    content: "I speak Karakalpak (native), Russian (fluent), Uzbek (fluent), English (fluent), and I'm learning Turkish. Each language unlocks a different way of thinking."
  },
  {
    category: "Basketball",
    content: "I've played basketball for 5+ years. It taught me that raw talent means nothing without discipline—and that the best players make everyone around them better."
  },
  {
    category: "Sleep",
    content: "I'm naturally a night owl but forcing myself to become a morning person. The quiet hours before sunrise are when my best thinking happens."
  },
  {
    category: "Memory",
    content: "I can't remember faces well, but I never forget a conversation. Ideas stick with me longer than names."
  },
  {
    category: "Reading",
    content: "I read multiple books at once—usually one fiction, one non-fiction, and something philosophical. Switching between them keeps my mind fresh."
  },
  {
    category: "Music",
    content: "I code to lo-fi and classical. I think to ambient. I work out to everything else. Music is my context switch."
  },
  {
    category: "Food",
    content: "Karakalpak cuisine is underrated. Beshbarmaq (boiled meat with noodles) is comfort food that tells a story of nomadic survival."
  },
  {
    category: "Writing",
    content: "I write to understand what I think. If I can't explain something in writing, I don't really understand it."
  },
  {
    category: "Aral Sea",
    content: "I grew up near one of the world's worst environmental disasters—the Aral Sea dried up in my grandparents' lifetime. It shaped my interest in environmental engineering."
  },
  {
    category: "Name",
    content: "Imamatdin means 'pillar of faith' in Arabic. My parents chose it hoping I'd be someone people could rely on."
  },
  {
    category: "Fear",
    content: "My biggest fear isn't failure—it's mediocrity. The thought of living a comfortable but unremarkable life terrifies me more than any risk."
  }
];

export default function Facts() {
  const textColor = useColorModeValue('#1a1a1a', '#e0e0e0');
  const subtleColor = useColorModeValue('#666666', '#999999');

  return (
    <>
      <NextSeo
        title="Interesting Things | Imamatdin"
        description="Random facts and things you might not know about me"
      />

      <Container maxW="650px" py={8}>
        <VStack align="stretch" spacing={6}>
          <Heading fontFamily="mono" fontSize="xl" color={textColor} mb={2}>
            Interesting Things
          </Heading>

          <Text fontFamily="mono" fontSize="14px" color={subtleColor} mb={2}>
            Random facts, preferences, and pieces of who I am that don't fit anywhere else.
          </Text>

          <VStack align="stretch" spacing={4}>
            {facts.map((fact, index) => (
              <VStack key={index} align="stretch" spacing={1}>
                <Text
                  fontFamily="mono"
                  fontSize="14px"
                  color={textColor}
                  fontWeight="bold"
                >
                  {fact.category}
                </Text>
                <Text fontFamily="mono" fontSize="14px" lineHeight="1.8" color={subtleColor}>
                  {fact.content}
                </Text>
              </VStack>
            ))}
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
