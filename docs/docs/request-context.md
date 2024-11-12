# Context

Ts.ED provides an utility to get request, response, to store and share data along all middlewares/endpoints during a
request with @@PlatformContext@@. This context is created by Ts.ED when the request is handled by the server.

It contains some information as following:

- The request and response abstraction layer with @@PlatformRequest@@ and @@PlatformResponse@@ (since v5.64.0+),
- The request id,
- The request container used by the Ts.ED DI. It contains all services annotated with `@Scope(ProviderScope.REQUEST)`,
- The current @@EndpointMetadata@@ context resolved by Ts.ED during the request,
- The data returned by the previous endpoint if you use multiple handlers on the same route. By default, data is empty.
- The @@ContextLogger@@ to log some information related to the request and his id.

Here is an example:

```ts
import {Context} from "@tsed/platform-params";
import {Middleware, UseBefore} from "@tsed/platform-middlewares";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {Forbidden} from "@tsed/exceptions";
import {AuthToken} from "../domain/auth/AuthToken.js";

@Middleware()
class AuthTokenMiddleware {
  use(@Context() ctx: Context) {
    if (!ctx.has("auth")) {
      ctx.set("auth", new AuthToken(ctx.request));
    }

    try {
      ctx.get("auth").claims(); // check token
    } catch (er) {
      throw new Forbidden("Access forbidden - Bad token");
    }
  }
}

@Controller("/")
@UseBefore(AuthTokenMiddleware) // protect all routes for this controller
class MyCtrl {
  @Get("/")
  get(@Context() context: Context, @Context("auth") auth: AuthToken) {
    context.logger.info({event: "auth", auth}); // Attach log to the request
  }
}
```

::: tip

@@ContextLogger@@ is attached to the context `ctx.logger`. The ContextLogger stores all logs and Ts.ED prints (
flushes) all logs after the response is sent by the server. The approach optimizes performance by first sending in the
response and then printing all logs.
:::

## Endpoint metadata

@@EndpointMetadata@@ is the current controller method executed by the request. Middleware can access to this endpoint
metadata when you use the middleware over a controller method. By accessing to the @@EndpointMetadata@@ you are able to:

- Get endpoint information,
- Create [custom middleware and decorator](/docs/custom-endpoint-decorators),
- Get the controller class name and propertyKey.

```typescript
import {StoreSet} from "@tsed/core";
import {Controller} from "@tsed/di";
import {Middleware, Use} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";
import {Get, Returns} from "@tsed/schema";
import {Resource} from "./Resource";

@Middleware()
export class MyMiddleware {
  use(@Context() ctx: Context) {
    console.log(ctx.endpoint); // Endpoint Metadata
    console.log(ctx.endpoint.targetName); // MyCtrl
    console.log(ctx.endpoint.propertyKey); // getMethod
    console.log(ctx.endpoint.type); // Resource
    console.log(ctx.endpoint.store.get("options")); // options
  }
}

@Controller("/resources")
class MyCtrl {
  @Get("/:id")
  @Use(MyMiddleware)
  @Returns(200, Resource)
  @StoreSet("options", "options")
  getMethod(): Resource {
    return new Resource();
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
import {Req, Res} from "@tsed/platform-http";
import {Middleware} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";

@Middleware()
export class MyMiddleware {
  use(@Req() req: Req, @Res() res: Res, @Context() ctx: Context) {
    // abstraction
    console.log(ctx.request); // PlatformRequest
    console.log(ctx.response); // PlatformResponse

    // by decorator
    console.log(req); // Express.Request
    console.log(res); // Express.Response

    // by
    console.log(ctx.request.raw); // Express.Request
    console.log(ctx.response.raw); // Express.Request

    // by method
    console.log(ctx.getRequest<Express.Request>()); // Express.Request
    console.log(ctx.getResponse<Express.Response>()); // Express.Response
  }
}
```

## PlatformRequest

@@PlatformRequest@@ provide high level methods and properties to get request information. His interface is the
following:

```typescript
interface PlatformRequest<T = Req> {
  raw: T;

  get secure(): boolean;

  get url(): string;

  get route(): string;

  get headers(): IncomingHttpHeaders;

  get method(): string;

  get body(): {[key: string]: any};

  get rawBody(): {[key: string]: any};

  get cookies(): {[key: string]: any};

  get params(): {[key: string]: any};

  get query(): {[key: string]: any};

  get session(): {[key: string]: any} | undefined;

  get(name: string): string | undefined; // get header
  getHeader(name: string): string | undefined; // get header
  accepts(mime?: string | string[]): string | string[] | false;
  isAborted(): boolean;
}
```

### Get request headers

```typescript
import {Controller} from "@tsed/di";
import {Context} from "@tsed/platform-params";

@Controller("/")
export class MyController {
  @Get("/")
  get(@Context() ctx: Context) {
    ctx.request.headers; // return all headers
    ctx.get("host"); // return host header
    ctx.getHeader("host"); // return host header
  }
}
```

### Get request params/body/query/cookies/session

```typescript
import {Controller} from "@tsed/di";
import {Context} from "@tsed/platform-params";

@Controller("/")
export class MyController {
  @Get("/")
  get(@Context() ctx: Context) {
    ctx.request.body; // return body payload
    ctx.request.params; // return path params
    ctx.request.query; // return query params
    ctx.request.cookies; // return cookies
    ctx.request.session; // return session
  }
}
```

## PlatformResponse

@@PlatformResponse@@ provide high level methods like `.body()` to send any data to your consumer. This method can
get `Boolean`, `Number`, `String`, `Date`, `Object`, `Array` or `Stream` as input type and determine the correct way to
send the response to your consumer.

His interface is the following:

```typescript
interface PlatformResponse {
  raw: Res;

  get statusCode(): number;

  get locals(): Record<string, any>;

  status(status: number): this;

  setHeaders(headers: {[key: string]: any}): this;

  contentType(contentType: string): this;

  redirect(status: number, url: string): this;

  location(location: string): this;

  stream(data: ReadableStream | any): this;

  render(path: string, options?: any): Promise<string>;

  body(data: any): this;

  onEnd(cb: Function): void;

  destroy(): void;

  cookie(name: string, value: string | null, opts?: TsED.SetCookieOpts): this;
}
```

### Set response headers

```typescript
import {Controller} from "@tsed/di";
import {Context} from "@tsed/platform-params";

@Controller("/")
export class MyController {
  @Get("/")
  get(@Context() ctx: Context) {
    // set headers, content-type and status
    ctx.response.setHeaders({"x-header": "header"});
    ctx.response.contentType("application/json");
    ctx.response.status(201);
  }
}
```

Can be also done by returning a response like object:

```typescript
import {Controller} from "@tsed/di";
import {Context} from "@tsed/platform-params";

@Controller("/")
export class MyController {
  @Get("/")
  get(@Context() ctx: Context) {
    return {
      statusText: "OK",
      status: 200,
      headers: {},
      data: {}
    };
  }
}
```

### Set response cookie

```typescript
import {Controller} from "@tsed/di";
import {Context} from "@tsed/platform-params";

@Controller("/")
export class MyController {
  @Get("/")
  get(@Context() ctx: Context) {
    // set
    ctx.response.cookie("locale", "fr-FR");

    // clear
    ctx.response.cookie("locale", null);
  }
}
```

### Set response body

```typescript
import {Controller} from "@tsed/di";
import {Context} from "@tsed/platform-params";

@Controller("/")
export class MyController {
  @Get("/")
  get(@Context() ctx: Context) {
    // equivalent to ctx.getResponse().send()
    ctx.response.body(null);
    ctx.response.body(undefined);
    ctx.response.body(true);
    ctx.response.body(false);

    // equivalent to ctx.getResponse().json()
    ctx.response.body({});
    ctx.response.body([]);
    ctx.response.body(new Date());

    // equivalent to readableStream.pipe(ctx.response.raw)
    ctx.response.body(readableStream);
  }
}
```

But prefer returning payload from your method! Ts.ED will handle all data type (Buffer/Stream/Data/Promise/Observable).

### Manipulate original response

You can retrieve the Express\Koa response by using `ctx.getResponse()` method:

```typescript
import {Controller} from "@tsed/di";
import {Context} from "@tsed/platform-params";

@Controller("/")
export class MyController {
  @Get("/")
  get(@Context() ctx: Context) {
    // Express.js
    ctx.getResponse<Express.Response>().status(201).send("Hello");
  }
}
```

## Inject context

Inject @@PlatformContext@@ from a controller and forward the context to another service could be a pain point. See
example:

```typescript
@Injectable()
export class CustomRepository {
  async findById(id: string, ctx: PlatformContext) {
    ctx.logger.info("Where are in the repository");
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

With `v6.26.0`, Ts.ED provide a way to get the @@PlatformContext@@ directly from a Service
called by a controller, using the [`AsyncLocalStorage`](https://nodejs.org/docs/latest-v14.x/api/async_hooks.html#async_hooks_class_asynclocalstorage) provided by Node.js.

This feature is experimental but in reality, the API is stable and the benefit to use it is here!

If you have a Ts.ED version under v6.113.0, you have to install the `@tsed/async-hook-context` package if your environment have the required Node.js (v13+) version.

```bash
npm install --save @tsed/async-hook-context
```

Since `v6.113.0`, the [`AsyncLocalStorage`](https://nodejs.org/docs/latest-v14.x/api/async_hooks.html#async_hooks_class_asynclocalstorage) is automatically enabled.

With this feature, you can inject directly the @@PlatformContext@@ in the service without injecting it in the
controller:

::: code-group
<<< @/docs/snippets/request-context/decorators/request-context-usage.ts [Decorators]
<<< @/docs/snippets/request-context/fn/request-context-usage.ts [Functional API]
:::

To run a method with context in your unit test, you can use the @@runInContext@@ function.

<<< @/docs/snippets/request-context/testing/request-context-usage.spec.ts
