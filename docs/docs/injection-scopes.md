# Injection scopes

The scope of a [Provider](/docs/providers.md) defines the lifecycle and visibility of that bean in the context in which it is used.

Ts.ED DI defines 3 types of @@Scope@@: `singleton`, `request` and `instance` which can be used on `Provider`, `Service`, `Middleware` and `Controller`.

## Singleton scope

Singleton scope is the default behavior of all providers. That means all providers are created during server initialization.

<<< @/docs/snippets/providers/scope-singleton.ts

::: tip Note
In this example all requests on `/random` endpoint return the same random value.
:::

## Request scope

Request scope will create a new instance of provider for each incoming request. A new container will be created
and attached to the request. It will contain all providers annotated by `@Scope(ProviderScope.REQUEST)`.

<<< @/docs/snippets/providers/scope-request.ts

Each request on `/random` will return a different random value.

### Chain with Service

It is also possible to use `@Scope(ProviderScope.REQUEST)` on a service if your service is injected on a controller
which is annotated by `@Scope(ProviderScope.REQUEST)` too.

Here is a working example:

<<< @/docs/snippets/providers/scope-chain.ts

And here is an unworking example:

<<< @/docs/snippets/providers/scope-chain-fail.ts

::: warning
The `SINGLETON` annotation avoids the `@Scope(ProviderScope.REQUEST)` annotation put on MyService.
:::

::: warning
The `@Scope(ProviderScope.REQUEST)` annotation has no effect on Global middlewares.
:::

### Performance

Using request-scoped providers will obviously affect application performance.
Even though Ts.ED is trying to cache as much metadata as possible, it will still have to create an instance of your class on each request.
Hence, it will slow down your average response time and overall benchmarking result.
If your provider doesn't necessarily need to be request-scoped, you should rather stick with the singleton scope.

## Instance scope

Instance scope used on a provider tells the injector to create a new instance each time the provider is injected to another one.

<<< @/docs/snippets/providers/scope-instance.ts
