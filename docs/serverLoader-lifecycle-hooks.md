[Home](https://github.com/Romakita/ts-express-decorators/wiki) > [ServerLoader](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader) > Lifecycle Hooks

[ServerLoader](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader) calls lifecycle hook methods to let you intercept them. These hooks are as follows :

Hook method | Description | 
--- | --- | ---
`constructor` | On this phase nothing is constructed. Express app isn't created. | 
`$onInit` | Respond when the server starting his lifecycle. Is good place to initialize Database connection. | [see](#serverloaderoninit-void--promise)
`$onMountingMiddlewares` | Respond when Express app is created. It will be triggered before the build of [Controllers](https://github.com/Romakita/ts-express-decorators/wiki/Controllers).  [Services](https://github.com/Romakita/ts-express-decorators/wiki/Services) are allready loaded. You can configure all express middlewares on this phase. | [see](#serverloaderonmountingmiddlewares-void--promise)
`$afterRoutesInit` | Respond just after all [Controllers](https://github.com/Romakita/ts-express-decorators/wiki/Controllers) are built and [`$onMoutingMiddlewares`](#serverloaderonmountingmiddlewares-void--promise). You can configure the [`serve-static`](https://github.com/expressjs/serve-static) middleware on this phase. | [see](#serverloaderafterroutesinit-void--promise)
`$onReady` | Respond when httpServer and/or httpsServer are ready. | [see](#serverloaderonready-void)
`$onAuth` | Respond when an Endpoint require an authentification strategy before access to the endpoint method. | [see](#serverloaderonauthrequest-response-next-void)
`$onError` | Respond when an error is intercepted by Express or TsExpressDecorators. | [see](#serverloaderonerrorerror-request-response-next-void)
`$onServerInitError` | Respond when an error is triggered on server initialization. | 

***

#### ServerLoader.$onInit(): void | Promise

During this phase you can initialize your database connection for example. This hook accept a promise as return and let you to wait the database connection before run the next lifecycle's phase.

Example with mongoose Api:
```typescript
class Server extends ServerLoader {

    public $onInit(): Promise  {
        
        return new Promise((resolve, reject) => {
            const db = Mongoose.connect(credentials);
            db.once('open', resolve);
            db.on('error', reject); // if error occurs, it will be intercepted by $onServerInitError
        });
    }
}
```

***

#### ServerLoader.$onMountingMiddlewares(): void | Promise

Some middlewares are required to work with all decorators as follow:

* `cookie-parser` are required to use `@CookieParams`,
* `body-parser` are require to use `@BodyParams`,
* [`method-override`](https://github.com/expressjs/method-override).

At this step, [Services](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader----API#serverloaderscanglobpattern-serverloader) are built.

Example of middlewares configuration:
```typescript
class Server extends ServerLoader {

    public $onMountingMiddlewares(app: Express.Application): void | Promise  {

        const morgan = require('morgan'),
            cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override'),
            session = require('express-session');

        app.use(morgan('dev'))
            .use(ServerLoader.AcceptMime("application/json"))
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride());

    }
}
```
> `$onMountingMiddlewares` accept a promise to defer the next lifecycle's phase.

***

#### ServerLoader.$afterRoutesInit(): void | Promise
> This hooks is available since v1.3.x

This hook will be called after all the routes are collected by [`ServerLoader.mount()`](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader----API#serverloadermountendpoint-globpattern-serverloader) or [`ServerLoader.scan()`](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader----API#serverloadermountendpoint-globpattern-serverloader). When all routes are collected, ServerLoader build the [Controllers](https://github.com/Romakita/ts-express-decorators/wiki/Controllers) then ServerLoader mount each route to the ExpressApp. 

This hook is the right place to add middleware like [`serve-static`](https://github.com/expressjs/serve-static) before the [Global Handlers Error](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader---Lifecycle-Hooks#serverloaderonerrorerror-request-response-next-void). 

##### With API

```typescript
class Server extends ServerLoader {

    public $afterRoutesInit(){
        const serveStatic =   require('serve-static');

        this.use(serveStatic('webapp'));
    }
}
```
##### With @ServerSettings decorator

> This decorator is available since v1.4.x

```typescript
@ServerSettings({
   serveStatic: {
      "/": "${rootDir}/webapp"
   }
})
export class Server extends ServerLoader {

}
```
> Note: serveStatic attributs supports multiple directories.

***

#### ServerLoader.$onReady(): void

On this phase your Express is ready. All Controllers are imported and all Services is constructed.
You can initialize other server here like a Socket server.

Example:
```typescript
class Server extends ServerLoader {

    public $onReady(): void {
        console.log('Server ready');
        const io = SocketIO(this.httpServer);
        // ...
    }
}
```

***

#### ServerLoader.$onAuth(request, response, next): void
* **request**: `Express.Request`
* **response**: `Express.Repsonse`
* **NextFunction**: `Express.NextFunction`

This hook respond when an Endpoint had a decorator `@Authenticated` on this method as follow:
```typescript
@Controller('/mypath')
class MyCtrl {
   
    @Get('/')
    @Authenticated()
    public getResource(){}
}
```

By default, the decorator respond true for each incoming request. To change this, you must implement your Authentification strategy by adding your method `$onAuth` on your Server (with Passport.js for example):

```typescript
class Server extends ServerLoader {
    public $onAuth(request, response, next): void {
        /// request.isAuthenticated() is provided by passport.js. You can implements other library
        next(request.isAuthenticated());
    }
}
```

> Note: Since 1.2.5 $onAuth hooks accept a fourth parameter named `autorization`.

```typescript
class Server extends ServerLoader {
    public $onAuth(request, response, next, authorization?: any): void {
        next(request.isAuthenticated());
    }
}
```
Authorization parameters let you to manage some information like a role. Example:

```typescript
@Controller('/mypath')
class MyCtrl {
   
    @Get('/')
    @Authenticated({role: 'admin'})
    public getResource(){}
}
```
The object given to `@Authenticated` will be passed to `$onAuth` hook when a new request incoming on there route path and let you manage the user's role for example.

> See a complete integration example with [Passport.js](https://github.com/Romakita/example-ts-express-decorator/tree/master/).

***

#### ServerLoader.$onError(error, request, response, next): void
* **error**: `Object`
* **request**: `Express.Request`
* **response**: `Express.Repsonse`
* **NextFunction**: `Express.NextFunction`

All errors are intercepted by the [ServerLoader](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader). By default, all 
HTTP Exceptions are automatically sent to the client, and technical error are
sent as Internal Server Error. 

You can change the default error management by adding your method on `$onError` hook.

This example show you how the default Global Errors Handler work. Customize this hook to manage the errors: 
```typescript
class Server extends ServerLoader  {

    public $onError(error: any, request: Express.Request, response: Express.Response, next: Function): void {

        if (response.headersSent) {
            return next(error);
        }

        if (typeof error === "string") {
            response.status(404).send(error);
            return next();
        }

        if (error instanceof Exception) {
            response.status(error.status).send(error.message);
            return next();
        }

        if (error.name === "CastError" || error.name === "ObjectID" || error.name === "ValidationError") {
            response.status(400).send("Bad Request");
            return next();
        }

        response.status(error.status || 500).send("Internal Error");

        return next();
        
    }
}
```
> You can use [`@MiddlewareError()`](https://github.com/Romakita/ts-express-decorators/wiki/Middlewares) to handle all errors too.
