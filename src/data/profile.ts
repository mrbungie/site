import type { Locale } from '../i18n/ui';

export type L10n<T> = Record<Locale, T>;

export const contact = {
  email: 'german.oviedo.b@gmail.com',
  linkedin: { url: 'https://linkedin.com/in/goviedb', label: 'linkedin.com/in/goviedb' },
  github: { url: 'https://github.com/mrbungie', label: 'github.com/mrbungie' },
};

export const cvHref: L10n<string> = {
  es: '/GermanOviedo_CV_ES.pdf',
  en: '/GermanOviedo_CV_EN.pdf',
};

export interface ExperienceItem {
  period: L10n<string>;
  org: string;
  role: L10n<string>;
  summary: L10n<string>;
}

export interface EducationItem {
  period: string;
  org: string;
  degree: L10n<string>;
  note: L10n<string>;
}

export interface SkillGroup {
  label: L10n<string>;
  items: L10n<string>;
}

export const profile = {
  name: 'Germán Oviedo',
  photoAlt: { es: 'Retrato de Germán Oviedo', en: 'Portrait of Germán Oviedo' } as L10n<string>,
  photoCaption: 'Trieste, 2025',

  hero: {
    kicker: { es: 'Ejecutivo de Datos e IA · Docente de ML', en: 'Data & AI Executive · ML Lecturer' } as L10n<string>,
    headline: {
      es: { before: 'Convierto IA y datos en', em: 'resultados de negocio', after: 'medibles.' },
      en: { before: 'I turn AI and data into', em: 'measurable business', after: 'results.' },
    } as L10n<{ before: string; em: string; after: string }>,
    valueProp: {
      es: 'Más de 10 años escalando capacidades de ML, GenAI y analítica avanzada en banca y fintech, en Chile e Italia. MBA por MIB Trieste, de vuelta en Chile y enseñando Machine Learning desde 2016.',
      en: 'Over 10 years scaling ML, GenAI and advanced analytics in banking and fintech across Chile and Italy. MBA from MIB Trieste, back in Chile and teaching Machine Learning since 2016.',
    } as L10n<string>,
    stats: [
      { value: '10+', label: { es: 'años en banca y fintech', en: 'years in banking & fintech' } },
      { value: '9.000+', label: { es: 'colaboradores en la adopción de Gemini que lideré', en: 'employees in the Gemini rollout I led' } },
      { value: '3,8M+', label: { es: 'usuarios cubiertos por el stack de decision science', en: 'users covered by our decision-science stack' } },
      { value: '2016', label: { es: 'docente universitario desde', en: 'university lecturer since' } },
    ] as { value: string; label: L10n<string> }[],
  },

  bio: {
    es: [
      'Especializado en convertir capacidades de ML, GenAI y analítica avanzada en productos financieros escalables, automatización operativa y decisiones comerciales medibles. Trayectoria en banca y fintech en Chile e Italia.',
      'MBA en International Business por MIB Trieste School of Management (2026). De vuelta en Chile e instructor universitario de Machine Learning y Estadística desde 2016.',
    ],
    en: [
      'Specialized in turning ML, GenAI, and advanced analytics into scalable financial products, operational automation, and measurable business outcomes. Track record across banking and fintech in Chile and Italy.',
      'MBA in International Business from MIB Trieste School of Management (2026). Back in Chile; university lecturer in Machine Learning and Statistics since 2016.',
    ],
  } as L10n<string[]>,

  experience: [
    {
      period: { es: 'Nov 2023 – May 2025', en: 'Nov 2023 – May 2025' },
      org: 'Banco Bci',
      role: { es: 'Subgerente de IA Generativa', en: 'Head of Generative AI' },
      summary: {
        es: 'Estrategia corporativa de IA, CLP 800MM+ en presupuesto. GenAI CoE (3 ML Engineers, 2 Product Leads). 26% de automatización en ~80K consultas/mes. Adopción de Gemini en 9.000+ colaboradores.',
        en: 'Corporate AI strategy, CLP 800MM+ budget. GenAI Center of Excellence (3 ML Engineers, 2 Product Leads). 26% automation over ~80K monthly inquiries. Led Gemini adoption across 9,000+ employees.',
      },
    },
    {
      period: { es: 'Mar 2022 – Nov 2023', en: 'Mar 2022 – Nov 2023' },
      org: 'MACH',
      role: { es: 'Head of Analytics & Data Science', en: 'Head of Analytics & Data Science' },
      summary: {
        es: 'Equipo de 9 para 3,8M+ usuarios. Inferencia causal en +100 campañas mensuales. Motor "Next Best Action" en AWS. AutoML + DataBot GPT.',
        en: 'Team of 9 for 3.8M+ users. Causal inference across 100+ monthly campaigns. "Next Best Action" engine on AWS. AutoML + GPT-based DataBot.',
      },
    },
    {
      period: { es: 'Dic 2020 – Ene 2022', en: 'Dec 2020 – Jan 2022' },
      org: 'Tenpo',
      role: { es: 'Head of Data & Analytics', en: 'Head of Data & Analytics' },
      summary: {
        es: 'Función de datos desde cero para 1M+ clientes. Cultura de datos de 2,0 → 4,5/5. Data lake en GCP (BigQuery, DBT, Airflow, Looker, Kubernetes).',
        en: 'Built data function from scratch for 1M+ customers. Data culture 2.0 → 4.5/5. Data lake on GCP (BigQuery, DBT, Airflow, Looker, Kubernetes).',
      },
    },
    {
      period: { es: 'Mar 2015 – Dic 2020', en: 'Mar 2015 – Dec 2020' },
      org: 'Banco Bci',
      role: { es: 'Principal Data Scientist', en: 'Principal Data Scientist' },
      summary: {
        es: '+20 modelos XGBoost para predicción de comportamiento. Motor CRM híbrido para 400K+ clientes diarios. Framework de monitoreo macro COVID-19.',
        en: '20+ XGBoost models for behavioral prediction. Hybrid CRM engine for 400K+ daily customers. COVID-19 macro-monitoring framework (NBER-style).',
      },
    },
  ] as ExperienceItem[],

  teaching: {
    period: { es: '2016 – Presente', en: '2016 – Present' } as L10n<string>,
    org: { es: 'Múltiples Universidades', en: 'Multiple Universities' } as L10n<string>,
    role: { es: 'Docente', en: 'Lecturer' } as L10n<string>,
    summary: {
      es: 'Data Mining, Machine Learning e Ingeniería de Software en U. Andrés Bello, U. Adolfo Ibáñez y U. Diego Portales.',
      en: 'Data Mining, Machine Learning, and Software Engineering at Universidad Andrés Bello, Universidad Adolfo Ibáñez, and Universidad Diego Portales.',
    } as L10n<string>,
  },

  education: [
    {
      period: '2024 – 2026',
      org: 'MIB Trieste School of Management',
      degree: { es: 'MBA in International Business', en: 'MBA in International Business' },
      note: { es: 'En colaboración con la Universidad de Trieste.', en: 'In collaboration with University of Trieste.' },
    },
    {
      period: '2021 – 2022',
      org: 'Universidad Adolfo Ibáñez',
      degree: { es: 'Máster en Ciencias de la Ingeniería, TI', en: 'M.Sc. in Engineering, IT specialization' },
      note: { es: 'Santiago y Viña del Mar, Chile', en: 'Santiago & Viña del Mar, Chile' },
    },
    {
      period: '2010 – 2015',
      org: 'Universidad Adolfo Ibáñez',
      degree: { es: 'Licenciatura en Ingeniería Industrial', en: 'B.Sc. in Engineering (Industrial Engineering)' },
      note: { es: 'Santiago y Viña del Mar, Chile', en: 'Santiago & Viña del Mar, Chile' },
    },
  ] as EducationItem[],

  skills: [
    { label: { es: 'GenAI y ML', en: 'GenAI & ML' }, items: { es: 'LLMs, RAG, LangGraph, PydanticAI, MLOps, evaluación de modelos', en: 'LLMs, RAG, LangGraph, PydanticAI, MLOps, model evaluation' } },
    { label: { es: 'Datos y plataformas', en: 'Data & Platforms' }, items: { es: 'BigQuery, Snowflake, DBT, Airflow, Spark, feature stores, gobierno de datos', en: 'BigQuery, Snowflake, DBT, Airflow, Spark, feature stores, data governance' } },
    { label: { es: 'Cloud', en: 'Cloud' }, items: { es: 'AWS (Glue, Athena), GCP, Azure · Kubernetes, Terraform', en: 'AWS (Glue, Athena), GCP, Azure · Kubernetes, Terraform' } },
    { label: { es: 'Analítica', en: 'Analytics' }, items: { es: 'Inferencia causal, A/B testing, cuasi-experimentos, analítica de marketing', en: 'Causal inference, A/B testing, quasi-experiments, marketing analytics' } },
    { label: { es: 'Programación', en: 'Programming' }, items: { es: 'Python (numpy, pytorch, tensorflow), SQL, Spark (Java, Scala), R', en: 'Python (numpy, pytorch, tensorflow), SQL, Spark (Java, Scala), R' } },
    { label: { es: 'Idiomas', en: 'Languages' }, items: { es: 'Español (nativo), Inglés (profesional)', en: 'Spanish (native), English (professional)' } },
  ] as SkillGroup[],

  contact: {
    headline: { es: 'Trabajemos en algo que importe.', en: "Let's work on something that matters." } as L10n<string>,
    body: {
      es: 'Abierto a roles de liderazgo en datos e IA, consultoría, proyectos de ML, docencia e invitaciones a hablar. Me muevo entre Europa y Latinoamérica: primero remoto, presencial cuando vale la pena.',
      en: 'Open to data & AI leadership roles, advisory work, ML contractor projects, teaching, and speaking. I move between Europe and Latin America: remote-first, in-person when it counts.',
    } as L10n<string>,
  },
};

// UI copy used only by the home/about pages
export const copy = {
  about: { es: 'Sobre mí', en: 'About' },
  work: { es: 'Trabajo', en: 'Work' },
  writing: { es: 'Escritura', en: 'Writing' },
  concepts: { es: 'Conceptos', en: 'Concepts' },
  experience: { es: 'Experiencia', en: 'Experience' },
  education: { es: 'Educación', en: 'Education' },
  teaching: { es: 'Docencia', en: 'Teaching' },
  skills: { es: 'Habilidades técnicas', en: 'Technical skills' },
  contact: { es: 'Contacto', en: 'Contact' },
  viewAll: { es: 'Ver todos →', en: 'All posts →' },
  browseAll: { es: 'Ver todos →', en: 'Browse all →' },
  downloadCv: { es: 'Descargar CV', en: 'Download résumé' },
  downloadCvFull: { es: 'Descargar CV completo ↓', en: 'Download full résumé ↓' },
  exploreConcepts: { es: 'Explorar conceptos', en: 'Explore concepts' },
  getInTouch: { es: 'Contacto', en: 'Get in touch' },
  aboutTitle: { es: 'Acerca de Germán Oviedo', en: 'About Germán Oviedo' },
  aboutDesc: {
    es: 'Trayectoria, experiencia, docencia y educación de Germán Oviedo, ejecutivo de Datos e IA.',
    en: 'Background, experience, teaching and education of Germán Oviedo, Data & AI executive.',
  },
} satisfies Record<string, L10n<string>>;
