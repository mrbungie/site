import { defaultLocale, type Locale } from './ui';

export const routeSegments: Record<Locale, Record<string, string>> = {
  es: {
    concepts: 'conceptos',
    blog: 'blog',
    about: 'acerca',
  },
  en: {
    concepts: 'concepts',
    blog: 'blog',
    about: 'about',
  },
};

// Build a full route: routePath('es', 'concepts') → '/conceptos'
export function routePath(lang: Locale, route: string, slug?: string): string {
  const segment = routeSegments[lang]?.[route] ?? route;
  const prefix = lang === defaultLocale ? '' : `/${lang}`;
  const base = `${prefix}/${segment}`;
  return slug ? `${base}/${slug}` : base;
}
