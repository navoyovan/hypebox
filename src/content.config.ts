import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    year: z.string(),
    role: z.string(),
    tags: z.array(z.string()),
    client: z.string().optional(),
    url: z.string().optional(),
    featured: z.boolean().default(false),
    gridClass: z.string().optional(),
  })
});

export const collections = {
  projects: projectsCollection,
};
