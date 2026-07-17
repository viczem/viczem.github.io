import type { ImageMetadata } from 'astro';

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  author: {
    name: string;
    url?: string;
    avatar?: string | ImageMetadata | { light: ImageMetadata; dark: ImageMetadata };
    bio?: string;
  };
  defaultOgImage: string;
  postsPerPage: number;
  isoDates: boolean;
  showFeaturedImages: boolean;
  boxedArticles: boolean;
  dynamicPostCardHeight: boolean;
  autoOgImage: boolean;
  showPrivacyPolicy: boolean;
  footer: {
    /** Optional full override for the left footer line. Supports {year} and {author}. */
    leftText?: string;
    /** Optional custom text shown before the theme link on the right footer line. */
    rightText?: string;
    /** Whether to show the Privacy Policy link in the footer. */
    showPrivacyPolicy?: boolean;
    /** Whether to show theme credits in the footer right side. */
    showThemeCredits?: boolean;
    /** Theme label text used by the right footer link. */
    themeName: string;
    /** Theme repository URL used by the right footer link. */
    themeUrl: string;
  };
  url: string;
}

export interface NavItem {
  /** Unique key matching the UI dictionary entries. */
  key: string;
  /** Absolute site path. */
  href: string;
  /** Optional icon name (e.g. "home", "tags"). */
  icon?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface TelegramCommentsConfig {
  /** Master switch. */
  enabled: boolean;
  /** Public channel username without @. */
  channel: string;
  /** Number of visible comments before expansion. */
  commentsLimit: number;
}
