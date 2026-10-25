import type { Locale } from '../../i18n/ui';

export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h?: number;
  title: string;
  sub?: string; // '\n' separates lines
  accent?: boolean;
}
export interface DiagramEdge { from: string; to: string }

export interface DiagramSpec {
  type?: 'flow';
  label: string;
  width: number;
  height: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  base: string;
}

// Layered architecture: one row per layer, components as chips.
export interface StackSpec {
  type: 'stack';
  label: string;
  layers: { name: string; items: string[]; accent?: boolean }[];
  note?: string;
}

// Narrowing pipeline: each stage keeps less, but more refined, data.
export interface FunnelSpec {
  type: 'funnel';
  label: string;
  stages: { title: string; sub: string; accent?: boolean }[];
  note?: string;
}

export type AnySpec = DiagramSpec | StackSpec | FunnelSpec;

type Builder = (tr: (es: string, en: string) => string) => AnySpec;

const chain = (...ids: string[]): DiagramEdge[] => ids.slice(1).map((to, i) => ({ from: ids[i], to }));

// One architecture diagram per project slug (see src/data/portfolio.ts).
const builders: Record<string, Builder> = {
  'agency-workflows': (tr) => ({
    type: 'stack',
    label: tr('Capas de la plataforma de workflows', 'Workflow platform layers'),
    layers: [
      { name: tr('Interfaz', 'Interface'), items: ['React SPA', 'Vite', '@wfsdk/react', tr('roles: agencia y cliente', 'roles: agency and client')] },
      { name: 'API', items: ['FastAPI', tr('auth y organizaciones', 'auth and organizations'), 'HTTP · SSE'] },
      { name: 'Workflows', items: [tr('wfsdk: DSL tipado', 'wfsdk: typed DSL'), 'Temporal', tr('workers', 'workers'), tr('pasos humanos', 'human steps')], accent: true },
      { name: tr('Servicios', 'Services'), items: ['LiteLLM → Gemini', tr('deck render: HTML → PPTX/PDF', 'deck render: HTML → PPTX/PDF')] },
      { name: tr('Datos', 'Data'), items: ['PostgreSQL', 'Redis', 'Cloud Storage'] },
      { name: tr('Plataforma', 'Platform'), items: ['GKE Autopilot', 'Gateway', 'Secret Manager', 'Workload Identity', 'Terraform'], accent: true },
    ],
    note: tr('wfsdk no depende del backend: el backend lo importa, nunca al revés.', 'wfsdk does not depend on the backend: the backend imports it, never the other way around.'),
  }),

  'solar-forecasting-mlops': (tr) => ({
    label: tr('Arquitectura de la plataforma MLOps', 'MLOps platform architecture'),
    width: 820,
    height: 345,
    nodes: [
      { id: 'pg', x: 16, y: 16, w: 118, title: 'PostgreSQL', sub: tr('base operacional', 'operational DB') },
      { id: 'dlt', x: 150, y: 16, w: 118, title: 'dlt', sub: tr('réplica incremental', 'incremental sync') },
      { id: 's3', x: 284, y: 16, w: 118, title: 'Lakehouse S3', sub: 'bronze · silver · gold' },
      { id: 'etl', x: 418, y: 16, w: 118, title: 'DuckDB · Polars', sub: tr('clima × generación', 'weather × generation') },
      { id: 'train', x: 552, y: 16, w: 118, title: tr('Entrenamiento', 'Training'), sub: 'XGBoost · CatBoost' },
      { id: 'mlflow', x: 686, y: 16, w: 118, title: 'MLflow', sub: tr('registro · serving', 'registry · serving') },
      { id: 'dagster', x: 16, y: 120, w: 788, h: 60, title: tr('Dagster: orquestación', 'Dagster: orchestration'), sub: tr('assets por etapa · schedules y sensores · config YAML con overrides en la UI · linaje', 'one asset per stage · schedules and sensors · YAML config with UI overrides · lineage'), accent: true },
      { id: 'dev', x: 16, y: 222, w: 382, h: 56, title: tr('Dev: Docker Compose', 'Dev: Docker Compose'), sub: tr('mismo código, ejecución local', 'same code, local execution'), accent: true },
      { id: 'prod', x: 422, y: 222, w: 382, h: 56, title: tr('Prod: AWS EKS', 'Prod: AWS EKS'), sub: tr('Helm · Karpenter con spot · IAM por rol · S3 cifrado', 'Helm · Karpenter on spot · per-role IAM · encrypted S3'), accent: true },
    ],
    edges: [
      ...chain('pg', 'dlt', 's3', 'etl', 'train', 'mlflow'),
      { from: 'dagster', to: 'dlt' },
      { from: 'dagster', to: 'etl' },
      { from: 'dagster', to: 'train' },
      { from: 'dagster', to: 'dev' },
      { from: 'dagster', to: 'prod' },
    ],
    base: tr('Infraestructura como código con Terraform · observabilidad con Prometheus', 'Infrastructure as code with Terraform · observability with Prometheus'),
  }),

  'optical-data-platform': (tr) => ({
    label: tr('Arquitectura de la plataforma de datos', 'Data platform architecture'),
    width: 820,
    height: 320,
    nodes: [
      { id: 'erp', x: 16, y: 32, w: 130, title: 'ERP', sub: tr('facturación', 'billing') },
      { id: 'sp', x: 16, y: 132, w: 130, title: 'SharePoint', sub: tr('catálogos', 'catalogs') },
      { id: 'bronze', x: 178, y: 82, w: 112, title: 'Bronze', sub: tr('copia cruda', 'raw copy') },
      { id: 'silver', x: 322, y: 74, w: 150, h: 72, title: 'Silver', sub: tr('clientes, productos,\nproveedores, facturas', 'customers, products,\nsuppliers, invoices') },
      { id: 'gold', x: 504, y: 74, w: 150, h: 72, title: 'Gold (dbt)', sub: tr('ventas, equivalencias,\nrecomendaciones', 'sales, equivalences,\nrecommendations') },
      { id: 'bi', x: 686, y: 82, w: 118, title: 'Dashboards', sub: tr('área comercial', 'sales team') },
      { id: 'ml', x: 412, y: 182, w: 170, h: 66, title: 'ML', sub: tr('atributos con LLM +\nclasificador · MLflow', 'LLM attributes +\nclassifier · MLflow'), accent: true },
    ],
    edges: [
      { from: 'erp', to: 'bronze' },
      { from: 'sp', to: 'bronze' },
      ...chain('bronze', 'silver', 'gold', 'bi'),
      { from: 'silver', to: 'ml' },
      { from: 'ml', to: 'gold' },
    ],
    base: tr('Dagster orquesta todo · Kubernetes · Postgres · IaC · CI/CD', 'Dagster orchestrates everything · Kubernetes · Postgres · IaC · CI/CD'),
  }),

  'covid-art-color-emotion': (tr) => ({
    label: tr('Método del paper: emociones y color en paralelo', 'Paper method: emotion and color in parallel'),
    width: 820,
    height: 300,
    nodes: [
      { id: 'cam', x: 16, y: 92, w: 150, h: 66, title: 'COVID Art Museum', sub: tr('1.537 imágenes\nde Instagram', '1,537 Instagram\nimages') },
      { id: 'emo', x: 206, y: 24, w: 170, h: 66, title: tr('Emociones', 'Emotions'), sub: tr('CNN entrenada\ncon ArtEmis', 'CNN trained\non ArtEmis'), accent: true },
      { id: 'col', x: 206, y: 160, w: 170, h: 66, title: 'Color', sub: tr('clustering y paleta\nde Itten → armonías', 'clustering and Itten\npalette → harmonies'), accent: true },
      { id: 'fuse', x: 416, y: 92, w: 170, h: 66, title: tr('Fusión', 'Fusion'), sub: tr('KDE por emoción\n+ reglas apriori', 'KDE per emotion\n+ apriori rules') },
      { id: 'res', x: 626, y: 84, w: 178, h: 82, title: tr('Hallazgos', 'Findings'), sub: tr('colores cálidos,\narmonías análogas,\nemociones positivas', 'warm colors,\nanalogous harmonies,\npositive emotions') },
    ],
    edges: [
      { from: 'cam', to: 'emo' },
      { from: 'cam', to: 'col' },
      { from: 'emo', to: 'fuse' },
      { from: 'col', to: 'fuse' },
      { from: 'fuse', to: 'res' },
    ],
    base: 'arXiv:2203.13770 · cs.CV · 2022',
  }),

  'rental-voucher-platform': (tr) => ({
    label: tr('Arquitectura de Aprendo y Arriendo', 'Aprendo y Arriendo architecture'),
    width: 820,
    height: 340,
    nodes: [
      { id: 'fe', x: 16, y: 72, w: 140, title: 'Frontend', sub: tr('Angular · celular\no desktop', 'Angular · mobile\nor desktop'), h: 66 },
      { id: 'cf', x: 188, y: 32, w: 120, title: 'Cloudflare', sub: tr('proxy y caché', 'proxy and cache') },
      { id: 'rud', x: 188, y: 160, w: 120, h: 66, title: 'Rudderstack', sub: tr('eventos de\nanalítica', 'analytics\nevents') },
      { id: 'bucket', x: 340, y: 16, w: 150, title: 'Cloud Storage', sub: tr('app de frontend', 'frontend app') },
      { id: 'api', x: 340, y: 110, w: 150, title: 'Backend Rails', sub: tr('lógica de la app', 'app logic'), accent: true },
      { id: 'pg', x: 522, y: 110, w: 130, title: 'PostgreSQL', sub: tr('datos de la app', 'app data') },
      { id: 'dbt', x: 522, y: 210, w: 130, title: 'dbt', sub: tr('ordena para analítica', 'models for analytics') },
      { id: 'ds', x: 684, y: 210, w: 120, title: 'Data Studio', sub: 'dashboards' },
    ],
    edges: [
      { from: 'fe', to: 'cf' },
      { from: 'cf', to: 'bucket' },
      { from: 'cf', to: 'api' },
      { from: 'fe', to: 'rud' },
      { from: 'rud', to: 'api' },
      { from: 'api', to: 'pg' },
      { from: 'pg', to: 'dbt' },
      { from: 'dbt', to: 'ds' },
    ],
    base: tr('Google Cloud Platform · Rudderstack regula el ritmo de eventos para no saturar el backend', 'Google Cloud Platform · Rudderstack throttles events so the backend is not flooded'),
  }),

  'ai-disclosure': (tr) => ({
    type: 'funnel',
    label: tr('Embudo de análisis de divulgación de IA', 'AI disclosure analysis funnel'),
    stages: [
      { title: tr('1,5M+ párrafos', '1.5M+ paragraphs'), sub: tr('10-K, 10-Q, 8-K, proxies y earnings calls del S&P 500, segmentados sin LLM', '10-K, 10-Q, 8-K, proxies and earnings calls from the S&P 500, segmented without LLMs') },
      { title: tr('Candidatos de IA', 'AI candidates'), sub: tr('prefiltro logístico con vocabulario y embeddings', 'logistic prefilter on vocabulary and embeddings') },
      { title: tr('Marcos semánticos', 'Semantic frames'), sub: tr('LLM judges extraen afirmaciones y actividades concretas', 'LLM judges extract claims and concrete activities'), accent: true },
      { title: tr('Panel empresa-año', 'Firm-year panel'), sub: tr('índice de washing: narrativa contra respaldo operativo', 'washing index: narrative against operational grounding') },
      { title: tr('Econometría', 'Econometrics'), sub: tr('DiD, posturas y estabilidad bootstrap', 'DiD, postures and bootstrap stability') },
    ],
    note: tr('Data lake Parquet por capas con Polars y DuckDB; cada etapa es reproducible y solo agrega datos.', 'Layered Parquet data lake with Polars and DuckDB; every stage is reproducible and append-only.'),
  }),

  'sales-pipeline-model': (tr) => ({
    label: tr('Flujo del modelo de priorización', 'Prioritization model flow'),
    width: 820,
    height: 300,
    nodes: [
      { id: 'raw', x: 16, y: 82, w: 130, title: tr('78k oportunidades', '78k opportunities'), sub: tr('snapshots de CRM', 'CRM snapshots') },
      { id: 'clean', x: 178, y: 74, w: 130, h: 66, title: tr('Validación', 'Validation'), sub: tr('duplicados y\nconsistencia', 'duplicates and\nconsistency') },
      { id: 'woe', x: 340, y: 82, w: 130, title: 'Binning WoE/IV', sub: tr('monotonicidad', 'monotonicity') },
      { id: 'win', x: 502, y: 24, w: 140, title: tr('P(cierre)', 'P(win)'), sub: 'XGBoost · LightGBM' },
      { id: 'amt', x: 502, y: 140, w: 140, title: tr('Monto', 'Amount'), sub: tr('regresión · SHAP', 'regression · SHAP') },
      { id: 'sim', x: 674, y: 74, w: 130, h: 66, title: tr('Simulación', 'Simulation'), sub: tr('priorización\ny canal', 'prioritization\nand channel'), accent: true },
    ],
    edges: [
      ...chain('raw', 'clean', 'woe', 'win', 'sim'),
      { from: 'woe', to: 'amt' },
      { from: 'amt', to: 'sim' },
    ],
    base: tr('Notebooks reproducibles · uv · reporte en Quarto', 'Reproducible notebooks · uv · Quarto report'),
  }),

  'gpu-data-runtime': (tr) => ({
    type: 'stack',
    label: tr('Capas de la imagen Docker', 'Docker image layers'),
    layers: [
      { name: tr('Acceso', 'Access'), items: ['nginx → JupyterLab', 'sshd', tr('websockets', 'websockets')] },
      { name: tr('Análisis', 'Analysis'), items: [tr('uv en venv aislado', 'uv in an isolated venv'), 'JupyterLab', 'DuckDB', 'claude · gemini · codex'] },
      { name: tr('Operación', 'Operations'), items: ['tini (PID 1)', tr('cron persistente', 'persistent cron'), tr('watchdog de inactividad', 'idle watchdog')], accent: true },
      { name: tr('Datos', 'Data'), items: ['rclone', 'awscli', 'gsutil', 'huggingface-cli'] },
      { name: tr('Base', 'Base'), items: ['ubuntu:24.04', tr('o', 'or'), 'nvidia/cuda runtime'], accent: true },
    ],
    note: tr('Un solo Dockerfile parametrizado por BASE_IMAGE; GitHub Actions publica ambas variantes en GHCR.', 'One Dockerfile parameterized by BASE_IMAGE; GitHub Actions publishes both variants to GHCR.'),
  }),

  'healthcare-chatbot': (tr) => ({
    type: 'stack',
    label: tr('Capas de la plataforma de chatbots', 'Chatbot platform layers'),
    layers: [
      { name: tr('Canales', 'Channels'), items: ['WebChat React', 'API REST', 'Bot Connector'] },
      { name: 'Bot', items: ['Bot Builder SDK', tr('librería común', 'shared library'), tr('plugins por bot', 'per-bot plugins')], accent: true },
      { name: tr('Inteligencia', 'Intelligence'), items: [tr('DialogFlow: intents y entidades', 'DialogFlow: intents and entities'), tr('tickets', 'tickets'), 'Q&A · Elasticsearch'] },
      { name: tr('Operación', 'Operations'), items: [tr('Google Sheets para agentes', 'Google Sheets for agents'), tr('Airflow: reentrenamiento', 'Airflow: retraining'), tr('revisión de fallbacks', 'fallback review')], accent: true },
      { name: tr('Entrega', 'Delivery'), items: ['Jenkins', tr('dev → QA → UAT → prod', 'dev → QA → UAT → prod'), 'VSTS'] },
      { name: tr('Infraestructura', 'Infrastructure'), items: ['Azure', 'Kubernetes', 'Docker'] },
    ],
    note: tr('Un plugin que usan varios bots se promueve a módulo general de la librería.', 'A plugin used by several bots gets promoted to a shared library module.'),
  }),

  'cloud-tco-openstack': (tr) => ({
    type: 'stack',
    label: tr('Capas de la nube OpenStack de laboratorio', 'OpenStack lab cloud layers'),
    layers: [
      { name: tr('Aprovisionamiento', 'Provisioning'), items: [tr('nodo Fuel', 'Fuel node'), 'PXE + DHCP', 'Puppet'], accent: true },
      { name: 'Control', items: [tr('controladores OpenStack', 'OpenStack controllers'), tr('identidad', 'identity'), tr('redes', 'networking'), tr('cómputo', 'compute')] },
      { name: tr('Cómputo', 'Compute'), items: [tr('nodos de cómputo', 'compute nodes'), 'KVM'] },
      { name: tr('Almacenamiento', 'Storage'), items: ['Ceph', tr('hardware commodity', 'commodity hardware')] },
      { name: tr('Red', 'Network'), items: [tr('2 NICs por nodo', '2 NICs per node'), 'VLANs 802.1Q', tr('túneles GRE', 'GRE tunnels')] },
      { name: 'Hardware', items: [tr('50 servidores universitarios', '50 university servers'), tr('antes con ESXi', 'previously on ESXi')], accent: true },
    ],
    note: tr('Las mediciones de instalación y operación del laboratorio alimentaron el modelo TCO (Gartner), que compara vCloud Suite contra OpenStack por nivel de disponibilidad.', 'Installation and operations measurements from the lab fed the Gartner-based TCO model, which compares vCloud Suite against OpenStack by availability level.'),
  }),

  'vcloud-elk-monitoring': (tr) => ({
    label: tr('Arquitectura de monitoreo con ELK', 'ELK monitoring architecture'),
    width: 820,
    height: 236,
    nodes: [
      { id: 'vcd', x: 16, y: 16, w: 140, title: 'vCloud Director', sub: tr('celdas y API', 'cells and API') },
      { id: 'hosts', x: 16, y: 116, w: 140, title: 'vCenter · ESXi', sub: tr('más de 1.000 VMs', '1,000+ VMs') },
      { id: 'ls', x: 196, y: 58, w: 150, h: 72, title: 'Logstash', sub: tr('ingesta y parseo\ncustomizado', 'custom ingestion\nand parsing'), accent: true },
      { id: 'es', x: 380, y: 66, w: 140, title: 'Elasticsearch', sub: tr('búsqueda y agregación', 'search and aggregation') },
      { id: 'kb', x: 554, y: 66, w: 130, title: 'Kibana', sub: tr('dashboards', 'dashboards'), accent: true },
      { id: 'ops', x: 714, y: 66, w: 90, title: tr('Operación', 'Ops'), sub: tr('equipo cloud', 'cloud team') },
    ],
    edges: [
      { from: 'vcd', to: 'ls' },
      { from: 'hosts', to: 'ls' },
      ...chain('ls', 'es', 'kb', 'ops'),
    ],
    base: tr('SONDA · stack ELK customizado sobre VMware vCloud Director', 'SONDA · custom ELK stack on VMware vCloud Director'),
  }),

  'kinect-gestures': (tr) => ({
    label: tr('Pipeline de reconocimiento de gestos', 'Gesture recognition pipeline'),
    width: 820,
    height: 190,
    nodes: [
      { id: 'kin', x: 16, y: 32, w: 130, title: 'Kinect', sub: tr('esqueleto 3D', '3D skeleton') },
      { id: 'traj', x: 178, y: 32, w: 130, title: tr('Trayectoria', 'Trajectory'), sub: tr('posición de la mano', 'hand position') },
      { id: 'km', x: 340, y: 32, w: 130, title: 'K-means', sub: tr('posición → símbolo', 'position → symbol') },
      { id: 'seq', x: 502, y: 32, w: 130, title: tr('Secuencia', 'Sequence'), sub: tr('de símbolos', 'of symbols') },
      { id: 'hmm', x: 664, y: 24, w: 140, h: 72, title: tr('HMM por gesto', 'HMM per gesture'), sub: tr('máxima\nverosimilitud', 'maximum\nlikelihood'), accent: true },
    ],
    edges: chain('kin', 'traj', 'km', 'seq', 'hmm'),
    base: tr('C# · Kinect SDK · un modelo oculto de Markov por gesto', 'C# · Kinect SDK · one hidden Markov model per gesture'),
  }),
};

export function diagramFor(slug: string, lang: Locale): AnySpec {
  const build = builders[slug];
  if (!build) throw new Error(`No diagram for project "${slug}"`);
  return build((es, en) => (lang === 'es' ? es : en));
}
