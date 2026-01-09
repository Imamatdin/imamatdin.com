import {
  VStack,
  Heading,
  Text,
  Container,
  Box,
  useColorModeValue,
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
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.2)', 'rgba(168, 144, 96, 0.15)');

  return (
    <>
      <NextSeo
        title="Projects | Imamatdin"
        description="A collection of inventions and constructions."
      />

      <Container maxW="650px" py={12}>
        <Heading
          fontFamily="heading"
          fontSize="3xl"
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

        <VStack align="stretch" spacing={6}>
          {projects.map((project) => (
            <NextLink href={`/projects/${project.slug}`} key={project.slug}>
              <Box
                py={4}
                borderBottom="1px dashed"
                borderColor={borderColor}
                cursor="pointer"
                transition="opacity 0.2s"
                _hover={{ opacity: 0.7 }}
              >
                <Text
                  fontFamily="body"
                  fontSize="lg"
                  fontWeight="bold"
                  color={inkColor}
                  mb={1}
                >
                  {project.title} ({project.status})
                </Text>
                <Text
                  fontFamily="body"
                  fontSize="md"
                  color={inkLight}
                >
                  {project.description}
                </Text>
              </Box>
            </NextLink>
          ))}
        </VStack>

        {projects.length === 0 && (
          <Text
            fontFamily="body"
            fontSize="md"
            color={inkLight}
            textAlign="center"
            py={12}
          >
            More projects coming soon...
          </Text>
        )}
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
