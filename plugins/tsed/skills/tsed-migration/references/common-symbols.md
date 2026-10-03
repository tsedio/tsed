# `@tsed/common` symbol → owning package (Ts.ED v8)

Verified against the v8 sources. In v8, `@tsed/common` is only this barrel:

```ts
import "@tsed/logger";
import "@tsed/logger-file";

export * from "@tsed/di";
export {$log, Logger} from "@tsed/logger";
export * from "@tsed/platform-exceptions";
export * from "@tsed/platform-http";
export * from "@tsed/platform-http/testing";
export * from "@tsed/platform-middlewares";
export * from "@tsed/platform-params";
export * from "@tsed/platform-response-filter";
export * from "@tsed/platform-router";
export {AcceptMime, All, Delete, Get, Head, Location, Options, Patch, Post, Put, Redirect, View} from "@tsed/schema";
```

Anything else that v7 code imported from `@tsed/common` (most of `@tsed/schema`, `@tsed/core`, `@tsed/exceptions`) must already be imported from its own package in v8.

## Lookup procedure for a symbol not listed here

1. Search the installed typings: `grep -rl "export declare .* <Symbol>\b" node_modules/@tsed/*/lib/types`.
2. Or look it up in `https://tsed.dev/api.json` (`symbolName` → `module`).
3. Import from the package root (`@tsed/<package>`), never from a deep `lib/` path. The only sub-path used here is `@tsed/platform-http/testing`.

## `@tsed/di`

| Kind       | Symbols                                                                                                                                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decorators | `Controller`, `Injectable`, `Service`, `Module`, `Configuration`, `Inject`, `Constant`, `Value`, `Scope`, `Interceptor`, `Intercept`, `OverrideProvider`, `Opts`, `UseOpts`, `LazyInject`, `OptionalLazyInject`, `AutoInjectable`, `InjectContext` |
| Functions  | `inject`, `injectMany`, `lazyInject`, `injectable`, `controller`, `constant`, `refValue`, `configuration`, `injector`, `logger`, `context`, `getContext`, `runInContext`                                                                           |
| Classes    | `InjectorService`, `DIContext`, `Provider`, `DITest`                                                                                                                                                                                               |
| Types      | `ProviderScope`, `ProviderType`, `InterceptorMethods`, `InterceptorContext`, `OnInit`                                                                                                                                                              |

## `@tsed/schema`

| Kind       | Symbols                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| Routing    | `Get`, `Post`, `Put`, `Patch`, `Delete`, `Head`, `Options`, `All`                                      |
| Response   | `Returns`, `Status`, `Header`, `ContentType`, `Redirect`, `Location`, `View`, `AcceptMime`             |
| Model      | `Property`, `Required`, `Name`, `Ignore` and the other schema decorators (see the `tsed-models` skill) |
| Metadata   | `EndpointMetadata`, `ParamMetadata`                                                                    |
| Interfaces | `PipeMethods`                                                                                          |

## `@tsed/platform-http`

| Kind                 | Symbols                                                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Classes              | `PlatformBuilder`, `PlatformApplication`, `PlatformContext`, `PlatformRequest`, `PlatformResponse`, `PlatformHandler`, `PlatformAdapter` |
| Parameter decorators | `Req`, `Request`, `Res`, `Response`, `Next`, `Err`                                                                                       |
| Functions            | `application`, `adapter`, `createContext`                                                                                                |
| Hook interfaces      | `BeforeRoutesInit`, `AfterRoutesInit`, `OnReady`                                                                                         |
| Types                | `PlatformConfiguration` (deprecated alias of `DIConfiguration`), `PlatformStaticsOptions`                                                |

## `@tsed/platform-http/testing`

`PlatformTest`. Test code only; it is not part of the production bundle.

## `@tsed/platform-params`

| Kind       | Symbols                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decorators | `BodyParams`, `RawBodyParams`, `PathParams`, `RawPathParams`, `QueryParams`, `RawQueryParams`, `HeaderParams`, `Cookies`, `CookiesParams`, `Session`, `Locals`, `Context` |
| Pipes      | `UsePipe`, `UseParam`, `UseParamType`, `UseType`, `UseValidation`, `UseDeserialization`, `ValidationPipe`, `DeserializerPipe`, `ParseExpressionPipe`                      |
| Errors     | `ValidationError`, `ParamValidationError`, `RequiredValidationError`                                                                                                      |
| Enums      | `ParamTypes`                                                                                                                                                              |

`Context` is both the parameter decorator and the type of the injected request context.

## `@tsed/platform-middlewares`

`Middleware`, `MiddlewareMethods`, `Use`, `UseBefore`, `UseAfter`, `UseBeforeEach`, `UseAuth`, `AuthOptions`.

## `@tsed/platform-exceptions`

`Catch`, `ExceptionFilterMethods`, `PlatformExceptions`, `ResourceNotFound`.

## `@tsed/platform-response-filter`

`ResponseFilter`, `ResponseFilterMethods`, `PlatformResponseFilter`, `TemplateRenderError`.

## `@tsed/platform-router`

`PlatformRouter`, `PlatformRouters`, `PlatformLayer`, `PlatformHandlerMetadata`, `PlatformHandlerType`, `useContextHandler`.

## Other packages that v7 code often reached through `@tsed/common`

| Symbols                                                                  | Import from             |
| ------------------------------------------------------------------------ | ----------------------- |
| `$log`, `Logger`                                                         | `@tsed/logger`          |
| `Exception`, `BadRequest`, `NotFound` and the other HTTP exceptions      | `@tsed/exceptions`      |
| `Store`, `useDecorators`                                                 | `@tsed/core`            |
| `MultipartFile`, `MulterOptions`, `MulterFileSize`, `PlatformMulterFile` | `@tsed/platform-multer` |
| `PlatformViews`                                                          | `@tsed/platform-views`  |
| `PlatformCache`                                                          | `@tsed/platform-cache`  |
| `$on`, `$once`, `$off`, `$emit`, `$asyncEmit`, `$alter`, `$asyncAlter`   | `@tsed/hooks`           |

## Sorting imports after the split

Keep one import statement per package and add each package to `dependencies` in `package.json`. All `@tsed/*` runtime packages must share the same version.
