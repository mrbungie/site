import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';

export type Post = CollectionEntry<'blog'>;

/** Slug shared by both languages: English files live in blog/en/ with the same filename. */
export const postSlug = (post: Post) => post.id.replace(/^en\//, '');
export const isTranslation = (post: Post) => post.id.startsWith('en/');

/**
 * Posts for a locale, newest first. Spanish is the source; for English each post
 * is replaced by its translation in blog/en/ when one exists (otherwise the Spanish post).
 */
export async function getPosts(lang: Locale = 'es'): Promise<Post[]> {
	const all = await getCollection('blog', ({ data }) => !data.draft);
	const source = all.filter((p) => !isTranslation(p));
	const posts =
		lang === 'es' ? source : source.map((p) => all.find((t) => t.id === `en/${p.id}`) ?? p);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Estimated reading time in minutes (~220 wpm, ignores code fences and imports). */
export function readingTime(body = ''): number {
	const text = body
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/^(import|export)\s.*$/gm, ' ')
		.replace(/<[^>]+>/g, ' ');
	const words = text.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 220));
}

export function postHref(lang: Locale, slug: string): string {
	return `${lang === 'es' ? '' : '/en'}/blog/${slug}/`;
}
