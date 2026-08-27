import { describe, expect, test } from 'bun:test';

import {
  GITHUB_COMMIT_HASH_PATTERN,
  GITHUB_REPOSITORY_PATTERN,
  githubCommitUrl,
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

  test('accepts full SHA-1 and SHA-256 commit hashes', () => {
    expect(GITHUB_COMMIT_HASH_PATTERN.test('a'.repeat(40))).toBe(true);
    expect(GITHUB_COMMIT_HASH_PATTERN.test('B'.repeat(64))).toBe(true);
  });

  test('rejects abbreviated and non-hex commit hashes', () => {
    expect(GITHUB_COMMIT_HASH_PATTERN.test('a'.repeat(7))).toBe(false);
    expect(GITHUB_COMMIT_HASH_PATTERN.test('g'.repeat(40))).toBe(false);
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

  test('builds a GitHub commit URL with the full hash', () => {
    const hash = '0123456789abcdef0123456789abcdef01234567';
    expect(githubCommitUrl('viczem/project-name', hash)).toBe(
      `https://github.com/viczem/project-name/commit/${hash}`,
    );
  });

  test('rejects an invalid hash before building a commit URL', () => {
    expect(() => githubCommitUrl('viczem/project-name', 'abc1234')).toThrow(
      'Expected a full 40 or 64 character SHA',
    );
  });
});
