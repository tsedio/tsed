---
meta:
 - name: description
   content: Documentation over Providers / DI provided by Ts.ED framework. Use providers to build your backend services.
 - name: keywords
   content: providers di ioc ts.ed express typescript node.js javascript decorators jsonschema class models
---
# Providers

Basically, almost everything may be considered as a provider – service, factory, interceptors, and so on. All of them
can inject dependencies, meaning, they can create various relationships with each other. But in fact, a provider is
nothing else than just a simple class annotated with an `@Injectable()` decorator.

<figure><img src="./../assets/providers.png" style="max-height: 300px; padding: 5px"></figure>

In controllers chapter, we've seen how to build a Controller, handle a request and create a response. Controllers shall
handle HTTP requests and delegate complex tasks to the **providers**.

The providers are plain javascript class and use one of these decorators on top of them. Here the list:

<ApiList query="['Injectable', 'Module', 'Service', 'Controller', 'Interceptor', 'Converter', 'Middleware', 'Filter', 'Protocol'].indexOf(symbolName) > -1" />

## Services

Let's start by creating a simple CalendarService provider.

<<< @/docs/snippets/providers/getting-started-service.ts

::: tip Note @@Service@@ and @@Injectable@@ have the same effect. @@Injectable@@ accepts options, @@Service@@ does not.
A Service is always configured as `singleton`.

Example with @@Injectable@:

<<< @/docs/snippets/providers/getting-started-injectable.ts

:::

Now we have the service class already done, let's use it inside the `CalendarCtrl`:

<<< @/docs/snippets/providers/getting-started-controller.ts

Finally, we can load the injector and use it:

<<< @/docs/snippets/providers/getting-started-serverloader.ts

::: tip NOTE You'll notice that we only import the CalendarsCtrl and not the CalendarsService as that would be the case
with other DIs (Angular / inversify). Ts.ED will discover automatically services/providers as soon as it is imported
into your application via an import ES6.

In most case, if a service is used by a controller or another service which is used by a controller, it's not necessary
to import it explicitly!
:::

## Dependency injection

Ts.ED is built around the **dependency injection** pattern. TypeScript emits type metadata on the constructor which will
be exploited by the @@InjectorService@@ to resolve dependencies automatically.

```typescript
import {Injectable} from "@tsed/di";

@Injectable()
class MyInjectable {
  constructor(private calendarsService: CalendarsService) {
  }
}
```

It's also possible to inject a service on a property by using @@Inject@@ decorator:

```typescript
import {Injectable, Inject} from "@tsed/di";

@Injectable()
class MyInjectable {
  @Inject()
  private calendarsService: CalendarService;

  $onInit() {
    console.log(this.calendarsService);
  }
}
```

In this case, the service won't be usable in the constructor. If you have to do something with the injected service, 
you can use the `$onInit` hook.

## Scopes

All providers have a lifetime strictly dependent on the application lifecycle. Once the server is created, all providers
have to be instantiated. Similarly, when the application shuts down, all providers will be destroyed. However, there are
ways to make your provider lifetime **request-scoped** as well. You can read more about these
techniques [here](/docs/injection-scopes.md).

## Binding configuration

All configurations set with @@Module@@ or @@Configuration@@ can be retrieved with @@Constant@@ and @@Value@@ decorators.
These decorators can be used with:

- [Service](/docs/services.md),
- [Controller](/docs/controllers.md),
- [Middleware](/docs/middlewares.md),
- [Filter](/docs/filters.md)
- [Converter](/docs/converters.md).

@@Constant@@ and @@Value@@ accept an expression as parameter to inspect the configuration object and return the value.

<<< @/docs/snippets/providers/binding-configuration.ts

::: warning @@Constant@@ returns an Object.freeze() value.
:::

::: tip NOTE The values for the decorated properties aren't available on constructor. Use $onInit() hook to use the
value.
:::

## Custom providers

The Ts.ED IoC resolves relationships providers for you, but sometimes, you want to tell to the DI how you want to
instantiate a specific service or inject different kind of providers based on values, on asynchronous or synchronous
factory or on external library. Look [here](/docs/custom-providers.md) to find more examples.

## Configurable provider

Sometimes you need to inject a provider with a specific configuration to another one.

This is possible with the combination of @@Opts@@ and @@UseOpts@@ decorators.

<<< @/docs/snippets/providers/configurable-provider.ts

::: warning Using @@Opts@@ decorator on a constructor parameter changes the scope of the provider
to `ProviderScope.INSTANCE`.
:::

## Lazy load provider <Badge text="6.81.0+"/>

By default, modules are eagerly loaded, which means that as soon as the application loads, so do all the modules,
whether or not they are immediately necessary. While this is fine for most applications, 
it may become a bottleneck for apps running in the **serverless environment**, where the startup latency `("cold start")` is crucial.

Lazy loading can help decrease bootstrap time by loading only modules required by the specific serverless function invocation.
In addition, you could also load other modules asynchronously once the serverless function is "warm" to speed-up the bootstrap time for subsequent calls even further (deferred modules registration).

You can read more about these techniques [here](/docs/providers-lazy-loading.md).

## Override provider

Any provider (Provider, Service, Controller, Middleware, etc...) already registered by Ts.ED or third-party can be
overridden by your own class.

<<< @/docs/snippets/providers/override-provider.ts

> Just don't forgot to import your provider in your project !
