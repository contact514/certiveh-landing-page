import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://certiveh.co',
  integrations: [react(), sitemap({
    filter: (page) =>
      !page.includes('/terminos-y-condiciones') &&
      !page.includes('/politica-de-privacidad') &&
      !page.includes('/exotics') &&
      !page.includes('/gnv'),
  })],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    assetsInclude: ['**/*.svg', '**/*.csv'],
  },
});
