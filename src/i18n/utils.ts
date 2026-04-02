import { ui, defaultLocale, type Locale } from './ui';

export type TranslationKey = keyof (typeof ui)[typeof defaultLocale];
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type LevelTranslationKey = `level.${Level}`;

export const getLevelTranslationKey = (level: Level): LevelTranslationKey => `level.${level}`;

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Locale;
  return defaultLocale;
}

export function getTranslations(lang: Locale) {
  return function t(key: TranslationKey): string {
    return ui[lang]?.[key] ?? ui[defaultLocale][key];
  };
}

/**
 * Returns the path localized for the target language.
 * localePath('es', '/conceptos') -> '/conceptos'
 * localePath('en', '/concepts') -> '/en/concepts'
 */
export function localePath(lang: Locale, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLocale) return cleanPath;
  return `/${lang}${cleanPath}`;
}
