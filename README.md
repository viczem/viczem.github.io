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
- Теги: `src/content/tags/`
- Проекты: `src/content/repos/`
- Страница «О сайте»: `src/content/pages/about.md`
- Политика конфиденциальности: `src/content/pages/privacy.md`
- Основные настройки сайта: `src/config.ts`

Пост может быть связан с одним или несколькими проектами через frontmatter:

```yaml
repositories:
  - viczem-project-name
```

Каждый используемый проект должен иметь описание в отдельном YAML-файле. Имя файла
задаёт адрес страницы в разделе `/repos/`:

```yaml
# src/content/repos/viczem-project-name.yaml -> /repos/viczem-project-name/
github: viczem/project-name
description: Краткое описание назначения проекта.
```

Значение в `repositories` — имя YAML-файла без расширения. Ссылка на GitHub и badge с
актуальным количеством звёзд строятся автоматически из поля `github`.

Теги также хранятся централизованно и выбираются в Keystatic из коллекции:

```yaml
# src/content/tags/open-source.yaml
name: Open Source
```

```yaml
tags:
  - open-source
```

## Команды

```bash
bun run build
bun run typecheck
bun run lint
```
