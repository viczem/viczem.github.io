/**
 * Content Collections (Astro v7 loader API).
 *
 * Content lives directly under `src/content/<collection>/**`.
 */

import { glob } from 'astro/loaders';
import { defineCollection, type SchemaContext } from 'astro:content';
import { z } from 'zod';

/**
 * Build the post / page frontmatter schema.
 *
 * `heroImage` accepts THREE shapes:
 *   1. An imported asset via `image()` — a path RELATIVE TO THE
 *      MARKDOWN FILE pointing into `src/assets/...`. Astro resolves
 *      it through its image pipeline (WebP, responsive `srcset`,
 *      width/height inferred). This is the recommended option.
 *   2. A public path (e.g. `/images/foo.jpg`) — copied as-is, NOT
 *      optimized.
 *   3. An external URL (https://…) — optimized at build if the host
 *      is allow-listed in `image.remotePatterns` in `astro.config.mjs`.
 */
const baseFrontmatter = ({ image }: SchemaContext) =>
  z.object({
    title: z.string().min(1).max(140),
    description: z.string().min(1).max(280),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    heroImage: z.union([image(), z.string()]).optional(),
    /** Optional alt-text for the hero/featured image. */
    heroImageAlt: z.string().optional(),
    /** Per-post override of SITE.showFeaturedImages (cards + hero). */
    showFeaturedImage: z.boolean().optional(),
    /** Per-post override of SITE.dynamicPostCardHeight on listing cards. */
    dynamicPostCardHeight: z.boolean().optional(),
    canonicalURL: z.url().optional(),
    comments: z.boolean().optional(),
    telegramPostId: z.number().int().positive().optional(),
    toc: z.boolean().default(true),
    /** Pin to top of listings. */
    pinned: z.boolean().default(false),
    /**
     * Opt in to LaTeX math rendering (KaTeX). When `true`, the layout
     * loads `katex.min.css` only on this page so the stylesheet stays
     * off posts/pages that don't use math.
     */
    math: z.boolean().default(false),
    /**
     * Unlisted posts/pages are NOT shown in any listing (home, archives,
     * tags, RSS, sitemap) but remain accessible to anyone who
     * knows the direct URL.
     *
     * Use `unlistedHideFromSeo: true` (the default when `unlisted: true`)
     * to also emit `<meta name="robots" content="noindex, nofollow">` so
     * search engines won't index or follow links on the page.
     */
    unlisted: z.boolean().default(false),
    /**
     * When `true`, adds `<meta name="robots" content="noindex, nofollow">`
     * to the page. Defaults to `true` whenever `unlisted: true`; can be
     * set independently to hide a listed post from search engines, or to
     * keep an unlisted post indexable (e.g. for sharing via a canonical URL
     * you control).
     */
    unlistedHideFromSeo: z.boolean().optional(),
  });

export type PostFrontmatter = z.infer<ReturnType<typeof baseFrontmatter>>;

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/posts',
  }),
  schema: baseFrontmatter,
});

const pages = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/pages',
  }),
  schema: (ctx) =>
    baseFrontmatter(ctx)
      .partial({ pubDate: true })
      .extend({
        /** Pages don't paginate or appear in archives. */
        showInNav: z.boolean().default(false),
      }),
});

export const collections = { posts, pages };
