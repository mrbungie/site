import type { APIRoute } from 'astro';
import { AUTHOR } from '../consts';
import { profile, cvHref } from '../data/profile';
import { projects } from '../data/portfolio';
import { services } from '../data/services';
import { getConcepts, conceptHref } from '../components/concept/concepts';
import { getPosts } from '../utils/blog';
import { routePath } from '../i18n/routes';

// llms.txt (https://llmstxt.org): a plain-text map of the site for AI assistants and answer engines.
export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const kind = { proprietary: 'client project', oss: 'open source', paper: 'paper' } as const;
  const { entries: concepts } = await getConcepts('es');
  const posts = await getPosts();

  const lines = [
    `# ${AUTHOR.name}`,
    '',
    `> ${AUTHOR.description.en}`,
    '',
    profile.hero.lead.en,
    '',
    ...profile.hero.track.map((t) => `- ${t.org}: ${t.role.en}`),
    '',
    profile.hero.teaching.en,
    '',
    profile.hero.now.en,
    '',
    '## Profile',
    `- [About (EN)](${abs(`${routePath('en', 'about')}/`)}): experience, teaching and education`,
    `- [Acerca (ES)](${abs(`${routePath('es', 'about')}/`)})`,
    `- [Résumé PDF (EN)](${abs(cvHref.en)})`,
    `- [CV PDF (ES)](${abs(cvHref.es)})`,
    ...AUTHOR.sameAs.map((url) => `- ${url}`),
    '',
    '## Services (consulting and implementation, Santiago and remote)',
    ...services.map((s) => `- [${s.seoTitle.en}](${abs(`${routePath('en', 'services', s.slug)}/`)}): ${s.description.en}`),
    '',
    '## Portfolio',
    ...projects.map(
      (p) => `- [${p.title.en}](${abs(`${routePath('en', 'portfolio', p.slug)}/`)}): ${p.period}, ${kind[p.kind]}, ${p.industry.en}. ${p.summary.en}`,
    ),
    '',
    '## ML concepts (interactive explanations, Spanish)',
    ...concepts.map((c) => `- [${c.data.title}](${abs(conceptHref('es', c))}): ${c.data.summary}`),
    '',
    '## Blog (Spanish)',
    ...posts.map((post) => `- [${post.data.title}](${abs(`/blog/${post.id}/`)}): ${post.data.description}`),
    '',
    '## Contact',
    `- [Contact form](${abs(`${routePath('en', 'contact')}/`)}): for roles or projects`,
    `- Email: ${AUTHOR.email}`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
