# Interceptors

An interceptor is a class annotated with the @@Interceptor@@ decorator. Interceptors should implement the @@InterceptorMethods@@ interface.

Interceptors have a set of useful capabilities which are inspired by the [Aspect Oriented Programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming) (AOP) technique.

Creating and consuming an interceptor is a two-step process:

1. Create and annotate the interceptor class that will intercept calls to service methods
2. Decide which methods will be **intercepted** by which **interceptor**

They make it possible to:

- bind extra logic before / after method execution
- transform the result returned from a function
- transform the exception thrown from a function
- extend the basic function behavior
- completely override a function depending on specific conditions

## Decorators

<ApiList query="module == '@tsed/di' && symbolType === 'decorator'" />

## Interceptor class

To create an interceptor class you need to implement the `IInterceptor` interface and implement the
`intercept(context: IInterceptorContext<any>, next?: IInterceptorNextHandler)` method, and use the `@Interceptor()` annotation to register your interceptor class.
Inside your `src/interceptors/MyInterceptor.ts` folder, create the following simple interceptor.

<<< @/docs/snippets/interceptors/interceptor-example.ts

## Use the interceptor

Now that your interceptor logic is in place, you can use it in any other service. You need to use the `@Intercept(InterceptorClass, opts)` annotation to register which interceptor should be used for the specific method you want to intercept. An example service in `src/services/MyService.ts`:

<<< @/docs/snippets/interceptors/interceptor-usage.ts

If the service method is executed like `myServiceInstance.mySimpleMethod()` we will get the following output:

```bash
the method mySimpleMethod will be executed with args and static data simple data
the simple method is executed
the method was executed, and returned undefined
```
