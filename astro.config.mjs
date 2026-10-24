// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeMathJaxSvg from 'rehype-mathjax/svg';

// https://astro.build/config
export default defineConfig({
  site: 'https://govieworks.com',
  trailingSlash: 'ignore',
  compressHTML: true,

  integrations: [
    // Math in MDX ($...$ / $$...$$) is rendered to SVG at build time
    mdx({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeMathJaxSvg] }),
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-CL', en: 'en-US' },
      },
    }),
  ],

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  image: {
    layout: 'constrained',
  },

  markdown: {
    // Math is handled by the MDX integration above.
    // Always-dark code blocks: readable in both site themes.
    shikiConfig: { theme: 'github-dark', wrap: false },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
