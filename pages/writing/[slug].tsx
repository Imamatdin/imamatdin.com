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
  // Light mode: warm paper | Dark mode: dark but with subtle warmth
  const pageBg = useColorModeValue("#FFFCF0", "#151413");
  const inkColor = useColorModeValue("#2a1a0a", "#e8dfd0");
  const dateColor = useColorModeValue("#6b5c4a", "#7a756d");
  const borderColor = useColorModeValue(
    "rgba(139, 90, 43, 0.25)",
    "rgba(139, 90, 43, 0.15)"
  );
  const codeBg = useColorModeValue(
    "rgba(139, 90, 43, 0.08)",
    "rgba(139, 90, 43, 0.15)"
  );

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

      <Box bg={pageBg} minH="100vh" py={{ base: 8, md: 12 }}>
        <Container maxW="650px">
          <VStack align="stretch" spacing={6}>

            {/* Title - handwritten style */}
            <Box>
              <Heading
                fontFamily="handwriting"
                fontSize={{ base: "2xl", md: "3xl" }}
                color={inkColor}
                fontWeight="700"
                lineHeight="1.3"
                mb={2}
              >
                {post.metadata.title}
              </Heading>

              {post.metadata.date && (
                <Text
                  fontFamily="handwriting"
                  fontSize="md"
                  color={dateColor}
                >
                  {post.metadata.date}
                </Text>
              )}
            </Box>

            {/* Divider */}
            <Box h="1px" bg={borderColor} w="40%" />

            {/* Content */}
            <Box
              fontFamily="body"
              color={inkColor}
              lineHeight="1.85"
              fontSize={{ base: "md", md: "lg" }}
              sx={{
                '& p': { mb: 5 },
                '& h2': {
                  fontFamily: 'handwriting',
                  fontSize: 'xl',
                  fontWeight: '700',
                  mt: 10,
                  mb: 4,
                },
                '& h3': {
                  fontFamily: 'handwriting',
                  fontSize: 'lg',
                  fontWeight: '700',
                  mt: 8,
                  mb: 3,
                },
                '& blockquote': {
                  borderLeft: '3px solid',
                  borderColor: borderColor,
                  pl: 4,
                  ml: 0,
                  fontStyle: 'italic',
                  color: dateColor,
                  my: 6,
                },
                '& code': {
                  fontFamily: 'mono',
                  bg: codeBg,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 'sm',
                  fontSize: '0.9em',
                },
                '& pre': {
                  bg: codeBg,
                  p: 4,
                  borderRadius: 'md',
                  overflow: 'auto',
                  my: 6,
                  '& code': {
                    bg: 'transparent',
                    p: 0,
                  }
                },
                '& a': {
                  color: 'accent',
                  borderBottom: '1px dashed',
                  borderColor: 'accent',
                  _hover: { borderStyle: 'solid' }
                },
                '& ul, & ol': { pl: 6, mb: 5 },
                '& li': { mb: 2 },
                '& img': {
                  maxW: '100%',
                  my: 8,
                  borderRadius: 'md',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                },
                '& hr': {
                  border: 'none',
                  h: '1px',
                  bg: borderColor,
                  my: 10,
                },
                /* Poetry/verse styling for br tags */
                '& br': {
                  display: 'block',
                  content: '""',
                  mb: 1,
                }
              }}
            >
              <MDXRemote {...post.source} />
            </Box>

            {/* Back link */}
            <Box pt={10} borderTop="1px dashed" borderColor={borderColor}>
              <NextLink href="/writing" passHref>
                <Text
                  as="a"
                  fontFamily="handwriting"
                  fontSize="md"
                  color={dateColor}
                  _hover={{ color: inkColor }}
                  cursor="pointer"
                >
                  ← back to writing
                </Text>
              </NextLink>
            </Box>
          </VStack>
        </Container>
      </Box>
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
