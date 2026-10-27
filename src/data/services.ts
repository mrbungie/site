import type { L10n } from './profile';

// Commercial pages under /servicios (es) and /en/services (en). Each one links to portfolio
// projects as evidence and ends in the contact form with "project" preselected.
export interface Service {
  slug: string; // shared by both locales
  name: L10n<string>; // short label for cards and nav
  seoTitle: L10n<string>; // <title> and H1
  description: L10n<string>; // meta description
  intro: L10n<string>;
  problems: L10n<string[]>;
  offer: L10n<string[]>;
  projects: string[]; // portfolio slugs used as evidence
  faqs: { q: L10n<string>; a: L10n<string> }[];
}

export const services: Service[] = [
  {
    slug: 'datos-inteligencia-artificial',
    name: { es: 'Datos e inteligencia artificial', en: 'Data and AI' },
    seoTitle: {
      es: 'Consultoría en datos e inteligencia artificial',
      en: 'Data and AI consulting',
    },
    description: {
      es: 'Plataformas de datos, modelos predictivos, GenAI y asistentes con LLMs para empresas, desde el caso de uso hasta producción. Experiencia en Bci, MACH y Tenpo.',
      en: 'Data platforms, predictive models, GenAI and LLM assistants for companies, from use case to production. Experience at Bci, MACH and Tenpo.',
    },
    intro: {
      es: 'Armo plataformas de datos, modelos y asistentes con IA, y los conecto con decisiones del negocio. Armé desde cero el área de datos de Tenpo, dirigí analítica y ciencia de datos en MACH y lideré la adopción de Gemini en una organización de más de 9.000 personas. La IA funciona cuando los datos debajo están bien, así que trabajo las dos cosas juntas.',
      en: "I build data platforms, models and AI assistants, and connect them to business decisions. I built Tenpo's data team from scratch, ran analytics and data science at MACH and led the rollout of Gemini to an organization of more than 9,000 people. AI works when the data underneath is sound, so I work on both together.",
    },
    problems: {
      es: [
        'Los datos están repartidos en sistemas y planillas, sin una fuente única.',
        'Tienen muchas ideas de IA y no saben cuáles priorizar ni cuánto cuestan.',
        'Un piloto de GenAI o un modelo en un notebook funcionó, pero no llega a producción.',
        'No saben si una campaña, un modelo o un asistente mejoró algo de verdad.',
        'Necesitan formar o reordenar un equipo de datos.',
      ],
      en: [
        'Data lives across systems and spreadsheets, with no single source of truth.',
        "You have plenty of AI ideas but don't know which to prioritize or what they cost.",
        'A GenAI pilot or a notebook model worked, but never reaches production.',
        "You can't tell whether a campaign, a model or an assistant actually improved anything.",
        'You need to build or reorganize a data team.',
      ],
    },
    offer: {
      es: [
        'Plataformas de datos: lakehouse, Dagster, dbt y calidad de datos.',
        'Modelos predictivos y de propensión que llegan a producción.',
        'Asistentes y agentes con LLMs: RAG, flujos con humanos en el loop y evaluación.',
        'Priorización de casos de uso de IA, con estimación de valor y costo.',
        'Inferencia causal, experimentos A/B y medición de impacto.',
        'Diseño y formación de equipos de datos.',
      ],
      en: [
        'Data platforms: lakehouse, Dagster, dbt and data quality.',
        'Predictive and propensity models that reach production.',
        'LLM assistants and agents: RAG, human-in-the-loop flows and evaluation.',
        'AI use case prioritization, with value and cost estimates.',
        'Causal inference, A/B tests and impact measurement.',
        'Data team design and training.',
      ],
    },
    projects: ['optical-data-platform', 'tenpo-realtime-fraud', 'agency-workflows', 'healthcare-chatbot'],
    faqs: [
      {
        q: { es: '¿Qué modelos de IA usas?', en: 'Which AI models do you use?' },
        a: {
          es: 'Depende del caso: OpenAI, Gemini, Claude o modelos abiertos. Elijo según costo, privacidad de los datos y calidad medida con evaluaciones.',
          en: 'It depends on the case: OpenAI, Gemini, Claude or open models. I choose by cost, data privacy and quality measured with evaluations.',
        },
      },
      {
        q: { es: '¿Trabajas con la nube que ya tenemos?', en: 'Do you work with the cloud we already have?' },
        a: {
          es: 'Sí. He construido plataformas en AWS, GCP y Azure, y prefiero aprovechar lo que ya existe antes que migrar por migrar.',
          en: "Yes. I've built platforms on AWS, GCP and Azure, and I'd rather use what you already have than migrate for its own sake.",
        },
      },
      {
        q: { es: '¿Puedes ayudarnos a medir el impacto de una campaña?', en: 'Can you help us measure a campaign’s impact?' },
        a: {
          es: 'Sí. Uso experimentos cuando se puede e inferencia causal cuando no, para separar el efecto real de la campaña del ruido.',
          en: 'Yes. I use experiments when possible and causal inference when not, to separate the real effect from noise.',
        },
      },
      {
        q: { es: '¿Puedes trabajar con mi equipo interno?', en: 'Can you work with my in-house team?' },
        a: {
          es: 'Sí, es lo que prefiero. Construyo junto al equipo y dejo documentación y formación para que no dependan de mí.',
          en: "Yes, that's what I prefer. I build alongside the team and leave documentation and training so you don't depend on me.",
        },
      },
    ],
  },
  {
    slug: 'arquitectura-tecnologica',
    name: { es: 'Arquitectura cloud y MLOps', en: 'Cloud architecture and MLOps' },
    seoTitle: {
      es: 'Arquitectura cloud y MLOps en AWS, GCP y Azure',
      en: 'Cloud architecture and MLOps on AWS, GCP and Azure',
    },
    description: {
      es: 'Arquitectura cloud, Kubernetes, infraestructura como código y MLOps para empresas. Ambientes reproducibles y costos bajo control.',
      en: 'Cloud architecture, Kubernetes, infrastructure as code and MLOps for companies. Reproducible environments and costs under control.',
    },
    intro: {
      es: 'Diseño la infraestructura donde corren datos y modelos: Kubernetes, infraestructura como código, CI/CD y ambientes que se comportan igual en desarrollo y en producción. Empecé en infraestructura cloud en 2013, así que también sé leer la cuenta.',
      en: "I design the infrastructure where data and models run: Kubernetes, infrastructure as code, CI/CD and environments that behave the same in development and production. I started in cloud infrastructure in 2013, so I also know how to read the bill.",
    },
    problems: {
      es: [
        'Lo que funciona en el notebook o en local falla en producción.',
        'La cuenta de la nube crece y nadie sabe bien por qué.',
        'Los modelos se despliegan a mano y no se pueden reproducir.',
        'Hay que elegir entre alternativas de infraestructura y comparar su costo real.',
      ],
      en: [
        'What works in the notebook or locally breaks in production.',
        'The cloud bill keeps growing and nobody quite knows why.',
        'Models are deployed by hand and cannot be reproduced.',
        'You need to choose between infrastructure options and compare their real cost.',
      ],
    },
    offer: {
      es: [
        'Kubernetes (EKS, GKE, AKS) con autoscaling y costos bajo control.',
        'Infraestructura como código con Terraform, Pulumi y Helm.',
        'MLOps: orquestación con Dagster o Airflow, registro de modelos con MLflow.',
        'Observabilidad y análisis de costo total (TCO).',
      ],
      en: [
        'Kubernetes (EKS, GKE, AKS) with autoscaling and costs under control.',
        'Infrastructure as code with Terraform, Pulumi and Helm.',
        'MLOps: orchestration with Dagster or Airflow, model registry with MLflow.',
        'Observability and total cost of ownership (TCO) analysis.',
      ],
    },
    projects: ['solar-forecasting-mlops', 'cloud-tco-openstack', 'vcloud-elk-monitoring', 'gpu-data-runtime'],
    faqs: [
      {
        q: { es: '¿Con qué nubes trabajas?', en: 'Which clouds do you work with?' },
        a: {
          es: 'AWS, GCP y Azure. La elección depende de lo que ya tienes, de tu equipo y del costo, no de una preferencia mía.',
          en: 'AWS, GCP and Azure. The choice depends on what you already have, your team and cost, not on my preference.',
        },
      },
      {
        q: { es: '¿Necesito Kubernetes?', en: 'Do I need Kubernetes?' },
        a: {
          es: 'No siempre. A veces un servicio administrado es más simple y barato. Lo evaluamos con números antes de decidir.',
          en: 'Not always. Sometimes a managed service is simpler and cheaper. We evaluate it with numbers before deciding.',
        },
      },
    ],
  },
  {
    slug: 'desarrollo-software',
    name: { es: 'Desarrollo de software a medida', en: 'Custom software development' },
    seoTitle: {
      es: 'Desarrollo de software a medida y plataformas web',
      en: 'Custom software and web platform development',
    },
    description: {
      es: 'Desarrollo de plataformas web, backends, integraciones y herramientas internas a medida para empresas, con foco en datos e IA.',
      en: 'Custom web platforms, backends, integrations and internal tools for companies, with a focus on data and AI.',
    },
    intro: {
      es: 'Diseño y construyo plataformas cuando lo que existe en el mercado no calza con tu proceso: desde el modelo de datos y la API hasta la interfaz y la infraestructura. Mi especialidad son los productos donde los datos y la IA son parte del núcleo.',
      en: "I design and build platforms when off-the-shelf tools don't fit your process: from the data model and API to the interface and infrastructure. My specialty is products where data and AI are part of the core.",
    },
    problems: {
      es: [
        'Procesos críticos que viven en planillas y correos.',
        'Sistemas que hay que integrar aunque no tengan API.',
        'Un MVP que funcionó y ahora tiene que escalar.',
        'Herramientas internas que nadie tiene tiempo de construir.',
      ],
      en: [
        'Critical processes living in spreadsheets and email.',
        "Systems that need integrating even though they don't have an API.",
        'An MVP that worked and now needs to scale.',
        'Internal tools nobody has time to build.',
      ],
    },
    offer: {
      es: [
        'Plataformas full-stack con React, FastAPI o Node.',
        'Workflows durables con pasos humanos (Temporal).',
        'Integraciones y extracción de datos, incluso desde sitios sin API.',
        'SDKs, herramientas internas y entornos de desarrollo.',
      ],
      en: [
        'Full-stack platforms with React, FastAPI or Node.',
        'Durable workflows with human steps (Temporal).',
        "Integrations and data extraction, even from sites without an API.",
        'SDKs, internal tools and developer environments.',
      ],
    },
    projects: ['agency-workflows', 'datax-tax-data', 'rental-voucher-platform', 'gpu-data-runtime'],
    faqs: [
      {
        q: { es: '¿Quién mantiene el software después?', en: 'Who maintains the software afterwards?' },
        a: {
          es: 'Lo dejo documentado y con pruebas para que tu equipo lo mantenga. Si lo prefieres, acordamos un soporte mensual.',
          en: 'I leave it documented and tested so your team can maintain it. If you prefer, we agree on monthly support.',
        },
      },
      {
        q: { es: '¿Haces solo el backend o también la interfaz?', en: 'Do you do only the backend or the interface too?' },
        a: {
          es: 'Ambos. En la plataforma de workflows para una agencia construí el frontend, el backend y la infraestructura.',
          en: 'Both. On the agency workflow platform I built the frontend, the backend and the infrastructure.',
        },
      },
    ],
  },
];

export const serviceProcess: L10n<{ title: string; body: string }[]> = {
  es: [
    { title: 'Diagnóstico', body: 'Entiendo el problema, los datos y las restricciones, y vemos si tiene sentido técnico y económico.' },
    { title: 'Prototipo', body: 'Algo funcionando con datos reales en pocas semanas, para decidir con evidencia.' },
    { title: 'Implementación', body: 'Lo llevamos a producción junto a tu equipo, con pruebas, monitoreo y costos claros.' },
    { title: 'Traspaso', body: 'Documentación y formación para que el equipo siga sin depender de mí.' },
  ],
  en: [
    { title: 'Diagnosis', body: 'I understand the problem, the data and the constraints, and we check whether it makes technical and economic sense.' },
    { title: 'Prototype', body: 'Something working with real data in a few weeks, so decisions rest on evidence.' },
    { title: 'Implementation', body: 'We take it to production with your team, with tests, monitoring and clear costs.' },
    { title: 'Handover', body: 'Documentation and training so the team can keep going without depending on me.' },
  ],
};

export const serviceFormats: L10n<string> = {
  es: 'Trabajo por proyecto, como asesoría mensual o como líder interino (fractional) de datos e IA. Presencial en Santiago y Antofagasta, y remoto para el resto de Chile y el extranjero.',
  en: 'I work per project, as a monthly advisor or as an interim (fractional) data and AI lead. On-site in Santiago and Antofagasta, and remote for the rest of Chile and abroad.',
};
