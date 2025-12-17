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
  const inkColor = useColorModeValue('#3a2a1a', '#e8dfd0');
  const inkLight = useColorModeValue('#6b5c4a', '#a89060');
  const borderColor = useColorModeValue('rgba(139, 90, 43, 0.3)', 'rgba(168, 144, 96, 0.3)');

  return (
    <>
      <NextSeo title="Writing | Imamatdin" />
      <Container maxW="container.lg" px={{ base: 4, md: 8, lg: 12 }}>
        <Box w="100%" maxW={{ base: "100%", md: "700px", lg: "800px" }} mx="auto">
          <Heading
            as="h1"
            fontFamily="handwriting"
            fontSize={{ base: '2xl', md: '3xl' }}
            color={inkColor}
            mb={2}
          >
            Writing
          </Heading>

          <Text fontFamily="body" fontSize="md" color={inkLight} mb={8}>
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
                  py={4}
                  borderBottom="1px dashed"
                  borderColor={borderColor}
                  transition="opacity 0.2s"
                  _hover={{ opacity: 0.7 }}
                >
                  <Text
                    fontFamily="body"
                    fontSize="lg"
                    fontWeight="medium"
                    color={inkColor}
                    mb={1}
                  >
                    {post.title}
                  </Text>
                  <Text
                    fontFamily="handwriting"
                    fontSize="sm"
                    color={inkLight}
                  >
                    {post.date}
                  </Text>
                </Box>
              </Link>
            ))}
          </VStack>
        </Box>
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
