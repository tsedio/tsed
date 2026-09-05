---
description: "Middleware is similar to the Express middleware with the difference that it's a class and you can use the IoC to inject other services on its constructor."
---
# Middlewares

@@Middleware@@ is similar to the Express middleware with the difference that it's a class and you can use the IoC
to inject other services on its constructor.

All middlewares decorated by @@Middleware@@ have one method named `use()`.
This method can use all parameters decorators as you could see with the [Controllers](/docs/controllers.md) and return a
promise.

![Middleware](./assets/middleware.png)

## Configuration

Create a new `middleware` directory then create a new file named `CustomMiddleware.ts` in your `middlewares` folder.
Create a new Class definition then add the @@Middleware@@ decorator.

<<< @/docs/snippets/middlewares/middleware-example.ts

You have different usecases to declare and use a middleware as following:

- [Global middleware](/docs/middlewares#global-middleware): this middleware can be used on the Server,
- [Endpoint middleware](/docs/middlewares#endpoint-middleware): this middleware can be used on a controller method,
- [Error middleware](/docs/middlewares#error-middleware) (deprecated): this middleware can be used to handle errors.

::: tip Note
Global middleware and endpoint middleware are similar, except that the Endpoint middleware
can access to the last executed endpoint information.
:::

## Global middleware

Global middlewares are generally used to handle requests before or after controllers.

<<< @/docs/snippets/middlewares/global-middleware.ts

Then add your middleware on the Server by using the right hook:

<<< @/docs/snippets/middlewares/global-middleware-configuration.ts

It's also possible to register middlewares from `middlewares` options on @@Configuration@@ decorator.
In addition, it's also possible to configure the environment for which the middleware should be loaded.

```typescript
import {Configuration, ProviderScope, ProviderType} from "@tsed/di";

@Configuration({
  middlewares: [
    {hook: "$afterInit", use: helmet({contentSecurityPolicy: false})},
    {env: Env.PROD, use: EnsureHttpsMiddleware},
    cors(),
    cookieParser(),
    compress({}),
    methodOverride(),
    AuthTokenMiddleware
  ]
})
export class Server {}
```

The middlewares added through `middlewares` options will always be registered after the middlewares registered through
the hook methods!

::: warning
Only Express/Koa middlewares can be added on `$beforeInit`, `$onInit` and `$afterInit` hooks.

During `$beforeInit`, `$onInit` and `$afterInit` steps the PlatformContext is not available. Injectable Ts.ED middleware
won't work as expected.

To add Ts.ED middleware, use the `$beforeRoutesInit` hook (it's the default hook value) or leave the `hook` property
empty.
:::

## Endpoint middleware

Endpoint middleware is not really different from global middleware, but its goal is to handle a request before or after
endpoint.
It knows which endpoint is executed by using the @@JsonMethodStore@@ decorator.

The following example, show you how to implement the middleware and use it with a custom decorator.

::: code-group

<<< @/docs/snippets/middlewares/endpoint-middleware.ts [AcceptMimesMiddleware.ts]

<<< @/docs/snippets/middlewares/endpoint-middleware-decorator.ts [accept.ts]

<<< @/docs/snippets/middlewares/endpoint-middleware-usage.ts [Usage]

:::

Middleware can be used on a class controller or endpoint method with the following decorators:

- @@UseBefore@@
- @@Use@@
- @@UseAfter@@ (prefer [Interceptor](/docs/interceptors) feature)
- or routes decorators: @@Get@@, @@Post@@, @@Delete@@, @@Put@@ and @@Patch@@

<<< @/docs/snippets/middlewares/endpoint-use-decorator-usage.ts

::: tip
If your middleware isn't correctly placed in the call sequence, you can use the `priority` property to change the order.

```ts
@Middleware({
  priority: -1
})
class MyMiddleware {}
```

Note: This options is only available for middlewares added on a controller or endpoint method.
:::

## Error middleware (deprecated)

::: warning
Error middleware is a specific implementation of Express.js. The Error middleware is emulated by Ts.ED
in Koa.js framework to reach the cross compatibility.

But Ts.ED provide many other way to catch error properly:

- [Exception filters](/docs/exceptions)
- [Interceptors](/docs/interceptors)

This feature will be deprecated and removed in the future Ts.ED versions.
:::

Express allows you to handle any error when your middleware have 4 parameters like this:

```javascript
function (error, req, res, next) {
}
```

Ts.ED has the same mechanism with @@Err@@ decorator. Use this decorator on a middleware to create a handler which will
only
called when an error occurs on th decorated endpoint.

::: code-group

<<< @/docs/snippets/middlewares/endpoint-middleware-error.ts [Middleware]

<<< @/docs/snippets/interceptors/interceptor-catch-error.ts [Interceptor]

:::

If you planned to catch errors globally see our [Exception filter](/docs/exceptions) page.

## Specifics parameters decorators

In addition, you have these specifics parameters decorators for the middlewares:

| Signature   | Description                                       |
| ----------- | ------------------------------------------------- |
| @@Err@@     | Inject the `Express.Err` service. (deprecated)    |
| @@Context@@ | Provide all information about the called endpoint |

## Call sequences

As you see in the previous section, a middleware can be used on different contexts:

- [Server](/docs/configuration/index),
- [Controller](/docs/controllers),
- [Endpoint](/docs/controllers).

A middleware added to a controller or endpoint level has the same constraint as the endpoint method itself.
It'll be played only when the url request matches with the path associated to the controller and its endpoint method.

When a request is sent to the server all middlewares added in the Server, [Controller](/docs/controllers.md) or Endpoint
with decorators
will be called while a response isn't sent by one of the handlers/middlewares in the stack.

![middleware in sequence](./assets/middleware-in-sequence.svg)

For each executed endpoints and middlewares, Platform API store the return value to the @@Context@@. We have two
scenarios:

1. If a data is stored in the @@Context@@ object, the response will be immediately send to your consumer after the
   UseAfterEach middleware (if present).
2. If no data is stored in the @@Context@@ object, the call sequence middlewares continue to the next endpoint (if
   present) or to the UseAfter then Global middlewares until a data isn't returned by a handler.

::: tip
The middlewares shown in the Endpoints box will be replayed as many times as it has endpoint that matches
the request url.
:::

For example:

<<< @/docs/snippets/middlewares/call-sequences.ts

According to the call sequence scheme, the stack calls will be there:

- **Middlewares** added in Server (logger, express middleware, etc...),
- **MdlwCtrlBefore**,
- **MdlwCtrlBeforeEach**
- **MdlwBefore**,
- **MdlwCtrl**,
- **MyCtrl.endpointA**,
- **MdlwAfter**,
- **SendResponse**, (but no data is returned by the endpointA)
- **MdlwCtrlBeforeEach**
- **MdlwCtrl**,
- **MyCtrl.endpointB**,
- **MdlwAfter**,
- **SendResponse**, send a response because endpointB returns data,
- **MdlwCtrlAfter**, but this middleware will not be called because a response is sent.
- **Middleware** added in Server (not called too).

## Override existing middlewares

The decorator @@OverrideProvider@@ gives you the ability to override some internal Ts.ED middlewares.

<<< @/docs/snippets/middlewares/override-middleware.ts

Here we use the new [Platform API](/docs/platform-api.md) to write our middleware.
By using @@Context@@ decorator and @@PlatformContext@@ class we can get some information:

- The data returned by the last executed endpoint,
- The @@EndpointMetadata@@ itself,
- The @@PlatformRequest@@ and @@PlatformResponse@@ classes abstraction. These classes allow better code abstraction by
  exposing methods that are agnostic to Express.js.

::: tip
To add your middleware, just import your middleware in your server:

```typescript
import {Configuration} from "@tsed/di";
import "./src/other/directory/CustomMiddleware";

@Configuration({
  ...
})
export class Server {

}
```

:::

## Provided middlewares

<ApiList query="symbolType === 'class' && tags.includes('middleware')" />
