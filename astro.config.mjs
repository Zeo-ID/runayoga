import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://runayoga.pages.dev',
  outDir: './dist',
  build: {
    format: 'file'
  }
});
