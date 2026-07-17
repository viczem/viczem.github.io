import { describe, expect, test } from 'bun:test';
import { slugify } from './slugify';

describe('slugify', () => {
  test('Latin tags remain unchanged', () => {
    expect(slugify('JavaScript')).toBe('javascript');
  });

  test('Cyrillic tags are transliterated to latin', () => {
    expect(slugify('Руководство')).toBe('rukovodstvo');
  });

  test('Cyrillic spaces become hyphens', () => {
    expect(slugify('начало работы')).toBe('nachalo-raboty');
  });

  test('Multiple spaces become single hyphen', () => {
    expect(slugify('hello   world')).toBe('hello-world');
  });

  test('Special characters are removed', () => {
    expect(slugify('hello@world!')).toBe('helloworld');
  });

  test('Leading and trailing spaces are trimmed', () => {
    expect(slugify('  hello  ')).toBe('hello');
  });

  test('Mixed Latin and Cyrillic use a shared ASCII slug', () => {
    expect(slugify('React Тест')).toBe('react-test');
  });

  test('Accented characters are transliterated', () => {
    expect(slugify('café')).toBe('cafe');
  });

  test('Unsupported scripts may collapse to empty', () => {
    expect(slugify('テスト')).toBe('');
  });

  test('Empty string after processing returns empty', () => {
    expect(slugify('!!!')).toBe('');
  });
});
