// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeMathJaxSvg from 'rehype-mathjax/svg';

const SITE = 'https://www.govieworks.com';

// Spanish ↔ English section slugs (mirrors src/i18n/routes.ts).
/** @type {Record<string, string>} */
const SECTIONS = { acerca: 'about', portafolio: 'portfolio', conceptos: 'concepts', blog: 'blog' };

/**
 * Equivalent es/en paths for a sitemap URL, or null when only one language exists.
 * @param {string} path
 */
function localePair(path) {
  const parts = path.split('/').filter(Boolean);
  const isEn = parts[0] === 'en';
  if (isEn) parts.shift();
  if (parts.length === 0) return { es: '/', en: '/en/' };
  const esSeg = isEn ? Object.keys(SECTIONS).find((k) => SECTIONS[k] === parts[0]) : parts[0];
  if (!esSeg || !(esSeg in SECTIONS)) return null;
  const rest = parts.slice(1);
  // Concept and blog entries only exist in Spanish (the /en copies are excluded above).
  if (rest.length && (esSeg === 'conceptos' || esSeg === 'blog')) return null;
  const tail = rest.length ? `${rest.join('/')}/` : '';
  return { es: `/${esSeg}/${tail}`, en: `/en/${SECTIONS[esSeg]}/${tail}` };
}

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  compressHTML: true,

  integrations: [
    // Math in MDX ($...$ / $$...$$) is rendered to SVG at build time
    mdx({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeMathJaxSvg] }),
    react(),
    sitemap({
      // /en concept and blog pages are Spanish fallbacks that canonicalize to the original.
      filter: (page) => !/\/en\/(concepts|blog)\/[^/]+\/$/.test(new URL(page).pathname),
      // Pair es/en pages by section, since slugs are translated (acerca ↔ about, ...).
      serialize: (item) => {
        const pair = localePair(new URL(item.url).pathname);
        if (pair) {
          item.links = [
            { lang: 'es-CL', url: SITE + pair.es },
            { lang: 'en-US', url: SITE + pair.en },
            { lang: 'x-default', url: SITE + pair.es },
          ];
        }
        return item;
      },
      xslURL: '/sitemap.xsl',
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
