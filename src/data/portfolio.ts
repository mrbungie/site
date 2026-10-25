import type { L10n } from './profile';

// Open-source work: public repos on github.com/mrbungie.
export interface Repo {
  name: string;
  url: string;
  year: string;
  desc: L10n<string>;
  tags: string[];
}

// Client work: no code, only an architecture diagram and what I did. Keep it short and anonymized.
export interface CaseStudy {
  id: 'data-platform' | 'agency-platform';
  period: string;
  title: L10n<string>;
  context: L10n<string>;
  goal: L10n<string>;
  did: L10n<string[]>;
  stack: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'agency-platform',
    period: '2026',
    title: {
      es: 'Plataforma de workflows con IA para una agencia de marketing',
      en: 'AI workflow platform for a marketing agency',
    },
    context: { es: 'Agencia de marketing en Chile', en: 'Marketing agency in Chile' },
    goal: {
      es: 'Sacar de las planillas los procesos de la agencia y convertirlos en workflows con pasos humanos, revisión asistida por LLM y entregables generados solos.',
      en: 'Move agency processes out of spreadsheets into workflows with human steps, LLM-assisted review and generated deliverables.',
    },
    did: {
      es: [
        'Diseñé y construí la plataforma: frontend en React, API en FastAPI y workers sobre Temporal.',
        'Escribí un DSL tipado para definir workflows, desacoplado del backend.',
        'Integré revisión con LLM vía LiteLLM y Gemini, y un servicio que convierte decks HTML en PPTX y PDF editables.',
        'Monté la infraestructura en GCP con Terraform: GKE Autopilot, Workload Identity y Secret Manager.',
      ],
      en: [
        'Designed and built the platform: React frontend, FastAPI API and Temporal workers.',
        'Wrote a typed DSL for defining workflows, decoupled from the backend.',
        'Integrated LLM review through LiteLLM and Gemini, plus a service that turns HTML decks into editable PPTX and PDF.',
        'Set up the GCP infrastructure with Terraform: GKE Autopilot, Workload Identity and Secret Manager.',
      ],
    },
    stack: ['Python', 'FastAPI', 'Temporal', 'React', 'LiteLLM', 'GCP'],
  },
  {
    id: 'data-platform',
    period: '2024 – 2026',
    title: {
      es: 'Plataforma de datos y ML para una distribuidora óptica',
      en: 'Data and ML platform for an optical distributor',
    },
    context: { es: 'Cooperativa europea del rubro óptico', en: 'European optical cooperative' },
    goal: {
      es: 'Unificar facturación y catálogos de varios proveedores en un solo modelo de datos, y usarlo para recomendar el producto propio equivalente a cada venta de terceros.',
      en: 'Unify billing and catalogs from several suppliers into one data model, and use it to recommend the in-house equivalent for each third-party sale.',
    },
    did: {
      es: [
        'Diseñé el pipeline ELT en Dagster y dbt, con capas bronze, silver y gold.',
        'Escribí la normalización de clientes, productos, proveedores y facturas, que llegaban en formatos distintos.',
        'Construí la parte de ML: extracción de atributos de producto con LLM y un clasificador supervisado, con experimentos en MLflow.',
        'Armé la cadena de equivalencias de producto que alimenta los dashboards comerciales.',
      ],
      en: [
        'Designed the ELT pipeline in Dagster and dbt, with bronze, silver and gold layers.',
        'Wrote the normalization of customers, products, suppliers and invoices, which arrived in different formats.',
        'Built the ML side: LLM-based product attribute extraction and a supervised classifier, tracked in MLflow.',
        'Built the product-equivalence chain that feeds the sales dashboards.',
      ],
    },
    stack: ['Dagster', 'dbt', 'Python', 'LLMs', 'MLflow', 'Kubernetes'],
  },
];

export const repos: Repo[] = [
  {
    name: 'ai_disclosure_analysis',
    url: 'https://github.com/mrbungie/ai_disclosure_analysis',
    year: '2026',
    desc: {
      es: 'Investigación sobre cómo hablan de IA las empresas del S&P 500 en sus reportes a la SEC (2021–2026). Pipeline sobre 1,5 millones de párrafos con Polars y clasificación con LLM.',
      en: 'Research on how S&P 500 companies talk about AI in their SEC filings (2021–2026). Pipeline over 1.5 million paragraphs with Polars and LLM classification.',
    },
    tags: ['Python', 'Polars', 'LLM', 'DuckDB'],
  },
  {
    name: 'ephemeris',
    url: 'https://github.com/mrbungie/ephemeris',
    year: '2026',
    desc: {
      es: 'SDK y servidor MCP para que agentes de IA levanten entornos de cómputo efímeros en hosts SSH o clusters de Kubernetes.',
      en: 'SDK and MCP server that lets AI agents spin up ephemeral compute on SSH hosts or Kubernetes clusters.',
    },
    tags: ['Python', 'MCP', 'FastAPI', 'Kubernetes'],
  },
  {
    name: 'arnessa',
    url: 'https://github.com/mrbungie/arnessa',
    year: '2026',
    desc: {
      es: 'Toolkit para construir harnesses de agentes sobre PydanticAI: estado sincronizado, tool calls diferidas y UI dinámica, con SDKs en Python y React.',
      en: 'Toolkit for building agent harnesses on PydanticAI: synced state, deferred tool calls and dynamic UI, with Python and React SDKs.',
    },
    tags: ['Python', 'TypeScript', 'PydanticAI', 'React'],
  },
  {
    name: 'mib_cars_analysis',
    url: 'https://github.com/mrbungie/mib_cars_analysis',
    year: '2026',
    desc: {
      es: 'Priorización de leads y simulación de ingresos sobre 78 mil registros de ventas. Proyecto del MBA.',
      en: 'Lead prioritization and revenue simulation over 78k sales records. MBA project.',
    },
    tags: ['Python', 'WoE/IV', 'Quarto'],
  },
  {
    name: 'vastai-datascience-runtime',
    url: 'https://github.com/mrbungie/vastai-datascience-runtime',
    year: '2026',
    desc: {
      es: 'Imagen Docker para análisis de datos en vast.ai, con o sin GPU: uv, JupyterLab, DuckDB y CLIs de IA.',
      en: 'Docker image for data analysis on vast.ai, with or without GPU: uv, JupyterLab, DuckDB and AI CLIs.',
    },
    tags: ['Docker', 'CUDA', 'Shell'],
  },
];
