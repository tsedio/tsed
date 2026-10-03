---
name: tsed-middlewares
description: Add cross-cutting request logic to a Ts.ED v8 application with middlewares, auth guards, interceptors and pipes. Use when writing a @Middleware class, registering global Express/Koa/Fastify middlewares through the `middlewares` configuration or $beforeRoutesInit, applying @UseBefore/@Use/@UseAfter/@UseBeforeEach, building a custom auth decorator with @UseAuth and useDecorators, wrapping service methods with @Interceptor/@Intercept, transforming a parameter with @UsePipe, caching with @UseCache, or when the error "middleware cannot be added on $beforeInit hook" appears.
---

# Ts.ED Middlewares, Interceptors and Pipes

Pick the narrowest tool first, then implement it as an injectable class.

| Need                                                                                                    | Use                                | Package                                     |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------- |
| Run before/after a route with access to request, response and endpoint metadata (auth, headers, tenant) | Middleware                         | `@tsed/platform-middlewares`                |
| Wrap any injectable method: timing, retry, fallback, caching, transactions                              | Interceptor                        | `@tsed/di`                                  |
| Transform or validate one handler parameter (id to entity, parsing)                                     | Pipe                               | `@tsed/platform-params`, `@tsed/schema`     |
| React to application or request lifecycle (`$onRequest`, `$onResponse`, `$onReady`)                     | Hook                               | see tsed-di, https://tsed.dev/docs/hooks.md |
| Change the shape of every response or error                                                             | Response filter / exception filter | see tsed-exceptions                         |

Never import from `@tsed/common`.

## 1. Write a middleware

```typescript
import {Unauthorized} from "@tsed/exceptions";
import {Middleware, type MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";

@Middleware()
export class ApiKeyMiddleware implements MiddlewareMethods {
  use(@Context() $ctx: Context) {
    const options = $ctx.endpoint.get(ApiKeyMiddleware) || {};
    if ($ctx.request.get("x-api-key") !== options.key) {
      throw new Unauthorized("Invalid API key");
    }
  }
}
```

1. Implement `use(...)`. Inject what is needed with parameter decorators (`@Context()`, `@HeaderParams()`, `@QueryParams()`); inject services with `@Inject()` or `inject()`.
2. Finish by returning or awaiting. Do not call `next()`; throw an exception from `@tsed/exceptions` to stop the request.
3. Read per-endpoint options with `$ctx.endpoint.get(MiddlewareClass)`. This is only available for endpoint-level middlewares, not global ones.
4. Use `$ctx.request` / `$ctx.response` (platform abstractions) so the code stays portable across Express, Koa and Fastify.

## 2. Attach to controllers and endpoints

1. `@UseBefore(M)`: before the handler. `@Use(M)`: just before the handler, after `@UseBefore`. `@UseAfter(M)`: after the handler when it returned no data.
2. On a class, `@UseBefore` runs once for the controller; `@UseBeforeEach(M)` runs before each of its endpoints.
3. All four accept Ts.ED middleware classes or raw framework functions, and come from `@tsed/platform-middlewares`.
4. Call order: global middlewares, controller `@UseBefore`, controller `@UseBeforeEach`, endpoint `@UseBefore`, controller `@Use`, endpoint `@Use`, handler, endpoint `@UseAfter`, send response. Once a handler returns data the response is sent and later `@UseAfter` and global middlewares are skipped.
5. Prefer an interceptor or response filter over `@UseAfter` for post-processing.
6. Do not write Express error middlewares (`@Err()`, four-argument functions); use exception filters (tsed-exceptions).

## 3. Register global middlewares

```typescript
import {Env} from "@tsed/core";
import {Configuration} from "@tsed/di";
import compression from "compression";
import helmet from "helmet";
import {RequestIdMiddleware} from "./middlewares/RequestIdMiddleware.js";

@Configuration({
  middlewares: [
    {use: helmet(), hook: "$afterInit"},
    "json-parser",
    {use: "urlencoded-parser", options: {extended: true}},
    {use: compression(), env: Env.PROD},
    RequestIdMiddleware
  ]
})
export class Server {}
```

1. Each entry is a function, a Ts.ED middleware class, a string, or `{use, hook?, env?, options?}`. Default hook: `$beforeRoutesInit`.
2. Built-in strings: `json-parser`, `urlencoded-parser`, `text-parser`, `raw-parser`. Any other string is imported as a module and called with `options`.
3. Ts.ED middleware classes need the request context: register them on `$beforeRoutesInit` or later. On `$beforeInit`, `$onInit` or `$afterInit` only raw framework middlewares are accepted and a class throws at startup.
4. Alternative: inject `PlatformApplication` from `@tsed/platform-http` in the server and call `this.app.use(M)` inside `$beforeRoutesInit()` or `$afterRoutesInit()`. Hook registrations run before the `middlewares` list.
5. Raw middlewares are framework specific. Do not register an Express middleware in a Koa or Fastify application.

## 4. Build an auth decorator

```typescript
import {useDecorators} from "@tsed/core";
import {UseAuth} from "@tsed/platform-middlewares";
import {In, Returns, Security} from "@tsed/schema";
import {AuthMiddleware} from "../middlewares/AuthMiddleware.js";

export function Auth(options: {role?: string; scopes?: string[]} = {}): Function {
  return useDecorators(
    UseAuth(AuthMiddleware, options),
    Security("oauth", ...(options.scopes || [])),
    In("header").Name("Authorization").Type(String).Required(true),
    Returns(401),
    Returns(403)
  );
}
```

1. `UseAuth(Guard, options)` adds the guard as `@UseBefore` once and merges `options` into the endpoint store. Read them with `$ctx.endpoint.get(AuthMiddleware)`.
2. Works on a method or on a class (applies to every endpoint; class-level and method-level options are merged in the endpoint store).
3. Throw `Unauthorized` for missing or invalid credentials and `Forbidden` for insufficient rights.
4. The `Security` name must match a security scheme declared in the OpenAPI configuration (tsed-openapi). Passport and OIDC: https://tsed.dev/docs/authentication.md.

## 5. Write an interceptor

```typescript
import {Interceptor, type InterceptorContext, type InterceptorMethods, type InterceptorNext} from "@tsed/di";

@Interceptor()
export class TimingInterceptor implements InterceptorMethods {
  async intercept(context: InterceptorContext, next: InterceptorNext) {
    const start = Date.now();
    const result = await next();
    console.log(String(context.propertyKey), Date.now() - start, context.options);
    return result;
  }
}
```

1. Apply with `@Intercept(TimingInterceptor, options)` from `@tsed/di` on a method, or on a class to wrap all its methods. Works on services and controllers.
2. `context` exposes `target`, `propertyKey`, `args`, `options`. Always return the result of `next()`, or a fallback value.
3. There is no `@UseInterceptor` decorator (a doc snippet mentions it by mistake).
4. Response caching: `@UseCache()` from `@tsed/platform-cache` is a ready-made interceptor (GET endpoints and service methods). Setup: https://tsed.dev/docs/cache.md.

## 6. Write a pipe

```typescript
import {Injectable} from "@tsed/di";
import {NotFound} from "@tsed/exceptions";
import type {JsonParameterStore, PipeMethods} from "@tsed/schema";

@Injectable()
export class UserPipe implements PipeMethods<string, Promise<User>> {
  async transform(id: string, metadata: JsonParameterStore) {
    const user = await findUser(id);
    if (!user) throw new NotFound("User not found");
    return user;
  }
}
```

1. Use it on a parameter: `@RawPathParams("id") @UsePipe(UserPipe) user: User` (both from `@tsed/platform-params`). Use the `Raw*` decorator when the pipe returns an object, otherwise the built-in deserializer and validator also run on the raw value.
2. Package it as `useDecorators(RawPathParams(expression), UsePipe(UserPipe, options))`; read options with `metadata.store.get(UserPipe)`. When a pipe throws, the handler is not called and the error goes to the exception filters.

## Pitfalls

- Class middleware registered with `hook: "$afterInit"`: startup error. Remove the hook or use `$beforeRoutesInit`.
- `$ctx.endpoint` is undefined in a global middleware: the route is not resolved yet. Move the logic to `@UseBefore`.
- Calling `next()` and also returning or throwing: double response. Do not inject `@Next()` in Ts.ED middlewares.
- Body is empty: no body parser registered (`json-parser` / `urlencoded-parser`).
- Pipe receives an already mapped value, or validation fails before the pipe: use the `Raw*` parameter decorator.

## Checklist

- Narrowest mechanism chosen; middleware decorated with `@Middleware()`, implements `use`, throws typed exceptions.
- Global entries use a valid hook; class middlewares are on `$beforeRoutesInit` or later.
- Auth decorator documents `Security`, 401 and 403.
- No `@tsed/common` import; relative imports end with `.js`.
- Behavior covered by an integration test (see tsed-testing).

Depth: https://tsed.dev/docs/middlewares.md, https://tsed.dev/docs/interceptors.md, https://tsed.dev/docs/pipes.md, https://tsed.dev/docs/authentication.md, https://tsed.dev/docs/request-context.md.
