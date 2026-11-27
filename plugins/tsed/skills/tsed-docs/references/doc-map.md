# Ts.ED documentation map

Every path below exists in the documentation source. Build the URL as `https://tsed.dev<path>.md` (markdown twin) or `https://tsed.dev<path>.html` (rendered page).

## Introduction

| Topic                                 | Path                                         |
| ------------------------------------- | -------------------------------------------- |
| What Ts.ED is                         | `/introduction/what-is-tsed`                 |
| What is new in v8                     | `/introduction/what-is-news-v8`              |
| Platform and plugin capability matrix | `/introduction/capabilities`                 |
| Installation, project creation        | `/introduction/getting-started`              |
| First controller walkthrough          | `/introduction/create-your-first-controller` |
| AGENTS.md template and AI setup       | `/introduction/ai/develop-with-ai`           |
| Cheat sheet                           | `/introduction/cheat-sheet`                  |
| Migrate from v7 to v8                 | `/introduction/migrate-from-v7`              |
| Migrate from v6 to v7                 | `/introduction/migrate-from-v6`              |
| Migrate from plain Express            | `/introduction/migrate-from-express`         |

## Configuration

| Topic                          | Path                                               |
| ------------------------------ | -------------------------------------------------- |
| Configuration overview         | `/docs/configuration`                              |
| Configuration sources          | `/docs/configuration/configuration-sources`        |
| Load configuration from a file | `/docs/configuration/load-configuration-from-file` |
| Server options                 | `/docs/configuration/server-options`               |
| Express.js                     | `/docs/configuration/express`                      |
| Koa.js                         | `/docs/configuration/koa`                          |
| Fastify.js                     | `/docs/configuration/fastify`                      |

## Fundamentals

| Topic                 | Path                           | Sibling skill      |
| --------------------- | ------------------------------ | ------------------ |
| Controllers           | `/docs/controllers`            | `tsed-controllers` |
| Routing               | `/docs/routing`                | `tsed-controllers` |
| DI and providers      | `/docs/providers`              | `tsed-di`          |
| Injection scopes      | `/docs/injection-scopes`       | `tsed-di`          |
| Lazy-loaded providers | `/docs/providers-lazy-loading` | `tsed-di`          |
| Custom providers      | `/docs/custom-providers`       | `tsed-di`          |
| Hooks                 | `/docs/hooks`                  | `tsed-di`          |
| Request context       | `/docs/request-context`        | `tsed-di`          |
| Models                | `/docs/model`                  | `tsed-models`      |
| JSON mapper           | `/docs/json-mapper`            | `tsed-models`      |
| Validation            | `/docs/validation`             | `tsed-models`      |
| Middlewares           | `/docs/middlewares`            | `tsed-middlewares` |
| Pipes                 | `/docs/pipes`                  | `tsed-middlewares` |
| Interceptors          | `/docs/interceptors`           | `tsed-middlewares` |
| Authentication        | `/docs/authentication`         | `tsed-middlewares` |
| Exceptions            | `/docs/exceptions`             | `tsed-exceptions`  |
| Response filter       | `/docs/response-filter`        | `tsed-exceptions`  |
| Logger                | `/docs/logger`                 | `tsed-logger`      |
| Testing               | `/docs/testing`                | `tsed-testing`     |

## Advanced

| Topic                            | Path                               |
| -------------------------------- | ---------------------------------- |
| Cache                            | `/docs/cache`                      |
| Platform API                     | `/docs/platform-api`               |
| Platform adapter                 | `/docs/platform-adapter`           |
| Platform AWS (serverless)        | `/docs/platform-serverless`        |
| Platform Serverless HTTP         | `/docs/platform-serverless-http`   |
| Platform MCP (`tsed-mcp-server`) | `/docs/mcp`                        |
| Command (`@tsed/cli-core`)       | `/docs/command`                    |
| Custom endpoint decorators       | `/docs/custom-endpoint-decorators` |
| Templating and view engines      | `/docs/templating`                 |
| Session and cookies              | `/docs/session`                    |
| Upload files                     | `/docs/upload-files`               |
| Serve static files               | `/docs/serve-files`                |
| Customize 404                    | `/docs/not-found-page`             |

## Tutorials

| Group                    | Topic → path                                                                                                                                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication, security | Passport.js `/tutorials/passport`, Keycloak `/tutorials/keycloak`, OIDC `/tutorials/oidc`                                                                                                                                          |
| API and documentation    | Swagger `/tutorials/swagger`, Scalar `/tutorials/scalar`, AJV `/tutorials/ajv`, Schema Formio `/tutorials/schema-formio`                                                                                                           |
| GraphQL                  | Overview `/tutorials/graphql`, Apollo `/tutorials/graphql-apollo`, TypeGraphQL `/tutorials/graphql-typegraphql`, Nexus `/tutorials/graphql-nexus`, GraphQL WS `/tutorials/graphql-ws`                                              |
| ORM and data             | Prisma `/tutorials/prisma`, MikroORM `/tutorials/mikroorm`, TypeORM `/tutorials/typeorm`, Mongoose `/tutorials/mongoose`, Objection.js `/tutorials/objection`                                                                      |
| Adapters and key-value   | Adapters `/tutorials/adapters`, Adapters Redis `/tutorials/adapters-redis`, Adapters IORedis `/tutorials/adapters-ioredis`, IORedis `/tutorials/ioredis`, Redis `/tutorials/redis`                                                 |
| Jobs and workflow        | Agenda `/tutorials/agenda`, BullMQ `/tutorials/bullmq`, Temporal `/tutorials/temporal`, Pulse (deprecated) `/tutorials/pulse`                                                                                                      |
| Testing                  | Vitest `/tutorials/vitest`, Jest `/tutorials/jest`                                                                                                                                                                                 |
| Third parties            | Socket.io `/tutorials/socket-io`, Stripe `/tutorials/stripe`, Serverless `/tutorials/serverless`, AWS `/tutorials/aws`, Terminus `/tutorials/terminus`, Vike `/tutorials/vike`, Server-sent events `/tutorials/server-sent-events` |

## Plugins

| Topic                         | Path                                                                        |
| ----------------------------- | --------------------------------------------------------------------------- |
| Marketplace                   | `/plugins`                                                                  |
| Create your own plugin        | `/plugins/create-your-own-plugins`                                          |
| Install premium plugins       | `/plugins/premium/install-premium-plugins`                                  |
| Premium configuration sources | `/plugins/premium/config-source/{aws-secrets,ioredis,mongo,postgres,vault}` |
| Premium Testcontainers        | `/plugins/premium/testcontainers/{redis,localstack,mongo,postgres,vault}`   |

## Indexes and other sites

| Need                                | URL                                       |
| ----------------------------------- | ----------------------------------------- |
| Guide index (no API reference)      | `https://tsed.dev/llms.txt`               |
| All guides in one file              | `https://tsed.dev/llms-full.txt`          |
| Symbol → package → API page         | `https://tsed.dev/api.json`               |
| API reference root                  | `https://tsed.dev/api.html`               |
| AGENTS.md template for applications | `https://tsed.dev/ai/AGENTS.md`           |
| CLI documentation index             | `https://cli.tsed.dev/llms.txt`           |
| Logger documentation index          | `https://logger.tsed.dev/llms.txt`        |
| v7 documentation (maintenance)      | `https://v7.tsed.dev`                     |
| Release notes                       | `https://github.com/tsedio/tsed/releases` |

## Package → topic quick map

| Package                          | What it owns                                                                                                                      |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `@tsed/di`                       | `Controller`, `Injectable`, `Module`, `Configuration`, `inject`, `injectable`, `constant`, `configuration`, `context`, `injector` |
| `@tsed/schema`                   | `Get`/`Post`/`Put`/`Patch`/`Delete`, `Returns`, `Property`, `Required`, model decorators                                          |
| `@tsed/platform-http`            | `PlatformContext`, `PlatformApplication`, `PlatformRequest`, `PlatformResponse`, `Req`, `Res`, `Next`                             |
| `@tsed/platform-http/testing`    | `PlatformTest`                                                                                                                    |
| `@tsed/platform-params`          | `BodyParams`, `PathParams`, `QueryParams`, `HeaderParams`, `Context`, `Cookies`, `Session`, `UsePipe`                             |
| `@tsed/platform-middlewares`     | `Middleware`, `MiddlewareMethods`, `Use`, `UseBefore`, `UseAfter`, `UseAuth`                                                      |
| `@tsed/platform-exceptions`      | `Catch`, `ExceptionFilterMethods`, `PlatformExceptions`                                                                           |
| `@tsed/platform-response-filter` | `ResponseFilter`, `ResponseFilterMethods`                                                                                         |
| `@tsed/exceptions`               | `Exception`, `BadRequest`, `NotFound` and other HTTP exceptions                                                                   |
| `@tsed/hooks`                    | `$on`, `$once`, `$off`, `$emit`, `$asyncEmit`, `$alter`, `$asyncAlter`                                                            |
