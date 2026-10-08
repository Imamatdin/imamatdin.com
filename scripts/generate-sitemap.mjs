import fs from "fs";
import path from "path";

function getAllBookSlugs() {
  const data = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "content", "books", "index.json"),
      "utf8"
    )
  );
  return data.map((item) => item.slug);
}

function getAllWritingSlugs() {
  const data = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "content", "writing", "index.json"),
      "utf8"
    )
  );

  return data.filter((item) => !item.external).map((item) => item.url);
}

async function main() {
  const bookSlugs = getAllBookSlugs();
  const writingSlugs = getAllWritingSlugs();
  const allSlugs = [...bookSlugs, ...writingSlugs];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://imamatdin.com</loc>
  </url>
  <url>
    <loc>https://imamatdin.com/writing</loc>
  </url>
  <url>
    <loc>https://imamatdin.com/projects</loc>
  </url>
  <url>
    <loc>https://imamatdin.com/library</loc>
  </url>
  <url>
    <loc>https://imamatdin.com/about</loc>
  </url>${allSlugs
    .map((slug) => {
      return `
  <url>
    <loc>${`https://imamatdin.com${slug}`}</loc>
  </url>`;
    })
    .join("")}
</urlset>`;

  if (fs.existsSync("public/sitemap.xml")) {
    fs.unlinkSync("public/sitemap.xml");
  }

  fs.writeFileSync("public/sitemap.xml", sitemap);
}

main();
