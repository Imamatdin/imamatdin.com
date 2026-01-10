import {
  Heading,
  Text,
  Box,
  Container,
  useColorModeValue,
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
}

const ProjectDetailPage = ({ project }: PageProps) => {
  const textColor = useColorModeValue('#1a1a1a', '#e0e0e0');
  const subtleColor = useColorModeValue('#666666', '#999999');
  const borderColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)');
  const accentColor = useColorModeValue('#0066cc', '#66b3ff');
  const codeBg = useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)');

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

      <Container maxW="650px" py={8}>
        {/* Back link */}
        <NextLink href="/projects">
          <Text
            fontFamily="mono"
            fontSize="sm"
            color={subtleColor}
            mb={6}
            cursor="pointer"
            _hover={{ color: textColor }}
            display="inline-block"
          >
            ← Back to Projects
          </Text>
        </NextLink>

        {/* Title */}
        <Heading
          as="h1"
          fontFamily="mono"
          fontSize="xl"
          color={textColor}
          mb={2}
        >
          {project.title}
        </Heading>

        {/* Date and status */}
        <Text fontFamily="mono" fontSize="12px" color={subtleColor} mb={4}>
          {formatDate(project.date)} • [{project.status}]
        </Text>

        {/* Description */}
        <Text
          fontFamily="mono"
          fontSize="14px"
          color={subtleColor}
          mb={6}
        >
          {project.description}
        </Text>

        {/* Links */}
        {project.links && project.links.length > 0 && (
          <Box mb={6}>
            <Text fontFamily="mono" fontSize="12px" color={subtleColor} mb={2}>
              Links:
            </Text>
            <VStack align="flex-start" spacing={1}>
              {project.links.map((link, i) => (
                <ChakraLink
                  key={i}
                  href={link.href}
                  isExternal
                  fontFamily="mono"
                  fontSize="14px"
                  color={accentColor}
                  textDecoration="underline"
                  _hover={{ opacity: 0.7 }}
                >
                  {link.label}
                </ChakraLink>
              ))}
            </VStack>
          </Box>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <Text fontFamily="mono" fontSize="12px" color={subtleColor} mb={6}>
            Tags: {project.tags.join(', ')}
          </Text>
        )}

        {/* Body content */}
        <Box
          fontFamily="mono"
          fontSize="14px"
          color={textColor}
          lineHeight="1.8"
          sx={{
            'h2': {
              fontFamily: 'mono',
              fontSize: 'md',
              fontWeight: 'bold',
              color: textColor,
              mt: 6,
              mb: 3,
            },
            'h3': {
              fontFamily: 'mono',
              fontSize: 'md',
              fontWeight: 'bold',
              color: textColor,
              mt: 4,
              mb: 2,
            },
            'p': {
              mb: 4,
            },
            'ul, ol': {
              pl: 5,
              mb: 4,
            },
            'li': {
              mb: 1,
            },
            'code': {
              fontFamily: 'mono',
              bg: codeBg,
              px: 1,
            },
            'a': {
              color: accentColor,
              textDecoration: 'underline',
              _hover: { opacity: 0.7 }
            }
          }}
        >
          <ReactMarkdown>{project.content || ''}</ReactMarkdown>
        </Box>
      </Container>
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

  return {
    props: {
      project,
    },
  };
};

export default ProjectDetailPage;
