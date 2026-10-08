/** @type {import('next').NextConfig} */

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});
module.exports = withMDX({
  async redirects() {
    return [
      { source: "/books/:slug*", destination: "/library/:slug*", permanent: true },
      { source: "/reading/:slug*", destination: "/library/:slug*", permanent: true },
      { source: "/deep-dives/:slug*", destination: "/writing#questions", permanent: true },
      { source: "/about/facts", destination: "/about#facts", permanent: true },
      { source: "/about/stack", destination: "/about#stack", permanent: true },
      { source: "/about/podcasts", destination: "/about#podcasts", permanent: true },
      { source: "/about/:rest+", destination: "/about", permanent: true },
      { source: "/now", destination: "/", permanent: false },
    ];
  },
  // Append the default value with md extensions
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
});
