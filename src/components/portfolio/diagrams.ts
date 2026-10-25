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
  label: string;
  width: number;
  height: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  base: string;
}

type Builder = (tr: (es: string, en: string) => string) => DiagramSpec;

const chain = (...ids: string[]): DiagramEdge[] => ids.slice(1).map((to, i) => ({ from: ids[i], to }));

// One architecture diagram per project slug (see src/data/portfolio.ts).
const builders: Record<string, Builder> = {
  'agency-workflows': (tr) => ({
    label: tr('Arquitectura de la plataforma de workflows', 'Workflow platform architecture'),
    width: 820,
    height: 320,
    nodes: [
      { id: 'users', x: 16, y: 102, w: 120, title: tr('Equipo', 'Team'), sub: tr('y clientes', 'and clients') },
      { id: 'fe', x: 168, y: 102, w: 140, title: 'Frontend', sub: 'React · wfsdk/react' },
      { id: 'api', x: 340, y: 32, w: 150, title: 'Backend API', sub: 'FastAPI · roles' },
      { id: 'dsl', x: 340, y: 172, w: 150, h: 66, title: 'wfsdk', sub: tr('DSL de workflows\ntipado', 'typed workflow\nDSL'), accent: true },
      { id: 'temporal', x: 522, y: 32, w: 130, title: 'Temporal', sub: tr('pasos humanos', 'human steps') },
      { id: 'worker', x: 522, y: 172, w: 130, title: 'Worker', sub: tr('ejecuta pasos', 'runs steps') },
      { id: 'llm', x: 684, y: 16, w: 120, title: 'LiteLLM', sub: '→ Gemini' },
      { id: 'deck', x: 684, y: 104, w: 120, title: 'Deck render', sub: 'HTML → PPTX/PDF' },
      { id: 'db', x: 684, y: 192, w: 120, title: 'Postgres', sub: 'Redis' },
    ],
    edges: [
      ...chain('users', 'fe', 'api', 'temporal', 'worker'),
      { from: 'dsl', to: 'api' },
      { from: 'worker', to: 'llm' },
      { from: 'worker', to: 'deck' },
      { from: 'worker', to: 'db' },
    ],
    base: 'GCP · GKE Autopilot · Gateway · Secret Manager · Workload Identity · Terraform',
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
    label: tr('Pipeline de análisis de divulgación de IA', 'AI disclosure analysis pipeline'),
    width: 820,
    height: 320,
    nodes: [
      { id: 'sec', x: 16, y: 32, w: 130, h: 66, title: 'SEC EDGAR', sub: '10-K, 10-Q, 8-K,\nproxies' },
      { id: 'calls', x: 16, y: 132, w: 130, title: 'Earnings calls', sub: tr('transcripciones', 'transcripts') },
      { id: 'seg', x: 178, y: 74, w: 132, h: 66, title: tr('Segmentación', 'Segmentation'), sub: tr('secciones y\nhablantes, sin LLM', 'sections and\nspeakers, no LLM') },
      { id: 'pre', x: 342, y: 74, w: 132, h: 66, title: tr('Prefiltro', 'Prefilter'), sub: tr('logit + embeddings\n1,5M párrafos', 'logit + embeddings\n1.5M paragraphs') },
      { id: 'llm', x: 506, y: 74, w: 140, h: 66, title: 'LLM judges', sub: tr('marcos semánticos\ny actividades', 'semantic frames\nand activities'), accent: true },
      { id: 'gold', x: 678, y: 74, w: 126, h: 66, title: tr('Panel gold', 'Gold panel'), sub: tr('índice de washing\npor empresa', 'washing index\nper firm') },
      { id: 'econ', x: 600, y: 184, w: 150, title: tr('Econometría', 'Econometrics'), sub: tr('DiD · posturas', 'DiD · postures') },
    ],
    edges: [
      { from: 'sec', to: 'seg' },
      { from: 'calls', to: 'seg' },
      ...chain('seg', 'pre', 'llm', 'gold', 'econ'),
    ],
    base: tr('Data lake Parquet por capas · Polars · DuckDB · explorador en Gradio', 'Layered Parquet data lake · Polars · DuckDB · Gradio explorer'),
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
    label: tr('Build y ejecución del runtime', 'Runtime build and execution'),
    width: 820,
    height: 300,
    nodes: [
      { id: 'df', x: 16, y: 74, w: 130, h: 66, title: 'Dockerfile', sub: 'BASE_IMAGE\nubuntu | cuda' },
      { id: 'ci', x: 178, y: 82, w: 130, title: 'GitHub Actions', sub: tr('build cpu y gpu', 'cpu and gpu builds') },
      { id: 'ghcr', x: 340, y: 82, w: 130, title: 'GHCR', sub: tr('imágenes', 'images') },
      { id: 'vast', x: 502, y: 66, w: 150, h: 84, title: tr('Instancia vast.ai', 'vast.ai instance'), sub: tr('tini · sshd · cron\nwatchdog por\ninactividad', 'tini · sshd · cron\nidle shutdown\nwatchdog'), accent: true },
      { id: 'jup', x: 684, y: 24, w: 120, title: 'nginx', sub: '→ JupyterLab' },
      { id: 'tools', x: 684, y: 140, w: 120, title: tr('Herramientas', 'Tooling'), sub: tr('uv · DuckDB · IA', 'uv · DuckDB · AI') },
    ],
    edges: [...chain('df', 'ci', 'ghcr', 'vast', 'jup'), { from: 'vast', to: 'tools' }],
    base: tr('Un solo Dockerfile para CPU y GPU · drivers CUDA montados en runtime', 'One Dockerfile for CPU and GPU · CUDA drivers mounted at runtime'),
  }),

  'healthcare-chatbot': (tr) => ({
    label: tr('Arquitectura de la plataforma de chatbots', 'Chatbot platform architecture'),
    width: 820,
    height: 340,
    nodes: [
      { id: 'ch', x: 16, y: 40, w: 120, h: 66, title: tr('Canales', 'Channels'), sub: 'WebChat React\nAPI REST' },
      { id: 'bf', x: 168, y: 48, w: 130, title: 'Bot Framework', sub: tr('conector de canales', 'channel connector') },
      { id: 'bs', x: 330, y: 40, w: 150, h: 66, title: 'Bot Service', sub: tr('librería común\n+ plugins por bot', 'shared library\n+ per-bot plugins'), accent: true },
      { id: 'nlu', x: 512, y: 16, w: 150, title: 'DialogFlow', sub: tr('intents y entidades', 'intents and entities') },
      { id: 'mods', x: 512, y: 110, w: 150, h: 66, title: tr('Módulos cognitivos', 'Cognitive modules'), sub: tr('tickets · Q&A\nsobre Elasticsearch', 'tickets · Q&A\non Elasticsearch') },
      { id: 'agents', x: 16, y: 208, w: 120, title: tr('Agentes', 'Agents'), sub: tr('equipo de soporte', 'support team') },
      { id: 'sheets', x: 168, y: 200, w: 130, h: 66, title: 'Google Sheets', sub: tr('intents, sinónimos\nfallbacks', 'intents, synonyms\nfallbacks') },
      { id: 'airflow', x: 330, y: 200, w: 150, h: 66, title: 'Airflow', sub: tr('DAGs de\nreentrenamiento', 'retraining\nDAGs'), accent: true },
    ],
    edges: [
      ...chain('ch', 'bf', 'bs', 'nlu'),
      { from: 'bs', to: 'mods' },
      ...chain('agents', 'sheets', 'airflow', 'nlu'),
    ],
    base: tr('Azure · Kubernetes · Docker · CD con Jenkins: desarrollo → QA → UAT → producción', 'Azure · Kubernetes · Docker · Jenkins CD: dev → QA → UAT → production'),
  }),

  'cloud-tco-openstack': (tr) => ({
    label: tr('Modelo de TCO y laboratorio OpenStack', 'TCO model and OpenStack lab'),
    width: 820,
    height: 380,
    nodes: [
      { id: 'hw', x: 16, y: 16, w: 150, title: 'Hardware', sub: tr('blades, storage, red', 'blades, storage, network') },
      { id: 'infra', x: 16, y: 84, w: 150, title: tr('Infraestructura', 'Facilities'), sub: tr('espacio y energía', 'space and power') },
      { id: 'sw', x: 16, y: 152, w: 150, title: tr('Licencias y soporte', 'Licenses and support'), sub: tr('instalación y operación', 'install and operations') },
      { id: 'tco', x: 220, y: 76, w: 170, h: 72, title: tr('Modelo TCO', 'TCO model'), sub: tr('Gartner, por zona\ny disponibilidad', 'Gartner, per zone\nand availability'), accent: true },
      { id: 'cmp', x: 440, y: 76, w: 190, h: 72, title: tr('Comparación', 'Comparison'), sub: tr('vCloud Suite contra\nalternativas OpenStack', 'vCloud Suite against\nOpenStack alternatives') },
      { id: 'esxi', x: 16, y: 252, w: 150, h: 66, title: tr('50 servidores', '50 servers'), sub: tr('originalmente\ncon ESXi', 'originally\nrunning ESXi') },
      { id: 'fuel', x: 220, y: 252, w: 170, h: 66, title: 'Mirantis OpenStack', sub: tr('versión 2014', '2014 release') },
      { id: 'os', x: 440, y: 252, w: 190, h: 66, title: tr('Nube universitaria', 'University cloud'), sub: tr('50 nodos', '50 nodes'), accent: true },
      { id: 'meas', x: 664, y: 166, w: 140, h: 66, title: tr('Mediciones', 'Measurements'), sub: tr('instalación\ny operación', 'installation\nand operations') },
    ],
    edges: [
      { from: 'hw', to: 'tco' },
      { from: 'infra', to: 'tco' },
      { from: 'sw', to: 'tco' },
      { from: 'tco', to: 'cmp' },
      ...chain('esxi', 'fuel', 'os', 'meas'),
      { from: 'meas', to: 'cmp' },
    ],
    base: tr('Memoria de Ingeniería Civil Industrial · UAI · 2014', 'Industrial Engineering thesis · UAI · 2014'),
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

export function diagramFor(slug: string, lang: Locale): DiagramSpec {
  const build = builders[slug];
  if (!build) throw new Error(`No diagram for project "${slug}"`);
  return build((es, en) => (lang === 'es' ? es : en));
}
