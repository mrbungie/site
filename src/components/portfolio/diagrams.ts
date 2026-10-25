import type { Locale } from '../../i18n/ui';
import type { CaseStudy } from '../../data/portfolio';

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

interface DiagramSpec {
  label: string;
  width: number;
  height: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  base: string;
}

const es = (lang: Locale, a: string, b: string) => (lang === 'es' ? a : b);

export function diagramFor(id: CaseStudy['id'], lang: Locale): DiagramSpec {
  if (id === 'data-platform') {
    return {
      label: es(lang, 'Arquitectura de la plataforma de datos', 'Data platform architecture'),
      width: 820,
      height: 320,
      nodes: [
        { id: 'erp', x: 16, y: 32, w: 130, title: 'ERP', sub: es(lang, 'facturación', 'billing') },
        { id: 'sp', x: 16, y: 132, w: 130, title: 'SharePoint', sub: es(lang, 'catálogos', 'catalogs') },
        { id: 'bronze', x: 178, y: 82, w: 112, title: 'Bronze', sub: es(lang, 'copia cruda', 'raw copy') },
        { id: 'silver', x: 322, y: 74, w: 150, h: 72, title: 'Silver', sub: es(lang, 'clientes, productos,\nproveedores, facturas', 'customers, products,\nsuppliers, invoices') },
        { id: 'gold', x: 504, y: 74, w: 150, h: 72, title: 'Gold (dbt)', sub: es(lang, 'ventas, equivalencias,\nrecomendaciones', 'sales, equivalences,\nrecommendations') },
        { id: 'bi', x: 686, y: 82, w: 118, title: 'Dashboards', sub: es(lang, 'área comercial', 'sales team') },
        { id: 'ml', x: 412, y: 182, w: 170, h: 66, title: 'ML', sub: es(lang, 'atributos con LLM +\nclasificador · MLflow', 'LLM attributes +\nclassifier · MLflow'), accent: true },
      ],
      edges: [
        { from: 'erp', to: 'bronze' },
        { from: 'sp', to: 'bronze' },
        { from: 'bronze', to: 'silver' },
        { from: 'silver', to: 'gold' },
        { from: 'gold', to: 'bi' },
        { from: 'silver', to: 'ml' },
        { from: 'ml', to: 'gold' },
      ],
      base: es(lang, 'Dagster orquesta todo · Kubernetes · Postgres · IaC · CI/CD', 'Dagster orchestrates everything · Kubernetes · Postgres · IaC · CI/CD'),
    };
  }

  return {
    label: es(lang, 'Arquitectura de la plataforma de workflows', 'Workflow platform architecture'),
    width: 820,
    height: 320,
    nodes: [
      { id: 'users', x: 16, y: 102, w: 120, title: es(lang, 'Equipo', 'Team'), sub: es(lang, 'y clientes', 'and clients') },
      { id: 'fe', x: 168, y: 102, w: 140, title: 'Frontend', sub: 'React · wfsdk/react' },
      { id: 'api', x: 340, y: 32, w: 150, title: 'Backend API', sub: es(lang, 'FastAPI · roles', 'FastAPI · roles') },
      { id: 'dsl', x: 340, y: 156, w: 150, h: 66, title: 'wfsdk', sub: es(lang, 'DSL de workflows\ntipado', 'typed workflow\nDSL'), accent: true },
      { id: 'temporal', x: 522, y: 32, w: 130, title: 'Temporal', sub: es(lang, 'pasos humanos', 'human steps') },
      { id: 'worker', x: 522, y: 172, w: 130, title: 'Worker', sub: es(lang, 'ejecuta pasos', 'runs steps') },
      { id: 'llm', x: 684, y: 16, w: 120, title: 'LiteLLM', sub: es(lang, '→ Gemini', '→ Gemini') },
      { id: 'deck', x: 684, y: 112, w: 120, title: 'Deck render', sub: 'HTML → PPTX/PDF' },
      { id: 'db', x: 684, y: 208, w: 120, title: 'Postgres', sub: 'Redis' },
    ],
    edges: [
      { from: 'users', to: 'fe' },
      { from: 'fe', to: 'api' },
      { from: 'dsl', to: 'api' },
      { from: 'api', to: 'temporal' },
      { from: 'temporal', to: 'worker' },
      { from: 'worker', to: 'llm' },
      { from: 'worker', to: 'deck' },
      { from: 'worker', to: 'db' },
    ],
    base: 'GCP · GKE Autopilot · Gateway · Secret Manager · Workload Identity · Terraform',
  };
}
