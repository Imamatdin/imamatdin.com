import { MDXRemote } from "next-mdx-remote";
import { GetStaticPropsContext, NextPageWithLayout } from "next";
import {
  Box,
  Heading,
  Text,
  Container,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import Layout from "../../components/Layout";
import { getAllSlugs, getPost, Post as PostMetadata } from "../../lib/writing";
import { Content } from "../../lib/mdx";
import { NextSeo } from "next-seo";
import NextLink from "next/link";

interface PostProps {
  post: Content<PostMetadata>;
}

const Post: NextPageWithLayout<PostProps> = ({ post }) => {
  const textColor = useColorModeValue("#1a1a1a", "#e0e0e0");
  const subtleColor = useColorModeValue("#666666", "#999999");
  const borderColor = useColorModeValue("rgba(0,0,0,0.1)", "rgba(255,255,255,0.1)");
  const accentColor = useColorModeValue("#0066cc", "#66b3ff");
  const codeBg = useColorModeValue("rgba(0,0,0,0.05)", "rgba(255,255,255,0.05)");

  return (
    <>
      <NextSeo
        title={post.metadata.title}
        description={post.metadata.description}
        openGraph={{
          title: post.metadata.title,
          description: post.metadata.description,
        }}
      />

      <Container maxW="650px" py={8}>
        <VStack align="stretch" spacing={4}>
          {/* Title */}
          <Box>
            <Heading
              fontFamily="mono"
              fontSize={{ base: "xl", md: "2xl" }}
              color={textColor}
              fontWeight="700"
              lineHeight="1.3"
              mb={2}
            >
              {post.metadata.title}
            </Heading>

            {post.metadata.date && (
              <Text fontFamily="mono" fontSize="sm" color={subtleColor}>
                {post.metadata.date}
              </Text>
            )}
          </Box>

          {/* Divider */}
          <Box h="1px" bg={borderColor} w="100%" />

          {/* Content */}
          <Box
            fontFamily="mono"
            color={textColor}
            lineHeight="1.8"
            fontSize={{ base: "14px", md: "14px" }}
            sx={{
              '& p': { mb: 4 },
              '& h2': {
                fontFamily: 'mono',
                fontSize: 'lg',
                fontWeight: '700',
                mt: 8,
                mb: 3,
              },
              '& h3': {
                fontFamily: 'mono',
                fontSize: 'md',
                fontWeight: '700',
                mt: 6,
                mb: 2,
              },
              '& blockquote': {
                borderLeft: '2px solid',
                borderColor: borderColor,
                pl: 4,
                ml: 0,
                fontStyle: 'italic',
                color: subtleColor,
                my: 4,
              },
              '& code': {
                fontFamily: 'mono',
                bg: codeBg,
                px: 1.5,
                py: 0.5,
                fontSize: '0.9em',
              },
              '& pre': {
                bg: codeBg,
                p: 4,
                overflow: 'auto',
                my: 4,
                '& code': {
                  bg: 'transparent',
                  p: 0,
                }
              },
              '& a': {
                color: accentColor,
                textDecoration: 'underline',
                _hover: { opacity: 0.7 }
              },
              '& ul, & ol': { pl: 5, mb: 4 },
              '& li': { mb: 1 },
              '& img': {
                maxW: '100%',
                my: 6,
              },
              '& hr': {
                border: 'none',
                h: '1px',
                bg: borderColor,
                my: 8,
              },
            }}
          >
            <MDXRemote {...post.source} />
          </Box>

          {/* Back link */}
          <Box pt={6} borderTop="1px solid" borderColor={borderColor}>
            <NextLink href="/writing" passHref>
              <Text
                as="a"
                fontFamily="mono"
                fontSize="sm"
                color={subtleColor}
                _hover={{ color: textColor }}
                cursor="pointer"
              >
                ← back to writing
              </Text>
            </NextLink>
          </Box>
        </VStack>
      </Container>
    </>
  );
};

export default Post;

Post.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticPaths() {
  const paths = getAllSlugs();
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  if (!params || !params.slug || typeof params.slug !== "string") {
    return { redirect: { destination: "/" } };
  }

  const post = await getPost(params.slug as string);
  if (!post) {
    return { redirect: { destination: "/" } };
  }

  return { props: { post } };
}
