---
meta:
 - name: description
   content: Authentication configuration 
 - name: keywords
   content: ts.ed express typescript auth node.js javascript decorators
---
# Authentication
## Usage

Ts.ED uses middlewares to protect your route with your own strategy. To handle correctly a request and protect your endpoints,
we have to use the @@UseAuth@@ decorator.

<<< @/docs/docs/snippets/authentication/auth-example.ts

::: tip
If you planed to use `Passport.js`, it's recommended to follow the [Passport.js guide here](/tutorials/passport.md).
:::

Any middleware can be used as an authentication strategy. Just keep in mind, to work properly, the middleware must use @@EndpointInfo@@
decorator to retrieve the endpoint context execution.

Here is an example of the CustomAuth middleware using the Passport.js method to check authentication:

<<< @/docs/docs/snippets/authentication/auth-middleware.ts

## Create your Auth decorator

It could be practical to create you own Authentication decorator to reduce the amount of code.
For example, if we use swagger, we have to configure some extra **security** and **responses** information and it can quickly become heavy. 

Example:

<<< @/docs/docs/snippets/authentication/auth-swagger-example.ts

To avoid that, we can create a decorator which apply all of these instructions automatically, like this:

<<< @/docs/docs/snippets/authentication/auth-decorator-example.ts

::: tip
Additionally, you can use the Operation decorator to add automatically the `Authorization` header field in the swagger spec:

<<< @/docs/docs/snippets/authentication/auth-decorator-example-2.ts

:::

And use it on our controller and endpoints:

<<< @/docs/docs/snippets/authentication/auth-custom-auth-example.ts

