/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly CI_SKIP_CONTENT_COLLECTIONS?: string;
  readonly CI_SKIP_RSS_SITEMAP?: string;
  readonly PUBLIC_TELEGRAM_COMMENTS_ENABLED?: string;
  readonly PUBLIC_TELEGRAM_CHANNEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
