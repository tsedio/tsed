# Middleware call sequences

As you have seen in the previous section, a middleware can be used on different contexts:

- [Server](/getting-started.md),
- [Controller](/docs/controllers.md),
- [Endpoint](/docs/controllers.md).

Middleware associated to a controller or endpoint has the same constraint as an endpoint.
It will be played only when the url request matches with the path associated to the controller and its endpoint method.

When a request is sent to the server, all middlewares added in the Server, [Controller](/docs/controllers.md) or Endpoint with decorators
 will be called while a response isn't sent by one of the middleware in the stack.

<figure><img src="./../../assets/middleware-in-sequence.svg" style="max-width:400px; padding:30px"></figure>

::: tip Note
The middlewares shown in the Endpoints box will be replayed as many times as it has an endpoint that matches 
the request url.
:::

> (1) Render middleware is called only when the @@Render@@ decorator is used on the endpoint.

> (2) SendResponse middleware send a response only when data is returned by the endpoint method or if the endpoint is the latest called endpoint for the resolved route. 

For example:

<<< @/docs/docs/snippets/middlewares/call-sequences.ts

According to the call sequence scheme, the stack calls will be there:

- **Middlewares** added in Server (logger, express middleware, etc...),
- **MdlwCtrlBefore**,
- **MdlwCtrlBeforeEach**
- **MdlwBefore**,
- **MdlwCtrl**,
- **MyCtrl.endpointA**,
- **MdlwAfter**,
- **SendResponse**, (but nothing data is returned by the endpointA)
- **MdlwCtrlBeforeEach**
- **MdlwCtrl**,
- **MyCtrl.endpointB**,
- **MdlwAfter**,
- **SendResponse**, send a response because endpointB return a data,
- **MdlwCtrlAfter**, but this middleware will not be called because a response is sent.
- **Middleware** added in Server (not called too).

