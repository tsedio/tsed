# Getting started
## Installation

You can get the latest release using npm:

```batch
$ npm install --save ts-express-decorators express@4 @types/express
```

> **Important!** Ts.ED requires Node >= 6, Express >= 4, TypeScript >= 2.0 and 
the `experimentalDecorators`, `emitDecoratorMetadata`, `types` and `lib` compilation 
options in your `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "target": "es2015",
    "lib": ["es2015"],
    "types": ["reflect-metadata"],
    "module": "commonjs",
    "moduleResolution": "node",
    "experimentalDecorators":true,
    "emitDecoratorMetadata": true,
    "sourceMap": true,
    "declaration": false
  },
  "exclude": [
    "node_modules"
  ]
}
```

> **Note** : target must be set to ES2015/ES6 (or more).

### Optional

You can copy this example of package.json to develop your application:

```json
{
  "name": "test-ts-express-decorator",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "npm run tsc",
    "coverage": "npm run test-cov && npm run test-remap",
    "postinstall": "npm run build",
    "tslint": "tslint ./*.ts ./lib/*.ts",
    "test": "mocha --reporter spec --check-leaks --bail test/",
    "tsc": "tsc --project tsconfig.json",
    "tsc:w": "tsc -w",
    "start": "nodemon --watch '**/*.ts' --ignore 'node_modules/**/*' --exec ts-node app.ts"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.15.2",
    "compression": "^1.6.2",
    "cookie-parser": "^1.4.3",
    "express": "^4.14.0",
    "express-session": "^1.14.2",
    "method-override": "^2.3.6",
    "ts-express-decorators": "2.0.0",
    "typescript": "^2.4.3"
  },
  "devDependencies": {
    "@types/express": "^4.0.37",
    "@types/node": "^8.0.13",
    "concurrently": "^3.1.0",
    "nodemon": "^1.11.0"
  }
}
```

> Use the command `npm start` to start you server with the Typescript auto compilation and the nodemon task.
 Nodemon restart automatically your server when a file is modified.

## Quick start
### Create your express server

Ts.ED provide a `ServerLoad` class to configure your 
Express application quickly. Just create a `server.ts` in your root project, declare 
a new `Server` class that extends [`ServerLoader`](docs/server-loader/_sidebar.md).

#### With decorators

```typescript
import {ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware} from "ts-express-decorators";
import Path = require("path");

@ServerSettings({
    rootDir: Path.resolve(__dirname), // optional. By default it's equal to process.cwd()
    acceptMimes: ["application/json"]
})
export class Server extends ServerLoader {

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public $onMountingMiddlewares(): void|Promise<any> {
    
        const cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override');

        this
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }

    public $onReady(){
        console.log('Server started...');
    }
   
    public $onServerInitError(err){
        console.error(err);
    }
}

new Server().start();
```
> By default ServerLoader load controllers in `${rootDir}/controllers` and mount it to `/rest` endpoint.

To customize the server settings see [Configuration](configuration.md) page.

#### With the methods

These example is available for all version and use ServerLoader API to configure the server.

```typescript
import {ServerLoader, GlobalAcceptMimesMiddleware} from "ts-express-decorators";
import Path = require("path");

export class Server extends ServerLoader {
    /**
     * In your constructor set the global endpoint and configure the folder to scan the controllers.
     * You can start the http and https server.
     */
    constructor() {
        super();

        const appPath: string = Path.resolve(__dirname);
        
        this.mount("/rest", appPath + "/controllers/**/**.js")    // Declare the directory that contains your controllers
            .createHttpServer(8000)
            .createHttpsServer({
                port: 8080
            });

    }

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    $onMountingMiddlewares(): void|Promise<any> {
    
        const morgan = require('morgan'),
            cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override');

        this
            .use(morgan('dev'))
            .use(GlobalAcceptMimesMiddleware)

            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }

    public $onReady(){
        console.log('Server started...');
    }
   
    public $onServerInitError(err){
        console.error(err);
    }
}

new Server().start();
```

## Create your first controller

Create a new `calendarCtrl.ts` in your controllers directory (by default `root/controllers`).
All controllers declared with `@Controller` decorators is considered as an Express router. 
An Express router require a path (here, the path is `/calendars`) to expose an url on your server. 
More precisely, it's a part of path, and entire exposed url depend on the Server configuration (see [Configuragtion](configuration.md)) 
and the [controllers dependencies](docs/controllers.md). 

In this case, we haven't a dependencies and the root endpoint is set to `/rest`. 
So the controller's url will be `http://host/rest/calendars`.

```typescript
import {
    Controller, Get, Render, Post, 
    Authenticated, Required, BodyParams,
    Delete
} from "ts-express-decorators";
import * as Express from "express";

export interface Calendar{
    id: string;
    name: string;
}

@Controller("/calendars")
export class CalendarCtrl {

    /**
     * Example of classic call. Use `@Get` for routing a request to your method.
     * In this case, this route "/calendars/:id" are mounted on the "rest/" path.
     *
     * By default, the response is sent with status 200 and is serialized in JSON.
     *
     * @param request
     * @param response
     * @returns {{id: any, name: string}}
     */
    @Get("/:id")
    async get(request: Express.Request, response: Express.Response): Promise<Calendar> {
        return {id: request.params.id, name: "test"};
    }

    @Get("/")
    @Render("calendars/index") // Render "calendars/index" file using Express.Response.render
    async renderCalendars(request: Express.Request, response: Express.Response): Promise<Array<Calendar>> {
        return [{id: '1', name: "test"}];
    }
    
    @Post("/")
    @Authenticated()
    async post(
        @Required() @BodyParams("calendar") calendar: Calendar
    ): Promise<Calendar> {
        return new Promise((resolve: Function, reject: Function) => {
            calendar.id = "1";
            resolve(calendar);
        });
    }
    
    @Delete("/")
    @Authenticated()
    async post(
        @BodyParams("calendar.id") @Required() id: string 
    ): Promise<Calendar> {
        return {id, name: "calendar"};
    }
}
```

To test your method, just run your `server.ts` and send a http request on `/rest/calendars/1`.

> **Note** : Decorators `@Get` support dynamic pathParams (see `/:id`) and `RegExp` like Express API. 


### Ready for More?

We’ve briefly introduced the most basic features of Ts.ED - the rest of this guide will cover them and other advanced features with much finer details, so make sure to read through it all!

<div class="guide-links">
<a href="#/configuration">Configuration</a>
<a href="#/docs/controllers">Controllers</a>
</div>

***

### Other topics

<div class="topics">
  [Controllers](docs/controllers.md)
  [Services](docs/services/overview.md)
  [Middlewares](docs/middlewares/overview.md)
  [Scope](docs/scope.md)
  [Converters](docs/converters.md)
  [Filters](docs/filters.md)
  [Testing](docs/testing.md)
  [Authentication](docs/middlewares/override/authentication.md)
  [Global Error Handler](docs/middlewares/override/global-error-handler.md)
  [Guides](tutorials/overview.md)
  [Passport.js](tutorials/passport.md)
  [Socket.io](tutorials/socket-io.md)
  [Swagger](tutorials/swagger.md)
  [Upload files](tutorials/upload-files-with-multer.md)
  [Serve static files](tutorials/serve-static-files.md)
  [Templating](tutorials/templating.md)
  [Throw HTTP exceptions](tutorials/throw-http-exceptions.md)
  [AWS project](tutorials/aws.md)
</div>  
