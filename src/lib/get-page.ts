import fs from "fs";
import path from "path";

/**
 * Load page content from a JSON file at build time.
 * Maps URL paths to content files:
 *   /           → content/home.json
 *   /angebote   → content/seiten/angebote.json
 *   /blog/xyz   → content/blog/xyz.json
 *   /kontakt    → content/seiten/kontakt.json
 */
export function getPage(urlPath: string): any | null {
  const contentDir = path.join(process.cwd(), "src", "content");

  // Home page
  if (urlPath === "/" || urlPath === "") {
    return readJson(path.join(contentDir, "home.json"));
  }

  const segments = urlPath.replace(/^\//, "").split("/");

  // Blog posts: /blog/slug
  if (segments[0] === "blog" && segments[1]) {
    return readJson(path.join(contentDir, "blog", `${segments[1]}.json`));
  }

  // Angebote: /angebote/slug
  if (segments[0] === "angebote" && segments[1]) {
    return readJson(path.join(contentDir, "angebote", `${segments[1]}.json`));
  }

  // Generic pages: /slug → content/seiten/slug.json
  return readJson(path.join(contentDir, "seiten", `${segments[0]}.json`));
}

function readJson(filePath: string): any | null {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * List all content files for static generation.
 */
export function getAllPaths(): string[] {
  const paths: string[] = ["/"];
  const contentDir = path.join(process.cwd(), "src", "content");

  // Pages
  const seitenDir = path.join(contentDir, "seiten");
  if (fs.existsSync(seitenDir)) {
    for (const file of fs.readdirSync(seitenDir)) {
      if (file.endsWith(".json")) {
        paths.push(`/${file.replace(".json", "")}`);
      }
    }
  }

  // Blog
  const blogDir = path.join(contentDir, "blog");
  if (fs.existsSync(blogDir)) {
    for (const file of fs.readdirSync(blogDir)) {
      if (file.endsWith(".json")) {
        paths.push(`/blog/${file.replace(".json", "")}`);
      }
    }
  }

  // Angebote
  const angeboteDir = path.join(contentDir, "angebote");
  if (fs.existsSync(angeboteDir)) {
    for (const file of fs.readdirSync(angeboteDir)) {
      if (file.endsWith(".json")) {
        paths.push(`/angebote/${file.replace(".json", "")}`);
      }
    }
  }

  return paths;
}
