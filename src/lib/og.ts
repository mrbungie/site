// Open Graph cards: one generated PNG per page, keyed by the page's pathname.
// BaseHead points og:image at ogImagePath(pathname); /og/[...key].png renders it.
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { locales, type Locale } from '../i18n/ui';
import { routePath } from '../i18n/routes';
import { projects } from '../data/portfolio';
import { services } from '../data/services';
import { profile } from '../data/profile';
import { getConcepts, conceptHref } from '../components/concept/concepts';
import { areaLabel } from '../components/concept/areas';
import { getPosts, postSlug } from '../utils/blog';

export interface OgCard {
  key: string; // pathname without slashes, 'home' for /
  lang: Locale;
  kicker: string;
  title: string;
}

const keyOf = (path: string) => path.replace(/^\/+|\/+$/g, '') || 'home';
export const ogImagePath = (pathname: string) => `/og/${keyOf(pathname)}.png`;

const tr = (lang: Locale, es: string, en: string) => (lang === 'es' ? es : en);

let cardsCache: Promise<OgCard[]> | undefined;
export const getOgCards = () => (cardsCache ??= buildCards());

export async function hasOgCard(pathname: string) {
  const key = keyOf(pathname);
  return (await getOgCards()).some((c) => c.key === key);
}

async function buildCards(): Promise<OgCard[]> {
  const cards: OgCard[] = [];
  for (const lang of locales) {
    const home = lang === 'es' ? '/' : `/${lang}/`;
    const h = profile.hero.headline[lang];
    cards.push(
      { key: keyOf(home), lang, kicker: tr(lang, 'Datos e IA · Docente de ML', 'Data & AI · ML lecturer'), title: `${h.before} ${h.em} ${h.after}`},
      { key: keyOf(routePath(lang, 'about')), lang, kicker: tr(lang, 'Acerca', 'About'), title: tr(lang, 'Trayectoria, docencia y educación', 'Background, teaching and education')},
      { key: keyOf(routePath(lang, 'portfolio')), lang, kicker: tr(lang, 'Portafolio', 'Portfolio'), title: tr(lang, 'Plataformas de datos, ML y GenAI', 'Data, ML and GenAI platforms') },
      { key: keyOf(routePath(lang, 'concepts')), lang, kicker: tr(lang, 'Conceptos de ML', 'ML Concepts'), title: tr(lang, 'Machine learning explicado con visualizaciones interactivas', 'Machine learning explained with interactive visuals') },
      { key: keyOf(routePath(lang, 'blog')), lang, kicker: 'Blog', title: tr(lang, 'Notas sobre datos, IA y estadística', 'Notes on data, AI and statistics') },
    );
    cards.push({ key: keyOf(routePath(lang, 'contact')), lang, kicker: tr(lang, 'Contacto', 'Contact'), title: tr(lang, 'Conversemos: un rol o un proyecto', "Let's talk: a role or a project")});
    cards.push({ key: keyOf(routePath(lang, 'services')), lang, kicker: tr(lang, 'Servicios', 'Services'), title: tr(lang, 'Datos, IA, cloud y software a medida', 'Data, AI, cloud and custom software') });
    for (const s of services) {
      cards.push({ key: keyOf(routePath(lang, 'services', s.slug)), lang, kicker: tr(lang, 'Servicios · Santiago y Antofagasta', 'Services · Santiago and Antofagasta'), title: s.seoTitle[lang] });
    }
    for (const p of projects) {
      cards.push({ key: keyOf(routePath(lang, 'portfolio', p.slug)), lang, kicker: `${p.industry[lang]} · ${p.period}`, title: p.title[lang] });
    }
    const { entries } = await getConcepts(lang);
    for (const c of entries) {
      cards.push({ key: keyOf(conceptHref(lang, c)), lang, kicker: tr(lang, 'Conceptos de ML', 'ML Concepts') + ` · ${areaLabel(lang, c.data.area)}`, title: c.data.title });
    }
    for (const post of await getPosts(lang)) {
      cards.push({ key: keyOf(routePath(lang, 'blog', postSlug(post))), lang, kicker: 'Blog', title: post.data.title });
    }
  }
  return cards;
}

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFile(require.resolve(`@fontsource/${pkg}/files/${file}`));

let assets: Promise<{ fonts: Parameters<typeof satori>[1]['fonts']; photo: string }> | undefined;
function loadAssets() {
  assets ??= (async () => {
    const [serif, sans, sansBold, mono, photo] = await Promise.all([
      font('dm-serif-display', 'dm-serif-display-latin-400-normal.woff'),
      font('dm-sans', 'dm-sans-latin-400-normal.woff'),
      font('dm-sans', 'dm-sans-latin-600-normal.woff'),
      font('dm-mono', 'dm-mono-latin-400-normal.woff'),
      readFile(join(process.cwd(), 'src/assets/me.png')),
    ]);
    return {
      fonts: [
        { name: 'Serif', data: serif, weight: 400, style: 'normal' },
        { name: 'Sans', data: sans, weight: 400, style: 'normal' },
        { name: 'Sans', data: sansBold, weight: 600, style: 'normal' },
        { name: 'Mono', data: mono, weight: 400, style: 'normal' },
      ],
      photo: `data:image/png;base64,${photo.toString('base64')}`,
    };
  })();
  return assets;
}

// Site palette (light theme)
const BG = '#FCFBF8';
const INK = '#1A1718';
const MUTED = '#5C5656';
const ACCENT = '#7A1F2E';
const RULE = '#E6E1DC';

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

export async function renderOgPng(card: OgCard): Promise<Uint8Array> {
  const { fonts, photo } = await loadAssets();
  const titleSize = card.title.length > 70 ? 50 : card.title.length > 40 ? 60 : 72;

  const tree = el('div', { width: 1200, height: 630, display: 'flex', background: BG, fontFamily: 'Sans' }, [
    el('div', { width: 14, height: '100%', background: ACCENT }),
    el('div', { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px' }, [
      el('div', { fontFamily: 'Mono', fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', color: ACCENT }, card.kicker),
      el('div', { display: 'flex', alignItems: 'center', gap: 48 }, [
        el('div', { flex: 1, fontFamily: 'Serif', fontSize: titleSize, lineHeight: 1.08, color: INK }, card.title),
        el('img', { width: 240, height: 240, borderRadius: 999, objectFit: 'cover', flexShrink: 0 }, undefined, { src: photo, width: 240, height: 240 }),
      ]),
      el('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `2px solid ${RULE}`, paddingTop: 28 }, [
        el('div', { fontSize: 30, fontWeight: 600, color: INK }, profile.name),
        el('div', { fontFamily: 'Mono', fontSize: 24, color: MUTED }, 'govieworks.com'),
      ]),
    ]),
  ]);

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
