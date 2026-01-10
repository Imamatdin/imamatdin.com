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
  const textColor = useColorModeValue('#1a1a1a', '#e0e0e0');
  const subtleColor = useColorModeValue('#666666', '#999999');
  const borderColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)');

  return (
    <>
      <NextSeo
        title="Projects | Imamatdin"
        description="A collection of inventions and constructions."
      />

      <Container maxW="650px" py={8}>
        <Heading
          fontFamily="mono"
          fontSize="xl"
          color={textColor}
          mb={2}
        >
          Projects
        </Heading>

        <Text
          fontFamily="mono"
          fontSize="14px"
          color={subtleColor}
          mb={6}
        >
          Things I've built or am currently building.
        </Text>

        <VStack align="stretch" spacing={4}>
          {projects.map((project) => (
            <NextLink href={`/projects/${project.slug}`} key={project.slug}>
              <Box
                py={3}
                borderBottom="1px solid"
                borderColor={borderColor}
                cursor="pointer"
                transition="opacity 0.2s"
                _hover={{ opacity: 0.7 }}
              >
                <Text
                  fontFamily="mono"
                  fontSize="14px"
                  fontWeight="bold"
                  color={textColor}
                  mb={1}
                >
                  {project.title} [{project.status}]
                </Text>
                <Text
                  fontFamily="mono"
                  fontSize="14px"
                  color={subtleColor}
                >
                  {project.description}
                </Text>
              </Box>
            </NextLink>
          ))}
        </VStack>

        {projects.length === 0 && (
          <Text
            fontFamily="mono"
            fontSize="14px"
            color={subtleColor}
            textAlign="center"
            py={8}
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
