import { Container, Heading, Text, VStack, useColorModeValue } from "@chakra-ui/react";
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
  const textColor = useColorModeValue('#1a1a1a', '#e0e0e0');
  const subtleColor = useColorModeValue('#666666', '#999999');

  return (
    <>
      <NextSeo
        title="Stack | Imamatdin"
        description="The tools, apps, and hardware I use daily"
      />

      <Container maxW="650px" py={8}>
        <Heading
          fontFamily="mono"
          fontSize="xl"
          color={textColor}
          mb={2}
        >
          Stack
        </Heading>

        <Text fontFamily="mono" fontSize="14px" color={subtleColor} mb={6}>
          Tools shape how we think. Here's what I use.
        </Text>

        <VStack spacing={4} align="stretch">
          {stack.map((category) => (
            <VStack key={category.title} align="stretch" spacing={1}>
              <Text
                fontFamily="mono"
                fontSize="14px"
                fontWeight="bold"
                color={textColor}
              >
                {category.title}
              </Text>

              {category.tools.map((tool) => (
                <Text
                  key={tool.name}
                  fontFamily="mono"
                  fontSize="14px"
                  color={textColor}
                >
                  {tool.name}
                  {tool.note && (
                    <Text as="span" color={subtleColor}> — {tool.note}</Text>
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
