import type { Locale } from '../../i18n/ui';
import { routePath } from '../../i18n/routes';

export const serviceLabels = {
  es: {
    title: 'Servicios',
    indexTitle: 'Servicios de datos, IA y software',
    indexDesc: 'Consultoría e implementación de inteligencia artificial, datos, arquitectura cloud y software a medida para empresas en Santiago y Chile.',
    indexIntro: 'Además de liderar equipos, tomo proyectos de consultoría e implementación. Estas son las áreas donde tengo experiencia comprobable, con proyectos reales detrás.',
    problems: 'Problemas que resuelvo',
    offer: 'Qué hago',
    process: 'Cómo trabajo',
    formats: 'Formatos',
    evidence: 'Proyectos relacionados',
    faq: 'Preguntas frecuentes',
    more: 'Ver servicio →',
    back: '← Servicios',
    ctaTitle: '¿Conversamos sobre tu proyecto?',
    ctaBody: 'Cuéntame qué necesitas y te respondo con una propuesta de cómo abordarlo.',
    ctaLink: 'Conversemos →',
  },
  en: {
    title: 'Services',
    indexTitle: 'Data, AI and software services',
    indexDesc: 'AI, data, cloud architecture and custom software consulting and implementation for companies in Santiago and Chile.',
    indexIntro: 'Besides leading teams, I take on consulting and implementation projects. These are the areas where I have proven experience, with real projects behind them.',
    problems: 'Problems I solve',
    offer: 'What I do',
    process: 'How I work',
    formats: 'Formats',
    evidence: 'Related projects',
    faq: 'FAQ',
    more: 'See service →',
    back: '← Services',
    ctaTitle: 'Shall we talk about your project?',
    ctaBody: "Tell me what you need and I'll reply with a proposal for how to approach it.",
    ctaLink: "Let's talk →",
  },
} satisfies Record<Locale, Record<string, string>>;

export const serviceHref = (lang: Locale, slug: string) => `${routePath(lang, 'services', slug)}/`;
export const contactHref = (lang: Locale) => `${lang === 'es' ? '/' : `/${lang}/`}?motivo=project#contact`;
