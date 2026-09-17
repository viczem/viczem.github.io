/* global URL */
import { SITE, SITE_IMAGES } from '../config';
import { withBase } from '../i18n/utils';

export interface SeoMeta {
  title: string;
  ogTitle: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageType?: string;
  twitterCard: 'summary' | 'summary_large_image';
  type: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  /**
   * When `true`, the SEO component emits
   * `<meta name="robots" content="noindex, nofollow">`.
   * Set automatically for unlisted posts/pages when
   * `unlistedHideFromSeo` is `true` (the default).
   */
  noindex?: boolean;
}

interface BuildSeoArgs {
  title?: string;
  description?: string;
  fullPath: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageType?: string;
  type?: 'website' | 'article';
  publishedTime?: Date;
  modifiedTime?: Date;
  tags?: string[];
  /** Emit `<meta name="robots" content="noindex, nofollow">`. */
  noindex?: boolean;
}

/** Build the SEO data block consumed by `<SEO />`. */
export function buildSeo(args: BuildSeoArgs): SeoMeta {
  const usesDefaultOgImage = !args.ogImage;
  const ogTitle = args.title ?? SITE.name;

  return {
    title: args.title && args.title !== SITE.name ? `${args.title} — ${SITE.name}` : SITE.name,
    // Social previews show the content title without the document title's site suffix.
    ogTitle,
    description: args.description ?? SITE.description,
    canonical: new URL(args.fullPath, SITE.url).toString(),
    ogImage: new URL(withBase(args.ogImage ?? SITE.defaultOgImage), SITE.url).toString(),
    ogImageWidth:
      args.ogImageWidth ?? (usesDefaultOgImage ? SITE_IMAGES.ogDefault.width : undefined),
    ogImageHeight:
      args.ogImageHeight ?? (usesDefaultOgImage ? SITE_IMAGES.ogDefault.height : undefined),
    ogImageType:
      args.ogImageType ??
      (usesDefaultOgImage
        ? `image/${SITE_IMAGES.ogDefault.format.replace('jpg', 'jpeg')}`
        : undefined),
    // A square fallback is a thumbnail; only page-specific images are covers.
    twitterCard: usesDefaultOgImage ? 'summary' : 'summary_large_image',
    type: args.type ?? 'website',
    publishedTime: args.publishedTime?.toISOString(),
    modifiedTime: args.modifiedTime?.toISOString(),
    tags: args.tags,
    noindex: args.noindex,
  };
}
