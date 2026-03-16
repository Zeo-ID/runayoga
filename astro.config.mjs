import { defineConfig } from 'astro/config';

export default defineConfig({
  // TODO: Configure your site URL here
  site: 'https://example.pages.dev',
  outDir: './dist',
  build: {
    format: 'file'
  }
});
