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

  hero: {
    headline: {
      es: { before: 'Llevo diez años trabajando en', em: 'datos e IA', after: 'para banca y fintech.' },
      en: { before: "I've spent ten years in", em: 'data and AI', after: 'for banking and fintech.' },
    } as L10n<{ before: string; em: string; after: string }>,
    lead: {
      es: 'Lideré IA generativa en Bci y ciencia de datos en MACH, y armé desde cero el área de datos de Tenpo. Hoy ayudo a empresas a llevar IA a producción, y enseño machine learning desde 2016.',
      en: "I led generative AI at Bci and data science at MACH, and built Tenpo's data team from scratch. Today I help companies take AI to production, and I've taught machine learning since 2016.",
    } as L10n<string>,
    more: { es: 'Mi trayectoria →', en: 'My background →' } as L10n<string>,
    now: {
      es: 'Terminé un MBA en Trieste y volví a Chile; hoy trabajo entre Santiago y Antofagasta. Tomo roles de liderazgo y proyectos de consultoría, remotos o presenciales.',
      en: 'I just finished an MBA in Trieste and moved back to Chile; I now work between Santiago and Antofagasta. I take leadership roles and consulting projects, remote or on-site.',
    } as L10n<string>,
  },

  bio: {
    es: [
      'Llevo más de diez años trabajando con datos en banca y fintech en Chile. Empecé como data scientist en Bci, construyendo modelos de comportamiento y motores de CRM. Después armé el área de datos de Tenpo, dirigí analítica y ciencia de datos en MACH y volví a Bci a liderar IA generativa.',
      'Desde 2016 hago clases de data mining y machine learning en la UNAB, la UAI y la UDP. En 2026 terminé un MBA en International Business en MIB Trieste y volví a Santiago.',
    ],
    en: [
      "I've worked with data in Chilean banking and fintech for more than ten years. I started as a data scientist at Bci, building behavioral models and CRM engines. Then I built Tenpo's data team, ran analytics and data science at MACH, and went back to Bci to lead generative AI.",
      "I've taught data mining and machine learning at UNAB, UAI and UDP since 2016. In 2026 I finished an MBA in International Business at MIB Trieste and moved back to Santiago.",
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
      period: '2025 – 2026',
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
    headline: { es: 'Conversemos.', en: 'Get in touch.' } as L10n<string>,
    body: {
      es: 'Si tienes un rol, un proyecto o solo una idea, escríbeme y lo conversamos.',
      en: "If you have a role, a project or just an idea, write to me and let's talk.",
    } as L10n<string>,
  },
};

// UI copy used only by the home/about pages
export const copy = {
  about: { es: 'Sobre mí', en: 'About' },
  writing: { es: 'Escritura', en: 'Writing' },
  experience: { es: 'Experiencia', en: 'Experience' },
  education: { es: 'Educación', en: 'Education' },
  teaching: { es: 'Docencia', en: 'Teaching' },
  skills: { es: 'Habilidades técnicas', en: 'Technical skills' },
  contact: { es: 'Contacto', en: 'Contact' },
  viewAll: { es: 'Ver todos →', en: 'All posts →' },
  browseServices: { es: 'Ver servicios →', en: 'All services →' },
  servicesLead: {
    es: 'Consultoría en inteligencia artificial, datos, arquitectura cloud y desarrollo de software para empresas en Chile y el extranjero.',
    en: 'Consulting in artificial intelligence, data, cloud architecture and software development for companies in Chile and abroad.',
  },
  downloadCv: { es: 'CV (PDF)', en: 'Résumé (PDF)' },
  downloadCvFull: { es: 'Ver CV completo ↗', en: 'View full résumé ↗' },
  emailMe: { es: 'Escríbeme', en: 'Email me' },
  aboutTitle: { es: 'Acerca de Germán Oviedo', en: 'About Germán Oviedo' },
  aboutDesc: {
    es: 'Trayectoria, experiencia, docencia y educación de Germán Oviedo, ejecutivo de Datos e IA.',
    en: 'Background, experience, teaching and education of Germán Oviedo, Data & AI executive.',
  },
} satisfies Record<string, L10n<string>>;
