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

Пост может быть связан с одним проектом и опционально с конкретным коммитом через frontmatter:

```yaml
repository: viczem-project-name
commitHash: 0123456789abcdef0123456789abcdef01234567
```

Каждый используемый проект должен иметь описание в отдельном YAML-файле. Имя файла
задаёт адрес страницы в разделе `/repos/`:

```yaml
# src/content/repos/viczem-project-name.yaml -> /repos/viczem-project-name/
github: viczem/project-name
description: Краткое описание назначения проекта.
```

Значение в `repository` — имя YAML-файла без расширения. Ссылка на GitHub и badge с
актуальным количеством звёзд строятся автоматически из поля `github`. Если указан полный
40- или 64-символьный SHA в `commitHash`, в шапке поста также отображается ссылка на коммит.

### Превью публикаций

Для превью публикации в Telegram и других сервисах используются `title`, `description`
и `heroImage` из frontmatter:

```yaml
title: Название публикации
description: Краткое описание публикации.
pubDate: 2026-07-26
heroImage: ../../assets/images/posts/example.png
heroImageAlt: Описание изображения
```

Если `heroImage` не задан, в Open Graph и Schema.org автоматически используется
`SITE.defaultOgImage` из `src/config.ts`. Отдельные изображения для каждого поста при
сборке не генерируются.

Страницы публикаций содержат метаданные Open Graph, Twitter Card и Schema.org
`BlogPosting`, а также стабильные классы `post-title`, `post-description`,
`post-published`, `post-cover` и `post-content` для Telegram Instant View Template.

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
