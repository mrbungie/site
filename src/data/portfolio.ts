import type { L10n } from './profile';

// Every project is a card on /portafolio and a detail page at /portafolio/<slug>.
// Proprietary work is anonymized: architecture and my role only, no client names or data.
export interface Project {
  slug: string;
  kind: 'proprietary' | 'oss';
  period: string;
  industry: L10n<string>;
  workType: L10n<string>;
  title: L10n<string>;
  summary: L10n<string>; // card blurb
  goal: L10n<string>;
  did: L10n<string[]>;
  stack: string[];
  repo?: string;
}

export const projects: Project[] = [
  {
    slug: 'agency-workflows',
    kind: 'proprietary',
    period: '2026',
    industry: { es: 'Marketing', en: 'Marketing' },
    workType: { es: 'Plataforma full-stack con IA', en: 'Full-stack AI platform' },
    title: {
      es: 'Plataforma de workflows con IA para una agencia',
      en: 'AI workflow platform for an agency',
    },
    summary: {
      es: 'Procesos de agencia convertidos en workflows con pasos humanos, revisión con LLM y entregables generados solos.',
      en: 'Agency processes turned into workflows with human steps, LLM review and generated deliverables.',
    },
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
    slug: 'optical-data-platform',
    kind: 'proprietary',
    period: '2024 – 2026',
    industry: { es: 'Retail óptico', en: 'Optical retail' },
    workType: { es: 'Ingeniería de datos y ML', en: 'Data engineering & ML' },
    title: {
      es: 'Plataforma de datos y ML para una distribuidora óptica',
      en: 'Data and ML platform for an optical distributor',
    },
    summary: {
      es: 'Facturación y catálogos de varios proveedores en un solo modelo de datos, usado para recomendar producto propio.',
      en: 'Billing and catalogs from several suppliers in one data model, used to recommend in-house products.',
    },
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
  {
    slug: 'ai-disclosure',
    kind: 'oss',
    period: '2026',
    industry: { es: 'Finanzas', en: 'Finance' },
    workType: { es: 'Investigación y NLP', en: 'Research & NLP' },
    title: {
      es: '¿AI washing o divulgación creíble?',
      en: 'AI washing or credible disclosure?',
    },
    summary: {
      es: 'Cómo hablan de IA las empresas del S&P 500 en sus reportes a la SEC, sobre 1,5 millones de párrafos.',
      en: 'How S&P 500 companies talk about AI in their SEC filings, across 1.5 million paragraphs.',
    },
    goal: {
      es: 'Medir si lo que las empresas del S&P 500 dicen sobre IA en sus reportes (2021–2026) tiene respaldo en implementaciones concretas, o si es solo narrativa.',
      en: 'Measure whether what S&P 500 companies say about AI in their filings (2021–2026) is backed by concrete implementations, or is just narrative.',
    },
    did: {
      es: [
        'Armé un data lake en Parquet por capas (raw, bronze, silver, gold) con Polars, reproducible etapa por etapa.',
        'Segmenté 10-K, 10-Q, 8-K, proxies y transcripciones de earnings calls por sección, sin usar LLM.',
        'Entrené un prefiltro logístico que reduce el corpus a candidatos, y luego usé LLMs para extraer marcos semánticos y actividades.',
        'Calculé un índice de "washing" por empresa, agrupé posturas y estimé modelos econométricos sobre el panel.',
      ],
      en: [
        'Built a layered Parquet data lake (raw, bronze, silver, gold) with Polars, reproducible stage by stage.',
        'Segmented 10-K, 10-Q, 8-K, proxy filings and earnings call transcripts by section, without LLMs.',
        'Trained a logistic prefilter that narrows the corpus to candidates, then used LLMs to extract semantic frames and activities.',
        'Computed a firm-level "washing" index, clustered postures and estimated econometric models on the panel.',
      ],
    },
    stack: ['Python', 'Polars', 'DuckDB', 'LLMs', 'Econometría'],
    repo: 'https://github.com/mrbungie/ai_disclosure_analysis',
  },
  {
    slug: 'sales-pipeline-model',
    kind: 'oss',
    period: '2026',
    industry: { es: 'Ventas', en: 'Sales' },
    workType: { es: 'Modelamiento predictivo', en: 'Predictive modeling' },
    title: {
      es: 'Priorización de oportunidades de venta',
      en: 'Sales opportunity prioritization',
    },
    summary: {
      es: 'Modelos de cierre y monto sobre 78 mil oportunidades, con simulación de ingresos. Proyecto del MBA.',
      en: 'Win and amount models over 78k opportunities, with revenue simulation. MBA project.',
    },
    goal: {
      es: 'Decidir en qué oportunidades del pipeline comercial enfocar el esfuerzo, estimando probabilidad de cierre y monto esperado.',
      en: 'Decide which opportunities in the sales pipeline deserve effort, by estimating win probability and expected amount.',
    },
    did: {
      es: [
        'Validé y limpié 78 mil registros de oportunidades, detectando que eran snapshots y no historia.',
        'Discreticé variables con WoE/IV y revisé monotonicidad antes de modelar.',
        'Entrené modelos de probabilidad de cierre y de monto con XGBoost y LightGBM, interpretados con SHAP.',
        'Simulé escenarios de priorización y canal, y presenté resultados en Quarto.',
      ],
      en: [
        'Validated and cleaned 78k opportunity records, finding they were snapshots rather than history.',
        'Binned features with WoE/IV and checked monotonicity before modeling.',
        'Trained win-probability and amount models with XGBoost and LightGBM, explained with SHAP.',
        'Simulated prioritization and channel scenarios, and presented results in Quarto.',
      ],
    },
    stack: ['Python', 'XGBoost', 'LightGBM', 'SHAP', 'Quarto'],
    repo: 'https://github.com/mrbungie/mib_cars_analysis',
  },
  {
    slug: 'gpu-data-runtime',
    kind: 'oss',
    period: '2026',
    industry: { es: 'Infraestructura de datos', en: 'Data infrastructure' },
    workType: { es: 'DevOps / MLOps', en: 'DevOps / MLOps' },
    title: {
      es: 'Runtime de ciencia de datos para GPUs en la nube',
      en: 'Data science runtime for cloud GPUs',
    },
    summary: {
      es: 'Una sola imagen Docker para analizar datos en vast.ai, con o sin GPU, lista en segundos.',
      en: 'One Docker image for data analysis on vast.ai, with or without GPU, ready in seconds.',
    },
    goal: {
      es: 'Tener un entorno de análisis idéntico en cualquier instancia arrendada, sin reinstalar herramientas cada vez ni pagar horas ociosas.',
      en: 'Get the same analysis environment on any rented instance, without reinstalling tools each time or paying for idle hours.',
    },
    did: {
      es: [
        'Hice un Dockerfile único parametrizado por imagen base: Ubuntu para CPU o CUDA runtime para GPU.',
        'Dejé JupyterLab detrás de nginx en un entorno aislado con uv, más DuckDB y CLIs de IA.',
        'Agregué un watchdog que apaga la instancia por inactividad y un crontab persistente.',
        'Publiqué las imágenes en GHCR con GitHub Actions.',
      ],
      en: [
        'Wrote a single Dockerfile parameterized by base image: Ubuntu for CPU or CUDA runtime for GPU.',
        'Put JupyterLab behind nginx in an isolated uv environment, plus DuckDB and AI CLIs.',
        'Added a watchdog that shuts the instance down when idle, and a persistent crontab.',
        'Published the images to GHCR with GitHub Actions.',
      ],
    },
    stack: ['Docker', 'CUDA', 'nginx', 'GitHub Actions'],
    repo: 'https://github.com/mrbungie/vastai-datascience-runtime',
  },
  {
    slug: 'kinect-gestures',
    kind: 'oss',
    period: '2012',
    industry: { es: 'Interacción humano-computador', en: 'Human-computer interaction' },
    workType: { es: 'Machine learning de secuencias', en: 'Sequence machine learning' },
    title: {
      es: 'Reconocimiento de gestos con Kinect',
      en: 'Gesture recognition with Kinect',
    },
    summary: {
      es: 'Gestos de mano codificados con K-means y clasificados con modelos ocultos de Markov, en C#.',
      en: 'Hand gestures encoded with K-means and classified with hidden Markov models, in C#.',
    },
    goal: {
      es: 'Reconocer gestos de mano a partir del esqueleto que entrega Kinect. Trabajo del curso de Experiencia de Usuario en la UAI.',
      en: 'Recognize hand gestures from the skeleton Kinect provides. Built for the User Experience course at UAI.',
    },
    did: {
      es: [
        'Capturé la trayectoria de la mano desde el esqueleto de Kinect.',
        'Cuanticé cada posición con K-means para convertir el movimiento en una secuencia de símbolos.',
        'Entrené un modelo oculto de Markov por gesto y clasifiqué por máxima verosimilitud.',
      ],
      en: [
        'Captured the hand trajectory from the Kinect skeleton.',
        'Quantized each position with K-means to turn movement into a symbol sequence.',
        'Trained one hidden Markov model per gesture and classified by maximum likelihood.',
      ],
    },
    stack: ['C#', 'Kinect SDK', 'K-means', 'HMM'],
    repo: 'https://github.com/mrbungie/kinect-gesture-serialization',
  },
];
