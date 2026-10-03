# Ts.ED CLI v7 init options and command flags

Live source: MCP resource `tsed://init/options`, or `tsed init-options -i 2` in a shell. Prefer them when available; this file mirrors `@tsed/cli` 7.x.

## `tsed init [root]`

| Flag (shell)                             | MCP `init-project` field | Values                                                | Default        |
| ---------------------------------------- | ------------------------ | ----------------------------------------------------- | -------------- |
| `[root]` positional                      | `cwd` (required)         | Target directory                                      | `.`            |
| `-n, --project-name <projectName>`       | `projectName`            | string                                                | directory name |
| `-p, --platform <platform>`              | `platform`               | `express`, `koa`, `fastify`                           | `express`      |
| `-a, --arch <architecture>`              | `architecture`           | `arc_default` (Ts.ED), `feature`                      | `arc_default`  |
| `-c, --convention <convention>`          | `convention`             | `conv_default` (Ts.ED), `angular`                     | `conv_default` |
| `--features <features...>`               | `features` (array)       | see feature values                                    | none           |
| `--runtime <runtime>`                    | `runtime`                | `vite`, `bun-vite`, `node`, `babel`, `webpack`, `bun` | `node`         |
| `-m, --package-manager <packageManager>` | `packageManager`         | `npm`, `yarn_berry`, `pnpm`, `bun`                    | `npm`          |
| `-t, --tsed-version <version>`           | `tsedVersion`            | `x.x.x` or a dist-tag                                 | `latest`       |
| `--gh-token <ghToken>`                   | not available            | GitHub token for `:premium` features                  |                |
| `-f, --file <file>`                      | not available            | `.yml`, `.yaml` or `.json` file holding these options |                |
| `-s, --skip-prompt`                      | forced by the tool       | boolean                                               | `false`        |

Notes:

- Runtime labels: `node` is Node.js + SWC, `vite` is Node.js + Vite, `bun-vite` is Bun.js + Vite, `babel` is Node.js + Babel, `webpack` is Node.js + Webpack, `bun` is Bun.js.
- The package manager question is skipped for the `bun` and `bun-vite` runtimes.
- Only runtimes and package managers detected on the machine are offered.
- The CLI only installs Ts.ED 8 or newer.
- Premium features cannot be installed through MCP `init-project` (no token field); use the shell with `--gh-token`.

Non-interactive example:

```sh
npx -p @tsed/cli tsed init my-api --skip-prompt \
  --platform fastify --arch feature --convention angular \
  --runtime vite --package-manager pnpm \
  --features config config:dotenv doc doc:scalar orm orm:prisma testing testing:vitest linter linter:oxlint linter:oxfmt
```

Options file example (`tsed init . --file ./tsed.init.yml --skip-prompt`):

```yaml
platform: express
architecture: arc_default
convention: conv_default
runtime: node
packageManager: npm
features:
  - doc
  - doc:swagger
  - testing
  - testing:vitest
```

## Feature values

Group values are the parents shown in the interactive picker. Pass the parent together with each selected leaf (`testing testing:vitest`), as the interactive picker does; parent entries carry their own dependencies.

| Group                   | Parent value  | Leaf values                                                                                                                                                                                                                                                                                                                                |
| ----------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Commands                | `commands`    |                                                                                                                                                                                                                                                                                                                                            |
| Configuration           | `config`      | `config:envs`, `config:dotenv`, `config:json`, `config:yaml`                                                                                                                                                                                                                                                                               |
| Configuration (premium) | `config`      | `config:aws_secrets:premium`, `config:ioredis:premium`, `config:mongo:premium`, `config:vault:premium`, `config:postgres:premium`                                                                                                                                                                                                          |
| ORM                     | `orm`         | `orm:prisma`, `orm:mongoose`, `orm:typeorm`                                                                                                                                                                                                                                                                                                |
| TypeORM driver          | `orm:typeorm` | `orm:typeorm:mysql`, `orm:typeorm:mariadb`, `orm:typeorm:postgres`, `orm:typeorm:cockroachdb`, `orm:typeorm:sqlite`, `orm:typeorm:better-sqlite3`, `orm:typeorm:cordova`, `orm:typeorm:nativescript`, `orm:typeorm:oracle`, `orm:typeorm:mssql`, `orm:typeorm:mongodb`, `orm:typeorm:sqljs`, `orm:typeorm:reactnative`, `orm:typeorm:expo` |
| Documentation           | `doc`         | `doc:swagger`, `doc:scalar`                                                                                                                                                                                                                                                                                                                |
| TypeGraphQL             | `graphql`     |                                                                                                                                                                                                                                                                                                                                            |
| Linter                  | `linter`      | `linter:eslint`, `linter:oxlint`, `linter:prettier`, `linter:oxfmt`, `linter:lintstaged`                                                                                                                                                                                                                                                   |
| OpenID Connect          | `oidc`        |                                                                                                                                                                                                                                                                                                                                            |
| Passport.js             | `passportjs`  | Express platform only                                                                                                                                                                                                                                                                                                                      |
| Socket.io               | `socketio`    |                                                                                                                                                                                                                                                                                                                                            |
| Testing                 | `testing`     | `testing:vitest`, `testing:jest` (unstable with ESM)                                                                                                                                                                                                                                                                                       |

Do not pass `swagger`, `jest`, `eslint`, `prettier` or `lintstaged` as bare values; they are rejected by schema validation.

## Other commands

Global options: `-r, --root-dir <path>` (project root), `--verbose`.

| Command                       | Arguments and flags                                                                                                            | Notes                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `tsed generate [type] [name]` | `--route <route>`, `-d, --directory <directory>`, `-t, --template-type <templateType>`, `-m, --middleware-position <position>` | Alias `g`. Prompts for anything missing.                                                                                             |
| `tsed template [name]`        | `--from <from>`, `--override`                                                                                                  | Writes `.templates/<name>.template.ts`; adds `@tsed/cli` to `devDependencies`.                                                       |
| `tsed add [name]`             |                                                                                                                                | Installs a CLI plugin as a dev dependency and runs its install hooks.                                                                |
| `tsed run <command>`          | `-p, --production`; unknown options are forwarded                                                                              | Runs `node --import @swc-node/register/esm-register src/bin/index.ts <command>`.                                                     |
| `tsed update`                 |                                                                                                                                | Interactive: picks a Ts.ED version and rewrites every `@tsed/*` dependency except `@tsed/cli*`, `@tsed/logger*` and `@tsed/barrels`. |
| `tsed init-options`           | `-i, --indent <indent>`                                                                                                        | Prints the init JSON schema.                                                                                                         |
| `tsed mcp`                    | `--http`                                                                                                                       | stdio by default; `--http` serves `POST /mcp` on `PORT` (default `3000`).                                                            |
| `tsed dev [entry]`            | `--watch`, `--no-watch`, `--watch=false`                                                                                       | Vite runtimes. Entry defaults to `src/index.ts`; needs `vite.config.ts`.                                                             |
| `tsed build`                  | arguments are forwarded to `vite build`                                                                                        | Vite runtimes; `vite` must be installed in the project.                                                                              |

## MCP surface

| Kind     | Name / URI            | Input                                 | Output (structured)                                                                  |
| -------- | --------------------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| tool     | `set-workspace`       | `cwd` (required)                      | `cwd`, `pkg`, `preferences`                                                          |
| tool     | `init-project`        | `cwd` (required) + init fields above  | `files`, `count`, `projectName`, `cwd`, `logs`, `warnings`                           |
| tool     | `list-templates`      | `search` (optional)                   | `items[]` with `id`, `label`, `description`, `required`, `properties`                |
| tool     | `get-template`        | `id` (required)                       | `id`, `label`, `description`, `schema`                                               |
| tool     | `generate-file`       | `id`, `name` (required), `properties` | `files`, `count`, `symbolPath`, `logs`, `warnings`                                   |
| resource | `tsed://project/info` |                                       | `cwd`, `pkg`, `isInitialized`, `preferences`                                         |
| resource | `tsed://init/options` |                                       | `instructions`, `schema`                                                             |
| resource | `tsed://server/info`  |                                       | `pid`, `serverCwd`, `projectCwd`, `tsedCliVersion`, `mcpSdkVersion`, `projectExists` |

Errors come back with `isError: true` and `structuredContent: {code, message, suggestion}`; codes are listed in the skill body.
