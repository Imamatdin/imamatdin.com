import { Container, Heading, Text, VStack, Box, HStack } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

interface Tool {
  name: string;
  description?: string;
  badge?: string;
}

interface Category {
  title: string;
  tools: Tool[];
}

const stack: Category[] = [
  {
    title: "Hardware",
    tools: [
      { name: "HP Envy x360", description: "My daily driver. Versatile 2-in-1 that handles everything from coding to note-taking." },
      { name: "Samsung A56", description: "Does what I need. No fancy flagship required." },
    ]
  },
  {
    title: "AI Arsenal",
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
    tools: [
      { name: "Comet", description: "Primary browser. Clean and fast." },
      { name: "Chrome", description: "When I need extensions or compatibility." },
      { name: "Edge", description: "PDF reading and Microsoft integrations." },
    ]
  },
  {
    title: "Development",
    tools: [
      { name: "VS Code", description: "The obvious choice. Extensions make it infinitely customizable." },
      { name: "Default Terminal", description: "No fancy setup. It works." },
      { name: "Python", description: "My go-to for everything from scripts to ML." },
      { name: "C++", description: "Currently learning. Pain builds character." },
    ]
  },
  {
    title: "Productivity",
    tools: [
      { name: "Obsidian", description: "Second brain for notes and writing. Markdown + local files = peace of mind." },
      { name: "Physical Notebook", description: "Task management. Simple. No notifications. Can't be hacked." },
      { name: "Google Calendar", description: "Tried alternatives. Nothing comes close. If it's not on the calendar, it doesn't exist." },
    ]
  },
  {
    title: "Creative",
    tools: [
      { name: "Figma", description: "UI design and prototyping.", badge: "Pro" },
      { name: "Scribble", description: "The website that erases everything if you stop writing. Forces flow state." },
    ]
  },
  {
    title: "Infrastructure",
    tools: [
      { name: "Vercel", description: "Deploy and forget. This site runs on it." },
      { name: "GitHub", description: "Code lives here. Version control is non-negotiable." },
      { name: "Namecheap", description: "Where I buy domains. Cheap and reliable." },
    ]
  },
  {
    title: "What I Don't Use",
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

          <VStack spacing={10} align="stretch">
            {stack.map((category) => (
              <Box key={category.title}>
                <Heading size="sm" color="gray.500" _dark={{ color: "gray.400" }} mb={4} textTransform="uppercase" letterSpacing="wider">
                  {category.title}
                </Heading>

                <VStack align="stretch" spacing={3}>
                  {category.tools.map((tool) => (
                    <HStack key={tool.name} justify="space-between" align="flex-start">
                      <Box>
                        <HStack spacing={2} align="center">
                          <Text fontWeight="medium" color="accent">
                            {tool.name}
                          </Text>
                          {tool.badge && (
                            <Text fontSize="xs" color="gray.400">
                              ({tool.badge})
                            </Text>
                          )}
                        </HStack>
                        {tool.description && (
                          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} mt={0.5}>
                            {tool.description}
                          </Text>
                        )}
                      </Box>
                    </HStack>
                  ))}
                </VStack>
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
