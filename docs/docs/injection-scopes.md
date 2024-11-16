# Injection scopes

The scope of a [Provider](/docs/providers.md) defines the lifecycle and visibility of that bean in the context in which it is used.

Ts.ED DI defines 3 types of @@ProviderScope@@ which can be used on injectable classes:

- `singleton`: The default scope. The provider is created during server initialization and is shared across all requests.
- `request`: A new instance of the provider is created for each incoming request.
- `instance`: A new instance of the provider is created each time it is injected.

## Singleton scope

Singleton scope is the default behavior of all providers. That means all providers are created during server initialization.

::: code-group
<<< @/docs/snippets/providers/decorators/scope-singleton.ts [Decorators]
<<< @/docs/snippets/providers/fn/scope-singleton.ts [Functional API]
:::

In this example all requests on `/random` endpoint return the same random value.

## Request scope

Request scope will create a new instance of provider for each incoming request. A new container will be created
and attached to the request. It will contain all providers annotated by `@Scope(ProviderScope.REQUEST)`.

::: code-group
<<< @/docs/snippets/providers/decorators/scope-request.ts [Decorators]
<<< @/docs/snippets/providers/fn/scope-request.ts [Functional API]
:::

Each request on `/random` will return a different random value.

### Chain with Service

It is also possible to use `@Scope(ProviderScope.REQUEST)` on a service if your service is injected on a controller
which is annotated by `@Scope(ProviderScope.REQUEST)` too.

Here is a working example:

::: code-group
<<< @/docs/snippets/providers/decorators/scope-chain.ts [Decorators]
<<< @/docs/snippets/providers/fn/scope-chain.ts [Functional API]
:::

And here is an example that doesn't work:

::: code-group
<<< @/docs/snippets/providers/decorators/scope-chain-fail.ts [Decorators]
<<< @/docs/snippets/providers/fn/scope-chain-fail.ts [Functional API]
:::

The `SINGLETON` annotation avoids the `@Scope(ProviderScope.REQUEST)` annotation put on MyService.
To work, the controller must have the scope `REQUEST` and each transitive injected service must have the same scope.

::: warning Note
The Request scope has cost performance. It's recommended to use it only when necessary. If you just need a context to store
data during the request, you can use the [Request Context](/docs/request-context.md) instead.
:::

::: warning
The `@Scope(ProviderScope.REQUEST)` annotation has no effect on Global middlewares.
:::

## Instance scope

Instance scope used on a provider tells the injector to create a new instance each time the provider is injected to another one.

::: code-group
<<< @/docs/snippets/providers/decorators/scope-instance.ts [Decorators]
<<< @/docs/snippets/providers/fn/scope-instance.ts [Functional API]
:::

::: tip Note
With the functional API, you can also rebuild any service on the fly by calling @@inject@@ with the `rebuild` flag:

```typescript
import {inject} from "@tsed/di";

const myService = inject(MyService, {rebuild: true});
```
