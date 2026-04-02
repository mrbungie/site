export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export type Locale = keyof typeof languages;
export const defaultLocale: Locale = 'es';
export const locales = Object.keys(languages) as Locale[];

export const ui = {
  es: {
    'site.title': 'Mi Sitio',
    'site.description': 'Conceptos profundos sobre datos, ML e ingeniería.',
    'nav.home': 'Inicio',
    'nav.blog': 'Blog',
    'nav.concepts': 'Conceptos',
    'nav.about': 'Acerca',
    'concepts.title': 'Conceptos',
    'concepts.subtitle': 'Conceptos profundos, definidos una sola vez.',
    'concepts.level': 'Nivel',
    'concepts.area': 'Área',
    'concepts.tags': 'Tags',
    'concepts.prerequisites': 'Prerequisitos',
    'concepts.related': 'Relacionados',
    'home.hero.title': 'Datos e Ingeniería',
    'home.hero.subtitle': 'Intuición primero',
    'home.featured': 'Conceptos destacados',
    'footer.rights': 'Todos los derechos reservados.',
    'level.beginner': 'Principiante',
    'level.intermediate': 'Intermedio',
    'level.advanced': 'Avanzado',
  },
  en: {
    'site.title': 'My Site',
    'site.description': 'Deep concepts on data, ML and engineering.',
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.concepts': 'Concepts',
    'nav.about': 'About',
    'concepts.title': 'Concepts',
    'concepts.subtitle': 'Deep concepts, defined once.',
    'concepts.level': 'Level',
    'concepts.area': 'Area',
    'concepts.tags': 'Tags',
    'concepts.prerequisites': 'Prerequisites',
    'concepts.related': 'Related',
    'home.hero.title': 'Data & Engineering',
    'home.hero.subtitle': 'Intuition first',
    'home.featured': 'Featured concepts',
    'footer.rights': 'All rights reserved.',
    'level.beginner': 'Beginner',
    'level.intermediate': 'Intermediate',
    'level.advanced': 'Advanced',
  },
} as const;
