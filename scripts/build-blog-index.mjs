import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const blogDir = path.join(root, "src", "content", "blog");
const dataDir = path.join(root, "src", "data");
const outFile = path.join(dataDir, "blog-index.json");

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findFirstByType(content, type) {
  if (!Array.isArray(content)) return null;
  return content.find((b) => b?.type === type) || null;
}

function extract(post, slug, mtime) {
  const content = post?.content || [];
  const hero = findFirstByType(content, "Hero")?.props || {};
  const richText = findFirstByType(content, "RichText")?.props || {};
  const rootProps = post?.root?.props || {};

  const title = hero.title || rootProps.seoTitle || slug;
  const description = rootProps.seoDescription || hero.subtitle || "";
  const image = hero.image || "";
  const body = stripHtml(richText.content || "");
  const excerpt = description || body.slice(0, 200);

  const date =
    rootProps.date ||
    rootProps.publishedAt ||
    new Date(mtime).toISOString().slice(0, 10);

  return {
    slug,
    href: `/blog/${slug}`,
    title,
    description: excerpt,
    image,
    date,
  };
}

function main() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  if (!fs.existsSync(blogDir)) {
    fs.writeFileSync(outFile, JSON.stringify({ posts: [] }, null, 2));
    console.log("[blog-index] no blog directory; wrote empty index");
    return;
  }

  const files = fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const posts = [];
  for (const file of files) {
    const full = path.join(blogDir, file);
    const slug = file.replace(/\.json$/, "");
    try {
      const json = JSON.parse(fs.readFileSync(full, "utf-8"));
      const stat = fs.statSync(full);
      posts.push(extract(json, slug, stat.mtimeMs));
    } catch (err) {
      console.warn(`[blog-index] skip ${file}:`, err.message);
    }
  }

  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  fs.writeFileSync(outFile, JSON.stringify({ posts }, null, 2));
  console.log(`[blog-index] wrote ${posts.length} posts to ${outFile}`);
}

main();
