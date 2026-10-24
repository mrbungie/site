import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, type Locale } from '../../i18n/ui';
import { routePath } from '../../i18n/routes';
import { AREAS } from './areas';

export type ConceptEntry = CollectionEntry<'concepts'>;

export const conceptSlug = (entry: ConceptEntry) =>
	entry.id.split('/').slice(1).join('/').replace(/\.(mdx|md)$/, '');

export const conceptHref = (lang: Locale, entry: ConceptEntry) =>
	routePath(lang, 'concepts', conceptSlug(entry));

export const readingMinutes = (entry: ConceptEntry) =>
	Math.max(1, Math.round((entry.body ?? '').split(/\s+/).filter(Boolean).length / 180));

/**
 * All published concepts for a locale, in learning-path order.
 * If a locale has no translated content, falls back to the default locale
 * (`fallback: true`) so pages are never empty.
 */
export async function getConcepts(lang: Locale) {
	const all = (await getCollection('concepts', (c) => !c.data.draft)).sort(
		(a, b) => a.data.order - b.data.order,
	);
	const own = all.filter((c) => c.id.startsWith(`${lang}/`));
	if (own.length > 0) return { entries: own, fallback: false };
	return { entries: all.filter((c) => c.id.startsWith(`${defaultLocale}/`)), fallback: lang !== defaultLocale };
}

export function groupByArea(entries: ConceptEntry[]) {
	return AREAS.map((area) => ({ area, items: entries.filter((e) => e.data.area === area) })).filter(
		(g) => g.items.length > 0,
	);
}

/** Resolve slugs from frontmatter to entries; throws on dangling references so builds fail loudly. */
export function resolveRefs(entries: ConceptEntry[], slugs: string[], from: string) {
	return slugs.map((s) => {
		const e = entries.find((x) => conceptSlug(x) === s);
		if (!e) throw new Error(`Concept "${from}" references unknown concept "${s}"`);
		return e;
	});
}
