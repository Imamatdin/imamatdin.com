import { Container, Heading, Text, VStack, Box, useColorModeValue } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

interface Tool {
  name: string;
  note?: string;
}

interface Category {
  title: string;
  tools: Tool[];
}

const stack: Category[] = [
  {
    title: "HARDWARE",
    tools: [
      { name: "HP Envy x360", note: "daily driver" },
      { name: "Samsung A56", note: "phone" },
    ]
  },
  {
    title: "AI",
    tools: [
      { name: "Claude Pro", note: "deep thinking, writing" },
      { name: "Perplexity Pro", note: "research" },
      { name: "Gemini Pro", note: "quick questions" },
      { name: "GPT", note: "general tasks" },
      { name: "DeepSeek", note: "code" },
      { name: "Grok", note: "real-time" },
    ]
  },
  {
    title: "BROWSERS",
    tools: [
      { name: "Comet", note: "primary" },
      { name: "Chrome", note: "extensions" },
      { name: "Edge", note: "PDFs" },
    ]
  },
  {
    title: "DEV",
    tools: [
      { name: "VS Code" },
      { name: "Terminal" },
      { name: "Python" },
      { name: "C++", note: "learning" },
    ]
  },
  {
    title: "PRODUCTIVITY",
    tools: [
      { name: "Obsidian", note: "notes" },
      { name: "Physical notebook", note: "tasks" },
      { name: "Google Calendar" },
    ]
  },
  {
    title: "CREATIVE",
    tools: [
      { name: "Figma Pro" },
      { name: "Scribble", note: "flow state" },
    ]
  },
  {
    title: "INFRA",
    tools: [
      { name: "Vercel" },
      { name: "GitHub" },
      { name: "Namecheap" },
    ]
  },
];

export default function Stack() {
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.3)', 'rgba(168, 144, 96, 0.3)');

  return (
    <>
      <NextSeo
        title="Stack | Imamatdin"
        description="The tools, apps, and hardware I use daily"
      />

      <Container maxW="650px" py={12}>
        <Heading
          fontFamily="heading"
          fontSize="3xl"
          color={inkColor}
          mb={2}
        >
          Stack
        </Heading>

        <Text fontFamily="body" fontSize="md" color={inkLight} mb={8}>
          Tools shape how we think. Here's what I use.
        </Text>

        <VStack spacing={6} align="stretch">
          {stack.map((category) => (
            <VStack key={category.title} align="stretch" spacing={2}>
              <Text
                fontFamily="handwriting"
                fontSize="lg"
                fontWeight="bold"
                color={inkColor}
              >
                {category.title}
              </Text>

              {category.tools.map((tool) => (
                <Text
                  key={tool.name}
                  fontFamily="body"
                  fontSize="md"
                  color={inkColor}
                >
                  {tool.name}
                  {tool.note && (
                    <Text as="span" color={inkLight}> — {tool.note}</Text>
                  )}
                </Text>
              ))}
            </VStack>
          ))}
        </VStack>
      </Container>
    </>
  );
}
