# Custom endpoint decorator

Custom endpoint decorator could be interesting when you want to handle a request and perform actions before or after the endpoint method.
It's based on the middleware but offers you more options and control over your decorated endpoint.

One of the usecases already implemented by Ts.ED is the @@AcceptMimesMiddleware@@:

<<< @/packages/common/src/mvc/middlewares/AcceptMimesMiddleware.ts

You can see in this example the usage of `endpoint.get` from @@EndpointInfo@@. This method contains all options
which can be passed to the decorator associated to AcceptMimesMiddleware.

<<< @/docs/docs/snippets/middlewares/accept-mime-usage.ts

::: tip
This example uses @@AcceptMime@@ decorator with one option, the `application/json`. 
This option will be set to `endpoint.get` seen before with AcceptMimesMiddleware example and can be retrieved by using 
`endpoint.get(AcceptMimesMiddleware)`.
:::

Ts.ED provides API to create your own decorator like @@AcceptMime@@ which registers the options and at least one middleware
with theses decorators and utils:

- @@Use@@, @@UseBeforeEach@@, @@UseBefore@@, or @@UseAfter@@ for middleware registration,
- @@applyDecorator@@ if you want to combine different decorators,
- @@StoreMerge@@ or @@StoreGet@@ to register options.

For example, we can take the @@AcceptMime@@ decorator as an example and see how it works. Here is its code:

<<< @/docs/docs/snippets/middlewares/custom-endpoint-decorator-accept-mime.ts

::: tip
It is also possible to create a custom endpoint decorator without Ts.ED middleware. If your action is really small,
you can register a pure express middleware to reach better performance.

<<< @/docs/docs/snippets/middlewares/custom-endpoint-decorator-status.ts
:::

## Built-in endpoint decorators

Many other decorators are implemented and can be taken as an example to build your own endpoint decorator. Just follow the links here and click on source link to see source code on Github:

<ApiList query="status.indexOf('endpoint') > -1 && status.indexOf('decorator') > -1" />
