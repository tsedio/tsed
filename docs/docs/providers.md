---
meta:
  - name: description
    content: Documentation over Providers / DI provided by Ts.ED framework. Use providers to build your backend services.
  - name: keywords
    content: providers di ioc ts.ed express typescript node.js javascript decorators jsonschema class models
---

# DI & Providers

Basically, almost everything may be considered as a provider – service, factory, interceptors, and so on. All of them
can inject dependencies, meaning, they can create various relationships with each other. But in fact, a provider is
nothing else than just a simple class annotated with an `@Injectable()` decorator.

![Providers](./assets/providers.png)

In controllers chapter, we've seen how to build a Controller, handle a request and create a response. Controllers shall
handle HTTP requests and delegate complex tasks to the **providers**.

Providers are plain javascript classes and use one of these decorators on top of them. Here is the list:

<ApiList query="['Injectable', 'Module', 'Service', 'Controller', 'Interceptor', 'Middleware', 'Protocol'].indexOf(symbolName) > -1" />

::: tip
Since v8, you can also use the functional API to define your providers using the @@injectable@@ function. This function
lets you
define your provider without using decorators and lets you define your provider in a more functional way.

This page will show you how to use both API to define your providers.

<ApiList query="['injectable', 'inject', 'lazyInject', 'constant', 'refValue', 'configuration'].indexOf(symbolName) > -1" />

:::

## Injectable

Let's start by creating a simple CalendarService provider.

::: code-group

<<< @/docs/snippets/providers/decorators/getting-started-service.ts [Decorators]
<<< @/docs/snippets/providers/fn/getting-started-service.ts [Functional API]

:::

> @@Service@@ and @@Injectable@@ have the same effect. @@Injectable@@ accepts options, @@Service@@ does not.
> A Service is always configured as `singleton`.

Example with @@Injectable@@:

::: code-group

<<< @/docs/snippets/providers/decorators/getting-started-injectable.ts [Decorators]
<<< @/docs/snippets/providers/fn/getting-started-injectable.ts [Functional API]

:::

Now we have the service class already done, let's use it inside the `CalendarsController`:

::: code-group

<<< @/docs/snippets/providers/decorators/getting-started-controller.ts [Decorators]
<<< @/docs/snippets/providers/fn/getting-started-controller.ts [Functional API]
<<< @/docs/snippets/providers/tests/getting-started-controller.spec.ts [Test]
:::

> Functional API doesn't provides alternative for @@Get@@ and @@BodyParams@@ decorators at the moment.

Finally, we can load the injector and use it:

::: code-group

<<< @/docs/snippets/providers/decorators/getting-started-server.ts [Decorators]
<<< @/docs/snippets/providers/fn/getting-started-server.ts [Functional API]

:::

::: tip NOTE

You'll notice that we only import the CalendarsController and not the CalendarsService as that would be the case
with other DIs (Angular / inversify). Ts.ED will discover automatically services/providers as soon as it's imported
into your application via an import ES6.

In most case, if a service is used by a controller or another service which is used by a controller, it's not necessary
to import it explicitly!
:::

## Dependency injection

Ts.ED is built around the **dependency injection** pattern. TypeScript emits type metadata on the constructor which will
be exploited by the @@InjectorService@@ to resolve dependencies automatically.

::: code-group

```typescript [Descorators]
import {Injectable} from "@tsed/di";

@Injectable()
class MyInjectable {
  @Inject()
  private calendarsService: CalendarsService;

  // or through the constructor
  constructor(private calendarsService2: CalendarsService) {
    console.log(calendarsService);
    console.log(calendarsService2);
    console.log(calendarsService === calendarsService2); // true
  }
}
```

```typescript [Functional API]
import {Injectable} from "@tsed/di";

@Injectable()
class MyInjectable {
  private calendarsService = inject(CalendarsService);

  constructor() {
    const calendarsService2 = inject(CalendarsService);
    console.log(calendarsService);
    console.log(calendarsService2);
    console.log(calendarsService === calendarsService2); // true
  }
}
```

:::

::: warning Important
With v7, accessing to a property decorated with @@Inject()@@, @@Constant@@, @@Value@@ in the constructor is not
possible. You have to use the
`$onInit()` hook to access to the injected service.

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

The v8 solve that, and now, you can access to the injected
service in the constructor.
:::

Note that, the @@inject@@ function can be used anywhere in your code, not only in a DI context:

```typescript
function getCalendarsService(): CalendarsService {
  const calendarsService = inject(CalendarsService);
  console.log(calendarsService);

  // do something

  return calendarsService;
}
```

## Scopes

All providers have a lifetime strictly dependent on the application lifecycle. Once the server is created, all providers
have to be instantiated. Similarly, when the application shuts down, all providers will be destroyed. However, there are
ways to make your provider lifetime **request-scoped** as well. You can read more about these
techniques [here](/docs/injection-scopes.md).

## Binding configuration

All configurations set with @@Module@@ or @@Configuration@@ can be retrieved with @@Constant@@ and @@Value@@ decorators,
or
with @@configuration@@, @@constant@@, and @@refValue@@ functions. It supports lodash path to retrieve nested properties.

By using these decorators or functions, you can more easily decouple your code from your server configurations and
therefore
more easily test your code independently of environment variables managed by files (.env, nconf, etc.).

Instead of doing this:

```ts
import {Injectable} from "@tsed/di";

@Injectable()
class MyService {
  doSomething() {
    const value = process.env.MY_VALUE;

    // your code
  }
}
```

Do this:

::: code-group
<<< @/docs/snippets/providers/decorators/binding-constant-best-practice.ts [Decorators]
<<< @/docs/snippets/providers/fn/binding-constant-best-practice.ts [Functional API]
:::

Then, you can test your code like this:

```ts
import {PlatformTest} from "@tsed/platform-http/testing";
import {inject} from "@tsed/di";
import {MyService} from "./MyService.js";

describe("MyService", () => {
  describe("when MY_VALUE is given", () => {
    beforeEach(() =>
      PlatformTest.create({
        envs: {
          MY_VALUE: "myValue"
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    it("should do something", () => {
      const myService = inject(MyService);

      expect(myService.doSomething()).toBe("myValue");
    });
  });

  describe("when MY_VALUE IS undefined", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should do something", () => {
      const myService = inject(MyService);

      expect(myService.doSomething()).toBe("myValue");
    });
  });
});
```

Testing different configurations is now much easier.

### Constant

The @@Constant@@ decorator or @@constant@@ function is used to inject a constant value into a provider.

::: code-group
<<< @/docs/snippets/providers/decorators/binding-constant.ts [Decorators]
<<< @/docs/snippets/providers/fn/binding-constant.ts [Functional API]
:::

::: warning
@@Constant@@ returns an immutable value using `Object.freeze()`. If you need to inject a mutable value, use @@Value@@
instead.
:::

Note that, @@constant@@ function can be used anywhere in your code, not only in a DI context:

```ts
function getMyValue(): string {
  const value = constant<string>("MY_VALUE");
  console.log(value); // "myValue"

  // do something

  return value;
}

@Injectable()
class MyService {
  constructor() {
    const value = getMyValue();
    console.log(value); // "myValue"
  }
}

// server.ts
import {configuration} from "@tsed/di";

class Server {}

configuration(Server, {
  MY_VALUE: "myValue"
});
```

Default value can be set with the second argument of the @@Constant@@ / @@constant@@:

```ts
@Constant("MY_VALUE", "defaultValue")
```

```ts
constant("MY_VALUE", "defaultValue");
```

::: tip Note
@@constant@@ try to infer the type from the default value. But sometimes, TypeScript will infer the unexpected type if
you give
a `null` value. In this case, you can specify the type explicitly:

```ts
constant<string | null>("MY_VALUE", null);
```

:::

### Value/refValue

The @@Value@@ decorator or @@refValue@@ function is used to inject a mutable value into a provider.

::: code-group
<<< @/docs/snippets/providers/decorators/binding-value.ts [Decorators]
<<< @/docs/snippets/providers/fn/binding-ref-value.ts [Functional API]
:::

Note that, @@value@@ function can be used anywhere in your code, not only in a DI context:

```ts
function getMyValue(): string {
  const value = value<string>("MY_VALUE");
  console.log(value); // "myValue"

  // do something

  return value;
}

// or
const current = getMyValue();
console.log(current.value);

// or
@Injectable()
class MyService {
  constructor() {
    const current = getMyValue();
    console.log(current.value); // "myValue"
  }
}
```

## Custom providers

The Ts.ED IoC resolves relationships providers for you, but sometimes, you want to tell to the DI how you want to
instantiate a specific service or inject different kind of providers based on values, on asynchronous or synchronous
factory or on external library. Look [here](/docs/custom-providers.md) to find more examples.

## Configurable provider

Sometimes you need to inject a provider with a specific configuration to another one.

This is possible with the combination of @@Opts@@ and @@UseOpts@@ decorators.

<<< @/docs/snippets/providers/configurable-provider.ts

::: warning

Using @@Opts@@ decorator on a constructor parameter changes the scope of the provider
to `ProviderScope.INSTANCE`.
:::

## Inject many providers

This feature simplifies dependency management when working with multiple implementations of the same interface using
type code.

Using a token, you can configure injectable classe to be resolved as an array of instances using `type` option:

::: code-group
<<< @/docs/snippets/providers/decorators/inject-many-declaration.ts [Decorators]
<<< @/docs/snippets/providers/fn/inject-many-declaration.ts [Functional API]
:::

Now, we can use the `Bar` token to inject all instances of `Bar` identified by his `type`:

::: code-group
<<< @/docs/snippets/providers/decorators/inject-many-usage.ts [Decorators]
<<< @/docs/snippets/providers/fn/inject-many-usage.ts [Functional API]
:::

Alternatively, you can do this:

```ts
import {Controller, injectMany} from "@tsed/di";
import {Post} from "@tsed/schema";
import {BodyParams} from "@tsed/platform-params";

@Controller("/some")
export class SomeController {
  @Post()
  async create(@BodyParams("type") type: "baz" | "foo") {
    const bar = injectMany<Bar>(Bar).find((x) => x.type === type);
  }
}
```

### AutoInjectable <Badge text="7.82.0+" />

The @@AutoInjectable@@ decorator let you create a class using `new` that will automatically inject all dependencies from
his
constructor signature.

```ts
import {AutoInjectable} from "@tsed/di";
import {MyOtherService} from "./MyOtherService.js";

@AutoInjectable()
class MyService {
  constructor(
    opts: MyOptions,
    private myOtherService?: MyOtherService
  ) {
    console.log(myOtherService);
    console.log(opts);
  }
}

const myService = new MyService({
  prop: "value"
});
```

In this example, we can see that `MyService` is created using `new`. We can give some options to the constructor and the
rest of
the dependencies will be injected automatically.

::: warning
@@AutoInjectable@@ decorator only handles dependency injection when using `new`. It doesn't register the class as a
provider in the DI container. If you need the class to be available for injection in other classes, you must still use
@@Injectable@@.
:::

## Interface abstraction

In some cases, you may want to use an interface to abstract the implementation of a service. This is a common pattern in
TypeScript and can be achieved by using the `provide` option in the `@Injectable` decorator or the
`injectable().class()` function.

::: code-group
<<< @/docs/snippets/providers/decorators/interface-abstraction-declaration.ts [Decorators]
<<< @/docs/snippets/providers/fn/interface-abstraction-declaration.ts [Functional API]
:::

Usage:

::: code-group
<<< @/docs/snippets/providers/decorators/interface-abstraction-usage.ts [Decorators]
<<< @/docs/snippets/providers/fn/interface-abstraction-usage.ts [Functional API]
:::

## Define provider by environment <Badge text="7.74.0+" />

Sometimes you need to import a provider depending on the environment or depending on a runtime context.

This is possible using the DI configuration `imports` option that let you fine-tune the provider registration.

Here is an example of how to import a provider from a configuration:

<<< @/docs/snippets/providers/decorators/define-provider-by-environment.ts

You can also use @@injectable@@ function to define your provider by environment:

<<< @/docs/snippets/providers/fn/define-provider-by-environment.ts

## Lazy load provider

By default, modules are eagerly loaded, which means that as soon as the application loads, so do all the modules,
whether or not they are immediately necessary. While this is fine for most applications,
it may become a bottleneck for apps running in the **serverless environment**, where the startup latency
`("cold start")` is crucial.

Lazy loading can help decrease bootstrap time by loading only modules required by the specific serverless function
invocation.
Additionally, you can load other modules asynchronously once the serverless function is "warm" to speed up the
bootstrap time for subsequent calls (deferred module registration).

You can read more about these techniques [here](/docs/providers-lazy-loading.md).

## Override provider

Any provider (Provider, Service, Controller, Middleware, etc...) already registered by Ts.ED or third-party can be
overridden by your own class.

To override an existing provider, you can reuse the token to register your own provider
using @@Injectable@@, @@OverrideProvider@@ decorators or @@injectable@@ function:

::: code-group
<<< @/docs/snippets/providers/decorators/override-existing-provider.ts [Decorators]
<<< @/docs/snippets/providers/decorators/override-provider.ts [Decorators v7]
<<< @/docs/snippets/providers/fn/override-existing-provider.ts [Functional API]
:::

> Just don't forget to import your provider in your project !

## Inject context

The @@Context@@ decorator or @@context@@ function is used to inject the request context into a class or another
function.

Context is a special object that contains all the information about the current request.
It can be available in any injectable context, including controllers, services, and interceptors, while the request is
being processed.

Here is an example to get context:

::: code-group
<<< @/docs/snippets/request-context/decorators/request-context-usage.ts [Decorators]
<<< @/docs/snippets/request-context/fn/request-context-usage.ts [Functional API]
:::

See more about the context [here](/docs/request-context.md).

## Get injector

v8 allows you to get the injector instance everywhere in your code:

```typescript
import {injector} from "@tsed/di";

function doSomething() {
  const myService = injector().get<MyService>(MyService);
  // shortcut to inject(MyService)

  return myService.doSomething();
}
```
