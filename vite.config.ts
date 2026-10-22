import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(({command}) => {
  // Determine base path:
  // - In development ('serve'): '/' for Google AI Studio preview & local dev
  // - In production: '/Guitar-Academy/' for GitHub Pages or relative './'
  const isDev = command === 'serve';
  const base = isDev
    ? '/'
    : (process.env.BASE_URL || (process.env.GITHUB_ACTIONS === 'true' ? '/Guitar-Academy/' : './'));

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        base,
        registerType: 'autoUpdate',
        includeAssets: [
          'icon.svg', 
          'stage-hero.webp', 
          'stage-hero.jpg', 
          'images/guitar-academy-background.webp', 
          'images/guitar-academy-background.jpg'
        ],
        manifest: {
          id: base,
          name: 'Guitar Academy — Formação Musical',
          short_name: 'GuitarAcad',
          description: 'Plataforma completa de formação musical para guitarristas do zero ao avançado.',
          theme_color: '#F8F7F4',
          background_color: '#F8F7F4',
          display: 'standalone',
          start_url: base,
          scope: base,
          icons: [
            {
              src: 'icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,woff,woff2}'],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
