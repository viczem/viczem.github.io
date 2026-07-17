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

function imageField(label: string) {
  return fields.image({
    label,
    directory: postImageDirectory,
    publicPath: postImagePath,
  });
}

function baseSchema(includePublicationDate: boolean) {
  return {
    title: fields.slug({
      name: { label: 'Заголовок' },
      slug: { label: 'URL' },
    }),
    description: fields.text({ label: 'Описание', multiline: true }),
    ...(includePublicationDate ? { pubDate: fields.date({ label: 'Дата публикации' }) } : {}),
    updatedDate: fields.date({ label: 'Дата обновления', validation: { isRequired: false } }),
    tags: fields.array(fields.text({ label: 'Тег' }), { label: 'Теги' }),
    draft: fields.checkbox({ label: 'Черновик', defaultValue: false }),
    heroImage: imageField('Обложка'),
    heroImageAlt: fields.text({ label: 'Описание обложки', validation: { isRequired: false } }),
    showFeaturedImage: fields.checkbox({ label: 'Показывать обложку', defaultValue: true }),
    dynamicPostCardHeight: fields.checkbox({
      label: 'Увеличивать высоту карточки',
      defaultValue: false,
    }),
    canonicalURL: fields.url({ label: 'Канонический URL', validation: { isRequired: false } }),
    comments: fields.checkbox({ label: 'Комментарии включены', defaultValue: true }),
    telegramPostId: fields.integer({ label: 'ID поста в Telegram', validation: { isRequired: false } }),
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
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: baseSchema(true),
    }),
    pages: collection({
      label: 'Страницы',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        ...baseSchema(false),
        showInNav: fields.checkbox({ label: 'Показывать в навигации', defaultValue: false }),
      },
    }),
  },
});
