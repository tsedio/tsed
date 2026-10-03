---
name: tsed-di
description: Declare, inject and scope Ts.ED v8 providers and wire lifecycle hooks - @Injectable, @Module, @Controller, @Inject, the functional API (inject, injectMany, lazyInject, constant, refValue, injectable().factory/asyncFactory/class/value, injector, context, logger), ProviderScope, custom tokens, @tsed/hooks ($on, $emit, $asyncEmit, $alter) and request context. Use when writing services or modules with @tsed/di, fixing InjectionError, "Given token is undefined" or undefined injected properties, choosing a scope, adding $onInit/$onDestroy/$onReady, or replacing registerProvider and other deprecated DI APIs.
---

# Ts.ED Dependency Injection and Lifecycle

Register every class the framework must build, resolve dependencies through the injector, and never construct DI-managed classes with `new`.

Read [the DI API reference](references/di-api.md) for signatures, the hook order and the deprecated-API table. Depth: `https://tsed.dev/docs/providers.md`, `https://tsed.dev/docs/custom-providers.md`, `https://tsed.dev/docs/hooks.md`.

## 1. Pick one style per file

All symbols below come from `@tsed/di`. Decorators and the functional API are interchangeable; follow the style already used in the project.

```typescript
import {Injectable, Inject, inject, injectable} from "@tsed/di";
import {UsersRepository} from "./UsersRepository.js";

@Injectable()
export class UsersService {
  @Inject()
  protected repository: UsersRepository; // decorator style

  // or: private readonly repository = inject(UsersRepository); // functional style
}

// Functional registration, without the class decorator:
// export class UsersService { ... }
// injectable(UsersService);
```

- `inject()` works in class field initializers, constructors, factories and hooks of registered providers.
- Do not call `inject()` at module top level: it builds the provider before configuration, imports overrides and test mocks are loaded.
- Do not mix `@Injectable()` and `injectable(Class)` on the same class.
- Controllers: `@Controller("/path")`, or `controller(Class).path("/path")`. Routing belongs to tsed-controllers.

## 2. Choose the provider kind

1. Plain service: `@Injectable()`.
2. Module (groups providers, carries configuration, built before the Server): `@Module({imports: [...]})`.
3. Value, factory, async factory, or implementation chosen at runtime: a custom token (step 3).
4. Middleware and interceptor classes: see tsed-middlewares. `@Interceptor()` and `@Intercept()` are exported by `@tsed/di`.

## 3. Declare custom providers and tokens

```typescript
import {constant, injectable} from "@tsed/di";

export const DbConnection = injectable(Symbol.for("DbConnection"))
  .asyncFactory(async () => {
    const options = constant<DbOptions>("database");
    return connect(options);
  })
  .hooks({$onDestroy: (connection) => connection.close()})
  .token();
export type DbConnection = typeof DbConnection;
```

- Builders: `.value(v)`, `.factory(fn)`, `.asyncFactory(fn)`, `.class(Klass)`; chain `.scope()`, `.deps()`, `.imports()`, `.hooks()`, `.type()`, `.alias()`, and end with `.token()`.
- Inject it with `inject(DbConnection)` or `@Inject(DbConnection) db: DbConnection`.
- Symbol and string tokens always need the explicit token: `@Inject(TOKEN)`. A bare `@Inject()` only works when the TypeScript type is a class.
- Interface abstraction: `export const RetryPolicy = Symbol("RetryPolicy")` plus `export interface RetryPolicy {...}`, then `injectable(RetryPolicy).class(TokenBucket)`.
- Group implementations: `injectable(Foo).type(Bar)` or `@Injectable({type: Bar})`, then `injectMany<Bar>(Bar)` or `@Inject(Bar) bars: Bar[]`.
- Swap an existing provider: `@OverrideProvider(Original)` on the replacement class, or `imports: [{token, useClass}]` in configuration.

## 4. Set the scope

```typescript
import {Injectable, ProviderScope, Scope} from "@tsed/di";

@Injectable()
@Scope(ProviderScope.REQUEST)
export class RequestCart {}
// functional: injectable(RequestCart).scope(ProviderScope.REQUEST);
```

- `SINGLETON` (default): one instance, built at startup.
- `REQUEST`: one instance per request. The controller and every provider on the injection chain must also be `REQUEST`; a singleton parent keeps the first instance forever.
- `INSTANCE`: a new instance on every injection. `inject(Token, {rebuild: true})` forces a fresh one ad hoc.
- Prefer the request context (step 7) over `REQUEST` scope when you only need per-request data.

## 5. Lazy-load heavy providers

```typescript
import {lazyInject} from "@tsed/di";

const service = await lazyInject(() => import("./ReportService.js")); // module must `export default` the class
```

Decorator form: `@LazyInject("ReportService", () => import("./ReportService.js")) reports: Promise<ReportService>`. Only `$onInit` runs for lazy providers. Do not lazy-load controllers, middlewares, or providers that rely on other hooks.

## 6. Use lifecycle hooks

```typescript
import {Injectable, OnDestroy, OnInit} from "@tsed/di";
import {$asyncEmit, $on} from "@tsed/hooks";

@Injectable()
export class QueueService implements OnInit, OnDestroy {
  async $onInit() {}
  async $onDestroy() {}
  $onReady() {}
}

$on("$onReady", () => {}); // subscribe without a class
await $asyncEmit("$orderCreated", [order]); // emit a custom hook; listeners are `$orderCreated(order)` methods
```

- Any method starting with `$` on a provider is registered as a hook listener.
- Order: `$beforeInit` → `$onInit` → `$afterInit` → `$beforeRoutesInit` → `$onRoutesInit` → `$afterRoutesInit` → `$beforeListen` → `$afterListen` → `$onReady`; per request `$onRequest` / `$onResponse`; shutdown `$onDestroy`.
- `OnInit` and `OnDestroy` types come from `@tsed/di`; `BeforeInit`, `AfterInit`, `BeforeRoutesInit`, `OnRoutesInit`, `AfterRoutesInit`, `BeforeListen`, `AfterListen`, `OnReady` come from `@tsed/platform-http`.
- Use `$alter("$name", value, [args])` / `$asyncAlter` for hooks that transform a value. `$emit` is synchronous and does not await listeners.

## 7. Read the request context

```typescript
import {context} from "@tsed/di";
import type {PlatformContext} from "@tsed/platform-http";

const $ctx = context<PlatformContext>();
$ctx.logger.info({event: "LOOKUP", id: $ctx.request.params.id});
```

- In handlers and middlewares use `@Context() $ctx: PlatformContext` from `@tsed/platform-params`.
- In services use `context()` or `@InjectContext() $ctx?: PlatformContext` from `@tsed/di`. Do not store `$ctx` on a singleton.
- Store per-request data with `$ctx.set(key, value)` / `$ctx.get(key)`. Outside a request, `context()` returns a detached `DIContext`, not the request.

## Pitfalls

- `InjectionError` or "Given token is undefined. Could mean a circular dependency problem": two files import each other. Extract the shared logic into a third provider, or resolve late with `inject(Token)` inside the method; never fix it with `new`.
- Property injected with `@Inject()` typed as an interface resolves to `Object` and throws `InvalidPropertyTokenError`. Pass the token.
- Injected property is `undefined` in the constructor under some compilers: set `useDefineForClassFields: false` and enable `experimentalDecorators` + `emitDecoratorMetadata`.
- An async factory resolves before `$onInit`; consumers receive the resolved value, not a promise. Do not `await inject(TOKEN)` in singletons.
- Request-scoped providers only get `$onDestroy`; other `$` hooks are not called on them.
- A provider file that is never imported is never registered. Import it from a module, controller, or `imports`.
- Do not import from `@tsed/common`; use `@tsed/di`, `@tsed/hooks`, `@tsed/platform-http`, `@tsed/platform-params`.

## Checklist

- Every DI-managed class is registered exactly once (`@Injectable`/`@Module`/`@Controller` or `injectable()`/`controller()`).
- Non-class tokens are injected with an explicit token and exported together with a matching type.
- Scopes are consistent along the whole injection chain; no request data lives on a singleton.
- Resources opened in `$onInit` or a factory are closed in `$onDestroy`.
- No `registerProvider`, `injector.emit/alter/alterAsync`, or `@tsed/common` import remains (see the reference table; use tsed-migration for v7 code).
- Settings are read with `constant()` / `refValue()` (tsed-configuration) and providers are tested through `PlatformTest` (tsed-testing).
