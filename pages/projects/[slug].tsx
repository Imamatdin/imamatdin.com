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
        <Container maxW="800px" py={16}>
          {/* Back link */}
          <NextLink href="/projects">
            <Text
              fontFamily="handwriting"
              fontSize="sm"
              color={inkLight}
              mb={8}
              cursor="pointer"
              _hover={{ color: inkColor }}
            >
              back to projects
            </Text>
          </NextLink>

          {/* Title */}
          <Heading
            as="h1"
            fontFamily="handwriting"
            fontSize={{ base: '3xl', md: '4xl' }}
            color={inkColor}
            mb={2}
            transform="rotate(-1deg)"
          >
            {project.title}
          </Heading>

          {/* Date and status */}
          <HStack spacing={4} mb={6}>
            <Text
              fontFamily="handwriting"
              fontSize="sm"
              color={inkLight}
            >
              {formatDate(project.date)}
            </Text>
            <Badge
              bg="transparent"
              color={sepiaAccent}
              fontFamily="handwriting"
              fontSize="sm"
              border="1px solid"
              borderColor={sepiaAccent}
              borderRadius="none"
              textTransform="lowercase"
            >
              {project.status}
            </Badge>
          </HStack>

          {/* Description */}
          <Text
            fontFamily="body"
            fontSize="lg"
            color={inkLight}
            mb={8}
          >
            {project.description}
          </Text>

          {/* Links */}
          {project.links && project.links.length > 0 && (
            <Box mb={8}>
              <Text
                fontFamily="handwriting"
                fontSize="sm"
                color={inkLight}
                mb={2}
              >
                links:
              </Text>
              <VStack align="flex-start" spacing={1}>
                {project.links.map((link, i) => (
                  <ChakraLink
                    key={i}
                    href={link.href}
                    isExternal
                    fontFamily="body"
                    fontSize="sm"
                    color={sepiaAccent}
                    borderBottom="1px dashed"
                    borderColor={sepiaAccent}
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
            <Wrap spacing={2} mb={8}>
              {project.tags.map((tag) => (
                <WrapItem key={tag}>
                  <Text
                    fontFamily="handwriting"
                    fontSize="xs"
                    color={inkLight}
                    px={2}
                    py={1}
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    {tag}
                  </Text>
                </WrapItem>
              ))}
            </Wrap>
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
