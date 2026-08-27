import { collection, config, fields } from '@keystatic/core';

const postImageDirectory = 'src/assets/images/posts';
const postImagePath = '../../assets/images/posts/';

function contentField() {
  return fields.mdx({
    label: 'Содержание',
    extension: 'md',
    options: {
      image: {
        directory: postImageDirectory,
        publicPath: postImagePath,
      },
    },
  });
}

function imageField(label: string, description?: string) {
  return fields.image({
    label,
    description,
    directory: postImageDirectory,
    publicPath: postImagePath,
  });
}

function baseSchema<PublicationFields extends object>(publicationFields: PublicationFields) {
  return {
    title: fields.slug({
      name: { label: 'Заголовок' },
      slug: { label: 'URL' },
    }),
    description: fields.text({
      label: 'Описание',
      multiline: true,
      validation: { isRequired: true, length: { min: 1, max: 280 } },
    }),
    ...publicationFields,
    updatedDate: fields.datetime({
      label: 'Дата и время обновления',
      validation: { isRequired: false },
    }),
    draft: fields.checkbox({ label: 'Черновик', defaultValue: false }),
    heroImage: imageField(
      'Обложка',
      'Рекомендуется 1600×840 px (1.91:1), минимум 1200×630 px. WebP или JPEG до 500 КБ. Важные детали размещайте ближе к центру: в карточках изображение обрезается.',
    ),
    heroImageAlt: fields.text({ label: 'Описание обложки', validation: { isRequired: false } }),
    showFeaturedImage: fields.checkbox({ label: 'Показывать обложку', defaultValue: true }),
    dynamicPostCardHeight: fields.checkbox({
      label: 'Увеличивать высоту карточки',
      defaultValue: false,
    }),
    canonicalURL: fields.url({ label: 'Канонический URL', validation: { isRequired: false } }),
    comments: fields.checkbox({ label: 'Комментарии включены', defaultValue: true }),
    telegramPostId: fields.integer({
      label: 'ID поста в Telegram',
      validation: { isRequired: false },
    }),
    toc: fields.checkbox({ label: 'Показывать содержание', defaultValue: true }),
    pinned: fields.checkbox({ label: 'Закрепить пост', defaultValue: false }),
    math: fields.checkbox({ label: 'Использует формулы', defaultValue: false }),
    unlisted: fields.checkbox({ label: 'Не показывать в списках', defaultValue: false }),
    unlistedHideFromSeo: fields.checkbox({
      label: 'Скрыть от поисковых систем',
      defaultValue: false,
    }),
    content: contentField(),
  };
}

export default config({
  storage: { kind: 'local' },
  collections: {
    posts: collection({
      label: 'Посты',
      slugField: 'title',
      path: 'src/content/posts/*',
      previewUrl: '/{slug}/',
      columns: ['pubDate'],
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        ...baseSchema({
          pubDate: fields.datetime({
            label: 'Дата и время публикации',
            defaultValue: { kind: 'now' },
            validation: { isRequired: true },
          }),
        }),
        tags: fields.multiRelationship({
          label: 'Теги',
          collection: 'tags',
          description: 'Выберите связанные с публикацией теги.',
        }),
        repository: fields.relationship({
          label: 'Проект',
          collection: 'repos',
          description: 'Выберите связанный с публикацией проект.',
          validation: { isRequired: false },
        }),
        commitHash: fields.text({
          label: 'Hash коммита',
          description: 'Полный SHA коммита выбранного проекта (40 или 64 символа).',
          validation: {
            isRequired: false,
            pattern: {
              regex: /^(?:[0-9a-fA-F]{40}|[0-9a-fA-F]{64})$/,
              message: 'Укажите полный SHA коммита из 40 или 64 hex-символов.',
            },
          },
        }),
      },
    }),
    tags: collection({
      label: 'Теги',
      slugField: 'name',
      path: 'src/content/tags/*',
      previewUrl: '/tags/{slug}/',
      format: 'yaml',
      entryLayout: 'form',
      schema: {
        name: fields.slug({
          name: { label: 'Название' },
          slug: {
            label: 'URL (/tags/tag-name)',
            description: 'После изменения URL заново выберите этот тег в связанных постах.',
          },
        }),
      },
    }),
    repos: collection({
      label: 'Проекты',
      slugField: 'github',
      path: 'src/content/repos/*',
      previewUrl: '/repos/{slug}/',
      format: 'yaml',
      entryLayout: 'form',
      schema: {
        github: fields.slug({
          name: {
            label: 'GitHub (owner/name)',
            validation: {
              isRequired: true,
              pattern: {
                regex: /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/,
                message: 'Укажите репозиторий в формате owner/name.',
              },
            },
          },
          slug: {
            label: 'URL (/repos/project-name)',
            description: 'После изменения URL заново выберите этот проект в связанных постах.',
          },
        }),
        description: fields.text({
          label: 'Описание',
          multiline: true,
          validation: { isRequired: true, length: { min: 1, max: 280 } },
        }),
      },
    }),
    pages: collection({
      label: 'Страницы',
      slugField: 'title',
      path: 'src/content/pages/*',
      previewUrl: '/{slug}/',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        ...baseSchema({}),
        showInNav: fields.checkbox({ label: 'Показывать в навигации', defaultValue: false }),
      },
    }),
  },
});
