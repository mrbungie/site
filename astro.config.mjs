// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeMathJaxSvg from 'rehype-mathjax/svg';
import { existsSync, readdirSync } from 'node:fs';

const SITE = 'https://www.govieworks.com';

/**
 * Slugs that have an English translation (files in <dir>/en/ named like the Spanish source).
 * @param {string} dir
 */
const translated = (dir) =>
  new Set(existsSync(dir) ? readdirSync(dir).filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, '')) : []);
const EN_CONCEPTS = translated('./src/content/concepts/en');
const EN_POSTS = translated('./src/content/blog/en');
/** @param {string} esSeg @param {string} slug */
const hasEnglish = (esSeg, slug) => (esSeg === 'conceptos' ? EN_CONCEPTS : EN_POSTS).has(slug);

// Spanish ↔ English section slugs (mirrors src/i18n/routes.ts).
/** @type {Record<string, string>} */
const SECTIONS = { acerca: 'about', servicios: 'services', portafolio: 'portfolio', contacto: 'contact', conceptos: 'concepts', blog: 'blog' };

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
  // Concept and blog entries pair only when an English translation exists.
  if (rest.length && (esSeg === 'conceptos' || esSeg === 'blog') && !hasEnglish(esSeg, rest[0])) return null;
  const tail = rest.length ? `${rest.join('/')}/` : '';
  return { es: `/${esSeg}/${tail}`, en: `/en/${SECTIONS[esSeg]}/${tail}` };
}

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  compressHTML: true,
  // Small site: inline CSS so first paint doesn't wait on a stylesheet request.
  build: { inlineStylesheets: 'always' },

  integrations: [
    // Math in MDX ($...$ / $$...$$) is rendered to SVG at build time
    mdx({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeMathJaxSvg] }),
    react(),
    sitemap({
      // Untranslated /en concept and blog pages are Spanish fallbacks that canonicalize to the original.
      filter: (page) => {
        const m = new URL(page).pathname.match(/^\/en\/(concepts|blog)\/([^/]+)\/$/);
        return !m || hasEnglish(m[1] === 'concepts' ? 'conceptos' : 'blog', m[2]);
      },
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
