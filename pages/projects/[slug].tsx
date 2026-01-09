// FILE: pages/projects/[slug].tsx

import {
  Heading,
  Text,
  Box,
  Container,
  Badge,
  HStack,
  useColorModeValue,
  Wrap,
  WrapItem,
  Link as ChakraLink,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';
import { Project, getProjects, getProjectBySlug } from '../../lib/projects';
import ReactMarkdown from 'react-markdown';

interface PageProps {
  project: Project;
  pageNumber: number;
}

const ProjectDetailPage = ({ project, pageNumber }: PageProps) => {
  const bgColor = useColorModeValue('#f5f0e8', '#1a1612');
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.2)', 'rgba(168, 144, 96, 0.15)');
  const sepiaAccent = useColorModeValue('#704214', '#8b4513');
  const codeBg = useColorModeValue('#e8dfd0', '#2a1a0a');

  if (!project) {
    return <Text>Loading...</Text>;
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <NextSeo
        title={`${project.title} | Projects`}
        description={project.description}
      />

      <Box
        minH="100vh"
        bg={bgColor}
        position="relative"
        className="parchment-bg"
      >
        <Container maxW="650px" py={12}>
          {/* Back link */}
          <NextLink href="/projects">
            <Text
              fontFamily="body"
              fontSize="sm"
              color={inkColor}
              mb={8}
              cursor="pointer"
              borderBottom="1px dashed"
              borderColor={inkLight}
              display="inline-block"
              _hover={{ borderStyle: 'solid' }}
            >
              ← Back to Projects
            </Text>
          </NextLink>

          {/* Title */}
          <Heading
            as="h1"
            fontFamily="heading"
            fontSize="3xl"
            color={inkColor}
            mb={3}
          >
            {project.title}
          </Heading>

          {/* Date and status */}
          <Text fontFamily="handwriting" fontSize="sm" color={inkLight} mb={6}>
            {formatDate(project.date)} • ({project.status})
          </Text>

          {/* Description */}
          <Text
            fontFamily="body"
            fontSize="md"
            color={inkLight}
            mb={8}
          >
            {project.description}
          </Text>

          {/* Links */}
          {project.links && project.links.length > 0 && (
            <Box mb={8}>
              <Text fontFamily="body" fontSize="sm" color={inkLight} mb={2}>
                Links:
              </Text>
              <VStack align="flex-start" spacing={1}>
                {project.links.map((link, i) => (
                  <ChakraLink
                    key={i}
                    href={link.href}
                    isExternal
                    fontFamily="body"
                    fontSize="sm"
                    color={inkColor}
                    borderBottom="1px dashed"
                    borderColor={inkLight}
                    textDecoration="none"
                    _hover={{ borderStyle: 'solid' }}
                  >
                    {link.label}
                  </ChakraLink>
                ))}
              </VStack>
            </Box>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <Text fontFamily="body" fontSize="sm" color={inkLight} mb={8}>
              Tags: {project.tags.join(', ')}
            </Text>
          )}

          {/* Body content */}
          <Box
            fontFamily="body"
            color={inkColor}
            lineHeight="tall"
            sx={{
              'h2': {
                fontFamily: 'handwriting',
                fontSize: '2xl',
                color: inkColor,
                mt: 8,
                mb: 4,
                transform: 'rotate(-0.5deg)',
              },
              'h3': {
                fontFamily: 'handwriting',
                fontSize: 'xl',
                color: inkColor,
                mt: 6,
                mb: 3,
              },
              'p': {
                mb: 4,
              },
              'ul, ol': {
                pl: 6,
                mb: 4,
              },
              'li': {
                mb: 2,
              },
              'code': {
                fontFamily: 'mono',
                bg: codeBg,
                px: 1,
                borderRadius: 'sm',
              },
            }}
          >
            <ReactMarkdown>{project.content || ''}</ReactMarkdown>
          </Box>

        </Container>
      </Box>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = getProjects();
  const paths = projects.map((project) => ({
    params: { slug: project.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const project = getProjectBySlug(params?.slug as string);
  const projects = getProjects();
  const pageNumber = projects.findIndex((p) => p.slug === params?.slug) + 1;

  return {
    props: {
      project,
      pageNumber,
    },
  };
};

export default ProjectDetailPage;
