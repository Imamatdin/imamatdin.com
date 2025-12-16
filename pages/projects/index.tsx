import {
  VStack,
  Heading,
  Text,
  Container,
  Box,
  HStack,
  Grid,
  useColorModeValue,
  Badge,
  Link as ChakraLink,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';
import { Project, getProjects } from '../../lib/projects';

interface PageProps {
  projects: Project[];
}

const ProjectsPage = ({ projects }: PageProps) => {
  const bgColor = useColorModeValue('#f5f0e8', '#1a1612');
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.2)', 'rgba(168, 144, 96, 0.15)');
  const sepiaAccent = useColorModeValue('#704214', '#8b4513');

  return (
    <>
      <NextSeo
        title="Projects | Imamatdin"
        description="A collection of inventions and constructions."
      />

      <Box
        minH="100vh"
        bg={bgColor}
        position="relative"
        className="parchment-bg"
      >
        <Container maxW="1200px" py={12}>
          {/* Page title */}
          <Heading
            as="h1"
            fontFamily="handwriting"
            fontSize={{ base: '4xl', md: '5xl' }}
            color={inkColor}
            mb={4}
            textAlign="center"
            transform="rotate(-1deg)"
          >
            Inventions & Constructions
          </Heading>

          <Text
            fontFamily="body"
            fontSize="lg"
            color={inkLight}
            textAlign="center"
            mb={12}
            maxW="600px"
            mx="auto"
          >
            Things I've built or am currently building.
          </Text>

          {/* Projects grid */}
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr' }}
            gap={8}
          >
            {projects.map((project, index) => (
              <NextLink href={`/projects/${project.slug}`} key={project.slug}>
                <Box
                  p={6}
                  border="1px dashed"
                  borderColor={borderColor}
                  position="relative"
                  transition="all 0.3s"
                  cursor="pointer"
                  _hover={{
                    borderStyle: 'solid',
                    boxShadow: '4px 4px 0 rgba(139, 90, 43, 0.1)',
                    transform: 'translate(-2px, -2px)',
                  }}
                >
                  {/* Corner notation */}
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

                  {/* Project sketch placeholder */}
                  <Box
                    h="150px"
                    mb={4}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="1px dashed"
                    borderColor={borderColor}
                  >
                    {project.thumbnail ? (
                      <Box
                        as="img"
                        src={project.thumbnail}
                        alt={project.title}
                        maxH="100%"
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
                  </Box>

                  {/* Title as handwritten label */}
                  <Text
                    fontFamily="handwriting"
                    fontSize="xl"
                    color={inkColor}
                    mb={2}
                  >
                    {project.title}
                  </Text>

                  {/* Brief description */}
                  <Text
                    fontFamily="body"
                    fontSize="sm"
                    color={inkLight}
                    noOfLines={2}
                    mb={4}
                  >
                    {project.description}
                  </Text>

                  {/* Date and status */}
                  <HStack justify="space-between">
                    <Text fontFamily="handwriting" fontSize="xs" color={inkLight}>
                      {project.date}
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
                    >
                      {project.status}
                    </Badge>
                  </HStack>
                </Box>
              </NextLink>
            ))}
          </Grid>

          {/* Empty state */}
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

          {/* Page number */}
          <Text
            position="fixed"
            bottom={4}
            right={8}
            fontFamily="handwriting"
            fontSize="sm"
            color={inkLight}
            zIndex={10}
          >
            folio ii
          </Text>
        </Container>
      </Box>
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
