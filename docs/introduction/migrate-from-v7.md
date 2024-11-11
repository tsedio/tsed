---
meta:
  - name: description
    content: Migrate Ts.ED application from v7 to v8. Ts.ED is built on top of Express and uses TypeScript language.
  - name: keywords
    content: migration getting started ts.ed express typescript node.js javascript decorators mvc class models
---

# Migrate from v7 to v8

## What's new ?

The latest releases for Ts.ED on GitHub focus on improved dependency injection (DI), updated adapter configurations, and
enhanced logging. Notable features in recent pre-releases include better testing tools, support for Apollo 4, and the
removal of CommonJS support in favor of ECMAScript Modules. Additionally, some deprecated methods and packages were
removed or updated to align with new DI functions. For further details, you can view the full release notes here.

| Topics                                                                    | Migration note                        | Issue                                                                 |
| ------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------- |
| Access to injector instance everywhere                                    | [See](#injector-instance-everywhere)  | [#2812](https://github.com/tsedio/tsed/pull/2812)                     |
| `useDefineForClassFields` must be set to false                            | [See](#usedefineforclassfields)       | [#2814](https://github.com/tsedio/tsed/pull/2814)                     |
| Remove proxy on DI Configuration                                          | [See](#use-configuration-get-method)  | [beta.6](https://github.com/tsedio/tsed/releases/tag/v8.0.0-beta.6)   |
| Removal of CommonJS support                                               | [See](#switch-your-code-base-on-esm)  | [alpha.6](https://github.com/tsedio/tsed/releases/tag/v8.0.0-alpha.6) |
| Apollo Server v4 support                                                  | [See](/tutorials/graphql.html#apollo) | [#2493](https://github.com/tsedio/tsed/issues/2493)                   |
| Remove Configurable, Deprecated,Enumerable, ReadOnly, Writable decorators |                                       | [beta.6](https://github.com/tsedio/tsed/releases/tag/v8.0.0-beta.6)   |
| Remove auto import of `@tsed/platform-log-middleware`                     | [See](#request-logger-doesn-t-work)   |                                                                       |

### Injector instance everywhere

In v7, the injector service in only available in a DI context execution (in a controller, service, middleware, etc.).
If you need to access to the injector instance everywhere, you have to get the injector and store it into a global
variable during the bootstrap like this:

```ts
async function bootstrap() {
  try {
    const platform = await PlatformExpress.bootstrap(Server);
    // Store the injector instance
    global.injector = platform.injector;

    await platform.listen();

    process.on("SIGINT", () => {
      platform.stop();
    });
  } catch (error) {
    $log.error({event: "SERVER_BOOTSTRAP_ERROR", message: error.message, stack: error.stack});
  }
}

bootstrap();
```

But, this example isn't recommended because it's a global variable and the injector isn't available while the server
isn't bootstrapped. They may lead to unexpected behavior.

Ts.ED v8 solves this problem by creating the injector on the fly when you need it in your code. V8 provides new
utilities to get the injector instance:

```ts
import {injector, inject} from "@tsed/di";
import {MyService} from "./services/MyService.js";

const myService = injector().get(MyService);
// short version
const myService = inject(MyService);
```

With v7, your write your service using decorators like this:

```ts
import {Injectable, Configuration, Constant, Inject} from "@tsed/di";

@Injectable()
// @Scope(ProviderScope.SINGLETON) // or Scope.REQUEST or Scope.INSTANcE
export class MyService {
  @Configuration()
  private settings: PlatformConfiguration;

  @Constant("myConstant", "default")
  private myConstant: string;

  @Inject()
  private repository: MyReposity;

  constructor() {
    console.log(this.settings); // undefined available in v7 but defined in v8
    console.log(this.myConstant); // undefined available in v7 but defined in v8
    console.log(this.repository); // undefined available in v7 but defined in v8
  }

  $onInit() {
    console.log(this.settings); // defined
    console.log(this.myConstant); // defined
    console.log(this.repository); // defined
  }
}
```

This code will work in v8 without any changes. But now, you can also write your code like this:

```ts
import {injectable, inject, configuration, constant} from "@tsed/di";
import {MyRepository} from "./inject-model.js";
import {injector} from "./injector.js";

export class MyService {
  private settings = configuration();
  private myConstant = constant("myConstant", "default");
  private repository = inject(MyRepository);

  constructor() {
    console.log(this.settings);
    console.log(this.myConstant);
    console.log(this.repository);
  }
}

injectable(MyService); // .scope(Scope.SINGLETON) by default
```

::: tip
Note in this case, that the types of each property (settings, myConstant, repository) are automatically inferred from
the utility function used to declare them.
:::

For more details on the new v8 DI api see the [Provider page](/docs/providers).

## Prepare your migration

Some tasks can be done before starting the migration to v8. By doing these tasks, you will make the migration easier and
faster.

1. Update all Ts.ED dependencies to the latest v7 version.
2. [Set `useDefineForClassFields` to `false`](#usedefineforclassfields) in your `tsconfig.json` file, `.swcrc` if you
   use SWC and vitest + swc
   configuration.
3. [Use `configuration.get("prop")`](#use-configurationget-method) instead of `configuration.prop` to get a
   configuration value.
4. [Switch your code base on ESM module](#switch-your-code-base-on-esm). It's mandatory for v8.

### useDefineForClassFields

In v8, the `useDefineForClassFields` option must be set to `false` in your `tsconfig.json` file. This option is used to
enable or disable the ECMAScript class fields feature. This feature is used to define class properties directly in the
class body. This feature is not supported by Ts.ED v8.

```json
{
  "compilerOptions": {
    // Critical for Ts.ED v8 compatibility
    // Ensures proper behavior of class field definitions
    "useDefineForClassFields": false
  }
}
```

Additionally, you have to set this option to `false` in your `.swcrc` file:

```json
{
  "sourceMaps": "inline",
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true
    },
    "target": "es2022",
    "externalHelpers": true,
    "keepClassNames": true,
    "transform": {
      "useDefineForClassFields": false,
      "legacyDecorator": true,
      "decoratorMetadata": true
    }
  },
  "module": {
    "type": "es6"
  }
}
```

Additionally, you have to set this option to `false` in your `vite.config.ts` file:

```ts
export default defineConfig({
  plugins: [
    swc.vite({
      sourceMaps: "inline",
      jsc: {
        target: "es2022",
        externalHelpers: true,
        keepClassNames: true,
        parser: {
          syntax: "typescript",
          tsx: true,
          decorators: true,
          dynamicImport: true,
          importMeta: true,
          preserveAllComments: true
        },
        transform: {
          useDefineForClassFields: false, // add this line
          legacyDecorator: true,
          decoratorMetadata: true
        }
      },
      module: {
        type: "es6",
        strict: false,
        strictMode: true,
        lazy: false,
        noInterop: false
      },
      isModule: true
    })
  ]
});
```

### Use configuration.get method

In v8, the `configuration.get("prop")` method must be used to get a configuration value instead of `configuration.prop`.
The proxy feature was removed in v8 on DI Configuration.

You can already update your code in v7 to use this method:

```ts
import {Configuration} from "@tsed/di";

class MyService {
  constructor(settings: PlatformConfiguration) {
    console.log(settings.get<string>("prop")); // Works in v7 and v8
    console.log(settings.prop); // Works in v7 but not in v8
  }
}
```

## Switch your code base on ESM

In v8, Ts.ED only supports ECMAScript Modules (ESM). You have to switch your code base to ESM.
This task can be complicated depending on your project structure.

::: tip
v7 is already compatible with ESM, so you can start to switch your code base to ESM in v7.
:::

Here are some steps to help you to switch your code base to ESM.

### add `.js` extension in your imports statements.

If you use CommonJS modules, you have to add the `.js` extension in your import statements. For example:

```diff
- import {MyService} from "./services/MyService";
+ import {MyService} from "./services/MyService.js";

- import * as controllers from "./controllers";
+ import * as controllers from "./controllers/index.js";
```

If you use lodash for example, you have to replace `import {get} from "lodash";` by `import {get} from "lodash.js";`

Some module doesn't support ESM named import like `fs-extra`:

Replace:

```ts
import {readFile} from "fs-extra";
```

By:

```ts
import fs from "fs-extra";

fs.readFile();
```

Unfortunately, you have to check each module to see if it supports ESM named import.

#### json files

If you import json files, you have to replace:

```ts
import config from "./config.json";
```

By:

```ts
import config from "./config.json.js" assert {type: "json"};
```

::: warning
Assert syntax isn't compatible with CommonJS.
:::

Or use `node:fs` to read file.

#### Enable ESM

In your `package.json` file, you have to set the `type` field to `module`:

```json
{
  "type": "module"
}
```

Then update your `tsconfig.json` file to use ESM:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

Change the scripts runtime. For this step, We recommend you to use `nodemon` + `@swc-node/register` instead of `ts-node-dev` or `node-dev`.
There are some issues with `ts-node-dev` and `node-dev` with ESM.

Install the following packages:

::: code-group

```sh [npm]
npm install @swc-node/register @swc/core @swc/helpers
npm install --save-dev nodemon cross-env
```

```sh [yarn]
yarn add @swc-node/register @swc/core @swc/helpers
yarn add -D nodemon cross-env
```

```sh [pnpm]
pnpm add @swc-node/register @swc/core @swc/helpers
pnpm add -D nodemon cross-env
```

```sh [bun]
bun add @swc-node/register @swc/core @swc/helpers
bun add -D nodemon cross-env
```

:::

Then create `nodemon.json` file at the root of your project with the following content:

```json
{
  "extensions": ["ts"],
  "watch": ["src"],
  "ignore": ["**/*.spec.ts"],
  "delay": 100,
  "execMap": {
    "ts": "node --import @swc-node/register/esm-register"
  }
}
```

Create or edit `.swcrc` file settings:

```json
{
  "sourceMaps": "inline",
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true
    },
    "target": "es2022",
    "externalHelpers": true,
    "keepClassNames": true,
    "transform": {
      "useDefineForClassFields": false,
      "legacyDecorator": true,
      "decoratorMetadata": true
    }
  },
  "module": {
    "type": "es6"
  }
}
```

Edit the package.json:

```json
{
  "scripts": {
    "start": "npm run barrels && nodemon src/index.ts",
    "start:prod": "cross-env NODE_ENV=production node --import @swc-node/register/register-esm src/index.js"
  }
}
```

::: tip Note
This configuration use Node.js loader to convert TypeScript to JavaScript (e.g: `--import`). There is no need to compile your code
on disk before running it.

You can also keep loaders for production mode. We have some projects in this mode, it works well without any issues and performance loss.
DX is really improved with this configuration.

`--import` differs from `--require` because, it uses Node.js workers to transform code on the fly without polluting the global runtime scope,
while `--require` will load the typescript compiler in the global scope.

Don't forget to set `noEmit: true` in your `tsconfig.json` file if you don't want to emit file anymore.

:::

Now, you can run your application with `npm start` or `yarn start` and debug your code.

## Replace barrelsby by @tsed/barrels

If you use barrelsby to generate your barrels, you have to replace it by [`@tsed/barrels`](https://www.npmjs.com/package/@tsed/barrels).
Barrelsby doesn't support ESM code generation.

Install the following package:

```sh
npm install @tsed/barrels
```

Then update your `package.json` file:

```json
{
  "scripts": {
    "barrels": "barrels"
  }
}
```

::: tip
`@tsed/barrels` support barrelsby configuration file. You don't have to change your configuration file.
:::

## Update dependencies to v8

Your code base works on v7 with ESM. Now, you can update your dependencies to v8. You can update all dependencies at once to v8 and `@tsed/cli-*` to v6.

```diff
{
    "dependencies": {
-       "@tsed/common": "^7.0.0",
+       "@tsed/common": "^8.0.0",
    },
    "devDependencies": {
-       "@tsed/cli": "^5.0.0",
+       "@tsed/cli": "^6.1.0",
    }
}
```

Start your application and check if everything works as expected.

## Request logger doesn't work

In v8, `@tsed/platform-log-middleware` isn't automatically imported. You have to import it manually in your `Server.ts` file.

```shell
import {PlatformLogMiddleware} from "@tsed/platform-log-middleware";

@Configuration({
   middlewares: [
      PlatformLogMiddleware
   ]
})
export class Server {
}
```

Or you can use the new optimized `@tsed/platform-log-request`. This module, doesn't use middleware to work.
it supports WWW platform (common) and Serverless platform. It provides new options which gives you control over the logger information and better customization depending on the log level.
It's a little more powerful than the old module, and it's lighter in terms of code.

Installation steps:

1. Uninstall `@tsed/platform-log-middleware`
2. Install `@tsed/platform-log-request`
3. Import `@tsed/platform-log-request` in your `Server.ts` file.

In your server.ts:

```ts
import "@tsed/platform-log-request"; // just add this line

@Configuration({
   logger: {
      logRequest: true
      /**
       * A function to alter the log object before it's logged.
       * @optional
       */
      // alterLog: (level, data, $ctx) => {
      //   /// see example above
      // },
      /**
       * A function to alter the log object before it's logged.
       * @optional
       */
      // onLogEnd? : ($ctx: BaseContext) => void;
   }
})
```

Example of `alterLog` function:

```ts
function alterLog(level: string, data: Record<string, unknown>, $ctx: PlatformContext) {
  switch (level) {
    case "info":
      return {
        ...data,
        // add you extra data
        tenant_id: $ctx.request.params.tenant_id
      };
  }

  return data;
}
```

This code example will add the `tenant_id` to the log object when the log level is `info`.

## Optimization

V8 comes with numerous optimizations to reduce the code size. But to not break your code, we have to keep some features through the `@tsed/common` package.

To enable these optimizations, you have to replace `@tsed/common` by `@tsed/platform-http`.

Here the list of optimization of `@tsed/platform-http`:

- PlatformTest can be imported from `@tsed/platform-http/testing` instead of `@tsed/common`.
  - It means that you have to replace `import {PlatformTest} from "@tsed/common"` by `import {PlatformTest} from "@tsed/platform-http/testing"`.
  - PlatformTest isn't embedded in the production runtime anymore.
- doesn't re-export all classes/decorators from
  - `@tsed/schema`
  - `@tsed/di`
  - `@tsed/platform-exceptions`,
  - `@tsed/platform-middlewares`,
  - `@tsed/platform-params`,
  - `@tsed/platform-response-filter`,
  - `@tsed/platform-router`
  - `@tsed/logger`
- doesn't import `@tsed/logger-file`

Basically, `@tsed/common` package is just this file now:

```ts
import "@tsed/logger";
import "@tsed/logger-file";

export * from "@tsed/di";
export {$log, Logger} from "@tsed/logger";
export * from "@tsed/platform-exceptions";
export * from "@tsed/platform-http";
export * from "@tsed/platform-http/testing";
export * from "@tsed/platform-middlewares";
export * from "@tsed/platform-params";
export * from "@tsed/platform-response-filter";
export * from "@tsed/platform-router";
export {AcceptMime, All, Delete, Get, Head, Location, Options, Patch, Post, Put, Redirect, View} from "@tsed/schema";
```

It means when you'll replace `@tsed/common` by `@tsed/platform-http`, you have to import the missing classes/decorators from the right package!

Installation:

::: code-group

```sh [npm]
npm uninstall @tsed/common
npm install @tsed/platform-http
```

```sh [yarn]
yarn remove @tsed/common
yarn add @tsed/platform-http
```

```sh [pnpm]
pnpm remove @tsed/common
pnpm add @tsed/platform-http
```

```sh [bun]
bun remove @tsed/common
bun add @tsed/platform-http
```

:::

That alls! You code base is now optimized for v8.
