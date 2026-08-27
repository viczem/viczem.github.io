import { getCollection, type CollectionEntry } from 'astro:content';

import { getPosts, type Post } from './posts';
import { normalizeRepositoryName, REPOSITORY_SLUG_PATTERN, repositoryPath } from './repository';

export type Repository = CollectionEntry<'repos'>;

export interface RepositoryWithPosts {
  entry: Repository;
  slug: string;
  posts: Post[];
}

export function repositorySlug(entry: Repository): string {
  return entry.id.replace(/\.(yaml|yml)$/i, '');
}

export async function getRepositoriesWithPosts(): Promise<RepositoryWithPosts[]> {
  const [entries, posts] = await Promise.all([getCollection('repos'), getPosts()]);
  const byName = new Map<string, string>();
  const bySlug = new Map<string, RepositoryWithPosts>();

  for (const entry of entries) {
    const slug = repositorySlug(entry);
    if (!REPOSITORY_SLUG_PATTERN.test(slug)) {
      throw new Error(
        `Invalid repository filename "${entry.id}". Use lowercase kebab-case, for example "owner-name.yaml".`,
      );
    }
    if (bySlug.has(slug)) throw new Error(`Duplicate repository route slug "${slug}".`);

    const key = normalizeRepositoryName(entry.data.github);
    if (byName.has(key)) {
      throw new Error(`Duplicate repository definition for "${entry.data.github}".`);
    }

    byName.set(key, slug);
    bySlug.set(slug, { entry, slug, posts: [] });
  }

  for (const post of posts) {
    const slug = post.data.repository;
    if (!slug) continue;

    const item = bySlug.get(slug);
    if (!item) {
      throw new Error(
        `Post "${post.id}" references unknown repository "${slug}". Add the matching YAML file to src/content/repos/.`,
      );
    }
    item.posts.push(post);
  }

  return Array.from(bySlug.values()).sort(
    (a, b) =>
      b.posts.length - a.posts.length || a.entry.data.github.localeCompare(b.entry.data.github),
  );
}

export async function getRepositoryForPost(post: Post): Promise<RepositoryWithPosts | undefined> {
  const slug = post.data.repository;
  if (!slug) return undefined;

  const repositories = await getRepositoriesWithPosts();
  const repository = repositories.find((item) => item.slug === slug);
  if (!repository) {
    throw new Error(
      `Post "${post.id}" references unknown repository "${slug}". Add the matching YAML file to src/content/repos/.`,
    );
  }

  return repository;
}

export { repositoryPath };
