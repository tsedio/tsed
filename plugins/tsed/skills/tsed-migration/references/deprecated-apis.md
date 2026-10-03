# Deprecated and removed APIs in Ts.ED v8

Every entry is taken from `@deprecated` tags or removals in the v8 sources. Deprecated APIs still work in v8; removed ones do not.

## Removed in v8

| Removed                                                            | Replacement                                                                                 |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| CommonJS builds of every `@tsed/*` package                         | ESM only: `"type": "module"`, `NodeNext`, `.js` import extensions                           |
| Proxy access on the configuration (`settings.myKey`)               | `settings.get("myKey")`, `constant("myKey")`, `@Constant("myKey")`                          |
| `Configurable`, `Enumerable`, `Writable` decorators (`@tsed/core`) | None. Use plain property descriptors                                                        |
| `ReadOnly`, `Deprecated` decorators from `@tsed/core`              | `ReadOnly` and `Deprecated` from `@tsed/schema` are schema decorators, not the same feature |
| Automatic import of `@tsed/platform-log-middleware`                | `import "@tsed/platform-log-request";` and `logger: {logRequest: true}`                     |
| Automatic registration of view engines                             | Explicit import, for example `import "@tsed/engines/PugEngine.js";`                         |
| `@tsed/schema`, `@tsed/core` re-exports through `@tsed/common`     | Import from the owning package (see `common-symbols.md`)                                    |
| `useDefineForClassFields: true` support                            | Set it to `false` in `tsconfig.json`, `.swcrc`, Vite and Vitest SWC options                 |

## Deprecated in `@tsed/di`

| Deprecated                                     | Replacement                                                      |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| `registerProvider({provide, useFactory, ...})` | `injectable(token).factory(() => ...).token()`                   |
| `provide` option / `Provider#provide`          | `token`                                                          |
| `GlobalProviders`                              | `Provider.Registry`                                              |
| `ControllerProvider`                           | `Provider`                                                       |
| `injector.getProvider(token)`                  | `injector().providers.get(token)`                                |
| `injector.getProviders(type)`                  | `injector().providers.getMany(type)`                             |
| `injector.emit(event, ...args)`                | `$asyncEmit(event, ...args)` from `@tsed/hooks`                  |
| `injector.alter(event, value, ...args)`        | `$alter(event, value, ...args)` from `@tsed/hooks`               |
| `injector.alterAsync(event, value, ...args)`   | `$asyncAlter(event, value, ...args)` from `@tsed/hooks`          |
| `bindContext(cb)`                              | `AsyncResource.bind(cb)` from `node:async_hooks` (what it wraps) |

Provider declaration, before and after:

```ts
// v7 style, deprecated
import {Configuration, registerProvider} from "@tsed/di";

export const CONNECTION = Symbol.for("CONNECTION");

registerProvider({
  provide: CONNECTION,
  deps: [Configuration],
  useFactory: (settings: Configuration) => createConnection(settings.get("database"))
});
```

```ts
// v8
import {constant, injectable} from "@tsed/di";

import {createConnection, type DatabaseOptions} from "./createConnection.js";

export const CONNECTION = injectable(Symbol.for("CONNECTION"))
  .factory(() => createConnection(constant<DatabaseOptions>("database")))
  .hooks({
    $onDestroy(connection) {
      return connection.close();
    }
  })
  .token();
```

Optional modernisation (decorators remain supported; see the `tsed-di` skill):

| Decorator style                            | Functional equivalent                             |
| ------------------------------------------ | ------------------------------------------------- |
| `@Inject() service: MyService`             | `service = inject(MyService)`                     |
| `@Constant("key", def) value: string`      | `value = constant("key", def)`                    |
| `@Value("key") value: string`              | `value = refValue<string>("key")` (read `.value`) |
| `@Configuration() settings: Configuration` | `settings = configuration()`                      |
| `@Injectable() class X {}`                 | `class X {}` then `injectable(X)`                 |
| `global.injector = platform.injector`      | `injector()` or `inject(Token)` anywhere          |

In v8, properties declared with `@Inject`, `@Constant`, `@Configuration` are available inside the constructor.

## Deprecated in `@tsed/platform-http` and related packages

| Deprecated                                                                    | Replacement                                                        |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `PlatformBuilder#injector` (`platform.injector`)                              | `injector()` from `@tsed/di`                                       |
| `PlatformConfiguration`                                                       | `Configuration` type or `DIConfiguration` from `@tsed/di`          |
| `PlatformTest.inject([Token], fn)`                                            | `await PlatformTest.invoke(Token)` or `PlatformTest.get(Token)`    |
| `MultipartFile`, `MulterOptions`, `MulterFileSize` from `@tsed/platform-http` | Same names from `@tsed/platform-multer`                            |
| `PlatformMulterMiddleware` from `@tsed/platform-http` (since 8.5)             | `PlatformMulterMiddleware` from `@tsed/platform-multer`            |
| `PlatformAcceptMimesMiddleware` from `@tsed/platform-http` (since 8.16)       | `PlatformAcceptMimesMiddleware` from `@tsed/platform-accept-mimes` |
| `PlatformLogMiddleware` (`@tsed/platform-log-middleware`)                     | `@tsed/platform-log-request`                                       |
| `View` from `@tsed/platform-views`                                            | `View` from `@tsed/schema`                                         |

## Request logging in v8

```ts
import "@tsed/platform-log-request";

import {Configuration} from "@tsed/di";

@Configuration({
  logger: {
    logRequest: true
  }
})
export class Server {}
```

`logger.alterLog(level, data, $ctx)` customises the logged object. See the `tsed-logger` skill.

## Search commands

```sh
grep -rnE "registerProvider|GlobalProviders|ControllerProvider" src
grep -rnE "\.getProviders?\(|\.alterAsync\(|injector\.(emit|alter)\(" src
grep -rnE "PlatformTest\.inject\(" src test
grep -rnE "PlatformLogMiddleware|@tsed/platform-views\"" src
grep -rnE "from \"@tsed/common\"" src test
```

## Version alignment

- `@tsed/*` framework packages: one identical 8.x version.
- `@tsed/logger*`, `@tsed/barrels`, `@tsed/cli*`: independent version lines; do not force them to the framework version.
- The migration guide mentions `@tsed/cli` `^6.1.0`; the current CLI major is 7 and requires Node.js >= 22. See the `tsed-cli` skill.
