# cat /dev/viczem

Личный сайт [Виктора Земцова](https://github.com/viczem) о проектах, коде и
open source.

Здесь публикуются новости и заметки о собственных проектах с открытым исходным
кодом, а также технические разборы, решения и опыт разработки.

## Стек

- Astro
- TypeScript
- Tailwind CSS
- Markdown и MDX

Сайт размещается на GitHub Pages и работает через Cloudflare. Комментарии к
публикациям ведутся в [Telegram](https://t.me/viczem_org).

## Локальный запуск

Требуется [Bun](https://bun.sh/).

```bash
bun install
bun dev
```

После запуска сайт будет доступен по адресу `http://localhost:4321`.

## Контент

- Публикации: `src/content/posts/`
- Страница «О сайте»: `src/content/pages/about.md`
- Политика конфиденциальности: `src/content/pages/privacy.md`
- Основные настройки сайта: `src/config.ts`

## Команды

```bash
bun run build
bun run typecheck
bun run lint
```
