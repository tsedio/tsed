# Introduction

Platform API create a routing abstraction. That means, all metadata data collected by
Ts.ED decorators will be stored somewhere and can be consumed to map the information
to the server framework of your choice.

Ts.ED provide use two packages to collect/consume metadata:

- `@tsed/schema` that you know well, because you use it to declare models
- `@tsed/platform-router` is used by the `@tsed/common` package and the platforms (express/koa) to consume the famous routing model abstraction.

For example, the following controller will create a @@PlatformLayer@@ with all required data to create a real router:

```ts
import {Controller} from "@tsed/common";

@Controller("/controller")
class MyController {
  @Get("/")
  get() {}
}
```

To get the layer we can do that:

```ts
import {Controller, InjectorService} from "@tsed/di";
import {PlatformHandlerType, PlatformHandlerMetadata, PlatformRouter, PlatformLayer} from "@tsed/platform-router";

const injector = new InjectorService();

injector.addProvider(MyController);
injector.addProvider(NestedController);

const appRouter = new PlatformRouter(injector);

// return the layer that decribe the controller and his handlers
appRouter.getLayers(); // [PlatformLayer]
```

Here we just described how we can the layers, but we need to example how we can consume and map the data to a real router.
We'll do that step-by-step by implementing the `Express.js` platform as example.

## Clone the template

The first step is to create a new project and cloning the `tsed-platform-adapter-starter-kit` template:

```sh
mkdir tsed-platform-express-5
cd tsed-platform-express-5
git clone https://github.com/tsedio/tsed-platform-adapter-starter-kit .
```

## Prepare the template

Replace all following keywords by his replacement in all files:

- `platform-adapter-kit-starter`: `platform-express-5`,
- `PlatformKitStarter`: `PlatformExpress5`,
- `kitStarter`: `express5`

Rename the following files:

- `PlatformKitStarter.ts`: `PlatformExpress5.ts`,
- `PlatformKitStarter.spec.ts`: `PlatformExpress5.spec.ts`,
- `PlatformKitStarterSettings.spec.ts`: `PlatformKitStarterSettings.spec.ts`

## Install dependencies

Depending on your platform, you will need to install some dependencies. For Express.js 5, we have to install the following dependencies:

```sh
yarn add express@next body-parser@next
yarn add -D @types/express compression cookie-parser express-session cors method-override
```

## Implement the Platform adapter

The template implement some integration tests that validate your Platform adapter compatibility with the Ts.ED platform.
These tests ensure that the platform will work as expected for the developer that use your platform.

The tests are located in `./test/integrations/platform.integration.spec.ts`.
Also, you have a small Ts.ED app under `./test/app`. We'll update this app for our integration test and fit the Express platform prerequisite.

To run integration tests, just run this command:

```sh
yarn test
```

Actually, all tests fail (timeout)! it's totally normal, because, we haven't configured the server application. So you Platform adapter isn't able
to listen a port and received a request.

Our job right now, is to pass all mandatory test.

### Add typings

In `src/components/PlatformExpress5.ts` change the following lines:

```diff
+ import Express from "express";

- export type Application = any
+ export type Application = Express.Application
```

In `src/interfaces/interfaces.ts` change the following lines:

```diff
+ import Express from "express";
import {PlatformContext} from "@tsed/common";
import {PlatformExpress5Settings} from "./PlatformExpress5Settings";

declare global {
  namespace TsED {
-    export interface Application {}
+    export interface Application extends Express.Application {}

    export interface Configuration {
      /**
       * Configuration related to the platform application.
       */
      express5: PlatformExpress5Settings;
    }

-    export interface NextFunction {
+    export interface NextFunction extends Express.NextFunction {

    }

-    export interface Response {}
+    export interface Response extends Express.Response {}
    export interface Request extends Express.Request {
      id: string;
      $ctx: PlatformContext;
    }

    export interface StaticsOptions {}
  }
}

```

### Replace Raw() by the App framework

In the template you have a fake Raw application.

```ts
// to be removed and replaced by the web framework class like (Express, Koa, etc...)
function Raw() {
  return () => {};
}
```

```diff
- // to be removed and replaced by the web framework class like (Express, Koa, etc...)
- function Raw() {
-   return () => {}
- }

// ...

- const app = this.injector.settings.get("express5.app") || Raw();
+ const app = this.injector.settings.get("express5.app") || Express();
```

At this step, we can run the integration test every time is needed. The server should be able to listen connection and receive incoming
request.

```sh
yarn test
```

### Map layers

Now your platform is able to listen connection, we need to fix the layer mapping to expose the routes declared by our controllers.

It's basically a step to map the route path and his http method to the Express application.
Here is the template code:

```ts
export class PlatformExpress5 implements PlatformAdapter<Application> {
  mapLayers(layers: PlatformLayer[]) {
    const app = this.getPlatformApplication();
    const rawApp: any = app.getApp();

    layers.forEach((layer) => {
      switch (layer.method) {
        case "statics":
          rawApp.use(layer.path, this.statics(layer.path as string, layer.opts as any));
          return;
      }

      if (rawApp?.[layer.method]) {
        rawApp[layer.method](...layer.getArgs());
      } else {
        this.injector.logger.warn(`[MAPLAYERS] ${layer.method} method not implemented yet.`);
      }
    });
  }
}
```

Express has a simple router that have methods for each Http verb (`POST`, `GET`, etc...):

```js
const app = express();

app.get("/", () => {});
app.post("/", () => {});
```

So the layer mapping is pretty simple and is assumed here:

```ts
rawApp[layer.method](...layer.getArgs());
```

The `mapLayers` implementation for Koa is pretty similar:

```ts
export class PlatformKoa implements PlatformAdapter<Application> {
  mapLayers(layers: PlatformLayer[]) {
    const {settings} = this.injector;
    const app = this.getPlatformApplication();
    const options = settings.get("koa.router", {});
    const rawRouter = new KoaRouter(options) as any;

    layers.forEach((layer) => {
      switch (layer.method) {
        case "statics":
          rawRouter.use(layer.path, this.statics(layer.path as string, layer.opts as any));
          break;

        default:
          rawRouter[layer.method](...layer.getArgs());
      }
    });

    app.getApp().use(rawRouter.routes()).use(rawRouter.allowedMethods());
  }
}
```

### Map handler

When you create a controller, Ts.ED create a layer (verb/path) and handlers that must be mapped to
the server framework (Express here).

A Ts.ED handler need only a `$ctx` (PlatformContext) as parameter to work, but in Express a signature handler
can be the followings:

```ts
// for endpoint
function handler(req, res) {}
// for middleware
function middleware(req, res, next) {}
// for error middleware
function middleware(error, req, res, next) {}
```

In koa:

```ts
// for endpoint and middleware
function handler(ctx, next) {}
```

To transform an Express handler to a valid Ts.ED handler we can do that through the `mapHandler` method.

```ts
export class PlatformExpress5 implements PlatformAdapter<Application> {
  mapHandler(handler: Function, metadata: PlatformHandlerMetadata) {
    switch (metadata.type) {
      case PlatformHandlerType.RAW_FN:
      case PlatformHandlerType.RAW_ERR_FN:
        return handler;
      case PlatformHandlerType.ERR_MIDDLEWARE:
        return async (error: unknown, req: any, res: any, next: any) => {
          return runInContext(req.$ctx, () => {
            const {$ctx} = req;

            $ctx.next = next;
            $ctx.error = error;

            return handler($ctx);
          });
        };
      default:
        return (req: any, res: any, next: any) => {
          return runInContext(req.$ctx, () => {
            req.$ctx.next = next;
            handler(req.$ctx);
          });
        };
    }
  }
}
```

The template generate a preconfigured mapping (Express like). But if you have to map handler for Koa, the code should be something like that:

```ts
export class PlatformKoa implements PlatformAdapter<Application> {
  mapHandler(handler: Function, metadata: PlatformHandlerMetadata) {
    if (metadata.isRawMiddleware()) {
      return handler;
    }

    return async (koaContext: Koa.Context, next: Koa.Next) => {
      const {$ctx} = koaContext.request;
      $ctx.next = next;

      await handler($ctx);
    };
  }
}
```

### Bind context to request

Ts.ED need to create the `$ctx` instance before all handlers. The `$ctx` is an instance of PlatformContext and wrap the request/response object.

The principle is to register a middleware to invoke a new context each time a request is handled by the server.
The `useContext` method is here to implement correctly the context middleware depending on the server framework used by your adapter.

Here is an Express example:

```ts
export class PlatformExpress5 implements PlatformAdapter<Application> {
  useContext(): this {
    const app = this.getPlatformApplication();
    const invoke = createContext(this.injector);

    this.injector.logger.debug("Mount app context");

    app.use(async (request: any, response: any, next: any) => {
      const $ctx = await invoke({request, response});
      await $ctx.start();

      $ctx.response.getRes().on("finish", () => $ctx.finish());

      return runInContext($ctx, next);
    });

    return this;
  }
}
```

While in Koa the middleware is implemented like that:

```ts
export class PlatformKoa implements PlatformAdapter<Application> {
  useContext(): this {
    const app = this.getPlatformApplication();
    const invoke = createContext(this.injector);
    const platformExceptions = this.injector.get<PlatformExceptions>(PlatformExceptions);

    this.injector.logger.debug("Mount app context");

    app.use(async (koaContext: Context, next: Next) => {
      const $ctx = await invoke({
        request: koaContext.request as any,
        response: koaContext.response as any,
        koaContext
      });

      return runInContext($ctx, async () => {
        try {
          await $ctx.start();
          await next();
          const status = koaContext.status || 404;

          if (status === 404 && !$ctx.isDone()) {
            platformExceptions?.resourceNotFound($ctx);
          }
        } catch (error) {
          platformExceptions?.catch(error, $ctx);
        } finally {
          await $ctx.finish();
        }
      });
    });

    return this;
  }
}
```

There is some important point to implement the middleware. We need to call:

- `invoke` to create a new @@PlatformContext@@ instance.
- `$ctx.start()`, to emit the `$onRequest` event.
- The handler in a `runInContext`. This method allow the `@InjectContext` usage in our Service.
- `$ctx.finish()`, to emit the `$onResponse` event.

### Required middlewares

Some extra middlewares are necessary for some of Ts.ED features. But it
depends on the server frameworks.

The middlewares are followings:

- BodyParser
- Multipart files
- Statics files

#### Body parser

```ts
export class PlatformKitStarter implements PlatformAdapter<Application> {
  bodyParser(type: "json" | "urlencoded" | "raw" | "text", additionalOptions: any = {}): any {}
}
```

<Tabs class="-code">
<Tab label="Express">

```ts
export class PlatformExpress5 implements PlatformAdapter<Application> {
  bodyParser(type: "json" | "text" | "urlencoded", additionalOptions: any = {}): any {
    const opts = this.injector.settings.get(`express.bodyParser.${type}`);

    let parser: any = Express[type];
    let options: OptionsJson & OptionsText & OptionsUrlencoded = {};

    if (isFunction(opts)) {
      parser = opts;
      options = {};
    }

    if (type === "urlencoded") {
      options.extended = true;
    }

    options.verify = (req: IncomingMessage & {rawBody: Buffer}, _res: ServerResponse, buffer: Buffer) => {
      const rawBody = this.injector.settings.get(`rawBody`);

      if (rawBody) {
        req.rawBody = buffer;
      }

      return true;
    };

    return parser({...options, ...additionalOptions});
  }
}
```

</Tab>
<Tab label="Koa">

```ts
export class PlatformKoa implements PlatformAdapter<Application> {
  bodyParser(type: "json" | "urlencoded" | "raw" | "text", additionalOptions: any = {}): any {
    const opts = this.injector.settings.get(`koa.bodyParser`);
    let parser: any = koaBodyParser;

    let options: Options = {};

    if (isFunction(opts)) {
      parser = opts;
      options = {};
    }

    return parser({...options, ...additionalOptions});
  }
}
```

</Tab>
</Tabs>

#### Multipart

Ts.ED use multer to handler file upload request.

```ts
export class PlatformKitStarter implements PlatformAdapter<Application> {
  multipart(options: PlatformMulterSettings): PlatformMulter {
    return multerMiddleware(options);
  }
}
```

<Tabs class="-code">
<Tab label="Express">

<<< @/packages/platform/platform-express/src/middlewares/multerMiddleware.ts

</Tab>
<Tab label="Koa">

<<< @/packages/platform/platform-koa/src/middlewares/multerMiddleware.ts

</Tab>
</Tabs>

#### Statics files

Ts.ED doesn't impose a specific middleware for this feature. You are free to implement the correct middleware to serve statics files.

```ts
export class PlatformKitStarter implements PlatformAdapter<Application> {
  statics(endpoint: string, options: PlatformStaticsOptions) {
    return staticsMiddleware(options);
  }
}
```

<Tabs class="-code">
<Tab label="Express">

<<< @/packages/platform/platform-express/src/middlewares/staticsMiddleware.ts

</Tab>
<Tab label="Koa">

<<< @/packages/platform/platform-koa/src/middlewares/staticsMiddleware.ts

</Tab>
</Tabs>
