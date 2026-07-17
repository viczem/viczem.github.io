/* global URL */
import { SITE } from '../config';
import { messages, type UIKey } from './ui';

/** Configured base path (no trailing slash). E.g. '/chirping-astro' or ''. */
const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

/**
 * Prefix an absolute path with the configured `base`. Safe to call with
 * already-prefixed paths (it won't double up) or with empty/relative
 * paths (returned unchanged).
 */
export function withBase(path: string): string {
  if (!path || !path.startsWith('/')) return path;
  if (!BASE) return path;
  if (path === BASE || path.startsWith(`${BASE}/`)) return path;
  return `${BASE}${path}`;
}

/** Build an absolute site path and apply the configured base path. */
export function localizedPath(path: string): string {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return withBase(cleaned);
}

/** Translation helper for the site's single Russian UI dictionary. */
export function useTranslations() {
  return function t(key: UIKey): string {
    return messages[key] ?? key;
  };
}

/** Russian date formatter. */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  if (SITE.isoDates) return d.toISOString().slice(0, 10);
  return new Intl.DateTimeFormat(htmlLang(), options).format(d);
}

/** Short ISO 8601 date used for <time datetime="..."> attributes. */
export function isoDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

/** Compute the canonical URL for a localized path. */
export function canonicalUrl(pathname: string): string {
  return new URL(pathname, SITE.url).toString();
}

/** ISO BCP 47 language tag for `<html lang>` and date formatters. */
export function htmlLang(): string {
  return 'ru-RU';
}
