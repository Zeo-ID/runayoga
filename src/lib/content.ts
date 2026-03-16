import matter from 'gray-matter';
import { marked } from 'marked';
import fs from 'node:fs';
import path from 'node:path';

const contentDir = path.join(process.cwd(), 'src/content');

export function getContent(relativePath: string) {
  const filePath = path.join(contentDir, relativePath);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { frontmatter: data, html: marked.parse(content) as string };
}

export function getCollection(subdir: string) {
  const dir = path.join(contentDir, subdir);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  return files.map(file => {
    const slug = file.replace('.md', '');
    const { frontmatter, html } = getContent(`${subdir}/${file}`);
    return { slug, frontmatter, html };
  });
}
