---
prev: /docs/configuration.md
next: /docs/controllers.html
otherTopics: true
meta:
  - name: description
    content: Migrate Ts.ED application from v6 to v7. Ts.ED is built on top of Express and uses TypeScript language.
  - name: keywords
    content: migration getting started ts.ed express typescript node.js javascript decorators mvc class models
---

# Migrate from v6

## What's new ?

| Topics                                                                      | Migration note                                    | Issue                                               |
| --------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------- | --- |
| Use virtual router instead of Express or Koa router                         | [See](#virtual-router)                            | [#1987](https://github.com/tsedio/tsed/pull/1987)   |
| Remove componentsScan options and any glob pattern to discover services     | [See](#components-scan)                           |                                                     |
| Use [@tsed/engines](/docs/templating.md) instead of Consolidate             | [See](#template-engines)                          |                                                     |
| Remove possibility to register twice handler with the same path + http verb | [See](#register-twice-handler-for-the-same-route) | [#1793](https://github.com/tsedio/tsed/issues/1793) |     |
| Remove `ConverterService`                                                   | [See]()                                           |                                                     |
| Remove `export * from @tsed/platform-cache` in `@tsed/common`               | [See]()                                           | [#1657](https://github.com/tsedio/tsed/pull/1657)   |
| Remove `@tsed/async_hook_pa`                                                | [See]()                                           | [#1860](https://github.com/tsedio/tsed/pull/1860)   |
| OIDC: use `/oidc` basePath by default                                       |                                                   | [#1490](https://github.com/tsedio/tsed/pull/1490)   |
| Remove deprecated code/decorators/functions in v6                           | [See]()                                           |                                                     |

## Workflow to migrate your app

<figure><img src="/getting-started/migration-workflow.png" style="padding: 20px; background: white;" alt="migration guide"></figure>

This graph will help you to migrate your application to the v7. Don't hesitate to give us feedback!

## Virtual router

Ts.ED replace the Express.Router and Koa.Router by his own Router. In most cases this will be transparent to you as you are using the Ts.ED controllers and Platform API.

### Why ?

This change will make it easier to integrate other frameworks like fastify and Hapi that don't have a nested router.

With Express you can create nested routers to compose your routes. What could be practical in a pure Express Application. With Ts.ED the use is limited or even transparent.

Hapi and Fastify only support a list of routes with full paths.

In fact, it is much simpler for Ts.ED to generate this list of flat routes and then map the routes/handlers to the target framework rather than managing each framework's nested routers! (Koa router is a real nightmare).

### Potential issue

There is a scenario where you may run into problems if you inject PlatformRouter into your controller to dynamically create your routes.

Here is the example:

```typescript
import {PlatformRouter} from "@tsed/platform-router"; // in v6 import {PlatformRouter} from "@tsed/common";
import {Controller} from "@tsed/di";

@Controller("/calendars")
export class CalendarCtrl {
  constructor(router: PlatformRouter) {
    router.get("/", this.myMethod.bind(this));

    // GET raw router (Express.Router or Koa.Router)
    console.log(router.callback()); // v7 removed
    console.log(router.getRouter()); // removed
    console.log(router.raw); // return PlatformRouter itself intead Express.Router
  }

  myMethod(req: any, res: any, next: any) {}
}
```

## Components scan

ComponentsScan is an option to import services using a glob pattern. It's pretty useful when you start new application.

But this option can cause some issues or misunderstood:

- When you change a location for a Controller/Service/Modules, the code isn't discovered as expected. It's normal, the server have default configuration like `**/services/**/*.ts`. if the code is outside of this pattern, the won't be loaded.
- Performance issue. The global pattern have a huge impact on the server bootstrap!
- Isn't compatible with Webpack or any bundler because the code imported dynamically.
- Importing dynamically code using glob pattern in production may be a breach exploitable by hackers to inject code.

This is why I decided to replace the componentsScan by another tools named `barrelsby`. The latest CLI version install barrelsby on fresh project. This tool use globpattern to generate an index files (barrel file) with all controllers. This tool isn't invoked a the runtime but before when you build the code or you invoke the NPM script to generates barrels.

It's maybe less magical, but it solves all previous described issues encountered with the `componentsScan`.

You can try this tool by generate a project with `tsed init .`. In the new project you'll have a new NPM task `barrels`
to generate barrels files. You can customize easily the barrelsby configuration to generate multiple barrels file at different levels of your project!

Here is the main points about barrelsby usage in a Ts.ED project:

```json
{
  "scripts": {
    "build": "yarn run barrels && yarn run tsc --project tsconfig.compile.json",
    "barrels": "barrelsby --config .barrelsby.json",
    "start": "yarn run barrels && tsnd --inspect --ignore-watch node_modules --respawn --transpile-only -r tsconfig-paths/register src/index.ts"
  }
}
```

**.barrelsby.json**

```json
{
  "directory": ["./src/controllers/rest"],
  "exclude": ["__mock__", "__mocks__", ".spec.ts"],
  "delete": true
}
```

This configuration generate index.ts file with the following contents:

```typescript
/**
 * @file Automatically generated by barrelsby.
 */

export * from "./HelloWorldController";
export * from "./UserController";
```

And we can use it as following:

```typescript
import * as rest from "./controllers/rest";

@Configuration({
  mount: {
    "/rest": [
      ...Object.values(rest)
    ]
  }
})
```

### Known issue with barrelsby

Actually, Barrelsby doesn't support ESM module. But an issue is already opened [here](https://github.com/bencoveney/barrelsby/issues/178) to support it!

### Keep the componentsScan

To facilitate your migration, you can install the `@tsed/components-scan` module. This module does exactly the same as what you have in v6

Here is the right way to use the `componentsScan` since v6.104.0:

```typescript
import {$log} from "@tsed/common";
import {importProviders} from "@tsed/components-scan";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";

async function bootstrap() {
  try {
    const scannedProviders = await importProviders({
      mount: {
        "/rest": ["**/controllers/**/*.ts"]
      },
      imports: ["**/services/**/*.ts", "**/protocols/**/*.ts"]
    });

    const platform = await PlatformExpress.bootstrap(Server, {
      ...scannedProviders
    });

    await platform.listen();

    process.on("SIGINT", () => {
      platform.stop();
    });
  } catch (error) {
    $log.error({event: "SERVER_BOOTSTRAP_ERROR", error});
  }
}

bootstrap();
```

## Template Engines

Consolidate is a perfect wrapper to support multiples engines, but It doesn't provide API to adding new Engines. And the package is no longer actively maintained.

Ts.ED Engines provide a set of engines and let you use decorators to implement your custom engine:

```typescript
import {Engine, ViewEngine} from "@tsed/engines";

@ViewEngine("pug", {
  requires: ["pug", "then-pug"] // multiple require is possible. Ts.ED will use the first module resolved from node_modules
})
export class PugEngine extends Engine {
  protected $compile(template: string, options: any) {
    return this.engine.compile(template, options);
  }

  protected async $compileFile(file: string, options: any) {
    return this.engine.compileFile(file, options);
  }
}
```

By this way, you'll be able to use it with Ts.ED (server or CLI) to compile and render your template.

For example, Ts.ED engines support Vite as View engine!! [See more here](https://github.com/tsedio/tsed-example-vite).

Ts.ED engines is already integrated to v6. You can now switch your project to this library and open issues if you have any problems.

For more details about engine configuration with Ts.ED, see our dedicated [page](/docs/templating.md).

## Register twice handler for the same route

One of the possibilities given by express.js is to be able to register two routes for the same http path and verb.

For example, you can do that:

```typescript
app.get("/mypath", myHandler1);
app.get("/mypath", myHandler2);
```

Ts.ED allowed to do the same thing with controllers in v6:

```typescript
@Controller("/")
class MyController {
  @Get("/mypath")
  getA() {}

  @Get("/mypath")
  getB() {}
}
```

But this principle leads to unexpected behavior and causes a regression when using an Error type middleware with UseAfter. This problem is reported in the [#1793](https://github.com/tsedio/tsed/issues/1793).

With v7, adding more handlers for the same path and http verb is no longer possible. Also this behavior is specific to Express and Koa but doesn't seem to be possible with Fastify and Hapi.js.

## ConverterService

The ConverterService finally bows out and gives way to its functional version widely used in v6. The migration is quite simple:

Before:

```typescript
import {ConverterService} from "@tsed/common";
import {Inject, Injectable} from "@tsed/di";

@Injectable()
class MyClass {
  @Inject()
  mapper: ConverterService;

  doSomething1(client: Client): any {
    return this.mapper.serialize(client, {type: Client});
  }

  doSomething2(client: any): Client {
    return this.mapper.deserialize(client, {type: Client});
  }
}
```

After (v6/v7):

```typescript
import {serialize, deserialize} from "@tsed/json-mapper";
import {Inject, Injectable} from "@tsed/di";

@Injectable()
class MyClass {
  doSomething1(client: Client): any {
    return serialize(client, {type: Client});
  }

  doSomething2(client: any): Client {
    return deserialize(client, {type: Client});
  }
}
```
