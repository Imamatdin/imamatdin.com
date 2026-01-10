import {
  Heading,
  Link,
  Text,
  VStack,
  Box,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import { getAllPostData, Post } from "../../lib/writing";
import type { NextPageWithLayout } from "next";
import Layout from "../../components/Layout";
import { NextSeo } from "next-seo";

interface WritingProps {
  posts: Post[];
}

const Writing: NextPageWithLayout<WritingProps> = ({ posts }) => {
  const textColor = useColorModeValue('#1a1a1a', '#e0e0e0');
  const subtleColor = useColorModeValue('#666666', '#999999');
  const borderColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)');

  return (
    <>
      <NextSeo title="Writing | Imamatdin" />
      <Container maxW="650px" py={8}>
        <Heading
          fontFamily="mono"
          fontSize="xl"
          color={textColor}
          mb={2}
        >
          Writing
        </Heading>

        <Text fontFamily="mono" fontSize="14px" color={subtleColor} mb={6}>
          Essays and thoughts.
        </Text>

        <VStack align="stretch" spacing={0}>
          {posts.map((post) => (
            <Link
              key={post.url || post.title}
              href={post.url}
              target={post.external ? "_blank" : "_self"}
              _hover={{ textDecoration: 'none' }}
            >
              <Box
                py={3}
                borderBottom="1px solid"
                borderColor={borderColor}
                transition="opacity 0.2s"
                _hover={{ opacity: 0.7 }}
              >
                <Text
                  fontFamily="mono"
                  fontSize="14px"
                  fontWeight="medium"
                  color={textColor}
                  mb={1}
                >
                  {post.title}
                </Text>
                <Text
                  fontFamily="mono"
                  fontSize="12px"
                  color={subtleColor}
                >
                  {post.date}
                </Text>
              </Box>
            </Link>
          ))}
        </VStack>
      </Container>
    </>
  );
};

export default Writing;

Writing.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps() {
  const posts = getAllPostData();
  return { props: { posts } };
}
