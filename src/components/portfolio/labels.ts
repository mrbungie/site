import type { Locale } from '../../i18n/ui';
import type { Project } from '../../data/portfolio';
import { routePath } from '../../i18n/routes';

export const labels = {
  es: {
    title: 'Portafolio',
    desc: 'Proyectos de Germán Oviedo: plataformas de datos, ML y GenAI para clientes, y código abierto.',
    intro: 'Proyectos para clientes y de código abierto. Los propietarios son confidenciales: muestro la arquitectura y lo que hice, sin datos ni nombres.',
    proprietary: 'Propietario',
    oss: 'Open source',
    industry: 'Rubro',
    workType: 'Tipo de trabajo',
    period: 'Período',
    goal: 'Objetivo',
    did: 'Lo que hice',
    stack: 'Stack',
    architecture: 'Arquitectura',
    results: 'Resultados',
    repo: 'Ver en GitHub ↗',
    back: '← Portafolio',
    confidential: 'Proyecto confidencial: el código y los datos no son públicos.',
  },
  en: {
    title: 'Portfolio',
    desc: 'Projects by Germán Oviedo: data, ML and GenAI platforms for clients, and open source.',
    intro: 'Client and open-source projects. Proprietary work is confidential: I show the architecture and what I did, without data or names.',
    proprietary: 'Proprietary',
    oss: 'Open source',
    industry: 'Industry',
    workType: 'Type of work',
    period: 'Period',
    goal: 'Goal',
    did: 'What I did',
    stack: 'Stack',
    architecture: 'Architecture',
    results: 'Results',
    repo: 'View on GitHub ↗',
    back: '← Portfolio',
    confidential: 'Confidential project: code and data are not public.',
  },
} satisfies Record<Locale, Record<string, string>>;

export const projectHref = (lang: Locale, p: Project) => `${routePath(lang, 'portfolio', p.slug)}/`;
