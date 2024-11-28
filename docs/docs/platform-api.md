# Platform API

Ts.ED uses now the Platform API to create an application. Platform API gives an abstraction layer between your code written with Ts.ED and the [Express.js](https://expressjs.com/fr/) code.
It means that a large part of your code isn't coupled with Express.js itself and can be used with another Platform like [Koa.js](https://koajs.com/).

There are some changes between ServerLoader API (v4/v5) and Platform API (v5.56.0+/v6), to get the original Express Application, Request or Response.
This page will describe how you can get these instances with the new API.

## Platform classes

### Abstraction

<ApiList query="status.includes('platform') && ['@tsed/common', '@tsed/platform-views', '@tsed/platform-params', '@tsed/platform-response-filter', '@tsed/platform-exceptions'].includes(module)" />

### Express.js

<ApiList query="status.includes('platform') && module.includes('@tsed/platform-express')" />

### Koa.js

<ApiList query="status.includes('platform') && module.includes('@tsed/platform-koa')" />

### Serverless

<ApiList query="status.includes('platform') && module.includes('@tsed/platform-serverless')" />

## Create application

The way to create a Ts.ED application, add [middlewares](/docs/middlewares.html), configure Express or Koa, are all impacted by the new Platform API.

Here is the common way to configure a server using the Platform API:

```typescript
import {Configuration, Constant} from "@tsed/di";
import {MyMiddleware} from "./MyMiddleware.js";

@Configuration({
  views: {
    root: `${process.cwd()}/views`,
    viewEngine: "ejs"
  },
  middlewares: [MyMiddleware, "cookie-parser", "compression", "method-override"]
})
export class Server {
  @Constant("viewsDir")
  viewsDir: string;

  $beforeRoutesInit() {
    console.log(this.viewsDir);
  }
}
```

We can see that the middlewares and views are configured through the `@Configuration` decorator.

With Platform API, the Server class is considered as a @@Provider@@.
It means that you can use decorators like @@Constant@@ and @@Inject@@ to get any configuration, provider or service from the DI registry.
Also, there decorators can be used in any Service or Injectable class.

By this way, we can decouple the configuration from the code and make it more testable and more adaptable to different frameworks (Express, Koa, etc...).

## Bootstrap application

Ts.ED need a Platform Adapter to work. It means that you have to install `@tsed/platform-express` (or `@tsed/platform-koa`) and
import the adapter to the `index.ts` or `server.ts`:

::: code-group

```typescript [Express.js]
import {$log} from "@tsed/logger";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./server";

async function bootstrap() {
  try {
    $log.debug("Start server...");
    const platform = await PlatformExpress.bootstrap(Server, {
      // extra settings
    });

    await platform.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
```

```typescript [Koa.js]
import {$log} from "@tsed/logger";
import {PlatformKoa} from "@tsed/platform-koa";
import {Server} from "./server";

async function bootstrap() {
  try {
    $log.debug("Start server...");
    const platform = await PlatformKoa.bootstrap(Server, {
      // extra settings
    });

    await platform.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
```

:::

## Get Application

To get the framework application instance (Express.js, Koa.js), you have to inject @@PlatformApplication@@ and use `app.getApp()` to get the `Express.Application`:

::: code-group

```typescript [Decorators]
import {Injectable, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import {MyMiddleware} from "../middlewares/MyMiddleware";

@Injectable()
class MyService {
  @Inject()
  protected app: PlatformApplication<Express.Application>;

  $onInit() {
    // With Platform API, it is also possible to adding middlewares with a service, module, etc...
    this.app.use(MyMiddleware);
  }
}
```

```typescript [Functional API]
import {injectable} from "@tsed/di";
import {application} from "@tsed/platform-http";
import {MyMiddleware} from "../middlewares/MyMiddleware";

class MyService {
  protected app = application();

  $onInit() {
    // With Platform API, it is also possible to adding middlewares with a service, module, etc...
    this.app.use(MyMiddleware);
  }
}

injectable(MyService);
```

:::

## Request and Response

There are no significant changes to Response and Request, you can always get @@Request@@ and @@Response@@ by using decorators.
With the Platform API, you are also able to use @@Context@@ decorator to deal with the @@PlatformRequest@@ or @@PlatformResponse@@ high level API.

See [Request Context](/docs/request-context.md#request-and-response-abstraction) page to get more details.

## Statics files

To serve static files, you can use the `@Configuration` decorator:

```typescript
@Configuration({
  statics: {
    "/before": [
      {
        root: `${process.cwd()}/public`,
        hook: "$beforeRoutesInit"
        // ... statics options
      }
    ],
    "/after": [
      {
        root: `${process.cwd()}/public`,
        hook: "$afterRoutesInit"
        // ... statics options
      }
    ]
  }
})
```

Or use the `app.statics()` method:

::: code-group

```typescript [Decorators]
import {Injectable} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import {join} from "path";

@Injectable()
export class MyService {
  constructor(private app: PlatformApplication) {}

  $onReady() {
    this.app.statics("/endpoint", {root: join(process.cwd(), "../publics")});
  }
}
```

```typescript [Functional API]
import {injectable} from "@tsed/di";
import {application} from "@tsed/platform-http";
import {join} from "path";

export class MyService {
  protected app = application();

  $onReady() {
    this.app.statics("/endpoint", {root: join(process.cwd(), "../publics")});
  }
}

injectable(MyService);
```

:::

## Catch exceptions

[Platform API](/docs/platform-api.md) provide a way to catch an exception with the @@Catch@@ decorator, and
to let you control the exact flow of control and the response's content sent back to the client.

See [Exception filter](/docs/exceptions.md#exception-filter) page to get more details.
