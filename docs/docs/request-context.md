---
prev: true
next: true
---

# Request context

Ts.ED provides an util to get request, response, to store and share data along all middlewares/endpoints during a
request with @@PlatformContext@@. This context is created by Ts.ED when the request is handled by the server.

It contains some information as following:

- The request and response abstraction layer with @@PlatformRequest@@ and @@PlatformResponse@@ (since v5.64.0+),
- The request id,
- The request container used by the Ts.ED DI. It contains all services annotated with `@Scope(ProviderScope.REQUEST)`,
- The current @@EndpointMetadata@@ context resolved by Ts.ED during the request,
- The data returned by the previous endpoint if you use multiple handlers on the same route. By default data is empty.
- The @@ContextLogger@@ to log some information related to the request and his id.

Here is an example:

<<< @/docs/snippets/request-context/context-example.ts

::: tip @@ContextLogger@@ is attached to the context `ctx.logger`. The ContextLogger stores all logs and Ts.ED prints (
flushes) all logs after the response is sent by the server. The approach optimizes performance by first sending in the
response and then printing all logs.
:::

## Endpoint metadata

@@EndpointMetadata@@ is the current controller method executed by the request. Middleware can access to this endpoint
metadata when you use the middleware over a controller method. By accessing to the @@EndpointMetadata@@ you are able to:

- Get endpoint information,
- Create [custom middleware and decorator](/docs/custom-endpoint-decorators.md),
- Get the controller class name and propertyKey.

```typescript
import {StoreSet} from "@tsed/core";
import {Get, Controller, Middleware, Context, EndpointInfo, Use, Returns} from "@tsed/common";
import {Resource} from "./Resource"

@Middleware()
export class MyMiddleware {
  use(@EndpointInfo() endpoint: EndpointInfo, @Context() ctx: Context) {
    console.log(endpoint === ctx.endpoint) // true
    console.log(ctx.endpoint.targetName) // MyCtrl
    console.log(ctx.endpoint.propertyKey) // getMethod
    console.log(ctx.endpoint.type) // Resource
    console.log(ctx.endpoint.store.get('options')) // options
  }
}

@Controller('/resources')
class MyCtrl {
  @Get('/:id')
  @Use(MyMiddleware)
  @Returns(200, Resource)
  @StoreSet('options', "options")
  getMethod(): Resource {
    return new Resource()
  }
}
```

## Request and Response abstraction

@@PlatformContext@@ provide a @@PlatformRequest@@ and @@PlatformResponse@@ classes which are an abstraction layer of the
targeted platform (Express.js, Koa.js, etc...).

By using the PlatformContext interface, your code will be compatible with any platform. But, the abstraction doesn't or
cannot provide all necessaries properties or methods. It's also possible to get the original request or response by
different ways.

```typescript
import {Middleware, Context, Req, Res} from "@tsed/common";

@Middleware()
export class MyMiddleware {
  use(@Req() req: Req, @Res() res: Res, @Context() ctx: Context) {
    // abstraction
    console.log(ctx.request) // PlatformRequest
    console.log(ctx.response) // PlatformResponse

    // by decorator
    console.log(req) // Express.Request
    console.log(res) // Express.Response

    // by
    console.log(ctx.request.raw) // Express.Request
    console.log(ctx.response.raw) // Express.Request

    // by method
    console.log(ctx.getRequest<Express.Request>()) // Express.Request
    console.log(ctx.getResponse<Express.Response>()) // Express.Response
  }
}
```

## PlatformRequest

@@PlatformRequest@@ provide high level methods and properties to get request information. His interface is the
following:

```typescript
class PlatformRequest<T = Req> {
  raw: T;

  get secure(): boolean;

  get url(): string;

  get headers(): IncomingHttpHeaders;

  get method(): string;

  get body(): {[key: string]: any};

  get cookies(): {[key: string]: any};

  get params(): {[key: string]: any};

  get query(): {[key: string]: any};

  get session(): {[key: string]: any} | undefined;

  get(name: string): string | undefined; // get header
  accepts(mime?: string | string[]): string | string[] | false;
}
```

## PlatformResponse

@@PlatformResponse@@ provide high level methods like `.body()` to send any data to your consumer. This method can
get `Boolean`, `Number`, `String`, `Date`, `Object`, `Array` or `Stream` as input type and determine the correct way to
send the response to your consumer.

His interface is the following:

```typescript
class PlatformResponse {
  raw: Res;

  get statusCode(): number;

  get locals(): Record<string, any>;

  status(status: number): this;

  setHeaders(headers: {
    [key: string]: any;
  }): this;

  contentType(contentType: string): this;

  redirect(status: number, url: string): this;

  location(location: string): this;

  stream(data: ReadableStream | any): this;

  render(path: string, options?: any): Promise<string>;

  body(data: any): this;

  onEnd(cb: Function): void;

  destroy(): void;
}
```

Example:

```typescript
import {Middleware, Context} from "@tsed/common";

@Middleware()
export class MyMiddleware {
  use(@Context() ctx: Context) {
    // set headers, content-type and status
    ctx.setHeaders({"x-header": "header"});
    ctx.contentType("application/json");
    ctx.status(201);

    // equivalent to ctx.response.raw.send() 
    ctx.body(null);
    ctx.body(undefined);
    ctx.body(true);
    ctx.body(false);

    // equivalent to ctx.response.raw.json()
    ctx.body({});
    ctx.body([]);
    ctx.body(new Date());

    // equivalent to readableStream.pipe(ctx.response.raw)
    ctx.body(readableStream);

    // use raw response
    ctx
      .getResponse<Express.Response>()
      .status(201)
      .send("Hello")
  }
}
```

## AsyncHook context <Badge text="v6.26.0" />

Inject @@PlatformContext@@ from a controller and forward the context to another service could be a pain point. See
example:

```typescript
@Injectable()
export class CustomRepository {
  async findById(id: string, ctx: PlatformContext) {
    ctx.logger.info('Where are in the repository');
    return {
      id,
      headers: this.$ctx?.request.headers
    };
  }
}

@Controller("/async-hooks")
export class AsyncHookCtrl {
  @Inject()
  repository: CustomRepository;

  @Get("/:id")
  async get(@PathParams("id") id: string, @Context() ctx: PlatformContext) {
    return this.repository.findById(id, ctx);
  }
}
```

Since v6.26.0, a new package is available to simplify the way to get the @@PlatformContext@@ directly from a Service
called by a controller.

This feature uses an experimental Node.js
feature [`AsyncLocalStorage`](https://nodejs.org/docs/latest-v14.x/api/async_hooks.html#async_hooks_class_asynclocalstorage)
which is only available from v13.10.0. So, to avoid a breaking change, you have to install
the `@tsed/async-hook-context` package if your environment have the required Node.js version.

```bash
npm install --save @tsed/async-hook-context
```

With this package, you can inject directly the @@PlatformContext@@ in the service without injecting it in the
controller:

```typescript
@Injectable()
export class CustomRepository {
  @InjectContext()
  $ctx?: PlatformContext;

  async findById(id: string) {
    this.ctx?.logger.info('Where are in the repository');

    return {
      id,
      headers: this.$ctx?.request.headers
    };
  }
}

@Controller("/async-hooks")
export class AsyncHookCtrl {
  @Inject()
  repository: CustomRepository;

  @Get("/:id")
  async get(@PathParams("id") id: string) {
    return this.repository.findById(id);
  }
}
```

To run a method with context in your unit test, you can use the @@PlatformAsyncHookContext@@.

```typescript
import {Injectable} from "@tsed/di";
import {PlatformContext} from "@tsed/common";
import {InjectContext, PlatformAsyncHookContext} from "@tsed/async-hook-context";

@Injectable()
export class CustomRepository {
  @InjectContext()
  $ctx?: PlatformContext;

  async findById(id: string) {
    this.ctx?.logger.info('Where are in the repository');

    return {
      id,
      headers: this.$ctx?.request.headers
    };
  }
}

describe("CustomRepository", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should run method with the ctx", async () => {
    const ctx = PlatformTest.createRequestContext();
    const service = PlatformTest.get<CustomRepository>(CustomRepository);

    ctx.request.headers = {
      "x-api": "api"
    }

    const result = await PlatformAsyncHookContext.run(ctx, () => service.findById("id"));
    
    expect(result).toEqual({
      id: "id",
      headers: {
        "x-api": "api"
      }
    })
  });
});
```
