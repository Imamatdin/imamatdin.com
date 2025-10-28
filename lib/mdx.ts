import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import fs from "fs";
import remarkGfm from "remark-gfm";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export type Content<TMetadata = { [key: string]: any }> =
  MDXRemoteSerializeResult<Record<string, unknown>, TMetadata>;

export type MaybeContent<TMetadata> = Content<TMetadata> | undefined;

export async function getMdxContent<TMetadata>(
  ...paths: string[]
): Promise<MaybeContent<TMetadata>> {
  const contentPath = path.join(process.cwd(), "content", ...paths);
  if (!fs.existsSync(contentPath)) {
    return undefined;
  }

  const content = fs.readFileSync(contentPath, "utf8");
  const source = await serialize(content, {
    parseFrontmatter: true,
    mdxOptions: {
      development: false,
      remarkPlugins: [remarkGfm],
    },
  });

  return source as Content<TMetadata>;
}
