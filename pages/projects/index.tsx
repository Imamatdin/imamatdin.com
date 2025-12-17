import {
  VStack,
  Heading,
  Text,
  Container,
  Box,
  HStack,
  useColorModeValue,
  Badge,
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

  return (
    <>
      <NextSeo
        title="Projects | Imamatdin"
        description="A collection of inventions and constructions."
      />

      <Container maxW="container.lg" px={{ base: 4, md: 8, lg: 12 }}>
        <Box w="100%" maxW={{ base: "100%", md: "700px", lg: "800px" }} mx="auto">
        <Heading
          as="h1"
          fontFamily="handwriting"
          fontSize={{ base: '2xl', md: '3xl' }}
          color={inkColor}
          mb={2}
        >
          Projects
        </Heading>

        <Text
          fontFamily="body"
          fontSize="md"
          color={inkLight}
          mb={8}
        >
          Things I've built or am currently building.
        </Text>

        <VStack align="stretch" spacing={8}>
          {projects.map((project, index) => (
            <NextLink href={`/projects/${project.slug}`} key={project.slug}>
              <Box
                py={6}
                borderBottom="1px dashed"
                borderColor={borderColor}
                cursor="pointer"
                transition="opacity 0.2s"
                _hover={{ opacity: 0.7 }}
              >
                {/* Sketch/thumbnail area */}
                <Box
                  h="120px"
                  mb={4}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="1px dashed"
                  borderColor={borderColor}
                  position="relative"
                >
                  {project.thumbnail ? (
                    <Box
                      as="img"
                      src={project.thumbnail}
                      alt={project.title}
                      maxH="100%"
                      maxW="100%"
                      objectFit="contain"
                      filter="sepia(30%) contrast(90%)"
                    />
                  ) : (
                    <Text
                      fontFamily="handwriting"
                      fontSize="sm"
                      color={inkLight}
                    >
                      [sketch]
                    </Text>
                  )}
                  <Text
                    position="absolute"
                    top={2}
                    right={2}
                    fontFamily="handwriting"
                    fontSize="xs"
                    color={inkLight}
                  >
                    fig. {index + 1}
                  </Text>
                </Box>

                <HStack justify="space-between" align="flex-start" mb={1}>
                  <Text
                    fontFamily="body"
                    fontSize="lg"
                    fontWeight="medium"
                    color={inkColor}
                  >
                    {project.title}
                  </Text>
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
                >
                  {project.description}
                </Text>
                <Text
                  fontFamily="handwriting"
                  fontSize="xs"
                  color={inkLight}
                  borderBottom="1px dashed"
                  borderColor={borderColor}
                  display="inline-block"
                >
                  {project.date}
                </Text>
              </Box>
            </NextLink>
          ))}
        </VStack>

        {projects.length === 0 && (
          <Text
            fontFamily="handwriting"
            fontSize="lg"
            color={inkLight}
            textAlign="center"
            py={12}
          >
            More inventions coming soon...
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
