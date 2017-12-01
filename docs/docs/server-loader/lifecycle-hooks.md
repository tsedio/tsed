# ServerLoader - Lifecycle Hooks

[ServerLoader](api/common/server/serverloader.md) calls a certain number of methods (hooks) during its initialization
phase (lifecycle). This lifecycle hooks that provide visibility into these key life moments and the ability to act
when they occur.

This schemes resume the order of the server's lifecycle and a service's lifecycle.

![lifecycle-hooks](_media/hooks-in-sequence.png)

Hook method | Description
--- | --- | ---
`constructor` | On this phase nothing is constructed. Express app isn't created.
[`$onInit`](#serverloaderoninit-void-promise) | Respond when the server starting his lifecycle. Is good place to initialize Database connection.
[`$onMountingMiddlewares`](#serverloaderonmountingmiddlewares-void-promise) | This hooks is the right place to configure the middlewares that must be used with your ExpressApplication. At this step, [InjectorService](api/common/core/di/injectorservice.md) and [services](docs/services/overview.md) are ready and can be injected. The [Controllers](docs/controllers.md) isn't built.
[`$afterRoutesInit`](#serverloaderafterroutesinit-void-promise) | Respond just after all [Controllers](docs/controllers.md) are built. You can configure the [`serve-static`](https://github.com/expressjs/serve-static) middleware on this phase.
[`$onReady`](#serverloaderonready-void) | Respond when the server is ready. At this step, HttpServer or/and HttpsServer object is available. The server listen the port.


> For more information on Service hooks see [Services lifecycle hooks](docs/services/lifecycle-hooks.md)

### Specials hooks

Some hooks have been added to intercept 3 events. This hooks are here to configure the server behavior when 
a request require an authentication strategy.

Hook method | Description
---|---
[`$onAuth`](#serverloaderonauthrequest-response-next-auth-void) | Respond when an Endpoint require an authentication strategy before access to the endpoint method.
`$onServerInitError`| Respond when an error is triggered on server initialization.

> $onAuth and $onServerInitError is a specials hooks.

!> $onAuth hook will be removed in future version. It's recommended to use the [@OverrideMiddleware](docs/middlewares/override-middleware.md).

### Hooks examples

#### ServerLoader.$onInit(): void | Promise

During this phase you can initialize your database connection for example. This hook accept a promise as return and let you to wait the database connection before run the next lifecycle's phase.

Example with mongoose Api:
```typescript
class Server extends ServerLoader {

    async $onInit(): Promise  {
        
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

At this step, [services](docs/services/overview.md) are built.

Example of middlewares configuration:
```typescript
class Server extends ServerLoader {

    async $onMountingMiddlewares(): void | Promise  {

        const cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override'),
            session = require('express-session');

        this.use(GlobalAcceptMimesMiddleware)
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

This hook will be called after all the routes are collected by [`ServerLoader.mount()`](api/common/server/serverloader.md) 
or [`ServerLoader.scan()`](api/common/server/serverloader.md). 
When all routes are collected, [ServerLoader](api/common/server/serverloader.md) build the [controllers](docs/controllers.md) then [ServerLoader](api/common/server/serverloader.md) mount each route to the ExpressApp. 

This hook is the right place to add middlewares before the [Global Handlers Error](docs/middlewares/override/global-error-handler.md). 

```typescript
class Server extends ServerLoader {
    public $afterRoutesInit(){
        
    }
}
```

***

#### ServerLoader.$onReady(): void

On this phase your Express application is ready. All controllers are imported and all services is constructed.
You can initialize other server like a Socket server.

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
> If you want integrate Socket.io, you can see the tutorials ["How to integrate Socket.io"](tutorials/socket-io.md).


### Specials hooks examples

!> $onAuth hook will be removed in future version. It's recommended to use the [@OverrideMiddleware](docs/middlewares/override-middleware.md).

#### ServerLoader.$onAuth(request, response, next, auth?): void
* **request**: `Express.Request`
* **response**: `Express.Repsonse`
* **next**: `Express.NextFunction`
* **auth?**: `Object`

This hook respond when an Endpoint had a decorator `@Authenticated` on this method as follow:
```typescript
@Controller('/mypath')
class MyCtrl {
   
    @Get('/')
    @Authenticated()
    public getResource(){}
}
```

By default, the decorator respond true for each incoming request. To change this, you must implement your authentication 
strategy by adding your method `$onAuth` on your Server (with Passport.js for example):

```typescript
class Server extends ServerLoader {
    public $onAuth(request, response, next, authorization?: any): void {
        next(request.isAuthenticated());
    }
}
```
Authorization parameters lets you manage some information like a role. Example:

```typescript
@Controller('/mypath')
class MyCtrl {
   
    @Get('/')
    @Authenticated({role: 'admin'})
    public getResource(){}
}
```
The object given to `@Authenticated` will be passed to `$onAuth` hook when a new request incoming on there route path 
and lets you manage the user's role for example.

> See a complete integration example with [Passport.js](tutorials/passport.md).

<div class="guide-links">
<a href="#/docs/filters">ServeLoader</a>
<a href="#/docs/server-loader/versionning">Versioning</a>
</div>