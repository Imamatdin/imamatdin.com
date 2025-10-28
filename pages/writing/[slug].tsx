import { MDXRemote } from "next-mdx-remote";
import { GetStaticPropsContext, NextPageWithLayout } from "next";
import { Heading, Flex } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import Layout from "../../components/Layout";
import { getAllSlugs, getPost, Post as PostMetadata } from "../../lib/writing";
import { Content } from "../../lib/mdx";
import { NextSeo } from "next-seo";

interface PostProps {
  post: Content<PostMetadata>;
}

const Post: NextPageWithLayout<PostProps> = ({ post }) => {
  if (!post.frontmatter) {
    return null;
  }

  return (
    <>
      <NextSeo
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        openGraph={{
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          images: [
            {
              url:
                post.frontmatter.image || "https://adammaj.com/og-image-dark.jpg",
            },
          ],
        }}
      />
      <Flex direction="column" gap={2}>
        <Heading size="lg">{post.frontmatter.title}</Heading>
        <Prose>
          <MDXRemote {...post} />
        </Prose>
      </Flex>
    </>
  );
};

export default Post;

Post.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticPaths() {
  const paths = getAllSlugs();

  return {
    paths,
    fallback: false,
  };
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
