import type { L10n } from './profile';

// Every project is a card on /portafolio and a detail page at /portafolio/<slug>.
// Proprietary work is anonymized: architecture and my role only, no client names or data.
export interface Project {
  slug: string;
  kind: 'proprietary' | 'oss' | 'paper';
  period: string;
  end: string; // YYYY-MM-DD (or YYYY-MM), used to sort newest first
  industry: L10n<string>;
  workType: L10n<string>;
  title: L10n<string>;
  summary: L10n<string>; // card blurb
  goal: L10n<string>;
  did: L10n<string[]>;
  stack: string[];
  repo?: string;
  site?: string; // public page about the project (non-OSS)
  paper?: string; // arXiv or publisher link
  pdf?: string; // full document (thesis, report)
  results?: { value: string; label: L10n<string> }[];
  featured?: boolean; // shown first, in the large grid
  via?: Firm; // the firm I delivered the project through
  client?: Firm; // named client, only when public
}

export interface Firm { name: string; url?: string }
const owl: Firm = { name: 'Owl Tech Labs', url: 'https://owltechlabs.com/' };
const mlsi: Firm = { name: 'ML Soluciones Informáticas' };

const allProjects: Project[] = [
  {
    slug: 'smartfield-geospatial-platform',
    kind: 'proprietary',
    period: '2026',
    end: '2026-09',
    industry: { es: 'Drones e inspección industrial', en: 'Drones & industrial inspection' },
    workType: { es: 'Arquitectura y plataforma desde cero', en: 'Architecture and platform from scratch' },
    title: {
      es: 'SmartField: plataforma geoespacial para AGS Soluciones',
      en: 'SmartField: geospatial platform for AGS Soluciones',
    },
    summary: {
      es: 'Arquitectura inicial de una plataforma multi-tenant que recibe capturas de dron, las procesa y las muestra en visores 2D y 3D.',
      en: 'Initial architecture of a multi-tenant platform that ingests drone captures, processes them and shows them in 2D and 3D viewers.',
    },
    goal: {
      es: 'AGS hace topografía, termografía e inspecciones con drones para minería y energía en Antofagasta. Necesitaba un producto propio para entregarle el dato al cliente: ortofotos, planos DWG, mallas, nubes de puntos y modelos IFC, cada uno en su visor y separado por cliente.',
      en: 'AGS runs drone surveys, thermography and inspections for mining and energy in Antofagasta. It needed its own product to deliver the data to clients: orthophotos, DWG drawings, meshes, point clouds and IFC models, each in its viewer and separated by client.',
    },
    did: {
      es: [
        'Estuve a cargo de todo el levantamiento inicial: diseñé la arquitectura y armé la base del código y de la infraestructura.',
        'Monorepo con API en NestJS (módulos verticales, auth y autorización), BFF en Next.js 15 y contratos compartidos en Zod.',
        'Worker en Python que transforma cada tipo de captura, desacoplado por una cola en Redis y escalado con KEDA según el largo de la cola.',
        'Paquete de visores propio sobre Cesium para 2D, 3D georreferenciado y nubes de puntos.',
        'Infraestructura en un repo aparte con OpenTofu y Terragrunt: AKS, Blob Storage, ACR, correo y DNS. Despliegue con Helm y GitHub Actions vía OIDC, sin secretos de larga duración.',
      ],
      en: [
        'Led the whole initial build: designed the architecture and laid down the code and infrastructure foundations.',
        'Monorepo with a NestJS API (vertical-slice modules, auth and authorization), a Next.js 15 BFF and shared Zod contracts.',
        'Python worker that transforms each capture type, decoupled through a Redis queue and scaled by KEDA on queue length.',
        'In-house viewer package on Cesium for 2D, georeferenced 3D and point clouds.',
        'Infrastructure in a separate repo with OpenTofu and Terragrunt: AKS, Blob Storage, ACR, email and DNS. Deployed with Helm and GitHub Actions over OIDC, with no long-lived secrets.',
      ],
    },
    stack: ['NestJS', 'Next.js', 'Python', 'Cesium', 'PostgreSQL', 'Redis', 'AKS', 'Helm', 'KEDA', 'OpenTofu'],
    client: { name: 'AGS Soluciones', url: 'https://agssoluciones.cl/' },
  },
  {
    slug: 'uai-lead-intelligence',
    kind: 'proprietary',
    period: '2021',
    end: '2021-12',
    industry: { es: 'Educación ejecutiva', en: 'Executive education' },
    workType: { es: 'Datos de prospectos y recomendación', en: 'Lead data and recommendation' },
    title: {
      es: 'Inteligencia de prospectos para postgrados en la UAI',
      en: 'Lead intelligence for graduate programs at UAI',
    },
    summary: {
      es: 'Perfiles profesionales cruzados con la base de contactos para saber qué diplomado o magíster ofrecerle a cada persona, y en qué momento.',
      en: 'Professional profiles matched to the contact base to know which diploma or master’s to offer each person, and when.',
    },
    goal: {
      es: 'El equipo comercial de diplomados y magísteres tenía miles de contactos, pero sabía poco de ellos. La idea era tener una ficha viva de cada prospecto (cargo, empresa, trayectoria) y usarla para ofrecer el programa adecuado cuando la persona estuviera lista para darlo.',
      en: 'The sales team for diplomas and master’s programs had thousands of contacts but knew little about them. The goal was a living profile of each prospect (role, company, career path) used to offer the right program when the person was ready for it.',
    },
    did: {
      es: [
        'Diseñé y construí la plataforma en Python, con SQLite como almacén de perfiles e historial.',
        'Automaticé la extracción de perfiles públicos de LinkedIn con PhantomBuster.',
        'Implementé record linkage para unir cada perfil con su persona en la base de contactos, aunque nombres, correos o empresas no calzaran exacto.',
        'Guardé la evolución de cada profesional (ascensos, cambios de empresa o de área) para detectar el momento de ofrecer algo.',
        'Crucé cargo y trayectoria con la oferta de programas para sugerir qué ofrecerle a cada prospecto.',
      ],
      en: [
        'Designed and built the platform in Python, with SQLite storing profiles and their history.',
        'Automated extraction of public LinkedIn profiles with PhantomBuster.',
        'Implemented record linkage to match each profile to its person in the contact base, even when names, emails or companies did not match exactly.',
        'Tracked how each professional evolved (promotions, company or area changes) to spot the right moment to reach out.',
        'Matched role and career path against the program catalog to suggest what to offer each prospect.',
      ],
    },
    stack: ['Python', 'SQLite', 'PhantomBuster', 'recordlinkage', 'pandas'],
  },
  {
    slug: 'agency-workflows',
    via: owl,
    kind: 'proprietary',
    period: '2026',
    end: '2026-10',
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
    slug: 'solar-forecasting-mlops',
    via: owl,
    featured: true,
    kind: 'proprietary',
    period: '2025 – 2026',
    end: '2026-01',
    industry: { es: 'Energía solar', en: 'Solar energy' },
    workType: { es: 'Orquestación y plataforma MLOps', en: 'Orchestration & MLOps platform' },
    title: {
      es: 'Plataforma MLOps para pronosticar generación solar',
      en: 'MLOps platform for solar generation forecasting',
    },
    summary: {
      es: 'Pronóstico de producción por inversor sobre un lakehouse en S3 y Kubernetes, con error 31% menor que la línea base física.',
      en: 'Per-inverter production forecasts on an S3 lakehouse and Kubernetes, with 31% lower error than the physics baseline.',
    },
    goal: {
      es: 'Pronosticar la generación diaria de miles de inversores con más precisión que la estimación física, para operar la red y comercializar energía con menos incertidumbre.',
      en: 'Forecast daily generation for thousands of inverters more accurately than the physics estimate, to run the grid and trade energy with less uncertainty.',
    },
    did: {
      es: [
        'Diseñé la orquestación en Dagster: assets por etapa del lakehouse, schedules y sensores, y el linaje completo desde la réplica hasta la inferencia.',
        'Hice la configuración del pipeline en YAML, con overrides desde la UI de Dagster para ajustar estrategias y umbrales de niveles sin tocar código.',
        'Integré Dagster con MLflow para registrar cada entrenamiento y promover el modelo campeón.',
        'Diseñé los ambientes: el mismo código corre en Docker Compose local y en EKS, con Terraform, Helm, Karpenter sobre instancias spot, roles IAM separados y S3 cifrado.',
      ],
      en: [
        'Designed the Dagster orchestration: one asset per lakehouse stage, schedules and sensors, and full lineage from replication to inference.',
        'Built YAML pipeline configuration with overrides from the Dagster UI, so strategies and tier thresholds change without code changes.',
        'Integrated Dagster with MLflow to log every training run and promote the champion model.',
        'Designed the environments: the same code runs on local Docker Compose and on EKS, with Terraform, Helm, Karpenter on spot instances, separate IAM roles and encrypted S3.',
      ],
    },
    results: [
      { value: '−31,7%', label: { es: 'error (MAE) vs. línea base física', en: 'error (MAE) vs. physics baseline' } },
      { value: '0,91', label: { es: 'R², contra 0,52 de la línea base', en: 'R², against 0.52 for the baseline' } },
      { value: '1,9M', label: { es: 'registros diarios desde 11M+ horarios', en: 'daily records from 11M+ hourly' } },
      { value: '95,4%', label: { es: 'de lotes pasan los controles de calidad', en: 'of batches pass data quality checks' } },
    ],
    stack: ['Dagster', 'MLflow', 'AWS EKS', 'Terraform', 'Helm', 'Karpenter'],
  },
  {
    slug: 'optical-data-platform',
    via: owl,
    featured: true,
    kind: 'proprietary',
    period: '2024 – 2026',
    end: '2026-09-23',
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
    slug: 'mach-nba-lighthouse',
    kind: 'proprietary',
    period: '2022 – 2023',
    end: '2023-11',
    industry: { es: 'Fintech', en: 'Fintech' },
    workType: { es: 'Framework de modelos para growth', en: 'Model framework for growth' },
    title: {
      es: 'Faro: Next Best Action en MACH',
      en: 'NBA Lighthouse: Next Best Action at MACH',
    },
    summary: {
      es: 'Framework sobre Spark para crear modelos que monitorean la estrategia de growth y predicen el mes siguiente para targeting.',
      en: 'Spark framework for building models that monitor the growth strategy and predict next month for targeting.',
    },
    goal: {
      es: 'Saber si las tácticas de growth estaban funcionando como se esperaba y decidir a quién aplicarle la siguiente, con modelos hechos de forma estándar y no uno a uno.',
      en: 'Know whether growth tactics were working as expected and decide who to target with the next one, with models built in a standard way instead of one by one.',
    },
    did: {
      es: [
        'Diseñé Faro (NBA Lighthouse), un framework sobre Spark para crear modelos de Next Best Action con la misma estructura.',
        'Modo monitoreo: modelos que predicen con dos meses de desfase, para comparar lo que la estrategia de growth esperaba con lo que realmente pasó y encontrar brechas.',
        'Modo predicción: modelos del mes siguiente para hacer targeting y aplicar tácticas nuevas.',
      ],
      en: [
        'Designed Faro (NBA Lighthouse), a Spark framework for building Next Best Action models with the same structure.',
        'Monitoring mode: models that predict with a two-month lag, to compare what the growth strategy expected with what actually happened and find gaps.',
        'Prediction mode: next-month models for targeting and for applying new tactics.',
      ],
    },
    stack: ['Spark', 'Python', 'AWS', 'Next Best Action'],
  },
  {
    slug: 'tenpo-realtime-fraud',
    kind: 'proprietary',
    period: '2021',
    end: '2021-12',
    industry: { es: 'Fintech · tarjetas', en: 'Fintech · cards' },
    workType: { es: 'Streaming y detección de fraude', en: 'Streaming & fraud detection' },
    title: {
      es: 'Revisión de fraude en tiempo real para tarjetas en Tenpo',
      en: 'Real-time card fraud review at Tenpo',
    },
    summary: {
      es: 'Transacciones de tarjeta evaluadas en tiempo real con Apache Flink sobre eventos de Kafka en Confluent.',
      en: 'Card transactions evaluated in real time with Apache Flink over Kafka events on Confluent.',
    },
    goal: {
      es: 'Detectar transacciones sospechosas de tarjeta mientras ocurren, y no al día siguiente, para que el equipo de fraude pueda actuar a tiempo.',
      en: 'Catch suspicious card transactions as they happen, not the next day, so the fraud team can act in time.',
    },
    did: {
      es: [
        'Diseñé el servicio de revisión de fraude en tiempo real sobre Apache Flink.',
        'Los eventos de transacciones llegaban por Kafka, gestionado en Confluent.',
        'Flink calculaba señales en ventanas de tiempo y aplicaba las reglas de revisión, marcando las transacciones sospechosas para el equipo de fraude.',
      ],
      en: [
        'Designed the real-time fraud review service on Apache Flink.',
        'Transaction events arrived through Kafka, managed on Confluent.',
        'Flink computed signals over time windows and applied the review rules, flagging suspicious transactions for the fraud team.',
      ],
    },
    stack: ['Apache Flink', 'Kafka', 'Confluent', 'Streaming'],
  },
  {
    slug: 'covid-art-color-emotion',
    kind: 'paper',
    period: '2021 – 2022',
    end: '2022-03',
    industry: { es: 'Arte y cultura · investigación', en: 'Art and culture · research' },
    workType: { es: 'Paper de visión por computador', en: 'Computer vision paper' },
    title: {
      es: 'Color y emoción en el arte de la pandemia',
      en: 'Color and emotion in pandemic art',
    },
    summary: {
      es: 'Cómo se usó el color y qué emociones transmitió el arte hecho durante el COVID-19, con deep learning y clustering sobre 1.537 imágenes.',
      en: 'How color was used and which emotions COVID-19 art conveyed, with deep learning and clustering over 1,537 images.',
    },
    goal: {
      es: 'Entender el uso del color y su relación con las emociones en las imágenes del COVID Art Museum de Instagram. Resultado: predominan los colores cálidos, las armonías análogas por sobre las complementarias y las emociones positivas.',
      en: 'Understand the use of color and its relation to emotion in the COVID Art Museum images on Instagram. Finding: warm colors, analogous over complementary harmonies, and positive emotions prevail.',
    },
    did: {
      es: [
        'Soy coautor del paper, publicado en arXiv (cs.CV) en marzo de 2022.',
        'El método combina dos ramas en paralelo: clasificación de emociones con una red convolucional entrenada sobre ArtEmis, y extracción de colores y armonías con clustering sobre la paleta de Itten.',
        'Luego se fusionan con densidades (KDE) por emoción y reglas de asociación (apriori).',
      ],
      en: [
        "I'm a co-author of the paper, published on arXiv (cs.CV) in March 2022.",
        'The method runs two branches in parallel: emotion classification with a CNN trained on ArtEmis, and color and harmony extraction with clustering over the Itten palette.',
        'Both are then fused with per-emotion densities (KDE) and association rules (apriori).',
      ],
    },
    stack: ['Python', 'CNN', 'ArtEmis', 'K-means', 'Apriori'],
    paper: 'https://arxiv.org/abs/2203.13770',
    pdf: 'https://arxiv.org/pdf/2203.13770',
  },
  {
    slug: 'rental-voucher-platform',
    kind: 'proprietary',
    period: '2020 – 2022',
    end: '2022-01',
    industry: { es: 'Políticas públicas · vivienda', en: 'Public policy · housing' },
    workType: { es: 'Consultoría de diseño y crecimiento', en: 'Design consulting & growth' },
    title: {
      es: 'Aprendo y Arriendo: consejería en línea para el Subsidio de Arriendo',
      en: 'Aprendo y Arriendo: online counseling for rental vouchers',
    },
    summary: {
      es: 'Plataforma web de un estudio experimental de la Universidad de Chile para apoyar a familias con subsidio de arriendo.',
      en: 'Web platform for a University of Chile field experiment supporting rental voucher families.',
    },
    goal: {
      es: 'Ayudar a las familias beneficiarias del Subsidio de Arriendo del Minvu a usar su subsidio, con información y acompañamiento en línea durante la búsqueda de vivienda. La investigación es de la académica Javiera Selman (Universidad de Chile) y en 2023 se adjudicó el Fondo de Evaluación de Impacto de Dipres.',
      en: "Help families with Chile's Minvu rental voucher actually use it, with online information and support during the housing search. The research is led by Professor Javiera Selman (University of Chile) and won Dipres' 2023 Impact Evaluation Fund.",
    },
    did: {
      es: [
        'Hice consultoría sobre los diseños iniciales de la plataforma: arquitectura, flujo de datos y analítica.',
        'Trabajé en hacer crecer la plataforma durante su primera etapa.',
      ],
      en: [
        "Consulted on the platform's initial designs: architecture, data flow and analytics.",
        'Worked on growing the platform during its first stage.',
      ],
    },
    stack: ['Angular', 'Rails', 'PostgreSQL', 'GCP', 'Cloudflare', 'Rudderstack', 'dbt'],
    site: 'https://www.javieraselman.com/onlinecounseling',
  },
  {
    slug: 'ai-disclosure',
    featured: true,
    kind: 'oss',
    period: '2026',
    end: '2026-09-28',
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
    pdf: 'https://cdn.jsdelivr.net/gh/mrbungie/ai_disclosure_analysis@main/thesis_document/GermanOviedo_FinalThesis.pdf',
  },
  {
    slug: 'sales-pipeline-model',
    kind: 'oss',
    period: '2026',
    end: '2026-04',
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
    end: '2026-09-02',
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
    slug: 'bci-covid-business-cycles',
    kind: 'proprietary',
    period: '2020',
    end: '2020-12',
    industry: { es: 'Banca · riesgo de empresas', en: 'Banking · corporate risk' },
    workType: { es: 'Series de tiempo y riesgo', en: 'Time series & risk' },
    title: {
      es: 'Recesión o crecimiento: ciclos de empresas en pandemia en Bci',
      en: 'Recession or growth: company cycles during the pandemic at Bci',
    },
    summary: {
      es: 'Detección de recesión y crecimiento en las series de uso de productos de empresas chilenas, para leer liquidez y capacidad de pago durante 2020.',
      en: "Recession and growth detection on Chilean companies' product-usage series, to read liquidity and payment capacity during 2020.",
    },
    goal: {
      es: 'En plena pandemia, sin datos macro a tiempo ni historia comparable, saber qué empresas clientes estaban entrando en recesión o seguían creciendo, para estimar su liquidez y capacidad de pago y usarlo en riesgo.',
      en: 'In the middle of the pandemic, with no timely macro data and no comparable history, know which client companies were entering recession or still growing, to estimate their liquidity and payment capacity for risk.',
    },
    did: {
      es: [
        'Armamos series de tiempo por empresa con datos propios del banco: el uso de sus distintos productos.',
        'Implementamos un marco de monitoreo estilo NBER para fechar puntos de giro y separar recesión de crecimiento en cada serie, procesando los datos desde Teradata con Spark y orquestado con Airflow.',
        'Tradujimos esas señales en indicadores de liquidez y capacidad de pago para el área de riesgo.',
      ],
      en: [
        "We built per-company time series from the bank's own data: usage across its different products.",
        'We implemented an NBER-style monitoring framework to date turning points and separate recession from growth in each series, processing data from Teradata with Spark and orchestrating it with Airflow.',
        'We turned those signals into liquidity and payment-capacity indicators for the risk team.',
      ],
    },
    stack: ['Python', 'Spark', 'Teradata', 'Airflow', 'Series de tiempo'],
  },
  {
    slug: 'datax-tax-data',
    via: mlsi,
    kind: 'proprietary',
    period: '2018 – 2019',
    end: '2019-12',
    industry: { es: 'Impuestos y cumplimiento', en: 'Tax and compliance' },
    workType: { es: 'Producto de datos y scraping', en: 'Data product & scraping' },
    title: {
      es: 'DataX: datos tributarios para una firma Big Four',
      en: 'DataX: tax data for a Big Four firm',
    },
    summary: {
      es: 'Plataforma que extraía información tributaria desde el SII y la mostraba a equipos de impuestos, contabilidad y compliance.',
      en: "Platform that pulled tax information from Chile's IRS (SII) and presented it to tax, accounting and compliance teams.",
    },
    goal: {
      es: 'Darles a los equipos de tax, corporate accounting y compliance de una firma Big Four acceso ordenado a la información tributaria de sus clientes, sin sacarla a mano del SII.',
      en: "Give a Big Four firm's tax, corporate accounting and compliance teams organized access to their clients' tax information, without pulling it by hand from the SII.",
    },
    did: {
      es: [
        'Fui socio inicial del proyecto.',
        'Hice los diseños iniciales, en especial los de los scrapers con Puppeteer sobre el sitio del SII.',
        'La plataforma usaba React en el frontend y Express en el backend.',
      ],
      en: [
        'I was an initial partner in the project.',
        'Did the initial designs, especially for the Puppeteer scrapers on the SII website.',
        'The platform used React on the frontend and Express on the backend.',
      ],
    },
    stack: ['Node.js', 'Puppeteer', 'Express', 'React'],
  },
  {
    slug: 'bci-experience-lighthouse',
    kind: 'proprietary',
    period: '2018',
    end: '2018-12',
    industry: { es: 'Banca · experiencia de clientes', en: 'Banking · customer experience' },
    workType: { es: 'Text mining y clasificación', en: 'Text mining & classification' },
    title: {
      es: 'Faro de experiencia: text mining para customer success en Bci',
      en: 'Experience Lighthouse: text mining for customer success at Bci',
    },
    summary: {
      es: 'Emails, llamados y casos de soporte clasificados por servicio, producto y sentimiento con text mining clásico, y cruzados en Power BI.',
      en: 'Emails, calls and support cases classified by service, product and sentiment with classic text mining, and cross-analyzed in Power BI.',
    },
    goal: {
      es: 'Darle al equipo de customer success una lectura ordenada de lo que decían los clientes en todos los canales: de qué servicio o producto hablaban y con qué tono.',
      en: 'Give the customer success team an organized read of what customers said across every channel: which service or product they talked about, and in what tone.',
    },
    did: {
      es: [
        'Juntamos experiencias de distintos canales: emails, llamados transcritos y casos de soporte.',
        'Usamos text mining clásico: conteo de palabras, TF-IDF y reducción con SVD truncado.',
        'Coordiné la clasificación manual con los equipos de experiencia: más de 10.000 interacciones etiquetadas para entrenar los modelos.',
        'Entrenamos modelos multi-label con XGBoost en Python para clasificar cada experiencia por servicio, producto y sentimiento, con ejecuciones agendadas en Airflow.',
        'Dejamos los resultados en Power BI para que el equipo cruzara canales, productos y tono.',
      ],
      en: [
        'We brought together experiences from several channels: emails, transcribed calls and support cases.',
        'We used classic text mining: word counts, TF-IDF and truncated SVD.',
        'I coordinated manual labeling with the experience teams: more than 10,000 labeled interactions to train the models.',
        'We trained multi-label XGBoost models in Python to classify each experience by service, product and sentiment, with runs scheduled in Airflow.',
        'We put the results in Power BI so the team could cross channels, products and tone.',
      ],
    },
    results: [
      { value: '10.000+', label: { es: 'interacciones etiquetadas con los equipos de experiencia', en: 'interactions labeled with the experience teams' } },
    ],
    stack: ['Python', 'TF-IDF', 'XGBoost', 'Airflow', 'Power BI'],
  },
  {
    slug: 'healthcare-chatbot',
    via: mlsi,
    kind: 'proprietary',
    period: '2018',
    end: '2018-12',
    industry: { es: 'Salud', en: 'Healthcare' },
    workType: { es: 'Arquitectura de chatbots y MLOps', en: 'Chatbot architecture & MLOps' },
    title: {
      es: 'Plataforma de chatbots para un prestador de salud',
      en: 'Chatbot platform for a healthcare provider',
    },
    summary: {
      es: 'Arquitectura para construir y operar varios chatbots en paralelo, con despliegue continuo y reentrenamiento con humanos en el loop.',
      en: 'Architecture to build and run several chatbots in parallel, with continuous delivery and human-in-the-loop retraining.',
    },
    goal: {
      es: 'Que un integrador TI pudiera desarrollar y vender chatbots para una clínica y otros clientes sin rehacer cada uno desde cero, y mantenerlos entrenados sin depender de desarrolladores.',
      en: 'Let an IT integrator build and sell chatbots for a clinic and other clients without rebuilding each one from scratch, and keep them trained without relying on developers.',
    },
    did: {
      es: [
        'Diseñé la arquitectura del chatbot: Bot Framework para los canales, DialogFlow para entender lenguaje, y una librería común con plugins por bot.',
        'Diseñé los módulos cognitivos de tickets y de preguntas y respuestas sobre Elasticsearch.',
        'Diseñé el pipeline de continuous delivery con Jenkins, que promueve cada bot por desarrollo, QA, UAT y producción en Kubernetes sobre Azure.',
        'Diseñé la operación recurrente: Airflow reentrena y carga intents nuevos a partir de una planilla que editan los agentes.',
      ],
      en: [
        'Designed the chatbot architecture: Bot Framework for channels, DialogFlow for language understanding, and a shared library with per-bot plugins.',
        'Designed the cognitive modules for tickets and for Q&A on Elasticsearch.',
        'Designed the continuous delivery pipeline with Jenkins, promoting each bot through dev, QA, UAT and production on Kubernetes on Azure.',
        'Designed the recurring operations: Airflow retrains and loads new intents from a spreadsheet that agents edit.',
      ],
    },
    stack: ['Bot Framework', 'DialogFlow', 'Elasticsearch', 'Airflow', 'Jenkins', 'Azure'],
  },
  {
    slug: 'bci-hybrid-crm',
    kind: 'proprietary',
    period: '2017',
    end: '2017-12',
    industry: { es: 'Banca', en: 'Banking' },
    workType: { es: 'Diseño de motor de decisiones', en: 'Decision engine design' },
    title: {
      es: 'Motor CRM híbrido de ofertas en Bci',
      en: 'Hybrid CRM offer engine at Bci',
    },
    summary: {
      es: 'Reglas de experto, triggers por eventos y modelos de propensión combinados para decidir ofertas personalizadas para más de 400 mil clientes al día.',
      en: 'Expert rules, event triggers and propensity models combined to decide personalized offers for more than 400k customers a day.',
    },
    goal: {
      es: 'Decidir cada día qué oferta mostrarle a cada cliente, combinando el criterio comercial del negocio con los modelos de propensión que ya existían.',
      en: "Decide every day which offer to show each customer, combining the business's commercial judgment with the propensity models that already existed.",
    },
    did: {
      es: [
        'Diseñé el motor e hice su primera implementación.',
        'Las reglas se programaban directamente desde el criterio experto; el ML aportaba los scores de los modelos de propensión existentes.',
        'Agregué triggers por eventos del cliente, como su cumpleaños o el vencimiento de un seguro, para ofrecer en el momento justo.',
        'Las ofertas se extraían desde el data warehouse en Teradata.',
        'Los umbrales de decisión se optimizaban con una aplicación en Shiny.',
      ],
      en: [
        'Designed the engine and built its first implementation.',
        'Rules were coded directly from expert judgment; ML contributed scores from the existing propensity models.',
        'Added triggers on customer events, such as a birthday or an insurance policy expiring, to make offers at the right moment.',
        'Offers were pulled from the Teradata data warehouse.',
        'Decision thresholds were tuned with a Shiny application.',
      ],
    },
    results: [
      { value: '400K+', label: { es: 'clientes evaluados cada día', en: 'customers evaluated daily' } },
    ],
    stack: ['Teradata', 'SQL', 'R Shiny', 'XGBoost'],
  },
  {
    slug: 'bci-propensity-models',
    kind: 'proprietary',
    period: '2016',
    end: '2016-12',
    industry: { es: 'Banca · seguros y tarjetas', en: 'Banking · insurance and cards' },
    workType: { es: 'Modelamiento predictivo y migración', en: 'Predictive modeling & migration' },
    title: {
      es: 'De SPSS Modeler a Python: modelos de propensión en Bci',
      en: 'From SPSS Modeler to Python: propensity models at Bci',
    },
    summary: {
      es: 'Migración del modelamiento a Python y más de 20 modelos XGBoost de cross/upsell, activación y reactivación.',
      en: 'Modeling migrated to Python and more than 20 XGBoost models for cross/upsell, activation and reactivation.',
    },
    goal: {
      es: 'Sacar el modelamiento de SPSS Modeler y pasarlo a Python, para construir más modelos de propensión, más rápido, para seguros y tarjetas.',
      en: 'Move modeling off SPSS Modeler and onto Python, to build more propensity models, faster, for insurance and cards.',
    },
    did: {
      es: [
        'Mostré cómo hacer la migración desde SPSS Modeler a Python y definí las bases iniciales del nuevo flujo.',
        'Con el equipo desarrollamos más de 20 modelos XGBoost de cross/upsell, activación y reactivación.',
        'El scoring quedó en scripts Python orquestados con Airflow, leyendo y escribiendo en Teradata.',
      ],
      en: [
        'Showed how to migrate from SPSS Modeler to Python and set the initial foundations of the new workflow.',
        'With the team we built more than 20 XGBoost models for cross/upsell, activation and reactivation.',
        'Scoring ran as Python scripts orchestrated by Airflow, reading from and writing to Teradata.',
      ],
    },
    results: [
      { value: '20+', label: { es: 'modelos de propensión', en: 'propensity models' } },
      { value: '> 0,70', label: { es: 'AUC habitual de los modelos', en: 'typical model AUC' } },
    ],
    stack: ['Python', 'XGBoost', 'Airflow', 'Teradata'],
  },
  {
    slug: 'cloud-tco-openstack',
    kind: 'proprietary',
    period: '2014',
    end: '2014-11',
    industry: { es: 'Servicios TI · cloud', en: 'IT services · cloud' },
    workType: { es: 'Memoria de título: costos e infraestructura', en: 'Thesis: costing and infrastructure' },
    title: {
      es: 'TCO de zonas cloud: VMware contra OpenStack',
      en: 'Cloud zone TCO: VMware versus OpenStack',
    },
    summary: {
      es: 'Modelo de costo total de propiedad para un proveedor cloud, validado con una nube OpenStack de 50 nodos montada en la universidad.',
      en: 'Total cost of ownership model for a cloud provider, validated with a 50-node OpenStack cloud built at the university.',
    },
    goal: {
      es: 'Evaluar si SONDA podía ofrecer zonas cloud más baratas sobre OpenStack, para clientes con exigencias de disponibilidad menores que las de su plataforma VMware vCloud. Memoria de Ingeniería Civil Industrial en la UAI.',
      en: "Assess whether SONDA could offer cheaper cloud zones on OpenStack, for clients with lower availability needs than its VMware vCloud platform. Industrial Engineering thesis at UAI.",
    },
    did: {
      es: [
        'Lo más interesante técnicamente: montar una nube universitaria de 50 nodos con Mirantis OpenStack (la versión de 2014), sobre servidores que originalmente corrían ESXi.',
        'Construimos un modelo de TCO basado en Gartner, alimentado con precios lista y mediciones de laboratorio: hardware, espacio, energía, licencias y soporte.',
        'Comparamos la solución incumbente, vCloud Suite, contra alternativas OpenStack para distintos niveles de disponibilidad.',
      ],
      en: [
        'The most interesting technical part: building a 50-node university cloud with Mirantis OpenStack (the 2014 release), on servers that originally ran ESXi.',
        'We built a Gartner-based TCO model, fed with list prices and lab measurements: hardware, space, power, licenses and support.',
        'We compared the incumbent, vCloud Suite, against OpenStack alternatives across availability levels.',
      ],
    },
    stack: ['Mirantis OpenStack', 'Fuel', 'Ceph', 'KVM', 'vCloud Suite', 'TCO'],
  },
  {
    slug: 'vcloud-elk-monitoring',
    kind: 'proprietary',
    period: '2013 – 2014',
    end: '2014-06',
    industry: { es: 'Servicios TI · cloud', en: 'IT services · cloud' },
    workType: { es: 'Observabilidad de infraestructura', en: 'Infrastructure observability' },
    title: {
      es: 'Monitoreo de una nube vCloud Director con ELK',
      en: 'Monitoring a vCloud Director cloud with ELK',
    },
    summary: {
      es: 'Stack ELK customizado para monitorear un despliegue de vCloud Director con más de 1.000 VMs en SONDA.',
      en: 'Custom ELK stack to monitor a vCloud Director deployment with more than 1,000 VMs at SONDA.',
    },
    goal: {
      es: 'Dar visibilidad operacional sobre la nube empresarial de SONDA, basada en VMware vCloud Director y con más de 1.000 máquinas virtuales.',
      en: "Give operational visibility over SONDA's enterprise cloud, built on VMware vCloud Director with more than 1,000 virtual machines.",
    },
    did: {
      es: [
        'Construí un stack de monitoreo con Elasticsearch, Logstash y Kibana, customizado para vCloud Director.',
        'Configuré en Logstash la ingesta y el parseo de logs y eventos de la plataforma.',
        'Armé dashboards en Kibana para seguir el estado de más de 1.000 VMs.',
      ],
      en: [
        'Built a monitoring stack with Elasticsearch, Logstash and Kibana, customized for vCloud Director.',
        'Set up Logstash ingestion and parsing for platform logs and events.',
        'Built Kibana dashboards to track the state of more than 1,000 VMs.',
      ],
    },
    stack: ['Elasticsearch', 'Logstash', 'Kibana', 'VMware vCloud'],
  },
  {
    slug: 'kinect-gestures',
    kind: 'oss',
    period: '2012',
    end: '2012-12',
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

// Newest first, by end date; ties keep the order above.
export const projects = [...allProjects].sort((a, b) => b.end.localeCompare(a.end));
export const featuredProjects = projects.filter((p) => p.featured);
export const archivedProjects = projects.filter((p) => !p.featured);
