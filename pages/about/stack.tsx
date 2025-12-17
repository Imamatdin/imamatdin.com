import { Container, Heading, Text, VStack, Box, useColorModeValue } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Layout from "../../components/Layout";

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
    <Layout>
      <NextSeo
        title="Stack | Imamatdin"
        description="The tools, apps, and hardware I use daily"
      />

      <Container maxW="container.md" px={4}>
        <Heading
          as="h1"
          fontFamily="handwriting"
          fontSize={{ base: '2xl', md: '3xl' }}
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
            <Box key={category.title}>
              <Text
                fontFamily="body"
                fontSize="xs"
                fontWeight="bold"
                color={inkLight}
                letterSpacing="wider"
                mb={2}
              >
                {category.title}
              </Text>

              <VStack align="stretch" spacing={1} pl={4}>
                {category.tools.map((tool) => (
                  <Text
                    key={tool.name}
                    fontFamily="body"
                    fontSize="sm"
                    color={inkColor}
                  >
                    {tool.name}
                    {tool.note && (
                      <Text as="span" color={inkLight}> — {tool.note}</Text>
                    )}
                  </Text>
                ))}
              </VStack>
            </Box>
          ))}
        </VStack>

        <Box pt={8} mt={8} borderTop="1px dashed" borderColor={borderColor}>
          <Text fontFamily="handwriting" fontSize="sm" color={inkLight} fontStyle="italic">
            "The best tool is the one you'll actually use."
          </Text>
        </Box>
      </Container>
    </Layout>
  );
}
