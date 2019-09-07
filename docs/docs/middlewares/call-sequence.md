# Middleware call sequences

As you see in the previous section, a middleware can be use on different context:

- @@ServerLoader@@,
- [Controller](/docs/controllers.md),
- [Endpoint](/docs/controllers.md).

Middleware associated to a controller or endpoint as a same constraint that an endpoint.
It'll be played only when the url request match with the path associated to the controller and his endpoint method.

When a request is sent to the server all middlewares added in the @@ServerLoader@@, [Controller](/docs/controllers.md) or Endpoint with decorators
 will be called while a response isn't sent by one of the middleware in the stack.

<figure><img src="./../../assets/middleware-call-sequence.svg" style="max-width:400px; padding:30px"></figure>

::: tip Note
The middlewares shown in the Endpoints box will be replayed as many times as it has endpoint that match 
the request url.
:::

> (1) Render middleware is called only when a the @@Render@@ decorator is used on the endpoint.

> (2) SendResponse middleware send a response only when a data is return by the endpoint method or if the endpoint is the latest called endpoint for the resolved route. 

For example:

<<< @/docs/docs/snippets/middlewares/call-sequences.ts

According to the call sequence scheme, the stack calls will be there:

- **Middlewares** added in ServerLoader (logger, express middleware, etc...),
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
- **Middleware** added in ServerLoader (not called too).

