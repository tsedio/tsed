# Middlewares

@@Middleware@@ is similar to the Express middleware with the difference that it's a class and you can use the IoC
to inject other services on its constructor.

All middlewares decorated by @@Middleware@@ have one method named `use()`.
This method can use all parameters decorators as you could see with the [Controllers](/docs/controllers.md) and return a promise.

<figure><img src="./../assets/middleware.png" style="max-height: 300px; padding: 10px; background: white"></figure>

## Configuration

To begin, you must add the `middlewares` folder on the `componentsScan` attribute in your server settings as follows:

<<< @/docs/snippets/middlewares/server-configuration.ts

Then, create a new file in your middlewares folder. Create a new Class definition then add the @@Middleware@@ decorator.

<<< @/docs/snippets/middlewares/middleware-example.ts

You have different usecases to declare and use a middleware as following:

- [Global middleware](/docs/middlewares.html#global-middleware): this middleware can be used on the Server,
- [Endpoint middleware](/docs/middlewares.html#endpoint-middleware): this middleware can be used on a controller method,
- [Error middleware](/docs/middlewares.html#error-middleware): this middleware can be used to handle errors.

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

The middlewares added through `middlewares` options will always be registered after the middlewares registered through the hook methods!

::: warn
Only Express/Koa middlewares can be added on `$beforeInit`, `$onInit` and `$afterInit` hooks. At this step the PlatformContext is not available. Injectable Ts.ED middleware won't work as expected.
To add Ts.ED middleware, use the `$beforeRoutesInit` hook (it's the default hook value) or leave the `hook` property empty.
:::

## Endpoint middleware

Endpoint middleware is not really different from global middleware, but its goal is to handle a request before or after endpoint.
It knows which endpoint is executed by using the @@EndpointInfo@@ decorator.

The following example, show you how to implement the middleware and use it with a custom decorator.

<Tabs class="-code">
  <Tab label="AcceptMimesMiddleware.ts">
  
<<< @/docs/snippets/middlewares/endpoint-middleware.ts

  </Tab>
  <Tab label="accept.ts">
    
<<< @/docs/snippets/middlewares/endpoint-middleware-decorator.ts
   
  </Tab>
  <Tab label="Usage">

<<< @/docs/snippets/middlewares/endpoint-middleware-usage.ts

  </Tab>
</Tabs>
  
Middleware can be used on a class controller or endpoint method with the following decorators:

- @@UseBefore@@
- @@Use@@
- @@UseAfter@@
- or routes decorators: @@Get@@, @@Post@@, @@Delete@@, @@Put@@ and @@Patch@@

<<< @/docs/snippets/middlewares/endpoint-use-decorator-usage.ts

## Error middleware

Express allows you to handle any error when your middleware have 4 parameters like this:

```javascript
function (error, req, res, next){}
```

Ts.ED has the same mechanism with @@Err@@ decorator. Use this decorator on a middleware to create a handler which will only
called when an error occurs on th decorated endpoint.

```typescript
import {Err, Middleware, Next} from "@tsed/common";

@Middleware()
export class MyMiddlewareError {
  use(@Err() err: unknown, @Next() next: Next) {
    console.log("===> Error:", err);
  }
}
```

The following example is the GlobalErrorHandlerMiddleware
used by Ts.ED to handle all errors thrown by your application.

If you planed to catch errors globally see our [Exception filter](/docs/exceptions.md) page.

## Specifics parameters decorators

In addition, you have these specifics parameters decorators for the middlewares:

| Signature   | Description                                       |
| ----------- | ------------------------------------------------- |
| @@Err@@     | Inject the `Express.Err` service.                 |
| @@Context@@ | Provide all information about the called endpoint |

## Call sequences

As you see in the previous section, a middleware can be used on different contexts:

- [Server](/docs/configuration.md),
- [Controller](/docs/controllers.md),
- [Endpoint](/docs/controllers.md).

A middleware added to a controller or endpoint level has the same constraint as the endpoint method itself.
It'll be played only when the url request matches with the path associated to the controller and its endpoint method.

When a request is sent to the server all middlewares added in the Server, [Controller](/docs/controllers.md) or Endpoint with decorators
will be called while a response isn't sent by one of the handlers/middlewares in the stack.

<figure><img src="./../assets/middleware-in-sequence.svg" style="max-width:400px; padding:30px"></figure>

For each executed endpoints and middlewares, Platform API store the return value to the @@Context@@. We have two scenarios:

1. If a data is stored in the @@Context@@ object, the response will be immediately send to your consumer after the UseAfterEach middleware (if present).
2. If no data is stored in the @@Context@@ object, the call sequence middlewares continue to the next endpoint (if present) or to the UseAfter then Global middlewares until a data isn't returned by a handler.

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
- The @@PlatformRequest@@ and @@PlatformResponse@@ classes abstraction. These classes allow better code abstraction by exposing methods that are agnostic to Express.js.

::: tip
By default, the server imports automatically your middlewares matching with this rules `${rootDir}/middlewares/**/*.ts` (See [componentScan configuration](/docs/configuration.md)).

```
.
├── src
│   ├── controllers
│   ├── services
│   ├── middlewares
│   └── Server.ts
└── package.json
```

If not, just import your middleware in your server or edit the [componentScan configuration](/docs/configuration.md).

```typescript
import {Configuration} from "@tsed/common";
import "./src/other/directory/CustomMiddleware";

@Configuration({
    ...
})
export class Server {

}
```

:::

## Provided middlewares

<ApiList query="symbolType: class AND tags: middleware" />
