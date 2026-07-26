import { describe, expect, test } from 'bun:test';

import {
  GITHUB_REPOSITORY_PATTERN,
  githubRepositoryUrl,
  githubStargazersUrl,
  githubStarsBadgeUrl,
  normalizeRepositoryName,
  repositoryPath,
  splitRepositoryName,
} from './repository';

describe('GitHub repositories', () => {
  test('accepts owner/name identifiers', () => {
    expect(GITHUB_REPOSITORY_PATTERN.test('viczem/project-name')).toBe(true);
    expect(GITHUB_REPOSITORY_PATTERN.test('open-source/repo.js')).toBe(true);
  });

  test('rejects incomplete and URL identifiers', () => {
    expect(GITHUB_REPOSITORY_PATTERN.test('project-name')).toBe(false);
    expect(GITHUB_REPOSITORY_PATTERN.test('https://github.com/viczem/project-name')).toBe(false);
  });

  test('normalizes case for matching', () => {
    expect(normalizeRepositoryName('VicZem/Project')).toBe('viczem/project');
  });

  test('splits a repository identifier', () => {
    expect(splitRepositoryName('viczem/project-name')).toEqual({
      owner: 'viczem',
      name: 'project-name',
    });
  });

  test('rejects invalid identifiers before building URLs', () => {
    expect(() => splitRepositoryName('viczem')).toThrow('Expected "owner/name"');
  });

  test('builds the short internal route', () => {
    expect(repositoryPath('viczem-project-name')).toBe('/repos/viczem-project-name/');
  });

  test('rejects an invalid internal route slug', () => {
    expect(() => repositoryPath('VicZem/project')).toThrow('lowercase kebab-case');
  });

  test('builds GitHub and stars URLs', () => {
    expect(githubRepositoryUrl('viczem/project-name')).toBe(
      'https://github.com/viczem/project-name',
    );
    expect(githubStargazersUrl('viczem/project-name')).toBe(
      'https://github.com/viczem/project-name/stargazers',
    );
    expect(githubStarsBadgeUrl('viczem/project-name')).toBe(
      'https://img.shields.io/github/stars/viczem/project-name?style=social',
    );
  });
});
