---
name: tsed-cli
description: Scaffolds Ts.ED v8 projects and generates files with the Ts.ED CLI v7, through its MCP server (tools set-workspace, init-project, list-templates, get-template, generate-file) or the tsed binary (tsed init, generate, template, add, run, update, dev, build). Use when creating a Ts.ED project, adding a controller, service, middleware, model, interceptor, pipe, decorator or custom template, when package.json has a "tsed" key or @tsed/cli, when a .templates/ directory exists, or on errors E_CWD_NOT_SET, E_PROJECT_NOT_INITIALIZED, E_TEMPLATE_UNKNOWN, E_ARGS_INVALID.
---

# Scaffold and generate with the Ts.ED CLI

Generate boilerplate with the CLI so file names, directories and class names match the project preferences. Hand-write a file only when no template fits.

References, loaded on demand:

- [Template ids, output paths and extra properties](references/templates.md)
- [Init options, feature values and command flags](references/init-options.md)

## 1. Read the project preferences first

Preferences live under the `tsed` key of the application's `package.json`, for example `"tsed": {"convention": "conv_default", "architecture": "arc_default", "platform": "express", "runtime": "node", "packageManager": "npm"}`.

| Key              | Values                                                | Effect                                                               |
| ---------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| `convention`     | `conv_default`, `angular`                             | File name: `ProductController.ts` vs `product.controller.ts`         |
| `architecture`   | `arc_default`, `feature`                              | `src/controllers/...` vs a folder taken from the name (`users/User`) |
| `platform`       | `express`, `koa`, `fastify`                           | Adapter package to import                                            |
| `runtime`        | `node`, `vite`, `bun`, `bun-vite`, `babel`, `webpack` | Dev/build scripts                                                    |
| `packageManager` | `npm`, `yarn`, `yarn_berry`, `pnpm`, `bun`            | Install command                                                      |

1. Read these values before creating or renaming any file, even by hand.
2. The exported class name is PascalCase with the type suffix in both conventions (`ProductController`); only the file name changes.
3. A missing `tsed.packageManager` means the project is not initialized for the CLI. Do not generate; go to section 3 or ask the user.
4. Use the project's package manager for every install or script command.

## 2. Choose the channel

1. If an MCP server named `tsed` is connected (tools `set-workspace`, `generate-file`, ...), use section 3.
2. Otherwise use the shell (section 4). Prefer the locally installed binary: `npx tsed ...` inside a project that has `@tsed/cli` in `devDependencies`.
3. To offer the MCP server to the user, give this exact declaration. Node.js >= 22 is required.

```json
{
  "mcpServers": {
    "tsed": {
      "command": "npx",
      "args": ["-y", "-p", "@tsed/cli", "tsed", "mcp"]
    }
  }
}
```

- stdio is the default transport. `tsed mcp --http` serves streamable HTTP on `POST /mcp`, port `PORT` (default `3000`).
- Do not write `npx -y @tsed/cli mcp`: it fails on a first install because the package name is not the binary name.
- Do not reference a `tsed-mcp` binary. It does not exist.

## 3. MCP flow

1. Call `set-workspace` with `{cwd}` (absolute path preferred). It resolves the nearest `package.json` and returns `cwd`, `pkg` and `preferences`.
2. Read resource `tsed://project/info` and check `isInitialized`. `preferences` there omits `architecture`; read it from `pkg.tsed.architecture`.
3. Not initialized, new project wanted:
   1. Read resource `tsed://init/options` (`instructions` plus the JSON `schema`).
   2. Ask the user for platform, architecture, convention, features, runtime and package manager. Show labels, send enum values.
   3. Call `init-project` with `{cwd, platform, architecture, convention, features, runtime, packageManager, projectName?, tsedVersion?}`.
4. Initialized, new file wanted:
   1. `list-templates` with an optional `{search}` to find the template id.
   2. `get-template` with `{id}` to read the extra properties schema.
   3. `generate-file` with `{id, name, properties}`. Example: `{"id": "controller", "name": "Product", "properties": {"route": "/products", "directory": "rest"}}`.
   4. Read `files` and `symbolPath` from the result, then edit the generated file.
5. Resource `tsed://server/info` reports the CLI version and whether the workspace is a project; use it for diagnostics.

| Error code                      | Returned by                     | Fix                                                                   |
| ------------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| `E_CWD_NOT_FOUND`               | `set-workspace`                 | Confirm the folder with the user, then `init-project` with that `cwd` |
| `E_CWD_NOT_SET`                 | `generate-file`                 | Call `set-workspace` first                                            |
| `E_PROJECT_NOT_INITIALIZED`     | `generate-file`                 | Wrong workspace, or run `init-project`                                |
| `E_PROJECT_ALREADY_INITIALIZED` | `init-project`                  | Use `generate-file`, or pick another folder                           |
| `E_TEMPLATE_UNKNOWN`            | `get-template`, `generate-file` | Take the id from `list-templates`                                     |
| `E_ARGS_INVALID`                | `generate-file`                 | Re-read `get-template`; fix `properties` (`details.errors`)           |

Do not call `init-project` without the user's choices. Do not retry a failed tool call with the same arguments.

## 4. Shell fallback

Global options on every command: `-r, --root-dir <path>`, `--verbose`. Run commands non-interactively; an agent cannot answer prompts.

```sh
# New project (asks nothing with --skip-prompt)
npx -p @tsed/cli tsed init my-api --skip-prompt --platform express --arch arc_default \
  --convention conv_default --runtime node --package-manager npm \
  --features doc doc:swagger testing testing:vitest linter linter:oxlint

# Generate: tsed generate|g [type] [name]
npx tsed g controller Product --route /products --directory rest
npx tsed g middleware Auth --middleware-position before
npx tsed g decorator Roles --template-type endpoint

npx tsed template my-template --from new  # scaffold .templates/my-template.template.ts
npx tsed add @tsed/cli-plugin-prisma # install a CLI plugin
npx tsed run <command>               # run a command from src/bin/index.ts
npx tsed update                      # interactive version picker
npx tsed dev                         # Vite runtimes only: watch src/index.ts
npx tsed build                       # Vite runtimes only: vite build
```

1. Pass both `type` and `name`, plus the template's options, or `generate` opens a prompt.
2. `tsed update` always prompts for the target version. Ask the user to run it, or edit the `@tsed/*` versions in `package.json` and install.
3. `tsed dev` and `tsed build` exist only for the `vite` and `bun-vite` runtimes and need `vite.config.ts`. For other runtimes use the `package.json` scripts written by `tsed init`.
4. `tsed init-options` prints the init JSON schema; use it when the feature list in the reference may be outdated.

## 5. Custom templates

1. Scaffold with `tsed template <name> --from new` (without `--from` the command prompts). The file lands in `.templates/<name>.template.ts`.
2. Every `.ts` file under `.templates/` is loaded at startup; a custom template replaces a built-in one with the same `id` and is labelled `(custom)`.
3. Shape:

```ts
import {defineTemplate} from "@tsed/cli";
import {s} from "@tsed/schema";

export default defineTemplate({
  id: "use-case",
  label: "Use case",
  description: "Create an application use case in src/use-cases.",
  fileName: "{{symbolName}}.use-case",
  outputDir: "{{srcDir}}/use-cases",
  schema: s.object({entity: s.string().description("Entity handled by the use case")}),
  render(symbolName, context) {
    return `import {Injectable} from "@tsed/di";\n\n@Injectable()\nexport class ${symbolName} {}\n`;
  }
});
```

4. Options: `id`, `label`, `outputDir` and `render` are required; `description`, `fileName`, `ext` (default `ts`, `null` for none), `hidden`, `preserveCase`, `preserveDirectory`, `schema`, `prompts`, `hooks`, `type` are optional. `render()` returns the file content, or `undefined` to skip the file.
5. `schema` is what `get-template` returns and what `generate-file` validates `properties` against. Always declare it for templates used by agents.
6. Check for an existing `.templates/` directory before generating: the project may override `controller`, `service`, etc.

Depth: `https://cli.tsed.dev/llms.txt`.

## Pitfalls

- The CLI docs show `tsed generate service --name Logger` and `tsed generate template`. Both are wrong: the name is the second positional argument, and the command is `tsed template`.
- `--features` is variadic: separate values with spaces, and use full values (`doc:swagger`, `orm:prisma`), not `swagger` or `prisma`.
- `list-templates` returns every visible template when `search` matches nothing. Check the returned ids instead of assuming a match.
- Hidden templates (project files such as `server`, `vitest.config`) are not listed but are accepted by `get-template` and `generate-file`. Do not regenerate them in an existing project.
- A `name` equal to `prisma` forces the `prisma.service` template.
- With `architecture: "feature"`, the base directory (`controllers`, `services`) is dropped; put the feature folder in the name: `users/User`.
- `passportjs` is offered only when the platform is `express`.
- Generated code is a starting point. Read the sibling skill for the file type (`tsed-controllers`, `tsed-di`, `tsed-middlewares`, `tsed-models`, `tsed-exceptions`, `tsed-testing`) before filling it in.

## Checklist

- `package.json` `tsed` preferences read before any file was created.
- Generator used (MCP `generate-file` or `tsed generate`) for every file type that has a template.
- Init options confirmed by the user before `init-project` or `tsed init`.
- Generated paths taken from the tool output, not assumed.
- MCP declaration, if suggested, uses `npx -y -p @tsed/cli tsed mcp`.
- No interactive command left waiting for input.
