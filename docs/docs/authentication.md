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

<<< @/docs/snippets/authentication/auth-example.ts

::: tip
If you planed to use `Passport.js`, it's recommended to follow the [Passport.js guide here](/tutorials/passport.md).
:::

Any middleware can be used as an authentication strategy. Just keep in mind, to work properly, the middleware must use @@Context@@
decorator to retrieve the endpoint context execution.

Here is an example of the CustomAuth middleware using the Passport.js method to check authentication:

<<< @/docs/snippets/authentication/auth-middleware.ts

## Create your Auth decorator

It could be practical to create you own Authentication decorator to reduce the amount of code.
For example, if we use swagger, we have to configure some extra **security** and **responses** information and it can quickly become heavy.

Example:

<<< @/docs/snippets/authentication/auth-swagger-example.ts

To avoid that, we can create a decorator which apply all of these instructions automatically, like this:

<<< @/docs/snippets/authentication/auth-decorator-example.ts

::: tip
Additionally, you can use the `In` decorator to add automatically the `Authorization` header field in the swagger spec:

<<< @/docs/snippets/authentication/auth-decorator-example-2.ts

:::

And use it on our controller and endpoints:

<<< @/docs/snippets/authentication/auth-custom-auth-example.ts

## With Passport.js

Another solution is to use [Passport.js](/tutorials/passport.md) to protect your API. Ts.ED provide
a [@tsed/passport](/tutorials/passport.md) plugin in order to facilitate the use of this library within the framework.

The following codesandbox example show you how you can use this plugin combined with Swagger to describe your API:

<iframe src="https://codesandbox.io/embed/tsed-swagger-with-authorization-hi5pp?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="tsed-swagger-with-authorization"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>
