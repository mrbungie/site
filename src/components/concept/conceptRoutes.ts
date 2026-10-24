import type { Locale } from '../../i18n/ui';
import { conceptSlug, getConcepts } from './concepts';

/** Shared getStaticPaths for /conceptos/[...slug] and /en/concepts/[...slug]. */
export async function getConceptPaths(lang: Locale) {
	const { entries } = await getConcepts(lang);
	return entries.map((concept) => ({
		params: { slug: conceptSlug(concept) },
		props: { concept },
	}));
}
