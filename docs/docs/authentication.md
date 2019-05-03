---
meta:
 - name: description
   content: Authentication configuration 
 - name: keywords
   content: ts.ed express typescript auth node.js javascript decorators
---
# Authentication
## Usage

Ts.ED use middleware to protect your route with your own strategy. To handle correctly a request and protect your endpoints,
we have to use the @@UseAuth@@ decorator.

<<< @/docs/docs/snippets/authentication/auth-example.ts

::: tip
If you planed to use `Passport.js`, it's recommended to follow the [Passport.js guide here](/tutorials/passport.md).
:::

Any middleware can be used as a authentication strategy. Just keep in mind, to works properly, the middleware must use @@EndpointInfo@@
decorator to retrieve the endpoint context execution.

Here an example of the a CustomAuth middleware with use the Passport.js method to check authentication:

<<< @/docs/docs/snippets/authentication/auth-middleware.ts

## Create your Auth decorator

It could be practical to create you own Authentication decorator to reduce the amount of code.
For example, if we use swagger, we have to configure some extra **security** and **responses** information and it can quickly become heavy. 

Example:

<<< @/docs/docs/snippets/authentication/auth-swagger-example.ts

To avoid that, we can create a decorator which apply all of theses instructions automatically, like this:

<<< @/docs/docs/snippets/authentication/auth-decorator-example.ts

::: tip
Additionally, you can use Operation decorator to add automatically in the swagger spec, the `Authorization` header field:

<<< @/docs/docs/snippets/authentication/auth-decorator-example-2.ts

:::

And use it on our controller and endpoints:

<<< @/docs/docs/snippets/authentication/auth-custom-auth-example.ts

