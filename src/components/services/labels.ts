import type { Locale } from '../../i18n/ui';
import { routePath } from '../../i18n/routes';

export const serviceLabels = {
  es: {
    title: 'Servicios',
    indexTitle: 'Servicios de datos, IA y software',
    indexDesc: 'Consultoría e implementación de inteligencia artificial, datos, arquitectura cloud y software a medida para empresas en Chile y el extranjero.',
    headline: 'Problemas que ya me tocó resolver.',
    indexIntro: 'Llego, entiendo qué tiene que cambiar en el negocio y dejo el sistema funcionando, con un equipo capaz de mantenerlo cuando me vaya. Estas son las cuatro áreas donde más veces lo he hecho.',
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
    indexDesc: 'AI, data, cloud architecture and custom software consulting and implementation for companies in Chile and abroad.',
    headline: "Problems I've already had to solve.",
    indexIntro: "I come in, figure out what has to change in the business, and leave the system running with a team that can keep it alive after I'm gone. These are the four areas where I've done it most.",
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
export const contactHref = (lang: Locale) => `${routePath(lang, 'contact')}/?motivo=project`;
