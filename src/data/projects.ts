// ── PORTFOLIO DE PROYECTOS ──────────────────────────────────────────────────
// Agrega tus proyectos aquí. Si el array está vacío, la sección no aparece.
//
// Cada proyecto puede tener:
//   year     — string, ej. "2024" o "2023–2024"
//   title    — nombre del proyecto (ES)
//   titleEN  — nombre del proyecto (EN), opcional (usa title si no se define)
//   desc     — descripción corta (ES)
//   descEN   — descripción corta (EN), opcional
//   tags     — array de strings, tecnologías o áreas
//   href     — URL del proyecto, repo, post, etc. (opcional)

export interface Project {
  year: string;
  title: string;
  titleEN?: string;
  desc: string;
  descEN?: string;
  tags: string[];
  href?: string;
}

export const projects: Project[] = [
  // Ejemplo — descomenta y edita:
  // {
  //   year: '2024',
  //   title: 'Nombre del proyecto',
  //   titleEN: 'Project name',
  //   desc: 'Descripción breve de qué resolviste, cómo y qué impacto tuvo.',
  //   descEN: 'Short description of what you solved, how, and what impact it had.',
  //   tags: ['Python', 'LLM', 'RAG'],
  //   href: 'https://github.com/tuusuario/proyecto',
  // },
];
