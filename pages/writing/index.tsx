import {
  Heading,
  Link,
  Text,
  VStack,
  Box,
  Container,
  HStack,
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
        <Box w="100%" maxW={{ base: "100%", md: "800px", lg: "900px" }} mx="auto">
          {/* Header */}
          <Box mb={10}>
            <Heading
              as="h1"
              fontFamily="heading"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="600"
              color={inkColor}
              mb={2}
            >
              Writing
            </Heading>
            <Text fontFamily="body" fontSize="md" color={inkLight}>
              Essays and thoughts.
            </Text>
          </Box>

          {/* Posts List */}
          <VStack align="stretch" spacing={0}>
            {posts.map((post, index) => (
              <Link
                key={post.url || post.title}
                href={post.url}
                target={post.external ? "_blank" : "_self"}
                _hover={{ textDecoration: 'none' }}
              >
                <HStack
                  py={5}
                  borderBottom="1px solid"
                  borderColor={borderColor}
                  transition="all 0.2s"
                  _hover={{
                    bg: 'rgba(139, 90, 43, 0.03)',
                    pl: 2
                  }}
                  justify="space-between"
                  align="flex-start"
                >
                  <Box flex={1}>
                    <HStack spacing={3} mb={1}>
                      <Text
                        fontFamily="handwriting"
                        fontSize="sm"
                        color={inkLight}
                        minW="24px"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </Text>
                      <Heading
                        as="h2"
                        fontFamily="heading"
                        fontSize={{ base: 'md', md: 'lg' }}
                        fontWeight="500"
                        color={inkColor}
                      >
                        {post.title}
                      </Heading>
                    </HStack>
                  </Box>

                  <Text
                    fontFamily="handwriting"
                    fontSize="sm"
                    color={inkLight}
                    flexShrink={0}
                    ml={4}
                  >
                    {post.date}
                  </Text>
                </HStack>
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
