# Custom providers

There are a lot of scenarios where you might want to bind something directly to the IoC container.
For example, any constant values, configuration objects created based on the current environment,
external libraries, or pre-calculated values that depend on few other defined providers.

Moreover, you are able to override default implementations, e.g. use different classes or make use of various test
doubles (for testing purposes) when needed.

One essential thing that you should always keep in mind is that Ts.ED uses @@TokenProvider@@ to identify a dependency.

Usually, the auto-generated tokens are equal to classes. If you want to create a custom provider, you'd need to choose a
token.
Mostly, the custom tokens are represented by either plain strings or symbols.

Let's go through the available options.

Custom providers can also use [hooks](/docs/hooks.md) to handle Ts.ED lifecycle events.

For example:

```typescript
import {Injectable} from "@tsed/di";

@Injectable()
class CustomProvider {
  async $onInit() {
    // Initialize your custom provider
  }
}
```

> There is other hooks available like `$onDestroy`, `$afterRoutesInit`, `$beforeRoutesInit`, `$onReady`, see more [here](/docs/hooks.md).

## Register Value

The `useValue` syntax is useful when it comes to either define a constant value, put external library into DI container,
or replace a real implementation with the mock object.

::: code-group
<<< @/docs/snippets/providers/custom-provider-use-value-declaration.ts [v8]
<<< @/docs/snippets/providers/v7/custom-provider-use-value-declaration.ts [Legacy]
:::

In order to inject custom provider, we use the @@Inject@@ decorator. This decorator takes a single argument - the token.

::: code-group
<<< @/docs/snippets/providers/decorators/custom-provider-use-value-usage.ts [Decorators]
<<< @/docs/snippets/providers/fn/custom-provider-use-value-usage.ts [Functional API]
:::

::: warning
When you declare a provider using a Symbol as a token, you must use the same Symbol to @@Inject@@ decorator.
TypeScript set Object as metadata key for the Symbol token.

```typescript
// Define the symbol once and export it
export const MY_SERVICE = Symbol.for("MY_SERVICE");

// Correct usage
@Injectable()
class MyService {
  @Inject(MY_SERVICE)
  service: MyServiceType;
}

// Incorrect usage - creates a new Symbol
@Injectable()
class MyService {
  @Inject()
  service: MyServiceType;
}
```

:::

## Register Factory

The `useFactory` is a way of creating providers dynamically.
The actual provider will be equal to a returned value of the factory function.
The factory function can either depend on several different providers or stay completely independent.
It means that factory may accept arguments, that DI will resolve and pass during the instantiation process.

<<< @/docs/snippets/providers/custom-provider-use-factory-declaration.ts

In order to inject a custom provider, we use the @@Inject@@ decorator. This decorator takes a single argument - the
token.

::: code-group
<<< @/docs/snippets/providers/decorators/custom-provider-use-value-usage.ts [Decorators]
<<< @/docs/snippets/providers/fn/custom-provider-use-value-usage.ts [Functional API]
:::

## Register Async Factory

The `useAsyncFactory` is a way of creating asynchronous providers dynamically.
The actual provider will be equal to a returned value of the factory function.
The factory function can either depend on several different providers or stay completely independent.
It means that factory may accept arguments, that DI will resolve and pass during the instantiation process.

::: code-group
<<< @/docs/snippets/providers/custom-provider-use-async-factory-declaration.ts [v8]
<<< @/docs/snippets/providers/v7/custom-provider-use-async-factory-declaration.ts [Legacy]
:::

In order to inject a custom provider, we use the @@Inject@@ decorator. This decorator takes a single argument - the
token.

::: code-group
<<< @/docs/snippets/providers/decorators/custom-provider-use-value-usage.ts [Decorators]
<<< @/docs/snippets/providers/fn/custom-provider-use-value-usage.ts [Functional API]
:::

::: danger Important Scope Limitation
Because async factories are resolved on server loading, the scope of the provider created by useAsyncFactory will always
be considered as `SINGLETON`.

This means:

- The provider will be instantiated only once
- The same instance will be shared across all injections
- Request-scoped dependencies should not be used in async factories
  :::

## Register Class

The `useClass` syntax is similar to register provider via decorator. But it allows you to use different classes per
chosen factors.
For example, you can change the class depending on the environment profile `production` or `development`.

::: code-group
<<< @/docs/snippets/providers/custom-provider-use-class-declaration.ts [v8]
<<< @/docs/snippets/providers/v7/custom-provider-use-class-declaration.ts [Legacy]
:::

In this case, even if any class depends on ConfigService, Ts.ED will inject an instance of the provided class (
`ProdConfigService` or `DevConfigService`) instead.

::: code-group
<<< @/docs/snippets/providers/decorators/custom-provider-use-class-usage.ts [Decorators]
<<< @/docs/snippets/providers/fn/custom-provider-use-class-usage.ts [Function API]
:::

::: tip
@@injectable@@ can be also used to add a provider or override an existing provider (like @@OverrideProvider@@ decorator).
:::
