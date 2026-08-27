---
title: >-
  Один Docker образ, разные задачи: миграции, health checks и деплой в Compose и
  Kubernetes
description: >-
  Использование одного Docker-образа с разными CLI-командами для миграций,
  запуска приложения и health checks в Docker Compose и Kubernetes
pubDate: 2026-08-25T17:15:00.000Z
draft: false
heroImage: ../../assets/images/posts/one-docker-image-multiple-cli-commands/heroImage.png
heroImageAlt: Один Docker-образ с разными CLI-командами
showFeaturedImage: true
dynamicPostCardHeight: false
comments: true
telegramPostId: 12
toc: true
pinned: false
math: false
unlisted: false
unlistedHideFromSeo: false
tags:
  - docker
  - pattern
repository: userhub
commitHash: de60445db48a4f8846634af7afe53978ee1b00e7
---
Один docker образ необязательно должен означать один сценарий запуска. На практике удобно собирать приложение один раз, а конкретную роль контейнера определять командой.

Например, один и тот же образ IAM-сервиса может поддерживать две команды:

```text
iam migrate
iam start
```

`migrate` выполняет миграции PostgreSQL и завершается, а `start` запускает долгоживущий HTTP-сервис.

Так миграции и само приложение используют один артефакт, но изменение схемы базы данных не становится скрытым побочным эффектом каждого запуска приложения.

## Почему миграции лучше отделить от старта

Самый простой вариант — выполнять миграции внутри `start`:

```text
start:
  migrate()
  runServer()
```

Для локальной разработки это может казаться удобным. Но при нескольких репликах появляется неприятный вопрос: кто именно должен выполнять миграцию?

Если одновременно запускаются три экземпляра приложения, все три потенциально начинают менять одну и ту же схему. Даже если инструмент миграций умеет блокировки, жизненный цикл приложения становится сложнее: старт HTTP-сервера теперь зависит не только от его собственной инициализации, но и от состояния схемы базы данных.

Гораздо прозрачнее разделить операции:

```text
image
├── migrate
└── start
```

Миграция становится отдельным шагом деплоя:

1. запустить контейнер с командой `migrate`;
2. дождаться успешного завершения;
3. запустить или обновить контейнеры с командой `start`.

При этом код приложения, драйвер PostgreSQL, миграции и их версии остаются внутри одного образа. Не нужен отдельный `migration image`, который пришлось бы версионировать синхронно с приложением.

## Liveness и readiness отвечают на разные вопросы

Для долгоживущего сервиса полезно разделить две проверки состояния.

```text
GET /health/live
GET /health/ready
```

`/health/live` отвечает на вопрос:

> Жив ли сам процесс?

Он не обязан проверять все внешние зависимости. Если база данных временно недоступна, перезапуск процесса зачастую ничего не исправит.

`/health/ready` отвечает на другой вопрос:

> Может ли этот экземпляр прямо сейчас обслуживать рабочий трафик?

Здесь уже имеет смысл проверить соединение с PostgreSQL и другие зависимости, без которых запросы всё равно завершатся ошибкой.

Получается примерно такая модель:

```text
/health/live
    └── процесс работает

/health/ready
    ├── процесс работает
    └── PostgreSQL доступен
```

Это различие особенно важно в Kubernetes. Неуспешная `livenessProbe` может привести к перезапуску контейнера, тогда как неуспешная `readinessProbe` просто исключает Pod из обслуживания трафика.

## Docker Compose

В Compose миграцию можно представить как короткоживущий сервис:

```yaml
services:
  iam-migrate:
    image: userhub/iam:dev
    command: ["migrate"]
    environment:
      DB_URL: ${DB_URL}
    restart: "no"

  iam:
    image: userhub/iam:dev
    command: ["start"]
    environment:
      DB_URL: ${DB_URL}
    depends_on:
      iam-migrate:
        condition: service_completed_successfully
    healthcheck:
      test: ["CMD", "/iam", "healthcheck"]
      interval: 10s
      timeout: 4s
      retries: 5
```

Здесь важны две детали.

Во-первых, `iam-migrate` не является сервисом в привычном смысле. Контейнер должен применить миграции и завершиться с кодом `0`.

Во-вторых, `iam` зависит не просто от запуска контейнера миграций:

```yaml
condition: service_completed_successfully
```

Compose ждёт его успешного завершения и только после этого запускает IAM.

Если миграция завершилась ошибкой, приложение не стартует поверх схемы, состояние которой неизвестно.

### Зачем отдельная команда `healthcheck`

Docker Compose умеет запускать `healthcheck`, но сам по себе не знает семантику HTTP-эндпоинтов приложения.

Поэтому бинарник может предоставить небольшую вспомогательную команду:

```text
/iam healthcheck
```

Внутри она обращается, например, к:

```text
http://localhost:8080/health/ready
```

и преобразует HTTP-ответ в обычный exit code:

```text
0 — ready
1 — not ready
```

Для Compose этого достаточно, чтобы отметить контейнер как `healthy` или `unhealthy`.

У этого подхода есть ещё один плюс: в образ не нужно добавлять `curl` или `wget` только ради health check.

## Kubernetes

В Kubernetes жизненный цикл миграции естественно представить через `Job`.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: iam-migrate-1-0
spec:
  backoffLimit: 1
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: migrate
          image: userhub/iam:dev
          args: ["migrate"]
          env:
            - name: DB_URL
              valueFrom:
                secretKeyRef:
                  name: iam-database
                  key: url
```

Job использует тот же образ, что и приложение, но запускает другую команду:

```yaml
args: ["migrate"]
```

После успешного завершения миграции можно обновлять `Deployment`.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: iam
spec:
  replicas: 2

  selector:
    matchLabels:
      app: iam

  template:
    metadata:
      labels:
        app: iam

    spec:
      containers:
        - name: iam
          image: userhub/iam:dev
          args: ["start"]

          ports:
            - containerPort: 8080

          env:
            - name: DB_URL
              valueFrom:
                secretKeyRef:
                  name: iam-database
                  key: url

          readinessProbe:
            httpGet:
              path: /health/ready
              port: 8080

          livenessProbe:
            httpGet:
              path: /health/live
              port: 8080
```

Здесь вспомогательная команда `healthcheck` уже не нужна. Kubernetes умеет самостоятельно выполнять HTTP-пробы.

`readinessProbe` определяет, можно ли направлять запросы в конкретный Pod:

```yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
```

А `livenessProbe` следит за тем, не оказался ли процесс в состоянии, из которого требуется перезапуск:

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
```

## Почему один образ удобен

В результате один и тот же артефакт проходит весь путь от CI до production:

```text
userhub/iam:dev
       │
       ├── migrate ──> PostgreSQL schema
       │
       └── start ────> IAM service
```

Это даёт несколько полезных свойств.

Версия миграций совпадает с версией приложения. Нельзя случайно запустить мигратор от одной версии и приложение от другой, если pipeline везде использует один image tag.

Не появляется второй Dockerfile и второй образ, жизненный цикл которого нужно поддерживать.

При этом ответственность остаётся разделённой: `migrate` меняет схему и завершается, `start` обслуживает запросы, `/health/live` сообщает о состоянии процесса, а `/health/ready` — о способности принимать трафик.

Главная идея здесь не столько в Docker или Kubernetes, сколько в явном жизненном цикле приложения:

```text
artifact
   │
   ├── migrate
   │     └── exit
   │
   └── start
         ├── /health/live
         └── /health/ready
```

Один образ может выполнять несколько задач. Важно лишь не смешивать эти задачи внутри одного запуска.
