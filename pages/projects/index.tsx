import { VStack, HStack, Heading, Text, Container, Box, Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';
import { Project, getProjects } from '../../lib/projects';

interface PageProps {
  projects: Project[];
}

/**
 * Hand-ordered rather than sorted by date — this is the order he wants people
 * to read them in. Anything not listed falls to the bottom, newest first.
 */
const ORDER = [
  'radiative-cooling-control',
  'sentinel',
  'thermotouch',
  'buildcored',
  'flowcored',
  'agentic-os',
  'aral-basin-platform',
];

const ProjectsPage = ({ projects }: PageProps) => (
  <>
    <NextSeo
      title="Projects | Imamatdin"
      description="Things I've built or am currently building."
    />

    <Container maxW="650px" py={4}>
      <Heading fontFamily="mono" fontSize="xl" color="text" mb={2}>
        Projects
      </Heading>

      <Text fontFamily="mono" fontSize="14px" color="subtle" mb={8}>
        Things I&apos;ve built or am currently building.
      </Text>

      <VStack align="stretch" spacing={7}>
        {projects.map((project) => (
          <Box key={project.slug}>
            <NextLink href={`/projects/${project.slug}`}>
              <Text
                as="div"
                fontFamily="mono"
                fontSize="14px"
                fontWeight="bold"
                color="accent"
                textDecoration="underline"
                cursor="pointer"
                _hover={{ opacity: 0.7 }}
              >
                {project.title}
              </Text>
            </NextLink>

            <Text as="div" fontFamily="mono" fontSize="14px" color="subtle" lineHeight="1.7" mt={1}>
              {project.description}
            </Text>

            {project.links && project.links.length > 0 && (
              <HStack as="div" spacing={3} mt={2} flexWrap="wrap">
                {project.links.map((link) => (
                  <ChakraLink
                    key={link.href}
                    href={link.href}
                    isExternal={link.href.startsWith('http')}
                    fontFamily="mono"
                    fontSize="12px"
                    color="subtle"
                    textDecoration="underline"
                    _hover={{ color: 'accent' }}
                  >
                    {link.label.toLowerCase()}
                  </ChakraLink>
                ))}
              </HStack>
            )}
          </Box>
        ))}
      </VStack>
    </Container>
  </>
);

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const rank = (slug: string) => {
    const i = ORDER.indexOf(slug);
    return i === -1 ? ORDER.length : i;
  };

  const projects = getProjects().sort((a, b) => {
    const byOrder = rank(a.slug) - rank(b.slug);
    if (byOrder !== 0) return byOrder;
    // Unlisted projects keep their newest-first ordering.
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return { props: { projects } };
};

export default ProjectsPage;
