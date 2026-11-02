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

export interface Highlight {
  value: L10n<string>;
  label: L10n<string>;
}

export interface ExperienceItem {
  id: string; // anchor, linked from the career timeline
  period: L10n<string>;
  span: [number, number]; // decimal years, positions the timeline segment
  org: L10n<string>;
  short: L10n<string>; // timeline label
  role: L10n<string>;
  headline: L10n<string>;
  highlights: Highlight[];
  bullets: L10n<string[]>;
  stack: string[];
}

export interface EducationItem {
  period: string;
  span?: [number, number]; // decimal years; omitted when it predates the timeline
  org: string;
  short: L10n<string>; // timeline label
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
      es: 'Terminé un MBA en Trieste y volví temporalmente a Chile; hoy trabajo entre Santiago y Antofagasta. Tomo roles de liderazgo y proyectos de consultoría, remotos o presenciales.',
      en: 'I just finished an MBA in Trieste and moved temporarily back to Chile; I now work between Santiago and Antofagasta. I take leadership roles and consulting projects, remote or on-site.',
    } as L10n<string>,
  },

  bio: {
    es: [
      'Llevo más de diez años trabajando con datos en banca y fintech en Chile. Empecé como data scientist en Bci, construyendo modelos de comportamiento y motores de CRM. Después armé el área de datos de Tenpo, dirigí analítica y ciencia de datos en MACH y volví a Bci a liderar IA generativa.',
      'Desde 2016 hago clases de data mining y machine learning en la UNAB, la UAI y la UDP. Mientras hacía el MBA en International Business en MIB Trieste seguí trabajando como ingeniero de datos independiente, y en 2026 volví temporalmente a Chile.',
    ],
    en: [
      "I've worked with data in Chilean banking and fintech for more than ten years. I started as a data scientist at Bci, building behavioral models and CRM engines. Then I built Tenpo's data team, ran analytics and data science at MACH, and went back to Bci to lead generative AI.",
      "I've taught data mining and machine learning at UNAB, UAI and UDP since 2016. During my MBA in International Business at MIB Trieste I kept working as an independent data engineer, and in 2026 I moved temporarily back to Chile.",
    ],
  } as L10n<string[]>,

  glance: [
    { label: { es: 'Experiencia', en: 'Experience' }, value: { es: 'Más de 10 años en banca y fintech', en: '10+ years in banking and fintech' } },
    { label: { es: 'Liderazgo', en: 'Leadership' }, value: { es: 'Liderando equipos desde 2020; el más grande, de 9 personas', en: 'Leading teams since 2020, the largest of 9 people' } },
    { label: { es: 'Forma de trabajo', en: 'How I work' }, value: { es: 'Mitad liderazgo, mitad hands-on', en: 'Half leadership, half hands-on' } },
    { label: { es: 'Relación con el negocio', en: 'Business exposure' }, value: { es: 'Presento a C-level y directorio', en: 'I present to C-level and boards' } },
    { label: { es: 'Docencia', en: 'Teaching' }, value: { es: 'Desde 2016, en tres universidades', en: 'Since 2016, at three universities' } },
    { label: { es: 'Idiomas', en: 'Languages' }, value: { es: 'Español nativo, inglés C1 (IELTS 8.0, TOEFL 98)', en: 'Native Spanish, C1 English (IELTS 8.0, TOEFL 98)' } },
  ] as { label: L10n<string>; value: L10n<string> }[],

  experience: [
    {
      id: 'independiente',
      period: { es: 'May 2025 – Sep 2026', en: 'May 2025 – Sep 2026' },
      span: [2025.33, 2026.75],
      org: { es: 'Independiente, part-time', en: 'Independent, part-time' },
      short: { es: 'Indep.', en: 'Indep.' },
      role: { es: 'Ingeniero de datos', en: 'Data Engineer' },
      headline: {
        es: 'Plataformas de datos y ML para un grupo de productos ópticos y una empresa de energía, durante el MBA.',
        en: 'Data and ML platforms for an optical products group and an energy company, during my MBA.',
      },
      highlights: [
        { value: { es: '2', en: '2' }, label: { es: 'clientes, en paralelo al MBA', en: 'clients, alongside the MBA' } },
        { value: { es: '>90%', en: '>90%' }, label: { es: 'de la energía generada coincidió con las estimaciones', en: 'of generated energy matched the estimates' } },
      ],
      bullets: {
        es: [
          'Grupo óptico: construí la base de código y las abstracciones de la plataforma de datos y ML, y operé Dagster sobre Kubernetes junto a DevOps.',
          'Llevé a producción el código del data scientist y armé los pipelines de facturación y la ingesta desde el ERP hasta las capas silver y gold, servidas en Metabase.',
          'Energía: hice nowcasting de generación eléctrica. Modelé cuánto deberían entregar paneles e inversores para detectar desviaciones respecto de lo esperado.',
          'En ambos definí el alcance con el cliente, apoyé la preventa técnica e implementé MLOps e infraestructura como código.',
        ],
        en: [
          'Optical group: built the codebase and abstractions of the data and ML platform, and ran Dagster on Kubernetes with DevOps.',
          "Took the data scientist's code to production and built the billing pipelines and the ERP ingestion into silver and gold layers, served through Metabase.",
          'Energy: electricity generation nowcasting. Modelled how much panels and inverters should deliver in order to detect deviations from expected output.',
          'On both, I scoped the work with the client, supported technical pre-sales, and set up MLOps and infrastructure as code.',
        ],
      },
      stack: ['Dagster', 'dbt', 'Kubernetes', 'MLflow', 'Postgres', 'DuckDB', 'Metabase', 'Terraform'],
    },
    {
      id: 'bci-genai',
      period: { es: 'Nov 2023 – May 2025', en: 'Nov 2023 – May 2025' },
      span: [2023.83, 2025.33],
      org: { es: 'Banco Bci', en: 'Banco Bci' },
      short: { es: 'Bci', en: 'Bci' },
      role: { es: 'Subgerente de IA Generativa', en: 'Head of Generative AI' },
      headline: {
        es: 'Estrategia corporativa de IA generativa en un banco regulado de más de 9.000 personas.',
        en: 'Enterprise generative AI strategy at a regulated bank with 9,000+ employees.',
      },
      highlights: [
        { value: { es: '26%', en: '26%' }, label: { es: 'de automatización sobre ~80K consultas al mes', en: 'automation over ~80K monthly inquiries' } },
        { value: { es: '20+', en: '20+' }, label: { es: 'iniciativas, de discovery a producción', en: 'initiatives, from discovery to production' } },
        { value: { es: 'CLP 800MM+', en: 'CLP 800MM+' }, label: { es: 'de presupuesto a cargo', en: 'budget managed' } },
      ],
      bullets: {
        es: [
          'Fundé y lideré el Centro de Excelencia de GenAI (3 ML Engineers, 2 Product Leads) y definí gobierno, arquitectura, estándares y relación con proveedores.',
          'Entregué un copiloto de atención al cliente como extensión de Chrome, con flujos de RAG agéntico sobre Azure Kubernetes.',
          'Modernicé la calidad del call center: transcripción con Whisper y clasificadores LLM para automatizar cumplimiento regulatorio y puntajes de calidad.',
          'Entregué un asistente de investigación con RAG para banca de inversión, sobre toda la data de la CMF y otras fuentes de mercado.',
          'Evalué modelos fundacionales con golden sets propios para cada caso y definí cómo servirlos en producción.',
          'Lideré la adopción corporativa de Gemini y armé comunidades de práctica en más de 10 grupos, 3 de ellos con PoCs activos.',
        ],
        en: [
          'Founded and led the GenAI Center of Excellence (3 ML Engineers, 2 Product Leads) and set governance, architecture, standards and vendor relationships.',
          'Delivered a Customer Success Copilot Chrome extension, with Agentic RAG workflows on Azure Kubernetes.',
          'Modernized Call Center QA: Whisper transcription and LLM classifiers to automate regulatory compliance and quality scoring.',
          'Delivered a RAG research assistant for investment banking, covering all CMF (Chilean financial regulator) data and other market sources.',
          'Benchmarked foundation models against in-house golden sets for each use case and defined how to serve them in production.',
          'Led corporate Gemini adoption and scaled expertise through Communities of Practice across 10+ groups, 3 with active PoCs.',
        ],
      },
      stack: ['Azure AI Foundry', 'Azure OpenAI', 'Databricks', 'Azure Kubernetes', 'LangGraph', 'PydanticAI', 'LangSmith', 'LiteLLM', 'pgvector', 'OpenTelemetry', 'Whisper'],
    },
    {
      id: 'mach',
      period: { es: 'Mar 2022 – Nov 2023', en: 'Mar 2022 – Nov 2023' },
      span: [2022.17, 2023.83],
      org: { es: 'MACH', en: 'MACH' },
      short: { es: 'MACH', en: 'MACH' },
      role: { es: 'Head of Analytics & Data Science', en: 'Head of Analytics & Data Science' },
      headline: {
        es: 'Analítica y ciencia de datos para Growth, Riesgo, Fraude y Producto en una fintech de más de 3,8M de usuarios.',
        en: 'Analytics and data science for Growth, Risk, Fraud and Product at a fintech with 3.8M+ users.',
      },
      highlights: [
        { value: { es: '3,8M+', en: '3.8M+' }, label: { es: 'usuarios', en: 'users' } },
        { value: { es: '100+', en: '100+' }, label: { es: 'campañas mensuales, todas medidas con A/B', en: 'monthly campaigns, all measured with A/B tests' } },
        { value: { es: '9', en: '9' }, label: { es: 'personas: 6 data scientists y 3 ML engineers', en: 'people: 6 data scientists and 3 ML engineers' } },
      ],
      bullets: {
        es: [
          'Impulsé un motor de Next Best Action sobre AWS que modelaba más de 40 comportamientos y se integraba con el stack de marketing.',
          'Supervisé la capa de datos de las campañas, evaluadas contra un grupo de control global del 10%. Con el motor como impulsor clave, la contribución atribuida superó el 50% del uso en algunos productos.',
          'Habilité analítica self-service, que usaba más del 30% de los 450 colaboradores.',
          'Operé los modelos en producción sobre un feature store y un registro de modelos propios, con monitoreo mensual de estabilidad (PSI/CSI) y lift.',
          'Entregué un DataBot interno basado en GPT, pipelines de AutoML y un PoC de verificación de identidad con un ahorro potencial cercano a USD 1M al año.',
        ],
        en: [
          'Drove a Next Best Action engine on AWS that modelled 40+ behaviors and plugged into the marketing stack.',
          'Oversaw the data layer for the campaigns, evaluated against a global 10% control group. With the engine as a key driver, attributed contribution exceeded 50% of usage in selected products.',
          "Enabled self-service analytics, used by over 30% of the company's 450 employees.",
          'Operated production models on an in-house feature store and model registry, with monthly stability (PSI/CSI) and lift monitoring.',
          'Delivered a GPT-based internal DataBot, AutoML pipelines and an identity verification PoC with potential savings near USD 1M a year.',
        ],
      },
      stack: ['AWS Glue', 'Athena', 'S3', 'SageMaker', 'QuickSight', 'Spark', 'Polars', 'Braze', 'AppsFlyer', 'Segment', 'Amplitude'],
    },
    {
      id: 'tenpo',
      period: { es: 'Dic 2020 – Ene 2022', en: 'Dec 2020 – Jan 2022' },
      span: [2020.92, 2022.08],
      org: { es: 'Tenpo', en: 'Tenpo' },
      short: { es: 'Tenpo', en: 'Tenpo' },
      role: { es: 'Head of Data & Analytics', en: 'Head of Data & Analytics' },
      headline: {
        es: 'Armé desde cero la función de datos de una fintech con más de 1M de usuarios.',
        en: 'Built the data function of a fintech with 1M+ users from scratch.',
      },
      highlights: [
        { value: { es: '2,0 → 4,5', en: '2.0 → 4.5' }, label: { es: 'de 5 en cultura de datos, en menos de un año', en: 'out of 5 in data culture, in under a year' } },
        { value: { es: '120+', en: '120+' }, label: { es: 'stakeholders internos', en: 'internal stakeholders' } },
        { value: { es: '<20 min', en: '<20 min' }, label: { es: 'de SLA en la mayoría de las funciones de datos', en: 'SLA on most data functions' } },
      ],
      bullets: {
        es: [
          'Definí modelo operativo, gobierno, roadmap y PMO, con un equipo de 3 data analysts.',
          'Dirigí el diseño y despliegue de la plataforma de datos y BI en GCP, integrada con los sistemas productivos, CleverTap y los microservicios del backend.',
          'Impulsé los activos analíticos centrales: bases de feature store, P&L y unit economics, segmentación RFMP, CLTV y modelos de comportamiento.',
          'Presenté cada trimestre estrategia e insights al C-level y preparé material de directorio para Krealo/Credicorp.',
        ],
        en: [
          'Defined the operating model, governance, roadmap and PMO, with a team of 3 data analysts.',
          'Directed the design and rollout of the data and BI platform on GCP, integrated with production systems, CleverTap and backend microservices.',
          'Drove the core analytical assets: feature store foundations, P&L and unit economics, RFMP segmentation, CLTV and behavioral models.',
          "Presented strategy and insights to the C-level every quarter and prepared board materials for Krealo/Credicorp.",
        ],
      },
      stack: ['GCP', 'BigQuery', 'dbt', 'Airflow', 'Looker', 'Flink', 'MLflow', 'Kubernetes', 'GitLab'],
    },
    {
      id: 'bci-ds',
      period: { es: 'Mar 2015 – Dic 2020', en: 'Mar 2015 – Dec 2020' },
      span: [2015.17, 2020.92],
      org: { es: 'Banco Bci', en: 'Banco Bci' },
      short: { es: 'Bci', en: 'Bci' },
      role: { es: 'Principal Data Scientist', en: 'Principal Data Scientist' },
      headline: {
        es: 'De trainee a referente de IA y ML del banco, con soluciones para Riesgo, Ventas, Marketing y Experiencia de Cliente.',
        en: "From trainee to the bank's AI and ML lead, delivering for Risk, Sales, Marketing and CX.",
      },
      highlights: [
        { value: { es: '20+', en: '20+' }, label: { es: 'modelos de ML en producción', en: 'ML models in production' } },
        { value: { es: '400K+', en: '400K+' }, label: { es: 'clientes analizados cada día', en: 'customers analyzed daily' } },
        { value: { es: '70K+', en: '70K+' }, label: { es: 'correos clasificados por semana', en: 'emails classified weekly' } },
      ],
      bullets: {
        es: [
          'Migré el modelamiento de SPSS Modeler a Python y fui pionero en adoptar Apache Airflow en 2016.',
          'Construí modelos XGBoost de cross-sell, up-sell, activación y reactivación para seguros y tarjetas.',
          'Diseñé un motor de CRM híbrido, de reglas y ML, que generaba ofertas personalizadas.',
          'Desarrollé pipelines de NLP con TF-IDF y Word2Vec para detectar intención y sentimiento en correos.',
          'Desarrollé microservicios de recomendación sobre más de 66M de transacciones, motores de búsqueda y chatbots, y una herramienta de pronóstico USD/CLP.',
          'Implementamos un marco de monitoreo macro durante el COVID-19 para detectar ciclos económicos y apoyar análisis de escenarios.',
        ],
        en: [
          'Moved modeling from SPSS Modeler to Python and pioneered Apache Airflow adoption in 2016.',
          'Built XGBoost models for cross-sell, up-sell, activation and reactivation in insurance and credit cards.',
          'Designed a hybrid CRM engine, rule-based and ML, that generated personalized offers.',
          'Engineered NLP pipelines with TF-IDF and Word2Vec to detect intent and sentiment in emails.',
          'Developed recommendation microservices over 66M+ transactions, search and chatbot engines, and a USD/CLP forecasting tool.',
          'Implemented a macro-monitoring framework during COVID-19 to detect economic cycles and support scenario analysis.',
        ],
      },
      stack: ['Python', 'Spark', 'SQL', 'R', 'Airflow', 'XGBoost', 'Elasticsearch', 'Dialogflow'],
    },
  ] as ExperienceItem[],

  teaching: {
    period: { es: '2016 – Presente', en: '2016 – Present' } as L10n<string>,
    org: { es: 'Múltiples Universidades', en: 'Multiple Universities' } as L10n<string>,
    role: { es: 'Docente', en: 'Lecturer' } as L10n<string>,
    summary: {
      es: 'Data Mining, Machine Learning e Ingeniería de Software en la U. Andrés Bello, la U. Adolfo Ibáñez y la U. Diego Portales. Trabajo con analítica aplicada y casos de negocio reales, en R y Python.',
      en: 'Data Mining, Machine Learning and Software Engineering at Universidad Andrés Bello, Universidad Adolfo Ibáñez and Universidad Diego Portales, focused on applied analytics and real business cases in R and Python.',
    } as L10n<string>,
  },

  publication: {
    year: '2022',
    title: 'Analysis of the Use of Color and Its Emotional Relationship in Visual Creations Based on Experiences during the Context of the COVID-19 Pandemic',
    authors: 'González-Martín, C., Carrasco, M., & Oviedo, G.',
    venue: 'Sustainability, 14(20), 12989',
    url: 'https://doi.org/10.3390/su142012989',
  },

  certification: {
    period: '2017',
    org: 'Udacity',
    name: { es: 'Artificial Intelligence Nanodegree', en: 'Artificial Intelligence Nanodegree' } as L10n<string>,
  },

  education: [
    {
      period: '2025 – 2026',
      span: [2025, 2026.75],
      org: 'MIB Trieste School of Management',
      short: { es: 'MBA', en: 'MBA' },
      degree: { es: 'MBA in International Business', en: 'MBA in International Business' },
      note: { es: 'En colaboración con la Universidad de Trieste, Italia.', en: 'In collaboration with the University of Trieste, Italy.' },
    },
    {
      period: '2021 – 2022',
      span: [2021, 2023],
      org: 'Universidad Adolfo Ibáñez',
      short: { es: 'Magíster', en: 'M.Sc.' },
      degree: { es: 'Magíster en Ciencias de la Ingeniería, mención TI', en: 'M.Sc. in Engineering, IT specialization' },
      note: { es: 'Santiago y Viña del Mar, Chile', en: 'Santiago & Viña del Mar, Chile' },
    },
    {
      period: '2010 – 2015',
      org: 'Universidad Adolfo Ibáñez',
      short: { es: 'Ingeniería', en: 'B.Sc.' },
      degree: { es: 'Ingeniería Civil Industrial', en: 'B.Sc. in Engineering (Industrial Engineering)' },
      note: { es: 'Santiago y Viña del Mar, Chile', en: 'Santiago & Viña del Mar, Chile' },
    },
  ] as EducationItem[],

  skills: [
    { label: { es: 'IA generativa y ML', en: 'GenAI & ML' }, items: { es: 'LLMs, RAG, LangGraph, PydanticAI, LangSmith, LiteLLM, evaluación con golden sets, OpenTelemetry, MLOps', en: 'LLMs, RAG, LangGraph, PydanticAI, LangSmith, LiteLLM, golden-set evaluation, OpenTelemetry, MLOps' } },
    { label: { es: 'Datos y plataformas', en: 'Data & platforms' }, items: { es: 'BigQuery, Databricks, dbt, Airflow, Dagster, Flink, Spark, DuckDB, feature stores, gobierno y calidad de datos', en: 'BigQuery, Databricks, dbt, Airflow, Dagster, Flink, Spark, DuckDB, feature stores, data governance and quality' } },
    { label: { es: 'Cloud', en: 'Cloud' }, items: { es: 'AWS (Glue, S3, Athena, SageMaker), GCP, Azure, Docker, Kubernetes, Terraform', en: 'AWS (Glue, S3, Athena, SageMaker), GCP, Azure, Docker, Kubernetes, Terraform' } },
    { label: { es: 'Analítica', en: 'Analytics' }, items: { es: 'Inferencia causal, pruebas A/B, cuasi-experimentos, analítica de producto y marketing, monitoreo de modelos (PSI/CSI, lift)', en: 'Causal inference, A/B testing, quasi-experiments, product and marketing analytics, model monitoring (PSI/CSI, lift)' } },
    { label: { es: 'BI y martech', en: 'BI & martech' }, items: { es: 'Looker, Power BI, QuickSight, Metabase, Braze, CleverTap, AppsFlyer, Segment, Amplitude', en: 'Looker, Power BI, QuickSight, Metabase, Braze, CleverTap, AppsFlyer, Segment, Amplitude' } },
    { label: { es: 'Programación', en: 'Programming' }, items: { es: 'Python (NumPy, Pandas, Polars, scikit-learn, PyTorch), SQL, Spark (PySpark, Java, Scala), R', en: 'Python (NumPy, Pandas, Polars, scikit-learn, PyTorch), SQL, Spark (PySpark, Java, Scala), R' } },
    { label: { es: 'Código con agentes', en: 'Agentic coding' }, items: { es: 'Claude Code, Cursor, OpenCode', en: 'Claude Code, Cursor, OpenCode' } },
    { label: { es: 'Liderazgo y negocio', en: 'Leadership & business' }, items: { es: 'Construcción de equipos, diseño organizacional, presupuesto y proveedores, gestión del cambio, relación con C-level y directorio', en: 'Team building, organization design, budget and vendors, change management, C-level and board relationships' } },
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
  skills: { es: 'Habilidades', en: 'Skills' },
  glance: { es: 'En corto', en: 'At a glance' },
  timeline: { es: 'Trayectoria, 2015 a hoy', en: 'Career, 2015 to today' },
  laneWork: { es: 'Trabajo', en: 'Work' },
  laneTeaching: { es: 'Docencia', en: 'Teaching' },
  laneStudy: { es: 'Estudios', en: 'Studies' },
  teachingShort: { es: 'UNAB, UAI y UDP', en: 'UNAB, UAI and UDP' },
  expandAll: { es: 'Abrir todo', en: 'Expand all' },
  collapseAll: { es: 'Cerrar todo', en: 'Collapse all' },
  stack: { es: 'Stack', en: 'Stack' },
  publications: { es: 'Publicación y certificación', en: 'Publication and certification' },
  readPaper: { es: 'Leer el paper ↗', en: 'Read the paper ↗' },
  contact: { es: 'Contacto', en: 'Contact' },
  viewAll: { es: 'Ver todos →', en: 'All posts →' },
  browseServices: { es: 'Ver servicios →', en: 'All services →' },
  servicesLead: {
    es: 'Consultoría en datos e inteligencia artificial, arquitectura cloud y desarrollo de software.',
    en: 'Consulting in data and AI, cloud architecture and software development.',
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
