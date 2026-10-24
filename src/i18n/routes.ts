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

/**
 * Map the current pathname to the equivalent page in another locale.
 * Section pages map exactly (/conceptos <-> /en/concepts). Detail pages
 * (/conceptos/knn) have locale-specific slugs, so they fall back to their
 * section index (`exact: false`) unless the page passes explicit alternates.
 */
export function switchLocalePath(pathname: string, target: Locale): { path: string; exact: boolean } {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] && (parts[0] as string) in routeSegments && parts[0] !== defaultLocale) parts.shift();
  const home = target === defaultLocale ? '/' : `/${target}/`;
  if (parts.length === 0) return { path: home, exact: true };

  const sourceLang = (Object.keys(routeSegments) as Locale[]).find((l) =>
    Object.values(routeSegments[l]).includes(parts[0]),
  );
  const key = sourceLang && Object.keys(routeSegments[sourceLang]).find((k) => routeSegments[sourceLang][k] === parts[0]);
  if (!key) return { path: home, exact: false };
  return { path: routePath(target, key), exact: parts.length === 1 };
}
