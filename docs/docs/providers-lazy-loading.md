---
meta:
  - name: description
    content: Documentation over Providers / DI provided by Ts.ED framework. Use providers to build your backend services.
  - name: keywords
    content: providers di ioc ts.ed express typescript node.js javascript decorators jsonschema class models
---

# Lazy-loading provider

By default, modules are eagerly loaded, which means that as soon as the application loads, so do all the modules,
whether they are immediately necessary. While this is fine for most applications, it may become a bottleneck for
apps running in the **serverless environment**, where the startup latency `("cold start")` is crucial.

Lazy loading can help decrease bootstrap time by loading only modules required by the specific serverless function
invocation. In addition, you could also load other modules asynchronously once the serverless function is "warm" to
speed up the bootstrap time for subsequent calls even further (deferred modules registration).

## Usage

To load a provider on-demand, Ts.ED provide decorators @@LazyInject@@ and @@OptionalLazyInject@@. Here is an example
with a @@PlatformExceptions@@:

::: code-group
<<< @/docs/snippets/providers/decorators/lazy-inject-example.ts [Decorators]
<<< @/docs/snippets/providers/fn/lazy-inject-example.ts [Functional API]
:::

The LazyInject decorator will load the `node_module` and invoke automatically the `PlatformException` exported class,
only when the decorated property will be used by your code.

::: tip

Lazy-loaded provider is `cached` on the first call.
That means, each consecutive call will be very fast and will return a cached instance, instead of loading the provider again.

:::

Create you own lazy injectable doesn't require special things, just declare a module or an injectable service with default export:

::: code-group
<<< @/docs/snippets/providers/decorators/lazy-inject-declaration.ts [Decorators]
<<< @/docs/snippets/providers/fn/lazy-inject-declaration.ts [Functional API]
:::

Then use it:

::: code-group
<<< @/docs/snippets/providers/decorators/lazy-inject-usage.ts [Decorators]
<<< @/docs/snippets/providers/fn/lazy-inject-usage.ts [Functional API]
:::

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

## Limitation

Some providers cannot be lazy loaded:

- Controllers,
- Middlewares,
- All providers that need to run a specific hook (excepted `$onInit` hook).
