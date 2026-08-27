import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().min(30).max(65).optional(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    category: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string(),
    sourceUrl: z.string().optional(),
    language: z.enum(['de-DE', 'en-DE']),
    sourceLanguage: z.enum(['de-DE', 'en-DE']),
    translationGroup: z.string().optional(),
    translations: z.object({ 'de-DE': z.string().optional(), 'en-DE': z.string().optional() }).optional(),
    draft: z.boolean().default(false),
    ctaIntro: z.string().optional(),
    natSeoArticleId: z.string().optional(),
  }),
});

export const collections = { blog };
