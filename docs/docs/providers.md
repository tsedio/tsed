---
meta:
 - name: description
   content: Documentation over Providers / DI provided by Ts.ED framework. Use providers to build your backend services.
 - name: keywords
   content: providers di ioc ts.ed express typescript node.js javascript decorators jsonschema class models
---
# Providers

Basically, almost everything may be considered as a provider – service, factory, interceptors, and so on. 
All of them can inject dependencies, meaning, they can create various relationships with each other.
 But in fact, a provider is nothing else than just a simple class annotated with an `@Injectable()` decorator.
 
<figure><img src="./../assets/providers.png" style="max-height: 300px"></figure>

In controllers chapter, we've seen how to build a Controller, handle request and create a response.
Controllers shall handle HTTP requests and delegate complex tasks to the **providers**.

The providers are plain javascript class and use one of these decorators on top of them. Here the list:

<ApiList query="['Injectable', 'Service', 'Controller', 'Interceptor', 'Converters', 'Middleware', 'MiddlewareError', 'Filter'].indexOf(symbolName) > -1" />

## Services

Let's start by creating a simple CalendarService provider. 

<<< @/docs/docs/snippets/providers/getting-started-service.ts

::: tip Note
@@Service@@ and @@Injectable@@ as the same effect. `@Injectable` accept options, `@Service` not.
A Service is always configured as `singleton`.

Example with `@Injectable`

<<< @/docs/docs/snippets/providers/getting-started-injectable.ts

:::

Now we have the service class already done, let's use it inside the `CalendarCtrl`:

<<< @/docs/docs/snippets/providers/getting-started-controller.ts

Finally, we can load the injector and use it:

<<< @/docs/docs/snippets/providers/getting-started-serverloader.ts

## Dependency injection

Ts.ED is built around the **dependency injection** pattern. TypeScript emit type metadata on the constructor
which will be exploited by the @@InjectorService@@ to resolve dependencies automatically.

```typescript
constructor(private calendarsService: CalendarsService) {}
```

## Async 

## Scopes

All providers has a lifetime strictly dependent on the application lifecycle.
Once the server is created, all providers have to be instantiated. 
Similarly, when the application shutdown, all providers will be destroyed. 
However, there are ways to make your provider lifetime **request-scoped** as well. 
You can read more about these techniques [here](/docs/injection-scopes.md).

## Custom providers

The Ts.ED IoC resolve relationships providers for you, but sometimes, you want to tell to the DI how you want to instantiate
a specific service or inject different kind of providers base on values or an external library.
Look [here](/docs/custom-providers.md) to find more examples.

## Override provider




