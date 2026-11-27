# Ts.ED DI API reference (v8)

Everything is exported by `@tsed/di` unless another package is named.

## Functional API

| Function             | Signature                                                   | Notes                                                                                                  |
| -------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `inject`             | `inject<T>(token, opts?: {useOpts?, rebuild?, locals?}): T` | Resolves through the global injector.                                                                  |
| `injectMany`         | `injectMany<T>(type: string \| symbol, opts?): T[]`         | All providers registered with `.type(type)`.                                                           |
| `lazyInject`         | `lazyInject<T>(() => import("./x.js")): Promise<T>`         | Module must have a default export; runs `$onInit` once.                                                |
| `optionalLazyInject` | same as `lazyInject`                                        | Resolves `undefined` when the import fails.                                                            |
| `constant`           | `constant<T>(expression, defaultValue?): T \| undefined`    | Reads the configuration at call time.                                                                  |
| `refValue`           | `refValue<T>(expression, defaultValue?): {value: T}`        | Live getter/setter on the configuration.                                                               |
| `configuration`      | `configuration(): TsED.Configuration & DIConfiguration`     | `.get(key, default?)`, `.set(key, value)`. `configuration(Class, {...})` attaches settings to a class. |
| `injectable`         | `injectable(token, opts?)`                                  | Returns a provider builder (below).                                                                    |
| `controller`         | `controller(Class).path("/x")`                              | Builder for controllers.                                                                               |
| `interceptor`        | `interceptor(Class)`                                        | Builder for interceptors.                                                                              |
| `injector`           | `injector(): InjectorService`                               | `.get`, `.has`, `.resolve`, `.invoke`, `.getMany`, `.settings`, `.providers`.                          |
| `context`            | `context<Ctx = DIContext>(): Ctx`                           | Current async-local request context.                                                                   |
| `contextLogger`      | `contextLogger()`                                           | Shortcut for `context().logger`.                                                                       |
| `logger`             | `logger()`                                                  | Application logger (`injector().logger`). See tsed-logger.                                             |
| `runInContext`       | `runInContext(ctx, cb): Promise<Result>`                    | Runs `cb` with `ctx` as the current context.                                                           |

## Provider builder

`injectable(token)` then chain:

- Kind: `.class(Klass)`, `.factory(fn)`, `.asyncFactory(fn)`, `.value(v)`.
- Metadata: `.scope(ProviderScope.X)`, `.type(tokenOrType)`, `.alias(token)`, `.deps([...])`, `.imports([...])`, `.hooks({$onInit(instance) {}, $onDestroy(instance) {}})`, `.configuration({...})`, `.set(key, value)`.
- Controllers only: `.path()`, `.children([...])`, `.middlewares({...})`.
- End: `.token()` returns the typed token; `.inspect()` returns the `Provider`.

```typescript
import {injectable} from "@tsed/di";

export const Clock = injectable(Symbol.for("Clock"))
  .value({now: () => Date.now()})
  .token();
export type Clock = typeof Clock;

export const ConfigService = injectable(Symbol.for("ConfigService"))
  .class(process.env.NODE_ENV === "production" ? ProdConfigService : DevConfigService)
  .token();
```

Inside a factory, resolve dependencies with `inject()` and `constant()` instead of declaring `.deps()`.

## Decorators

| Decorator                                                          | Use                                                                                      |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `@Injectable(opts?)`                                               | Register a class. `opts`: `token`, `scope`, `type`, `deps`, `imports`, `hooks`, `alias`. |
| `@Service()`                                                       | Alias of `@Injectable()`.                                                                |
| `@Module(opts?)`                                                   | Singleton provider of type module; `opts` also accepts configuration keys and `imports`. |
| `@Controller(path \| {path, children, middlewares, scope})`        | Register a controller.                                                                   |
| `@Inject(token?, transformOrOpts?)`                                | Property or constructor parameter injection.                                             |
| `@Scope(scope = ProviderScope.REQUEST)`                            | Set the scope.                                                                           |
| `@Constant(expression, default?)` / `@Value(expression, default?)` | Bind configuration (see tsed-configuration).                                             |
| `@Configuration()` on a constructor parameter                      | Inject the whole configuration object.                                                   |
| `@Opts` + `@UseOpts({...})`                                        | Configurable provider; `@Opts` forces `INSTANCE` scope.                                  |
| `@LazyInject(key, resolver)` / `@OptionalLazyInject(...)`          | Lazy property returning a promise.                                                       |
| `@OverrideProvider(Original)`                                      | Replace the class of an existing provider.                                               |
| `@AutoInjectable()`                                                | Allow `new Klass(arg)` with remaining constructor params resolved by DI.                 |
| `@InjectContext(transform?)`                                       | Property getter returning `context()`.                                                   |
| `@Interceptor()` / `@Intercept(InterceptorClass, opts?)`           | Declare and apply an interceptor (`intercept(context, next)`).                           |

## Scopes

`ProviderScope.SINGLETON = "singleton"`, `ProviderScope.REQUEST = "request"`, `ProviderScope.INSTANCE = "instance"`.

Default scope per provider type can be changed with the `scopes` configuration key, for example `scopes: {[ProviderType.CONTROLLER]: ProviderScope.REQUEST}`.

## Hooks

`@tsed/hooks` exports `$on(event, cb)`, `$on(event, ref, cb)`, `$once`, `$off(ref)` / `$off(event, cb)`, `$emit(event, args?)`, `$asyncEmit(event, args?)`, `$alter(event, value, args?)`, `$asyncAlter(event, value, args?)`.

Built-in events, in order:

| Event                                | When                                                                    |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `$beforeInit`                        | Before providers are merged and configuration is resolved.              |
| `$afterResolveConfiguration`         | Configuration merged; `@tsed/config` sources load here.                 |
| `$beforeInvoke` / `$afterInvoke`     | Around each provider instantiation (`$on("$beforeInvoke", Token, cb)`). |
| `$onInit`                            | All async and singleton providers are built.                            |
| `$afterInit`                         | Injector loaded, before routes.                                         |
| `$beforeRoutesInit`                  | Global middlewares and statics are mounted here.                        |
| `$onRoutesInit` / `$afterRoutesInit` | Controllers mapped / routes ready.                                      |
| `$beforeListen` / `$afterListen`     | Around `platform.listen()`.                                             |
| `$onReady`                           | Server is ready.                                                        |
| `$onRequest` / `$onResponse`         | Each request, receives `$ctx`.                                          |
| `$onDestroy`                         | `platform.stop()` or injector destroy.                                  |

Hook interfaces: `OnInit`, `OnDestroy` from `@tsed/di`; `BeforeInit`, `AfterInit`, `BeforeRoutesInit`, `OnRoutesInit`, `AfterRoutesInit`, `BeforeListen`, `AfterListen`, `OnReady` from `@tsed/platform-http`.

Custom hook:

```typescript
import {Module} from "@tsed/di";
import {$asyncAlter, $asyncEmit} from "@tsed/hooks";

@Module()
export class OrdersModule {
  async publish(order: Order) {
    const enriched = await $asyncAlter("$alterOrder", order, [this]);
    await $asyncEmit("$orderCreated", [enriched]);
  }
}
// Any provider with a `$orderCreated(order)` or `$alterOrder(order)` method is called.
```

## Request context

- `PlatformContext` (`@tsed/platform-http`): `$ctx.request` (`PlatformRequest`: `headers`, `body`, `params`, `query`, `cookies`, `session`, `url`, `method`, `get(name)`), `$ctx.response` (`PlatformResponse`), `$ctx.logger`, `$ctx.id`, `$ctx.data`, `$ctx.endpoint`, `$ctx.set/get/has/delete`, `$ctx.cache(key, cb)`, `$ctx.getRequest()` / `$ctx.getResponse()` for the raw framework objects.
- `@Context()` / `@Context("key")` parameter decorator: `@tsed/platform-params`.
- Docs: `https://tsed.dev/docs/request-context.md`, `https://tsed.dev/docs/injection-scopes.md`, `https://tsed.dev/docs/providers-lazy-loading.md`.

## Deprecated APIs and replacements

| Deprecated                                     | Replacement                                                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `registerProvider({provide, useFactory, ...})` | `injectable(token).factory(...)` (and `.asyncFactory`, `.value`, `.class`)                               |
| `provide` option                               | `token`                                                                                                  |
| `injector.emit()`                              | `$asyncEmit()` from `@tsed/hooks`                                                                        |
| `injector.alter()` / `injector.alterAsync()`   | `$alter()` / `$asyncAlter()` from `@tsed/hooks`                                                          |
| `injector.getProvider()` / `getProviders()`    | `injector().providers.get()` / `.getMany()`                                                              |
| `GlobalProviders`                              | `Provider.Registry`                                                                                      |
| `ControllerProvider`                           | `Provider`                                                                                               |
| `PlatformBuilder#injector`                     | `injector()`                                                                                             |
| `PlatformTest.inject([...], cb)`               | `inject()` or `PlatformTest.invoke()` (see tsed-testing)                                                 |
| `@tsed/common` imports                         | `@tsed/di`, `@tsed/platform-http`, `@tsed/platform-params`, `@tsed/platform-middlewares`, `@tsed/schema` |
