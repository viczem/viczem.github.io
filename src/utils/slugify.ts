import slugifyLib from 'slugify';

/** Slugify a tag for use in ASCII-only URLs. */
export function slugify(text: string) {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}
