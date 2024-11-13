# Custom endpoint decorator

Custom endpoint decorator could be interesting when you want to handle a request and perform actions before or after the endpoint method.

Unlike [Pipes](/docs/pipes.html) that operate on the parameters of a method, the endpoint decorator will operate on the method itself.

It's based on the middleware and use one of these decorators to work:

- @@UseBefore@@: use the given middleware before the method,
- @@Use@@: use the given middleware after `UseBefore` but before the method,
- @@UseAfter@@: use the given middleware after the method.

## Built-in

Many other decorators are implemented and can be taken as an example to build your own endpoint decorator. Just follow the links here and click on source link to see source code on Github:

<ApiList query="status.indexOf('operation') > -1 && status.indexOf('decorator') > -1" />

## Build your own decorator

One of the use cases already implemented by Ts.ED is the @@PlatformAcceptMimesMiddleware@@:

<<< @/docs/snippets/middlewares/platform-accept-mimes-middleware.ts

You can see in this example the usage of `endpoint.get` from @@EndpointInfo@@. This method contains all options
which can be passed to the decorator associated to PlatformAcceptMimesMiddleware.

<<< @/docs/snippets/middlewares/accept-mime-usage.ts

::: tip
This example uses @@AcceptMime@@ decorator with one option, the `application/json`.
This option will be set to `endpoint.get` seen before with PlatformAcceptMimesMiddleware example and can be retrieved by using
`endpoint.get(PlatformAcceptMimesMiddleware)`.
:::

Ts.ED provides API to create your own decorator like @@AcceptMime@@ which registers the options and at least one middleware
with these decorators and utils:

- @@Use@@, @@UseBeforeEach@@, @@UseBefore@@, or @@UseAfter@@ for middleware registration,
- @@useDecorators@@ if you want to combine different decorators,
- @@StoreMerge@@ or @@StoreGet@@ to register options.

For example, we can take the @@AcceptMime@@ decorator as an example and see how it works. Here is its code:

<<< @/docs/snippets/middlewares/custom-endpoint-decorator-accept-mime.ts

::: tip
It is also possible to create a custom endpoint decorator without Ts.ED middleware. If your action is really small,
you can register a pure express middleware to reach better performance.

<<< @/docs/snippets/middlewares/custom-endpoint-decorator-status.ts
:::
