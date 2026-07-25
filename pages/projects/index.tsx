import {
  VStack,
  Heading,
  Text,
  Container,
  Box,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { GetStaticProps } from 'next';
import { Project, getProjects } from '../../lib/projects';

interface PageProps {
  projects: Project[];
}

const ProjectsPage = ({ projects }: PageProps) => {

  return (
    <>
      <NextSeo
        title="Projects | Imamatdin"
        description="A collection of inventions and constructions."
      />

      <Container maxW="650px" py={4}>
        <Heading
          fontFamily="mono"
          fontSize="xl"
          color="text"
          mb={2}
        >
          Projects
        </Heading>

        <Text
          fontFamily="mono"
          fontSize="14px"
          color="subtle"
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
                borderColor="border"
                cursor="pointer"
                transition="opacity 0.2s"
                // The whole card is an anchor, so the underline has to be
                // switched off here and put back on the title alone.
                textDecoration="none"
                _hover={{ opacity: 0.7 }}
              >
                <Text
                  fontFamily="mono"
                  fontSize="14px"
                  fontWeight="bold"
                  color="text"
                  textDecoration="underline"
                  mb={1}
                >
                  {project.title}
                </Text>
                <Text
                  fontFamily="mono"
                  fontSize="14px"
                  color="subtle"
                  textDecoration="none"
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
            color="subtle"
            textAlign="center"
            py={4}
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
