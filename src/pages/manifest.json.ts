import type { APIRoute } from 'astro';
import favicon120Img from '../assets/images/site/favicon120.png';
import favicon152Img from '../assets/images/site/favicon152.png';
import favicon167Img from '../assets/images/site/favicon167.png';
import favicon180Img from '../assets/images/site/favicon180.png';
import favicon240Img from '../assets/images/site/favicon240.png';
import { SITE } from '../config';
import { withBase } from '../i18n/utils';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: SITE.title,
      short_name: SITE.name,
      start_url: withBase('/'),
      scope: withBase('/'),
      display: 'standalone',
      background_color: '#f6f7f8',
      theme_color: '#f6f7f8',
      icons: [
        { src: withBase(favicon120Img.src), sizes: '120x120', type: 'image/png' },
        { src: withBase(favicon152Img.src), sizes: '152x152', type: 'image/png' },
        { src: withBase(favicon167Img.src), sizes: '167x167', type: 'image/png' },
        { src: withBase(favicon180Img.src), sizes: '180x180', type: 'image/png' },
        { src: withBase(favicon240Img.src), sizes: '240x240', type: 'image/png' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } },
  );
