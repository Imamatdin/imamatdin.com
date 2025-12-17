import {
  VStack,
  Heading,
  Text,
  Container,
  Box,
  HStack,
  useColorModeValue,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';
import { Project, getProjects } from '../../lib/projects';

interface PageProps {
  projects: Project[];
}

const ProjectsPage = ({ projects }: PageProps) => {
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.3)', 'rgba(168, 144, 96, 0.3)');
  const sepiaAccent = useColorModeValue('#704214', '#8b4513');
  const sketchBg = useColorModeValue('rgba(139, 90, 43, 0.05)', 'rgba(139, 90, 43, 0.1)');

  return (
    <>
      <NextSeo
        title="Projects | Imamatdin"
        description="A collection of inventions and constructions."
      />

      <Container maxW="container.lg" px={{ base: 4, md: 8, lg: 12 }}>
        <Box w="100%" maxW={{ base: "100%", md: "800px", lg: "900px" }} mx="auto">
          {/* Header */}
          <Box mb={10}>
            <Heading
              as="h1"
              fontFamily="heading"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="600"
              color={inkColor}
              mb={2}
            >
              Projects
            </Heading>
            <Text fontFamily="body" fontSize="md" color={inkLight}>
              Things I've built or am currently building.
            </Text>
          </Box>

          {/* Projects Grid/List */}
          <VStack align="stretch" spacing={8}>
            {projects.map((project, index) => (
              <NextLink href={`/projects/${project.slug}`} key={project.slug}>
                <Box
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ transform: 'translateY(-2px)' }}
                >
                  {/* Sketch Area */}
                  <Box
                    h={{ base: "140px", md: "180px" }}
                    mb={4}
                    bg={sketchBg}
                    border="1px dashed"
                    borderColor={borderColor}
                    position="relative"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                  >
                    {project.thumbnail ? (
                      <Box
                        as="img"
                        src={project.thumbnail}
                        alt={project.title}
                        maxH="100%"
                        maxW="100%"
                        objectFit="contain"
                        filter="sepia(20%) contrast(95%)"
                      />
                    ) : (
                      <Text
                        fontFamily="handwriting"
                        fontSize="lg"
                        color={inkLight}
                        opacity={0.5}
                      >
                        [sketch pending]
                      </Text>
                    )}

                    {/* Figure label */}
                    <Text
                      position="absolute"
                      bottom={2}
                      right={3}
                      fontFamily="handwriting"
                      fontSize="xs"
                      color={inkLight}
                    >
                      fig. {index + 1}
                    </Text>
                  </Box>

                  {/* Project Info */}
                  <HStack justify="space-between" align="flex-start" mb={2}>
                    <Heading
                      as="h2"
                      fontFamily="heading"
                      fontSize={{ base: 'lg', md: 'xl' }}
                      fontWeight="500"
                      color={inkColor}
                    >
                      {project.title}
                    </Heading>
                    <Badge
                      bg="transparent"
                      color={sepiaAccent}
                      fontFamily="handwriting"
                      fontSize="xs"
                      border="1px solid"
                      borderColor={sepiaAccent}
                      borderRadius="none"
                      textTransform="lowercase"
                      flexShrink={0}
                    >
                      {project.status}
                    </Badge>
                  </HStack>

                  <Text
                    fontFamily="body"
                    fontSize="sm"
                    color={inkLight}
                    mb={2}
                    lineHeight="tall"
                  >
                    {project.description}
                  </Text>

                  <Text
                    fontFamily="handwriting"
                    fontSize="sm"
                    color={inkLight}
                  >
                    {project.date}
                  </Text>

                  {/* Divider */}
                  <Box
                    mt={6}
                    h="1px"
                    bg={borderColor}
                    w="100%"
                  />
                </Box>
              </NextLink>
            ))}
          </VStack>

          {projects.length === 0 && (
            <Text
              fontFamily="body"
              fontSize="lg"
              color={inkLight}
              textAlign="center"
              py={12}
            >
              More projects coming soon...
            </Text>
          )}
        </Box>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const projects = getProjects();

  return {
    props: {
      projects,
    },
  };
};

export default ProjectsPage;
