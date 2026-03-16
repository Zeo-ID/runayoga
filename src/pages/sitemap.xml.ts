import { getCollection } from '../lib/content';

const base = 'https://example.pages.dev';

export function GET() {
  const blogs = getCollection('blog');

  const staticPages = [
    { url: '/', priority: '1.0' },
    { url: '/angebote', priority: '0.8' },
    { url: '/ueber-mich', priority: '0.8' },
    { url: '/retreat', priority: '0.8' },
    { url: '/preise', priority: '0.8' },
    { url: '/blog', priority: '0.8' },
    { url: '/kontakt', priority: '0.8' },
    { url: '/service-1', priority: '0.6' },
    { url: '/service-2', priority: '0.6' },
    { url: '/service-3', priority: '0.6' },
    { url: '/impressum', priority: '0.3' },
    { url: '/datenschutz', priority: '0.3' },
  ];

  const blogEntries = blogs.map(b => ({
    url: `/blog/${b.slug}`,
    priority: '0.5',
  }));

  const entries = [...staticPages, ...blogEntries];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url><loc>${base}${e.url}</loc><priority>${e.priority}</priority></url>`).join('\n')}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
