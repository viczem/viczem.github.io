import { withBase } from '../i18n/utils';

export const GITHUB_REPOSITORY_PATTERN =
  /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/;

export const GITHUB_COMMIT_HASH_PATTERN = /^(?:[0-9a-fA-F]{40}|[0-9a-fA-F]{64})$/;

export const REPOSITORY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeRepositoryName(repository: string): string {
  return repository.toLowerCase();
}

export function splitRepositoryName(repository: string): { owner: string; name: string } {
  if (!GITHUB_REPOSITORY_PATTERN.test(repository)) {
    throw new Error(`Invalid GitHub repository "${repository}". Expected "owner/name".`);
  }

  const [owner, name] = repository.split('/');
  return { owner, name };
}

export function repositoryPath(slug: string): string {
  if (!REPOSITORY_SLUG_PATTERN.test(slug)) {
    throw new Error(`Invalid repository route slug "${slug}". Expected lowercase kebab-case.`);
  }
  return withBase(`/repos/${slug}/`);
}

export function githubRepositoryUrl(repository: string): string {
  const { owner, name } = splitRepositoryName(repository);
  return `https://github.com/${owner}/${name}`;
}

export function githubCommitUrl(repository: string, hash: string): string {
  if (!GITHUB_COMMIT_HASH_PATTERN.test(hash)) {
    throw new Error(`Invalid Git commit hash "${hash}". Expected a full 40 or 64 character SHA.`);
  }

  return `${githubRepositoryUrl(repository)}/commit/${hash}`;
}

export function githubStargazersUrl(repository: string): string {
  return `${githubRepositoryUrl(repository)}/stargazers`;
}

export function githubStarsBadgeUrl(repository: string): string {
  const { owner, name } = splitRepositoryName(repository);
  return `https://img.shields.io/github/stars/${owner}/${name}?style=social`;
}
