---
name: tsed-docs
description: Locates authoritative Ts.ED v8 documentation and API reference instead of guessing framework APIs. Routes a topic to the right tsed.dev page, its markdown twin, the llms.txt indexes (tsed.dev, cli.tsed.dev, logger.tsed.dev) and the sibling tsed-* skills. Use when working in a project that depends on @tsed/* packages and an import path, decorator (@Controller, @Injectable, @Returns), function (inject, injectable, configuration), option name or error message is uncertain, when an example imports from @tsed/common, or before answering any "how do I ... in Ts.ED" question.
---

# Find Ts.ED documentation

Ts.ED changes between majors and across minor releases. Fetch the published documentation before writing framework code; do not reconstruct APIs from memory.

The full topic → page table is in [the doc map](references/doc-map.md). Load it when the short table below does not cover the topic.

## 1. Identify the installed version

1. Read the application's `package.json` and note the version of `@tsed/platform-http`, `@tsed/di` and `@tsed/schema` (fall back to any `@tsed/*` dependency).
2. Map the major to a documentation site:

| Installed major | Documentation                                                  |
| --------------- | -------------------------------------------------------------- |
| 8.x             | `https://tsed.dev` (everything in this skill)                  |
| 7.x             | `https://v7.tsed.dev`, then propose the `tsed-migration` skill |
| 6.x and older   | `https://v6.tsed.dev`, `https://v5.tsed.dev` (obsolete)        |

3. If `@tsed/common` is a dependency, treat the project as not fully migrated and use the `tsed-migration` skill before adding new code.
4. Do not apply v8 documentation to a v7 project without telling the user.

## 2. Pick the cheapest source

Use the sources in this order and stop as soon as the question is answered:

1. A sibling skill (section 4) when the topic has one.
2. The page's markdown twin: any page URL plus `.md`.
   - `https://tsed.dev/docs/controllers.html` → `https://tsed.dev/docs/controllers.md`
   - A directory index drops the trailing `/index`: `https://tsed.dev/docs/configuration.md`
3. `https://tsed.dev/llms.txt`: index of guides, tutorials and plugin pages with one-line descriptions. It excludes the API reference.
4. `https://tsed.dev/llms-full.txt`: the same pages concatenated. Large; fetch it only for a cross-cutting search and grep the result instead of reading it whole.
5. API reference under `https://tsed.dev/api/...` for exact signatures (section 3).

Other documentation sites:

| Product                       | Index                              |
| ----------------------------- | ---------------------------------- |
| Ts.ED CLI (`@tsed/cli`)       | `https://cli.tsed.dev/llms.txt`    |
| Ts.ED logger (`@tsed/logger`) | `https://logger.tsed.dev/llms.txt` |

Do not scrape the rendered `.html` pages when a `.md` twin exists.

## 3. Resolve an API symbol

1. Fetch `https://tsed.dev/api.json`. It maps each package to its `symbols`; every entry has `symbolName`, `module`, `symbolType` and `path`.
2. Filter by `symbolName` and read `module` to get the import path. Example entry: `Injectable` → module `@tsed/di`, path `/api/di/types/common/decorators/decorator-injectable`.
3. Open `https://tsed.dev<path>` (append `.md` for the markdown twin) for the signature and description.
4. When the application has `node_modules`, confirm with the installed typings: `node_modules/@tsed/<package>/lib/types/**/*.d.ts`. The installed version wins over the website.

Do not guess an API URL; the path always comes from `api.json`.

## 4. Route to a sibling skill first

| Topic                                                          | Skill                |
| -------------------------------------------------------------- | -------------------- |
| Scaffolding, generators, `tsed` CLI, CLI MCP server            | `tsed-cli`           |
| `@Configuration`, server options, configuration sources, env   | `tsed-configuration` |
| Providers, `inject()`, `injectable()`, scopes, hooks, modules  | `tsed-di`            |
| Controllers, routing, parameters, responses                    | `tsed-controllers`   |
| Models, `@tsed/schema`, validation, JSON mapper                | `tsed-models`        |
| Middlewares, pipes, interceptors, auth guards                  | `tsed-middlewares`   |
| Exceptions, exception filters, error responses                 | `tsed-exceptions`    |
| Unit and integration tests, `PlatformTest`, Vitest             | `tsed-testing`       |
| OpenAPI, Swagger, Scalar, `@Returns`                           | `tsed-openapi`       |
| `@tsed/logger`, request logging                                | `tsed-logger`        |
| Exposing MCP tools/resources/prompts with `@tsed/platform-mcp` | `tsed-mcp-server`    |
| Upgrading from v6/v7, removing `@tsed/common`, ESM switch      | `tsed-migration`     |

## 5. Route to a page

Most used pages (all verified against the documentation sidebar). Prefix with `https://tsed.dev` and append `.md`.

| Topic                               | Page                                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Install, first project              | `/introduction/getting-started`                                                                        |
| Platform feature matrix             | `/introduction/capabilities`                                                                           |
| Decorator and function cheat sheet  | `/introduction/cheat-sheet`                                                                            |
| Configuration overview              | `/docs/configuration/index`                                                                            |
| Configuration sources               | `/docs/configuration/configuration-sources`                                                            |
| Server options                      | `/docs/configuration/server-options`                                                                   |
| Express / Koa / Fastify specifics   | `/docs/configuration/{express,koa,fastify}`                                                            |
| Controllers, routing                | `/docs/controllers`, `/docs/routing`                                                                   |
| DI and providers                    | `/docs/providers`, `/docs/custom-providers`                                                            |
| Models, JSON mapper, validation     | `/docs/model`, `/docs/json-mapper`, `/docs/validation`                                                 |
| Middlewares, pipes, interceptors    | `/docs/middlewares`, `/docs/pipes`, `/docs/interceptors`                                               |
| Authentication                      | `/docs/authentication`                                                                                 |
| Hooks, request context              | `/docs/hooks`, `/docs/request-context`                                                                 |
| Exceptions, response filter         | `/docs/exceptions`, `/docs/response-filter`                                                            |
| Testing                             | `/docs/testing`, `/tutorials/vitest`                                                                   |
| CLI commands inside an application  | `/docs/command` (singular, not `commands`)                                                             |
| MCP server in an application        | `/docs/mcp`                                                                                            |
| Swagger, Scalar                     | `/tutorials/swagger`, `/tutorials/scalar`                                                              |
| Prisma, Mongoose, TypeORM, MikroORM | `/tutorials/{prisma,mongoose,typeorm,mikroorm}`                                                        |
| Migration guides                    | `/introduction/migrate-from-v7`, `/introduction/migrate-from-v6`, `/introduction/migrate-from-express` |

## 6. Apply what was read

1. Prefer v8 idioms. Both styles are supported; follow the style already used in the application, and default to the functional API for new providers:

```ts
import {Controller, inject} from "@tsed/di";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";

import {ProductsService} from "../services/ProductsService.js";

@Controller("/products")
export class ProductsController {
  protected products = inject(ProductsService);

  @Get("/:id")
  get(@PathParams("id") id: string) {
    return this.products.findById(id);
  }
}
```

2. Rewrite any example that imports from `@tsed/common` before using it: split the import across the owning packages (`@tsed/di`, `@tsed/schema`, `@tsed/platform-http`, `@tsed/platform-params`, `@tsed/platform-middlewares`, `@tsed/platform-exceptions`). The mapping is in the `tsed-migration` skill.
3. Keep ESM conventions in every snippet: relative imports end with `.js`.
4. Quote the page URL used in the answer or in the change description so the user can check it.

## Pitfalls

- `@tsed/common` examples are pre-v8. They may also use `settings.prop` proxy access and CommonJS imports, both removed in v8.
- `llms.txt` does not list API pages; a symbol missing there is not evidence that it does not exist. Check `api.json`.
- The command page is `/docs/command`, the CLI product documentation lives on `cli.tsed.dev`. They are different subjects: the first documents `@tsed/cli-core` commands hosted by an application, the second the `tsed` binary.
- The page titled "Migrate v6 to v7" is `/introduction/migrate-from-v6`; it does not target v8.
- `/tutorials/pulse` is deprecated; route scheduling questions to `/tutorials/agenda` or `/tutorials/bullmq`.
- Search results, blog posts and Stack Overflow answers frequently describe v5/v6 (`@tsed/common`, `ServerLoader`, `@ServerSettings`). Do not use them.

## Checklist

- Installed `@tsed/*` major identified from `package.json`.
- Sibling skill consulted when one covers the topic.
- At least one `https://tsed.dev/...md` page or `api.json` entry fetched for every non-trivial API used.
- No import from `@tsed/common` in produced code; relative imports end with `.js`.
- Source URL reported to the user.
