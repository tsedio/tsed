# Platform API

Ts.ED uses now the Platform API to create an application. Platform API gives an abstraction layer between your code written with Ts.ED and the [Express.js](https://expressjs.com/fr/) code.
It means that a large part of your code isn't coupled with Express.js itself and can be used with another Platform like [Koa.js](https://koajs.com/).

There are some changes between ServerLoader API (v4/v5) and Platform API (v5.56.0+/v6), to get the original Express Application, Request or Response.
This page will describe how you can get these instances with the new API.

## Platform classes

<Tabs>
  <Tab label="Abstraction">
  <ApiList query="status.includes('platform') && ['@tsed/common', '@tsed/platform-views', '@tsed/platform-params', '@tsed/platform-response-filter', '@tsed/platform-exceptions'].includes(module)" />
  </Tab>
  <Tab label="Express.js">
  <ApiList query="status.includes('platform') && module.includes('@tsed/platform-express')" />
  </Tab>
  <Tab label="Koa.js">
  <ApiList query="status.includes('platform') && module.includes('@tsed/platform-koa')" />
  </Tab>
  <Tab label="Serverless">
  <ApiList query="status.includes('platform') && module.includes('@tsed/platform-serverless')" />
  </Tab>  
</Tabs>

## Create application

The way to create a Ts.ED application, add [middlewares](/docs/middlewares.html), configure Express or Koa, all are impacted by the new Platform API.

If you use `ServerLoader`, you'll probably know this example to create a Ts.ED application:

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import {MyMiddleware} from "./MyMiddleware";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";

export const rootDir = __dirname;

@ServerSettings({
  rootDir,
  viewsDir: `${rootDir}/views`
})
export class Server extends ServerLoader {
  $beforeRoutesInit() {
    this.use(MyMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );

    // configure express app
    this.set("views", this.settings.get("viewsDir"));
    this.engine("ejs", ejs);
  }
}
```

With Platform API you have to inject @@PlatformApplication@@ to register a middleware and set configuration to `Express.Application`:

```typescript
import {Configuration, PlatformApplication} from "@tsed/common";
import {Inject, Constant} from "@tsed/di";
import {MyMiddleware} from "./MyMiddleware";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";

export const rootDir = __dirname;

@Configuration({
  rootDir,
  views: {
    root: `${rootDir}/views`,
    viewEngine: "ejs"
  }
})
export class Server {
  @Constant("viewsDir")
  viewsDir: string;

  @Inject()
  app: PlatformApplication<Express.Application>;

  $beforeRoutesInit() {
    this.app
      .use(MyMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );
  }
}
```

::: tip
With Platform API, the Server class is considered as a @@Provider@@. It means that you can use decorators like @@Constant@@ and @@Inject@@ to get any configuration, provider or service from the DI registry.
:::

## Inject service in the Server

With `ServerLoader`, injecting a provider can be done as follows:

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import {MyService} from "./services/MyService";

@ServerLoader({})
export class Server extends ServerLoader {
  $beforeRoutesInit() {
    const myService = this.injector.get<MyService>(MyService);

    myService.getSomething();
  }
}
```

Now with Platform API, the Server class is considered as a @@Provider@@.
It means that you can use decorators like @@Constant@@ and @@Inject@@ to get any configuration, provider or service from the DI registry.

```typescript
import {Configuration} from "@tsed/common";
import {Inject} from "@tsed/di";
import {MyService} from "./services/MyService";

@Configuration({})
export class Server {
  @Inject()
  myService: MyService;

  $beforeRoutesInit() {
    this.myService.getSomething();
  }
}
```

## Bootstrap application

In v5, boostrap a `Server` can be done with the `ServerLoader.boostrap` method:

```typescript
import {$log, ServerLoader} from "@tsed/common";
import {Server} from "./server";

async function bootstrap() {
  try {
    $log.debug("Start server...");
    const platform = await ServerLoader.bootstrap(Server, {
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

Now with Platform API, you have to install `@tsed/platform-express` (or `@tsed/platform-koa`) and change the code by the following example:

```typescript
import {$log} from "@tsed/common";
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

## Get Application

Before with v5, to get `Express.Application`, you had to use `ExpressApplication` decorator:

```typescript
import {Injectable} from "@tsed/di";
import {ExpressApplication} from "@tsed/common";

@Injectable()
class MyService {
  constructor(@ExpressApplication private app: ExpressApplication) {}

  getExpressApp() {
    return this.app;
  }
}
```

With Platform API, you have to inject @@PlatformApplication@@ and use the `app.raw` or `app.getApp()` to get the `Express.Application`:

```typescript
import {Injectable, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import {MyMiddleware} from "../middlewares/MyMiddleware";

@Injectable()
class MyService {
  @Inject()
  app: PlatformApplication<Express.Application>;

  getExpressApp() {
    return this.app.raw; // GET Express raw Application. E.g.: const app = express()
  }

  $onInit() {
    // With Platform API, it is also possible to add middlewares with a service, module, etc...
    this.app.use(MyMiddleware);
  }
}
```

## Request and Response

There is no big change over Response and Request, you can always get @@Request@@ and @@Response@@ by using decorators.
With the Platform API, you are also able to use @@Context@@ decorator to deal with the @@PlatformRequest@@ or @@PlatformResponse@@ high level API.

See [Request context](/docs/request-context.md#request-and-response-abstraction) page to get more details.

## Statics files

Since v5.65.0, Platform API manages also the statics files. The @@ServeStaticService@@ is now deprecated in favor of `PlatformApplication.statics()` method.

Before:

```typescript
import {Injectable} from "@tsed/di";
import {ServeStaticService} from "@tsed/common";

@Injectable()
class MyService {
  constructor(private service: ServeStaticService) {}

  $onReady() {
    this.service.statics({"/endpoint": __dirname + "/publics"});
  }
}
```

After:

```typescript
import {Injectable} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";

@Injectable()
class MyService {
  constructor(private app: PlatformApplication) {}

  $onReady() {
    this.app.statics("/endpoint", {root: __dirname + "/publics"});
  }
}
```

## Catch exceptions

The new [Platform API](/docs/platform-api.md) introduces a new way to catch an exception with the @@Catch@@ decorator, and
to let you control the exact flow of control and the response's content sent back to the client.

See [Exception filter](/docs/exceptions.md#exception-filter) page to get more details.
