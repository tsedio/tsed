---
head:
  - - meta
    - name: description
      content: Learn how to create a custom platform adapter for Ts.ED framework. This guide explains how to implement your own adapter to integrate any web framework with Ts.ED.
  - - meta
    - name: keywords
      content: platform adapter express koa fastify custom framework ts.ed typescript node.js javascript decorators mvc class models providers integration
---

# Creating a Custom Platform Adapter

Ts.ED provides built-in support for several web frameworks like Express.js, Koa.js, and Fastify through its Platform
Adapter system. This guide explains how to create your own custom adapter to integrate any web framework with Ts.ED.

## Understanding Platform Adapters

Platform adapters serve as a bridge between Ts.ED's platform-agnostic abstractions and specific web frameworks. They
allow your application code to remain framework-agnostic while providing the necessary integration with your chosen web
framework.

Ts.ED provides an abstraction layer based on decorators from `@tsed/schema`. These decorators create an abstraction
model that allows the `@tsed/platform-routers` module to generate a routing table that can be mapped to any target
framework (Express.js, Koa.js, Fastify.js, etc.).

The routing table contains all the necessary information to map HTTP verbs, paths, and handlers to the target framework.
The adapter's primary responsibility is to perform this mapping, transforming Ts.ED handlers into handlers that are
compatible with the target framework.

Target frameworks generally provide similar functionality, but when certain features are missing in a particular
framework, it's the adapter's responsibility to fill these gaps.

The core of this system is the @@PlatformAdapter@@ abstract class, which your custom adapter will extend.

## Adapter Implementation Steps

### 1. Project Structure

Create a new package with the following structure:

```text
platform-yourframework/
├── src/
│   ├── components/
│   │   └── PlatformYourFramework.ts
│   ├── interfaces/
│   │   └── PlatformYourFrameworkSettings.ts
│   ├── services/
│   │   ├── PlatformYourFrameworkHandler.ts
│   │   ├── PlatformYourFrameworkRequest.ts
│   │   └── PlatformYourFrameworkResponse.ts
│   ├── middlewares/
│   │   └── staticsMiddleware.ts
│   └── index.ts
└── package.json
```

You can take inspiration from the existing adapters in the Ts.ED repository, such as:

- [PlatformExpress](https://github.com/tsedio/tsed/blob/production/packages/platform/platform-express)
- [PlatformKoa](https://github.com/tsedio/tsed/blob/production/packages/platform/platform-koa)
- [PlatformFastify](https://github.com/tsedio/tsed/blob/production/packages/platform/platform-fastify)

### 2. Extend PlatformAdapter

Create your adapter class by extending @@PlatformAdapter@@:

```typescript
import {adapter, PlatformAdapter, PlatformHandler, PlatformResponse} from "@tsed/platform-http";
import YourFramework from "your-framework";

export class PlatformYourFramework extends PlatformAdapter<YourFramework.Application> {
  readonly NAME = "yourframework";

  // Implementation of required methods
  // ...
}

// Register your adapter and its services
adapter(PlatformYourFramework, [
  {
    token: PlatformResponse,
    useClass: PlatformYourFrameworkResponse
  },
  {
    token: PlatformHandler,
    useClass: PlatformYourFrameworkHandler
  }
]);
```

### 3. Implement Required Methods

Your adapter must implement several key methods:

#### createApp()

Creates and configures the framework application instance:

::: code-group

```typescript [Usage]
import {PlatformAdapter} from "@tsed/platform-http";

class PlatformYourFramework extends PlatformAdapter {
  createApp() {
    const app = new YourFramework();

    // Configure app with any default settings

    return {
      app,
      callback: () => app
    };
  }
}
```

```typescript [Express]
class PlatformExpress extends PlatformAdapter {
  createApp() {
    const app = constant<Express.Express>("express.app") || Express();

    return {
      app,
      callback: () => app
    };
  }
}
```

```typescript [Koa]
import {PlatformAdapter} from "@tsed/platform-http";

class PlatformKoa extends PlatformAdapter {
  createApp() {
    const app = constant<Koa | undefined>("koa.app") || new Koa();
    koaQs(app, "extended");

    return {
      app,
      callback() {
        return app.callback();
      }
    };
  }
}
```

```typescript [Fastify]
import {PlatformAdapter} from "@tsed/platform-http";
import type {FastifyInstance} from "fastify";

class PlatformFastify extends PlatformAdapter {
  createApp() {
    const {app, ...props} = constant<PlatformFastifySettings>("fastify") || {};
    // Configure options...

    const instance: FastifyInstance = app || Fastify(opts);
    instance.decorateRequest("$ctx", null as never);
    instance.decorateReply("locals", null);

    return {
      app: instance,
      callback: () => {
        return async (request, response) => {
          await instance.ready();
          instance.server.emit("request", request, response);
        };
      }
    };
  }
}
```

:::

#### useContext()

This method is essential to the framework's operation. It enables the transportation of the `$ctx` object across all
methods executed from the controller to the service layer.

This system relies on Node.js's `async_hooks` feature, which allows context to be maintained throughout asynchronous
operations.

Without this feature properly implemented, Ts.ED's functionality would be degraded or completely non-functional, as the
context that carries request-specific data would be lost between middleware and controller executions.

Sets up the context for each request:

```typescript [
class PlatformYourFramework extends PlatformAdapter {
  useContext(): void {
    const invoke = createContext();
    const app = application();

    // Add middleware to create context for each request
    app.use(async (request, response, next) => {
      const $ctx = invoke({request, response});
      await $ctx.start();

      // Store context on request for later use
      request.$ctx = $ctx;

      // Clean up when response is finished
      response.on("finish", () => $ctx.finish());

      return next();
    });
  }
}
```

#### mapHandler()

Maps Ts.ED handlers to the target framework handler convention:

::: code-group

```typescript [Usage]
class PlatformYourFramework extends PlatformAdapter {
  mapHandler(handler: Function, metadata: PlatformHandlerMetadata) {
    // For error middleware
    if (metadata.type == PlatformHandlerType.ERR_MIDDLEWARE) {
      return (error, req, res, next) => {
        // signature may vary by framework
        // Handle error middleware
        // ...
      };
    }

    // For regular handler
    return (req, res, next) => {
      // signature may vary by framework
      // Execute handler in context
      // ...
    };
  }
}
```

```typescript [Express]
import {PlatformAdapter} from "@tsed/platform-http";
import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import {runInContext} from "@tsed/di";
import {catchAsyncError} from "@tsed/core";

class PlatformExpress extends PlatformAdapter {
  mapHandler(handler: Function, metadata: PlatformHandlerMetadata) {
    if (metadata.type == PlatformHandlerType.ERR_MIDDLEWARE) {
      return (error: unknown, req: any, res: any, next: any) => {
        return runInContext(req.$ctx, async () => {
          const {$ctx} = req;
          $ctx.next = next;
          $ctx.error = error;
          $ctx.error = await catchAsyncError(() => handler($ctx));
          return callNext(next, metadata, $ctx);
        });
      };
    }

    return (req: any, res: any, next: any) => {
      return runInContext(req.$ctx, async () => {
        const {$ctx} = req;
        $ctx.next = next;
        $ctx.error = await catchAsyncError(() => handler($ctx));
        return callNext(next, metadata, $ctx);
      });
    };
  }
}
```

```typescript [Koa]
import {PlatformAdapter} from "@tsed/platform-http";
import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import Koa from "koa";
import {catchAsyncError} from "@tsed/core";

class PlatformKoa extends PlatformAdapter {
  mapHandler(handler: Function, metadata: PlatformHandlerMetadata) {
    return async (koaContext: Koa.Context, next: Koa.Next) => {
      const {$ctx} = koaContext.request;
      $ctx.next = next;
      const error = await catchAsyncError(() => handler($ctx));
      if (error) {
        $ctx.error = error;
      }
      if (metadata.type !== PlatformHandlerType.RESPONSE_FN) {
        return $ctx.next && $ctx.error ? $ctx.next($ctx.error) : $ctx.next();
      }
    };
  }
}
```

```typescript [Fastify]
import {PlatformAdapter} from "@tsed/platform-http";
import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import type {IncomingMessage} from "node:http";
import {runInContext} from "@tsed/di";
import type {FastifyRequest} from "fastify";

class PlatformFastify extends PlatformAdapter {
  mapHandler(handler: (...args: any[]) => any, metadata: PlatformHandlerMetadata) {
    if (metadata.isRawMiddleware()) {
      return handler;
    }

    switch (metadata.type) {
      case PlatformHandlerType.MIDDLEWARE:
        return (request: IncomingMessage, _: ServerResponse, done: (err?: any) => void) => {
          const {$ctx} = request;
          $ctx.next = done;
          return runInContext($ctx, () => handler($ctx));
        };

      default:
        return async (request: FastifyRequest, _: FastifyReply, done: (err?: any) => void) => {
          const {$ctx} = request;
          $ctx.next = done;
          await runInContext($ctx, () => handler($ctx));
          if (metadata.type === PlatformHandlerType.CTX_FN) {
            done();
          }
        };
    }
  }
}
```

:::

#### mapLayers()

Maps platform layers to framework routes:

::: code-group

```typescript [Usage]
class PlatformYourFramework extends PlatformAdapter {
  mapLayers(layers: PlatformLayer[]) {
    const rawApp = this.app.getApp();

    layers.forEach((layer) => {
      switch (layer.method) {
        case "statics":
          // Handle static files
          rawApp.use(layer.path, this.statics(layer.path as string, layer.opts as any));
          return;

        default:
          // Handle routes
          rawApp[layer.method](...layer.getArgs());
      }
    });
  }
}
```

```typescript [Express]
import {PlatformAdapter} from "@tsed/platform-http";

class PlatformExpress extends PlatformAdapter {
  mapLayers(layers: PlatformLayer[]) {
    const rawApp: any = this.app.getApp();

    layers.forEach((layer) => {
      switch (layer.method) {
        case "statics":
          rawApp.use(layer.path, this.statics(layer.path as string, layer.opts as any));
          return;
      }

      rawApp[layer.method](...layer.getArgs());
    });
  }
}
```

```typescript [Koa]
import {PlatformAdapter} from "@tsed/platform-http";

class PlatformKoa extends PlatformAdapter {
  mapLayers(layers: PlatformLayer[]) {
    const options = constant("koa.router", {});
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

    application().getApp().use(rawRouter.routes()).use(rawRouter.allowedMethods());
  }
}
```

```typescript [Fastify]
import {PlatformAdapter} from "@tsed/platform-http";

class PlatformFastify extends PlatformAdapter {
  mapLayers(layers: PlatformLayer[]) {
    const {app} = this;
    const rawApp: FastifyInstance = app.getApp();

    layers.forEach((layer) => {
      switch (layer.method) {
        case "use":
          if ((rawApp as any).use) {
            (rawApp as any).use(...layer.getArgs());
          }
          return;
        case "statics":
          this.statics(layer.path as string, layer.opts as any);

          // rawApp.register();
          return;
      }
      try {
        rawApp.route({
          method: layer.method.toUpperCase() as any,
          url: layer.path as any,
          handler: this.compose(layer), // this method emulate middleware on the route like is used in Express
          config: {
            rawBody: layer.handlers.some((handler) => handler.opts?.paramsTypes?.RAW_BODY)
          }
        });
      } catch (er) {
        logger().warn({
          error_name: er.code,
          error_message: er.message
        });
      }
    });
  }
}
```

:::

#### bodyParser()

Configures body parsing middleware:

```typescript
class PlatformYourFramework extends PlatformAdapter {
  bodyParser(type: "json" | "text" | "urlencoded", additionalOptions: any = {}): any {
    // Return appropriate body parser middleware
    // ...
  }
}
```

#### statics()

Configures static file serving:

```typescript
class PlatformYourFramework extends PlatformAdapter {
  statics(endpoint: string, options: PlatformStaticsOptions) {
    // Return middleware for serving static files
    // ...
  }
}
```

### 4. Implement Response and Request Classes

Create custom implementations for `PlatformResponse` and `PlatformRequest`:

```typescript
// PlatformYourFrameworkResponse.ts
import {PlatformResponse} from "@tsed/platform-http";

export class PlatformYourFrameworkResponse extends PlatformResponse {
  // Implement methods to adapt your framework's response object
  // ...
}

// PlatformYourFrameworkRequest.ts
import {PlatformRequest} from "@tsed/platform-http";

export class PlatformYourFrameworkRequest extends PlatformRequest {
  // Implement methods to adapt your framework's request object
  // ...
}
```

### 5. Add Bootstrap Methods

Add static methods to create and bootstrap applications:

```typescript
class PlatformYourFramework extends PlatformAdapter {
  static create(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.create<YourFramework.Application>(module, {
      ...settings,
      adapter: PlatformYourFramework
    });
  }

  static bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.bootstrap<YourFramework.Application>(module, {
      ...settings,
      adapter: PlatformYourFramework
    });
  }
}
```

## Best Practices

1. **Framework Specifics**: Understand the specifics of your target framework, especially its middleware system and
   request/response lifecycle.

2. **Error Handling**: Implement proper error handling in your adapter to ensure exceptions are caught and processed
   correctly.

3. **Context Management**: Ensure that the Ts.ED context is properly created, stored, and cleaned up for each request.

4. **Testing**: Create comprehensive tests for your adapter to ensure it works correctly with the Ts.ED framework.

5. **Documentation**: Document any framework-specific behaviors or limitations of your adapter.

## Testing Your Adapter

Ts.ED provides the `@tsed/platform-test-sdk` package to help you test your custom platform adapter. This package
includes a comprehensive test suite that verifies your adapter's compatibility with the Ts.ED framework.

It is strongly recommended to set up these tests early in your development process to ensure your adapter meets all the
framework requirements.

### Setting Up Tests

First, install the package:

```bash
npm install --save-dev @tsed/platform-test-sdk
```

Then create a test file for your adapter:

```typescript
// platform-yourframework.spec.ts
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {PlatformYourFramework} from "../src/components/PlatformYourFramework";
import {rootDir, Server} from "./app/Server";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformYourFramework,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("PlatformYourFramework", () => {
  describe("Handlers", () => {
    utils.test("handlers");
  });
  describe("Response", () => {
    utils.test("response");
  });
  describe("Middlewares", () => {
    utils.test("middlewares");
  });
  describe("Headers", () => {
    utils.test("headers");
  });
  describe("BodyParams", () => {
    utils.test("bodyParams");
  });
  // Add more tests as needed
});
```

The `PlatformTestSdk` will run a series of tests against your adapter to ensure it correctly implements all the required
functionality.

### What Gets Tested

The test suite covers various aspects of the platform adapter:

- Request and response handling
- Middleware execution
- Parameter binding (path, query, body, headers)
- Error handling
- Routing
- Content negotiation
- File uploads
- And more

Each test verifies that your adapter correctly implements the expected behavior for a specific feature of the Ts.ED
framework.

### Example Test Server

You'll need to create a test server for your tests:

```typescript
// app/Server.ts
import {Configuration} from "@tsed/di";
import {PlatformYourFramework} from "../../src/components/PlatformYourFramework";
import path from "path";

export const rootDir = path.join(__dirname, "..");

@Configuration({
  rootDir,
  mount: {
    "/rest": [`${rootDir}/controllers/**/*.ts`]
  },
  logger: {
    level: "off"
  }
})
export class Server {}
```

### Integration Tests

Looking at the existing adapters, you can see how they implement their test suites:

::: code-group

```typescript [Express]
// platform-express.spec.ts
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {PlatformExpress} from "../src/components/PlatformExpress";
import {rootDir, Server} from "./app/Server";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformExpress,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("PlatformExpress", () => {
  describe("Handlers", () => {
    utils.test("handlers");
  });
  // More tests...
});
```

```typescript [Koa]
// platform-koa.spec.ts
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {PlatformKoa} from "../src/components/PlatformKoa";
import {rootDir, Server} from "./app/Server";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformKoa,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("PlatformKoa", () => {
  describe("Handlers", () => {
    utils.test("handlers");
  });
  // More tests...
});
```

```typescript [Fastify]
// platform-fastify.spec.ts
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {PlatformFastify} from "../src/components/PlatformFastify";
import {rootDir, Server} from "./app/Server";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformFastify,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("PlatformFastify", () => {
  describe("Handlers", () => {
    utils.test("handlers");
  });
  // More tests...
});
```

:::

By implementing these tests early in your development process, you can ensure that your adapter correctly implements all
the required functionality and meets the expectations of the Ts.ED framework.

## Conclusion

Creating a custom platform adapter allows you to integrate any web framework with Ts.ED. By implementing the required
methods and following the patterns established by the built-in adapters, you can create a seamless integration between
your chosen framework and the Ts.ED ecosystem.

For more details, examine the source code of the existing adapters:

- [PlatformExpress](https://github.com/tsedio/tsed/blob/production/packages/platform/platform-express/src/components/PlatformExpress.ts)
- [PlatformKoa](https://github.com/tsedio/tsed/blob/production/packages/platform/platform-koa/src/components/PlatformKoa.ts)
- [PlatformFastify](https://github.com/tsedio/tsed/blob/production/packages/platform/platform-fastify/src/components/PlatformFastify.ts)
