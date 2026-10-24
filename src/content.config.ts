import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { AREAS } from './components/concept/areas';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
		}),
});

const concepts = defineCollection({
	loader: glob({ base: './src/content/concepts', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string().min(2),
		summary: z.string().min(20).max(180),
		// Display category, see src/components/concept/areas.ts
		area: z.enum(AREAS),
		level: z.enum(['beginner', 'intermediate', 'advanced']),
		// Position in the suggested learning path (also drives prev/next navigation)
		order: z.number().int().positive(),
		tags: z.array(z.string()).max(4).default([]),
		// Slugs of other concepts (file name without extension)
		prerequisites: z.array(z.string()).default([]),
		related: z.array(z.string()).max(4).default([]),
		featured: z.boolean().default(false),
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog, concepts };
