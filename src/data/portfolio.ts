import type { L10n } from './profile';

// Every project is a card on /portafolio and a detail page at /portafolio/<slug>.
// Proprietary work is anonymized: architecture and my role only, no client names or data.
export interface Project {
  slug: string;
  kind: 'proprietary' | 'oss';
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
  results?: { value: string; label: L10n<string> }[];
}

const allProjects: Project[] = [
  {
    slug: 'agency-workflows',
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
    slug: 'healthcare-chatbot',
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
      es: 'Evaluar si SONDA podía ofrecer zonas cloud más baratas sobre OpenStack, para clientes con exigencias de disponibilidad menores que las de su plataforma VMware vCloud. Memoria de Ingeniería Civil Industrial en la UAI, junto a Reynaldo Araya y guiada por Jorge Villalón.',
      en: "Assess whether SONDA could offer cheaper cloud zones on OpenStack, for clients with lower availability needs than its VMware vCloud platform. Industrial Engineering thesis at UAI, with Reynaldo Araya and advised by Jorge Villalón.",
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
    stack: ['Mirantis OpenStack', 'VMware ESXi', 'vCloud Suite', 'TCO'],
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
