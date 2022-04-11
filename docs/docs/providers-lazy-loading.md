---
meta:
  - name: description
    content: Documentation over Providers / DI provided by Ts.ED framework. Use providers to build your backend services.
  - name: keywords
    content: providers di ioc ts.ed express typescript node.js javascript decorators jsonschema class models
---

# Lazy-loading provider

<Badge text="6.81.0+"/>

By default, modules are eagerly loaded, which means that as soon as the application loads, so do all the modules,
whether or not they are immediately necessary. While this is fine for most applications, it may become a bottleneck for
apps running in the **serverless environment**, where the startup latency `("cold start")` is crucial.

Lazy loading can help decrease bootstrap time by loading only modules required by the specific serverless function
invocation. In addition, you could also load other modules asynchronously once the serverless function is "warm" to
speed-up the bootstrap time for subsequent calls even further (deferred modules registration).

## Getting started

To load a provider on-demand, Ts.ED provide decorators @@LazyInject@@ and @@OptionalLazyInject@@. Here is an example
with a @@PlatformExceptions@@:

```typescript
import {Injectable, LazyInject} from "@tsed/di";
import type {PlatformExceptions} from "@tsed/platform-exceptions";

@Injectable()
class MyInjectable {
  @LazyInject("PlatformException", () => import("@tsed/platform-exceptions"))
  private platformExceptions: Promise<PlatformExceptions>;

  async use() {
    try {
      /// do something
    } catch (er) {
      const exceptions = await this.platformExceptions;
      platformExceptions.catch(er, {});
    }
  }
}
```

The LazyInject decorator will load the `node_module` and invoke automatically the `PlatformException` exported class,
only when the decorated property will be used by your code.

::: tip

Lazy-loaded provider is `cached` on the first call.
That means, each consecutive call will be very fast and will return a cached instance, instead of loading the provider again.

:::

Create you own lazy injectable doesn't require special things, just declare a module or an injectable service is enough:

```typescript
import {Module} from "@tsed/di";

@Module({
  // works also with @Injectable
  imports: [] // Use the imports field if you have services to build
})
export class MyModule {
  $onInit() {
    // The hook will be called once the module is loaded
  }
}
```

Then use it:

```typescript
import {Injectable, LazyInject} from "@tsed/di";
import type {MyModule} from "../MyModule.ts";

@Injectable()
class MyInjectable {
  @LazyInject("MyModule", () => import("../MyModule.ts"))
  private myModule: Promise<MyModule>;

  async use() {
    const myModule = await this.myModule;

    myModule.doSomething();
  }
}
```

::: warning

If you use Webpack, make sure to update your `tsconfig.json` file - setting `compilerOptions.module` to `"esnext"` and adding `compilerOptions.moduleResolution` property with `"node"` as a value:

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "node"
  }
}
```

:::

## Lazy loading programmatically

Ts.ED provide also a way to lazy load a provider programmatically. You just need to inject the @@InjectorService@@ in service:

```typescript
import {Injectable, Inject, InjectorService} from "@tsed/di";

@Injectable()
class MyService {
  @Inject()
  protected injector: InjectorService;

  async load() {
    const {MyModule} = await import("../lazy/my-module.ts");
    const myModule = await this.injector.lazyInvoke(MyModule);

    myModule.doSomething();
  }
}
```

## Limitation

Some providers cannot be lazy loaded:

- Controllers,
- Middlewares,
- All providers that need to run a specific hook (excepted `$onInit` hook).
