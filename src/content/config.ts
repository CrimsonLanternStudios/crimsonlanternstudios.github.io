import { defineCollection, z } from 'astro:content';

const devlog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tag: z.enum(['Music', 'VFX', 'Studio', 'Game Dev', 'Community', 'Tech', 'Music · Store']),
    excerpt: z.string(),
  }),
});

export const collections = { devlog };
