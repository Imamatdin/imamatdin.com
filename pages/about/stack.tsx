import { Container, Heading, Text, VStack, Box, SimpleGrid, Badge, HStack } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

interface Tool {
  name: string;
  description?: string;
  badge?: string;
}

interface Category {
  title: string;
  icon: string;
  tools: Tool[];
}

const stack: Category[] = [
  {
    title: "Hardware",
    icon: "💻",
    tools: [
      { name: "HP Envy x360", description: "My daily driver. Versatile 2-in-1 that handles everything from coding to note-taking." },
      { name: "Samsung A56", description: "Does what I need. No fancy flagship required." },
    ]
  },
  {
    title: "AI Arsenal",
    icon: "🤖",
    tools: [
      { name: "Claude", description: "Deep thinking, long-form writing, coding assistance.", badge: "Pro" },
      { name: "Perplexity", description: "Research and fact-checking. Replaced Google for most searches.", badge: "Pro" },
      { name: "Gemini", description: "Quick questions, integration with Google ecosystem.", badge: "Pro" },
      { name: "GPT", description: "General tasks, image generation." },
      { name: "DeepSeek", description: "Code generation and technical problems." },
      { name: "Grok", description: "Real-time information, unfiltered responses." },
    ]
  },
  {
    title: "Browsers",
    icon: "🌐",
    tools: [
      { name: "Comet", description: "Primary browser. Clean and fast." },
      { name: "Chrome", description: "When I need extensions or compatibility." },
      { name: "Edge", description: "PDF reading and Microsoft integrations." },
    ]
  },
  {
    title: "Development",
    icon: "⌨️",
    tools: [
      { name: "VS Code", description: "The obvious choice. Extensions make it infinitely customizable." },
      { name: "Default Terminal", description: "No fancy setup. It works." },
      { name: "Python", description: "My go-to for everything from scripts to ML." },
      { name: "C++", description: "Currently learning. Pain builds character." },
    ]
  },
  {
    title: "Productivity",
    icon: "📋",
    tools: [
      { name: "Obsidian", description: "Second brain for notes and writing. Markdown + local files = peace of mind." },
      { name: "Physical Notebook", description: "Task management. Simple. No notifications. Can't be hacked." },
      { name: "Google Calendar", description: "Tried alternatives. Nothing comes close. If it's not on the calendar, it doesn't exist." },
    ]
  },
  {
    title: "Creative",
    icon: "🎨",
    tools: [
      { name: "Figma", description: "UI design and prototyping.", badge: "Pro" },
      { name: "Scribble", description: "The website that erases everything if you stop writing. Forces flow state." },
    ]
  },
  {
    title: "Infrastructure",
    icon: "🚀",
    tools: [
      { name: "Vercel", description: "Deploy and forget. This site runs on it." },
      { name: "GitHub", description: "Code lives here. Version control is non-negotiable." },
      { name: "Namecheap", description: "Where I buy domains. Cheap and reliable." },
    ]
  },
  {
    title: "What I Don't Use",
    icon: "🚫",
    tools: [
      { name: "Music while working", description: "Silence or nothing. Music is for full attention, not background noise." },
      { name: "Headphones", description: "Don't own any. Probably should." },
      { name: "Fancy task apps", description: "Tried Notion, Todoist, Things. Always came back to paper." },
    ]
  },
];

export default function Stack() {
  return (
    <>
      <NextSeo
        title="Stack | Imamatdin"
        description="The tools, apps, and hardware I use daily"
      />

      <Container maxW="4xl" py={12}>
        <VStack align="stretch" spacing={8}>
          <Box>
            <Heading size="2xl" mb={2}>Stack</Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }}>
              Tools shape how we think. Here's what I use to build, write, and stay organized.
            </Text>
          </Box>

          <VStack spacing={8} align="stretch">
            {stack.map((category) => (
              <Box key={category.title}>
                <HStack mb={4}>
                  <Text fontSize="2xl">{category.icon}</Text>
                  <Heading size="md" color="gray.600" _dark={{ color: "gray.400" }}>
                    {category.title}
                  </Heading>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  {category.tools.map((tool) => (
                    <Box
                      key={tool.name}
                      p={4}
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                      _dark={{ borderColor: "gray.700" }}
                    >
                      <HStack justify="space-between" align="flex-start" mb={1}>
                        <Text fontWeight="bold" color="accent">
                          {tool.name}
                        </Text>
                        {tool.badge && (
                          <Badge colorScheme="green" fontSize="xs">
                            {tool.badge}
                          </Badge>
                        )}
                      </HStack>
                      {tool.description && (
                        <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                          {tool.description}
                        </Text>
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </VStack>

          <Box pt={4} borderTop="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }}>
            <Text fontSize="sm" color="gray.500" fontStyle="italic">
              "The best tool is the one you'll actually use."
            </Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
}
