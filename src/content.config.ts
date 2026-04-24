import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.object({ slug: z.string(), label: z.string() })),
    category: z.object({ slug: z.string(), label: z.string() }),
    imageUrl: image(),
    imageAlt: z.string(),
    relatedPosts: z.array(reference('blog')).optional(),
  }),
});

export const collections = { blog };