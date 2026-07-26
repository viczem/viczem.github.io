import { getCollection, type CollectionEntry } from 'astro:content';

import { withBase } from '../i18n/utils';
import { getPosts, type Post } from './posts';
import { normalizeRepositoryName, REPOSITORY_SLUG_PATTERN } from './repository';

export type Tag = CollectionEntry<'tags'>;

export interface TagWithPosts {
  entry: Tag;
  slug: string;
  posts: Post[];
}

export function tagSlug(entry: Tag): string {
  return entry.id.replace(/\.(yaml|yml)$/i, '');
}

export function tagPath(slug: string): string {
  if (!REPOSITORY_SLUG_PATTERN.test(slug)) {
    throw new Error(`Invalid tag route slug "${slug}". Expected lowercase kebab-case.`);
  }
  return withBase(`/tags/${slug}/`);
}

export async function getTagsWithPosts(): Promise<TagWithPosts[]> {
  const [entries, posts] = await Promise.all([getCollection('tags'), getPosts()]);
  const byName = new Set<string>();
  const bySlug = new Map<string, TagWithPosts>();

  for (const entry of entries) {
    const slug = tagSlug(entry);
    if (!REPOSITORY_SLUG_PATTERN.test(slug)) {
      throw new Error(
        `Invalid tag filename "${entry.id}". Use lowercase kebab-case, for example "open-source.yaml".`,
      );
    }
    if (bySlug.has(slug)) throw new Error(`Duplicate tag route slug "${slug}".`);

    const name = normalizeRepositoryName(entry.data.name);
    if (byName.has(name)) throw new Error(`Duplicate tag definition for "${entry.data.name}".`);

    byName.add(name);
    bySlug.set(slug, { entry, slug, posts: [] });
  }

  for (const post of posts) {
    const seen = new Set<string>();
    for (const slug of post.data.tags) {
      if (seen.has(slug)) {
        throw new Error(`Post "${post.id}" references tag "${slug}" more than once.`);
      }
      seen.add(slug);

      const tag = bySlug.get(slug);
      if (!tag) {
        throw new Error(
          `Post "${post.id}" references unknown tag "${slug}". Add the matching YAML file to src/content/tags/.`,
        );
      }
      tag.posts.push(post);
    }
  }

  return Array.from(bySlug.values()).sort(
    (a, b) => b.posts.length - a.posts.length || a.entry.data.name.localeCompare(b.entry.data.name),
  );
}

export async function getTagsForPost(post: Post): Promise<TagWithPosts[]> {
  if (post.data.tags.length === 0) return [];

  const tags = await getTagsWithPosts();
  const bySlug = new Map(tags.map((tag) => [tag.slug, tag]));
  return post.data.tags.map((slug) => {
    const tag = bySlug.get(slug);
    if (!tag) {
      throw new Error(
        `Post "${post.id}" references unknown tag "${slug}". Add the matching YAML file to src/content/tags/.`,
      );
    }
    return tag;
  });
}
