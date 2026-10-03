---
name: tsed-migration
description: Migrates an application to Ts.ED v8 from v7, with pointers for v6 and plain Express apps. Covers the ESM switch (type module, NodeNext, .js extensions, @tsed/barrels), useDefineForClassFields false, removal of settings.prop proxy access, replacing @tsed/common imports, deprecated DI APIs (registerProvider, injector.getProvider, PlatformTest.inject) and Jest to Vitest. Use when package.json has @tsed/* 6.x or 7.x or @tsed/common, on ERR_REQUIRE_ESM, ERR_MODULE_NOT_FOUND, "has no exported member" from @tsed/common, undefined injected properties, or a request to upgrade Ts.ED.
---

# Migrate to Ts.ED v8

Migrate in small, verifiable steps. v7 already supports ESM, `useDefineForClassFields: false` and `settings.get()`, so do all preparation on v7, verify, and only then bump to v8.

References, loaded on demand:

- [`@tsed/common` symbol → owning package](references/common-symbols.md)
- [Deprecated and removed APIs with replacements](references/deprecated-apis.md)

Live guide: `https://tsed.dev/introduction/migrate-from-v7.md` and `https://tsed.dev/introduction/what-is-news-v8.md`.

## 1. Assess

1. Read `package.json`: the `@tsed/*` major, the `type` field, the test runner, the dev runner (`ts-node`, `ts-node-dev`, `tsx`, SWC), `barrelsby`.
2. Read `tsconfig.json`, `.swcrc`, `vite.config.ts` / `vitest.config.ts`, `jest.config.*`.
3. Pick the path:

| Starting point    | Path                                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| v7                | Sections 2 to 7                                                                                                 |
| v6                | First reach the latest v7 with `https://tsed.dev/introduction/migrate-from-v6.md`, verify, then sections 2 to 7 |
| v5 or older       | Do not upgrade in place. Scaffold a v8 project with the `tsed-cli` skill and port code feature by feature       |
| Plain Express app | Section 8                                                                                                       |

4. Confirm Node.js >= 20.11.0 (>= 22 when the Ts.ED CLI v7 is used).
5. Require a clean git tree and a passing test suite before starting. Commit after each section.

Do not bump `@tsed/*` to 8.x before sections 2 to 4 pass on v7.

## 2. Prepare on v7: compiler and configuration access

1. Update every `@tsed/*` package to the latest 7.x.
2. Set `useDefineForClassFields: false` in every transpiler configuration that exists:
   - `tsconfig.json` → `compilerOptions.useDefineForClassFields`
   - `.swcrc` and SWC options in `vite.config.ts` / `vitest.config.ts` → `jsc.transform.useDefineForClassFields`
   - Keep `legacyDecorator: true` and `decoratorMetadata: true` (SWC), `experimentalDecorators` and `emitDecoratorMetadata` (tsc).
3. Replace proxy access on the configuration object. v8 removes it:

```ts
import {Configuration, Injectable} from "@tsed/di";

@Injectable()
export class MyService {
  constructor(@Configuration() private settings: Configuration) {
    settings.get<string>("myOption"); // v7 and v8
    // settings.myOption             // v7 only, undefined in v8
  }
}
```

4. Find candidates: search for `settings.`, `configuration.` and `this.settings.` followed by a custom key. Built-in accessors (`rootDir`, `env`, `imports`, `routes`, `mount`, `logger`, `debug`, `version`) keep working; anything else must use `.get("key")`, `constant("key")` or `@Constant("key")`.

## 3. Prepare on v7: switch to ESM

1. `package.json`: set `"type": "module"`.
2. `tsconfig.json`: `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`, `"target": "esnext"`.
3. Add `.js` to every relative import and export, and `/index.js` to directory imports:

```ts
import {ProductsService} from "./services/ProductsService.js";
import * as rest from "./controllers/rest/index.js";
```

4. Fix deep CommonJS imports (`lodash/get` → `lodash/get.js`) and named imports from CommonJS-only packages (`import fs from "fs-extra"`).
5. Replace `__dirname` / `__filename` with `import.meta.dirname` / `import.meta.filename`, and `require()` with `import`.
6. JSON: `import config from "./config.json" with {type: "json"}`, or read the file with `node:fs`.
7. Replace `barrelsby` with `@tsed/barrels` (binary `barrels`, configuration `.barrels.json`); the barrelsby configuration format is accepted.
8. Replace `ts-node` / `ts-node-dev` with SWC: install `@swc-node/register @swc/core @swc/helpers`, run with `node --import @swc-node/register/esm-register src/index.ts`, and add `nodemon` for watch mode. Details: `https://tsed.dev/introduction/migrate-from-v7.md`.

Do not mix `require` and `import` to work around a failing import; fix the import form.

## 4. Verify on v7

```sh
npx tsc --noEmit
grep -rnE "from \"\.{1,2}/[^\"]*\"" src | grep -vE "\.(js|json)\""   # must print nothing
npm test
npm start    # boot, hit one route, stop
```

Stop and fix before continuing. A failure here is not a v8 problem.

## 5. Bump to v8

1. Set every `@tsed/*` runtime package to the same 8.x version. Do not align `@tsed/logger*`, `@tsed/barrels` or `@tsed/cli*`; they are versioned separately.
2. Install and boot. `@tsed/common` 8.x still exists as a compatibility barrel, so the application should start before step 6.
3. Apply the v8 behaviour changes:
   - Request logging is no longer automatic. Add `import "@tsed/platform-log-request";` in `Server.ts` and set `logger: {logRequest: true}`. `PlatformLogMiddleware` from `@tsed/platform-log-middleware` is deprecated.
   - View engines must be imported explicitly, for example `import "@tsed/engines/PugEngine.js";`.
   - `Configurable`, `Enumerable`, `Writable` and the `@tsed/core` versions of `ReadOnly` and `Deprecated` are removed.
   - Hooks moved to `@tsed/hooks` (`$on`, `$asyncEmit`, `$alter`, `$asyncAlter`).
4. Re-run section 4 commands.

## 6. Remove `@tsed/common`

1. List usages: `grep -rn "@tsed/common" src test`.
2. Rewrite each import with [the symbol table](references/common-symbols.md). Typical split:

```ts
// before: import {BodyParams, Controller, Post, Req, UseBefore, PlatformTest} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Req} from "@tsed/platform-http";
import {UseBefore} from "@tsed/platform-middlewares";
import {BodyParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";
// tests only
import {PlatformTest} from "@tsed/platform-http/testing";
```

3. Add each owning package to `dependencies`, then remove `@tsed/common`.
4. `@tsed/common` imported `@tsed/logger-file` as a side effect. If file appenders are used, add `import "@tsed/logger-file";` explicitly.
5. Resolve remaining deprecations with [the replacement table](references/deprecated-apis.md). Adopt the functional DI API only where it simplifies code; decorators remain supported. See the `tsed-di` skill.

Do not import `PlatformTest` from `@tsed/platform-http` in application code; it lives in `@tsed/platform-http/testing`.

## 7. Tests: Jest to Vitest

Jest is unstable with ESM. Migrate when the suite fails after section 3.

1. Install `vitest unplugin-swc @swc/core @vitest/coverage-v8`; create `vitest.config.ts` from `https://tsed.dev/tutorials/vitest.md` (SWC plugin with `useDefineForClassFields: false`).
2. Replace `jest.fn`, `jest.spyOn`, `jest.mock` with `vi.fn`, `vi.spyOn`, `vi.mock` (import `vi` from `vitest` unless `globals: true`).
3. Replace `PlatformTest.inject([...], fn)` with `PlatformTest.invoke(Token)` or `PlatformTest.get(Token)`.
4. Use the `tsed-testing` skill for test structure and the `tsed-cli` skill to add `@tsed/cli-plugin-vitest`.

## 8. Plain Express application

1. Move the legacy code to `src/legacy/` and make sure `src/index.ts` does not exist.
2. Scaffold over the existing `package.json` with the `tsed-cli` skill (`tsed init .`, platform `express`); rename conflicting scripts first.
3. Export the legacy `express.Router()` and mount it in `@Configuration`: `middlewares: [{use: expressRouter, hook: "$beforeRoutesInit"}]`, so existing routes keep working.
4. In legacy handlers, reach Ts.ED services with `inject(MyService)` from `@tsed/di`.
5. Port routes to controllers incrementally (`tsed-controllers`, `tsed-middlewares`). Guide: `https://tsed.dev/introduction/migrate-from-express.md`.

## Pitfalls

- Injected properties are `undefined` in constructors or at runtime: `useDefineForClassFields` is still `true` in one of `tsconfig.json`, `.swcrc`, `vite.config.ts`, `vitest.config.ts`.
- `ERR_MODULE_NOT_FOUND` on a relative path: missing `.js` extension or a directory import without `/index.js`.
- `ERR_REQUIRE_ESM`: a CommonJS entry point or loader (`ts-node`, `--require`) is still in use. Use `--import`.
- `Module '"@tsed/common"' has no exported member 'Returns'` (or `Property`, `Required`): in v8 the barrel re-exports only the routing decorators of `@tsed/schema`. Import from `@tsed/schema`.
- Request logs disappeared after the bump: `@tsed/platform-log-request` is not imported.
- The migration guide shows `import ... from "./config.json.js" assert {type: "json"}` and `@swc-node/register/register-esm`. Use `./config.json` with `with {type: "json"}` and `@swc-node/register/esm-register`.
- Controllers discovered through barrels silently vanish when `barrels` is not run before start. Keep `"barrels": "barrels"` in the start script chain.

## Checklist

- Sections 2 to 4 verified on v7 before the v8 bump.
- `"type": "module"`, `NodeNext`, `.js` extensions everywhere, no `require`, no `__dirname`.
- `useDefineForClassFields: false` in every transpiler configuration.
- No custom key read through `settings.<key>`.
- All `@tsed/*` runtime packages on the same 8.x version; `@tsed/common` removed and no import of it left.
- `@tsed/platform-log-request` and view engines imported explicitly where needed.
- `npx tsc --noEmit`, the test suite and a manual boot all pass.
