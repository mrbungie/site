import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';

export type Post = CollectionEntry<'blog'>;

/** All posts, newest first. */
export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
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

export function postHref(lang: Locale, id: string): string {
	return `${lang === 'es' ? '' : '/en'}/blog/${id}/`;
}
