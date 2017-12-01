# Middleware call sequences

As you see in the previous section, a middleware can be use on different context:

- [ServerLoader](docs/server-loader/_sidebar.md),
- [Controller](docs/controllers.md),
- [Endpoint](docs/controllers.md).

Middleware associated to a controller or endpoint as a same constraint that an endpoint.
It'll be played only when the url request match with the path associated to the controller and his endpoint method.

When a request is sent to the server all middlewares added in the [ServerLoader](docs/server-loader/_sidebar.md), [Controller](docs/controllers.md) or Endpoint with decorators
 will be called while a response isn't sent by one of the middleware in the stack.

<img src="_media/middleware-call-sequence.png" style="max-width:400px">

> Note: The middlewares represented in the Endpoint (0-n) box will be replayed as many times as it has endpoint that match 
the url of the request.

> \* Render is called only when a the @Render o @ResponseView decorator is used on the endpoint.

> \*\* SendResponse middleware send a response only when a data is return by the endpoint method. 

For example:

```typescript
@Controller('/')
@UseAfter(MdlwCtrlAfter)
@UseBefore(MdlwCtrlBefore)
@Use(MdlwCtrl)
export class MyCtrl {
    
    @Get("/")
    @UseAfter(MdlwAfter)
    @Use(Mdlw)
    @UseBefore(MdlwBefore)
    endpointA(@Next() next()) {
        console.log("EndpointA")
        next()
    }
    
    @Get("/")
    endpointB() {
        console.log("EndpointB")
        return {}
    }
}
```

According to the call sequence scheme, the stack will be there:

- **Middlewares** added in ServerLoader (logger, express middleware, etc...),
- **MdlwCtrlBefore**,
- **MdlwCtrl**, 
- **MdlwBefore**,
- **MyCtrl.endpointA**,
- **MdlwAfter**,
- **SendResponse**, (but nothing data is returned by the endpointA)
- **MdlwCtrl**,
- **MyCtrl.endpointB**,
- **MdlwAfter**,
- **SendResponse**, send a response because endpointB return a data,
- **MdlwCtrlAfter**, but this middleware will not be called because a response is sent.
- **Middleware** added in ServerLoader (not called too).

<div class="guide-links">
<a href="#/docs/middlewares/overview">Middlewares</a>
<a href="#/docs/middlewares/global-middleware">Global middleware</a>
</div>

