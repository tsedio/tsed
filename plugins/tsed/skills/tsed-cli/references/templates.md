# Ts.ED CLI v7 template reference

Source of truth at runtime: MCP `list-templates` / `get-template`, or the picker of `tsed generate`. Plugin templates exist only when the plugin package is installed in the project.

## Naming rules

Given `tsed generate <type> <name>` (MCP: `generate-file {id, name}`):

1. The name is kebab-cased and the template type suffix is removed from it (`ProductController` and `Product` give the same result for type `controller`).
2. The class name is always PascalCase of `fileName` (`{{symbolName}}.controller` → `ProductController`).
3. The file name depends on `tsed.convention`:
   - `conv_default`: PascalCase, optional segments (marked `?`) dropped → `ProductController.ts`.
   - `angular`: lower-case dotted, optional segments kept → `product.controller.ts`.
4. The directory depends on `tsed.architecture`:
   - `arc_default`: `<outputDir>/<directory option>/<dirname(name)>/`.
   - `feature`: `<srcDir>/<directory option>/<dirname(name)>/` (the template `outputDir` is ignored). Use names such as `users/User`.
5. Templates flagged `preserveCase` keep their fixed file name and location in both conventions.

Examples for `tsed g controller users/User --directory rest`:

| Preferences                    | File                                            |
| ------------------------------ | ----------------------------------------------- |
| `conv_default` + `arc_default` | `src/controllers/rest/users/UserController.ts`  |
| `angular` + `arc_default`      | `src/controllers/rest/users/user.controller.ts` |
| `angular` + `feature`          | `src/rest/users/user.controller.ts`             |

## Built-in templates (`@tsed/cli`), visible in the picker

| Id                      | File name pattern                 | Output directory   | Extra properties                                                                                                            |
| ----------------------- | --------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `controller`            | `{{symbolName}}.controller`       | `src/controllers`  | `route` (string, must start with `/`), `directory` (sub-directory)                                                          |
| `service`               | `{{symbolName}}.service`          | `src/services`     | none                                                                                                                        |
| `repository`            | `{{symbolName}}.repository`       | `src/services`     | none                                                                                                                        |
| `factory`               | `{{symbolName}}.factory?`         | `src/services`     | none                                                                                                                        |
| `async.factory`         | `{{symbolName}}.factory?`         | `src/services`     | none                                                                                                                        |
| `value`                 | `{{symbolName}}.value`            | `src/services`     | none                                                                                                                        |
| `prisma.service`        | `prisma.service`                  | `src/services`     | none                                                                                                                        |
| `model`                 | `{{symbolName}}.model`            | `src/models`       | none                                                                                                                        |
| `interface`             | `{{symbolName}}.interface`        | `src/interfaces`   | none                                                                                                                        |
| `middleware`            | `{{symbolName}}.middleware`       | `src/middlewares`  | `middlewarePosition`: `before`, `after`                                                                                     |
| `interceptor`           | `{{symbolName}}.interceptor`      | `src/interceptors` | none                                                                                                                        |
| `pipe`                  | `{{symbolName}}.pipe`             | `src/pipes`        | none                                                                                                                        |
| `decorator`             | `{{symbolName}}`                  | `src/decorators`   | `templateType`: `class` (default), `generic`, `method`, `param`, `property`, `prop`, `parameters`, `endpoint`, `middleware` |
| `exception-filter`      | `{{symbolName}}.exception-filter` | `src/filters`      | none                                                                                                                        |
| `response-filter`       | `{{symbolName}}.response-filter`  | `src/filters`      | none                                                                                                                        |
| `module`                | `{{symbolName}}.module`           | `src`              | none                                                                                                                        |
| `command`               | `{{symbolName}}.command`          | `src/bin/commands` | none                                                                                                                        |
| `docker-compose.yml`    | `docker-compose.yml`              | project root       | none                                                                                                                        |
| `dockerfile.npm`        | `Dockerfile`                      | project root       | none                                                                                                                        |
| `dockerfile.yarn`       | `Dockerfile`                      | project root       | none                                                                                                                        |
| `dockerfile.yarn_berry` | `Dockerfile`                      | project root       | none                                                                                                                        |
| `dockerfile.pnpm`       | `Dockerfile`                      | project root       | none                                                                                                                        |
| `dockerfile.bun`        | `Dockerfile`                      | project root       | none                                                                                                                        |

Shell flags for extra properties: `--route <route>`, `-d, --directory <directory>`, `-t, --template-type <templateType>`, `-m, --middleware-position <position>`.

## Built-in hidden templates (used by `tsed init`)

Not listed by `list-templates` or the picker. Do not regenerate them in an existing project.

`agents`, `barrels`, `config`, `.gitignore`, `index`, `index.command`, `index.config.util`, `index.controller`, `index.logger`, `new-template`, `pm2.node-loader`, `pm2.node-compiled`, `pm2.bun`, `readme`, `server`, `tsconfig.spec.json`, and the documentation skills `tsed-skill`, `docker-skill`, `express-skill`, `fastify-skill`, `scalar-skill`, `prisma-skill`, `mongoose-skill`, `typeorm-skill`, `vitest-skill`, `oxlint-skill`.

## Plugin templates

| Plugin package                   | Visible ids                                                           | Hidden ids                                                                                                                                                  |
| -------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@tsed/cli-plugin-mongoose`      | `mongoose.model`, `mongoose.schema`, `mongoose.connection`            | `mongoose.index`                                                                                                                                            |
| `@tsed/cli-plugin-typeorm`       | `typeorm:datasource`                                                  |                                                                                                                                                             |
| `@tsed/cli-plugin-typegraphql`   | `typegraphql.resolver`, `typegraphql.model`, `typegraphql.datasource` | `typegraphql.service`                                                                                                                                       |
| `@tsed/cli-plugin-passport`      | `protocol` (property `passportPackage`)                               | `protocol.generic`, `protocol.passport-local`, `protocol.passport-jwt`, `protocol.passport-http`, `protocol.passport-facebook`, `protocol.passport-discord` |
| `@tsed/cli-plugin-oidc-provider` |                                                                       | `oidc-provider.index`                                                                                                                                       |
| `@tsed/cli-plugin-vitest`        |                                                                       | `vitest.config`, `generic.spec`, `controller.integration`, `server.integration`, `decorator.{class,endpoint,method,param,parameter,prop,property}.spec`     |
| `@tsed/cli-plugin-jest`          |                                                                       | `jest.config`, `generic.spec`, `controller.integration`, `server.integration`, `decorator.{class,endpoint,method,param,parameter,prop,property}.spec`       |
| `@tsed/cli-plugin-eslint`        |                                                                       | `eslint.config`, `eslint.lintstagedrc`                                                                                                                      |
| `@tsed/cli-plugin-oxc`           |                                                                       | `oxc.config`, `oxfmt.config`, `oxc.lintstagedrc`, `oxc.huskyGitignore`                                                                                      |

Install a plugin with `tsed add <package>`; its templates then appear in `list-templates`.

## `defineTemplate()` options

Import from `@tsed/cli`. Place the file in `.templates/` at the project root and `export default` the result.

| Option              | Type                         | Notes                                                                                                                          |
| ------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `id`                | `string`, required           | Same id as a built-in template overrides it.                                                                                   |
| `label`             | `string`, required           | Shown in the picker, suffixed with `(custom)` for project templates.                                                           |
| `outputDir`         | `string`, required           | `{{srcDir}}` is replaced by the project source directory.                                                                      |
| `render`            | function, required           | `render(symbolName, context)` returns the content string, or `undefined` to skip.                                              |
| `description`       | `string`                     | Returned by `list-templates`.                                                                                                  |
| `fileName`          | `string`                     | Pattern without extension. Default `{{symbolName}}.{{symbolType}}?`. A trailing `?` marks a segment dropped in `conv_default`. |
| `ext`               | `string \| null`             | Default `ts`. No leading dot. `null` writes no extension.                                                                      |
| `hidden`            | `boolean`                    | Hide from the picker and from `list-templates`.                                                                                |
| `preserveCase`      | `boolean`                    | Use `fileName` as is, in every convention.                                                                                     |
| `preserveDirectory` | `boolean`                    | Keep `outputDir` even with the `feature` architecture.                                                                         |
| `schema`            | `@tsed/schema` object schema | Extra properties; drives MCP validation. Exclude `type` and `name`.                                                            |
| `prompts`           | function                     | `prompts(context)` returns extra interactive questions for `tsed generate`.                                                    |
| `hooks`             | provider hooks               | Lifecycle hooks of the underlying DI provider.                                                                                 |
| `type`              | `string`                     | Grouping type (for example `pm2`, `util`).                                                                                     |

Context helpers available in `render` and `prompts`: `context.getRoute(value)`, `context.getDirectories(dir)`, plus the properties declared in `schema` and the project preferences.

## Scaffolding a template file

- `tsed template <name> --from new` is the only fully non-interactive form. It writes `.templates/<name>.template.ts` with `id` set to the kebab-cased name.
- Copying an existing template (`from: existing`) needs the interactive picker to choose the base template. Agents should scaffold with `--from new` and adapt the file instead.
- To override a built-in template, set `id` to the built-in id by hand and keep `export default defineTemplate({...})`. Verify with `list-templates`: the label ends with `(custom)`.
