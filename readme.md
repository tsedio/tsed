# TsExpressDecorators

[![Build Status](https://travis-ci.org/Romakita/ts-express-decorators.svg?branch=master)](https://travis-ci.org/Romakita/ts-express-decorators)
[![Coverage Status](https://coveralls.io/repos/github/Romakita/ts-express-decorators/badge.svg?branch=master)](https://coveralls.io/github/Romakita/ts-express-decorators?branch=master)
[![TypeScript](https://badges.frapsoft.com/typescript/love/typescript.svg?v=100)](https://github.com/ellerbrock/typescript-badges/) 
[![Package Quality](http://npm.packagequality.com/shield/ts-express-decorators.png)](http://packagequality.com/#?package=ts-express-decorators)
[![npm version](https://badge.fury.io/js/ts-express-decorators.svg)](https://badge.fury.io/js/ts-express-decorators)
[![Dependencies](https://david-dm.org/romakita/ts-express-decorators.svg)](https://david-dm.org/romakita/ts-express-decorators#info=dependencies)
[![img](https://david-dm.org/romakita/ts-express-decorators/dev-status.svg)](https://david-dm.org/romakita/ts-express-decorators/#info=devDependencies)
[![img](https://david-dm.org/romakita/ts-express-decorators/peer-status.svg)](https://david-dm.org/romakita/ts-express-decorators/#info=peerDependenciess)
[![Known Vulnerabilities](https://snyk.io/test/github/romakita/ts-express-decorators/badge.svg)](https://snyk.io/test/github/romakita/ts-express-decorators)

> Build your TypeScript v2 application with Express decorators ! Support ES5 and ES6.

[![NPM](https://nodei.co/npm/ts-express-decorators.png?downloads=true&downloadRank=true)](https://nodei.co/npm/ts-express-decorators/)
[![NPM](https://nodei.co/npm-dl/ts-express-decorators.png?months=9&height=3)](https://nodei.co/npm/ts-express-decorators/)

## Table of contents

* [Features](#features)
* [Installation](#installation)
* [Quick start](#quick-start)
* [Controllers](#controllers)
* [Services](#user-content-services)
* [Authentification](#authentification)
* [Throw HTTP exceptions](#throw-http-exceptions)
* [Global errors handler](#global-errors-handler)
* [Decorators references](#decorators-references)
* [License](#license)

## Features

* Define classe as Controller,
* Define classe as Service,
* Define root path for an entire controller,
* Define as sub-route path for a method,
* Define routes on GET, POST, PUT, DELETE and HEAD verbs,
* Define middlewares on routes,
* Define required parameters,
* Inject data from query string, path parameters, entire body, cookies or header,
* Inject Request, Response, Next object from Express request,
* IoC services.

## Installation

You can get the latest release and the type definitions using npm:

```batch
$ npm install --save ts-express-decorators express@4
```

> **Important!** TsExpressDecorators requires Node >= 4, TypeScript >= 2.0 and 
the `experimentalDecorators`, `emitDecoratorMetadata`, `types` and `lib` compilation 
options in your `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es6", "dom"],
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

> **Note** : target can be set to es2015/ES6. You can use pure es6 API with `ts-express-decorators/es6`.

### Examples

Some examples are provided :

* [Basic example](https://github.com/Romakita/example-ts-express-decorator/tree/master/basic)
* [Services declaration](https://github.com/Romakita/example-ts-express-decorator/tree/master/example-services)

## Quick start
#### Create your express server

`ts-express-decorators` provide a `ServerLoad` class to configure your express quickly. Just create a `server.ts` in your root project, declare a new `Server` class that extends `ServerLoader`.

```typescript
import * as Express from "express";
import {ServerLoader} from "ts-express-decorators";
import Path = require("path");

export class Server extends ServerLoader {
    /**
     * In your constructor set the global endpoint and configure the folder to scan the controllers.
     * You can start the http and https server.
     */
    constructor() {
        super();

        let appPath: string = Path.resolve(__dirname);
        
        this.setEndpoint("/rest")                       // Declare your endpoint
            .scan(appPath + "/controllers/**/**.js")    // Declare the directory that contains your controllers
            .createHttpServer(8000)
            .createHttpsServer({
                port: 8080
            });

    }

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public importMiddlewares(): Server {
        let morgan = require("morgan"),
            cookieParser = require("cookie-parser"),
            bodyParser = require("body-parser"),
            compress = require("compression"),
            methodOverride = require("method-override"),
            session = require("express-session");

        this
            .use(morgan("dev"))
            .use(ServerLoader.AcceptMime("application/json"))
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride());

        return this;
    }

    /**
     * Start your server. Enjoy it !
     * @returns {Promise<U>|Promise<TResult>}
     */
    static Initialize(): Promise<any> {

        log.debug("Initialize server");

        return new Server()
            .start()
            .then(() => {
                log.debug("Server started...");
            });
    }
    
}

Server.Initialize();
```

#### Create your first controller

Create a new `calendarCtrl.ts` in your controllers directory configured previously with `ServerLoader.scan()`. All controllers declared with `@Controller` decorators is considered as an Express router. An Express router require a path (here, the path is `/calendars`) to expose an url on your server. 
More precisely, it is a part of path, and entire exposed url depend on the Server configuration (see ServerLoader.setEndpoint()) and the controllers dependencies. In this case, we haven't a dependencies and the root endpoint is set `/rest`. So the url of this controller will be `http://host/rest/calendars`.

```typescript
import {Controller, Get} from "ts-express-decorators";
import * as Express from "express";

interface ICalendar{
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
    public get(request: Express.Request, response: Express.Response): ICalendar {

        return <ICalendar> {id: request.params.id, name: "test"};
    }
    
    @Authenticated()
    @BodyParamsRequired("calendar.name")  // Throw Bad Request (400) if the request.body.calendar.name isn't provided 
    @Post("/")
    public post(
        @BodyParams("calendar") calendar: ICalendar
    ): Promise<ICalendar> {
    
        return new Promise((resolve: Function, reject: Function) => {
        
            calendar.id = 1;
            
            resolve(calendar);
            
        });
    }
    
    @Authenticated()
    @Delete("/")
    public post(
        @BodyParams("calendar.id") @Required() id: string 
    ): Promise<ICalendar> {
    
        return new Promise((resolve: Function, reject: Function) => {
        
            calendar.id = id;
            
            resolve(calendar);
            
        });
    }
}
```

To test your method, just run your `server.ts` and send a http request on `/rest/calendars/1`.

**Note** : Decorators Get support dynamic pathParams (see `/:id`) and RegExp like Express API. 

## Controllers

> Since v1.1.0 a controller are instanciated for each incoming request.

### Response and Request

You can use decorator to inject `Express.RequestService`, `Express.Response` and 
`Express.NextFunction` services instead of the classic call provided by Express API.
Just use decorator `RequestService`, `Response` and `Next` on your method parameters like this :

```typescript
import {Controller, Get, Response, Request, Next} from "ts-express-decorators";
import * as Express from "express";

interface ICalendar{
    id: string;
    name: string;
}

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/:id")
    public get(
        @Request() request: Express.Request, 
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction
    ): void {
    
        setTimeout(() => {
            response.send(200, {id: request.params.id, name: "test"});
            next();
        });

    }
}
```

### PathParams, BodyParams, QueryParams

`@PathParams` decorator provide you a quick access to an attribute `Express.request.params`.

```typescript
import {Controller, Get, Response, PathParams} from "ts-express-decorators";
import * as Express from "express";

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/:id")
    public get(
        @PathParams("id") id: number, 
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction
    ): void {
    
        setTimeout(() => {
            response.send(200, {id: id, name: "test"});
            next();
        });

    }
}
```

Same decorator are available to get other params. Use `BodyParams` 
(with the right HTTP verb @Post, @Put, etc...), `QueryParams` or `CookiesParams` 
to get parameters send by the client. 


### Header

`@Header` decorator provide you a quick access to the `Express.request.get()`

```typescript
import {Controller, Get, Response, PathParams} from "ts-express-decorators";
import * as Express from "express";

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/:id")
    public get(
        @Header("x-token") token: string,
        @PathParams("id") id: number
    ): any {
    
        console.log("token", token);
        return {id: id};
    }
}
```

### Use promise

`ts-express-decorators` support Promise API to send a response. Just return a promise
in your method and the controller will be waiting your promised response before 
send a response to the client.


```typescript
import {Controller, Get, Response, Request} from "ts-express-decorators";
import * as Promise from "bluebird";
import * as Express from "express";

interface ICalendar{
    id: string;
    name: string;
}

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/:id")
    public get(
        @Request() request: Express.Request, 
        @Response() response: Express.Response
    ): Promise<ICalendar> {
    
        return new Promise<ICalendar>((resolve: Function, reject: Function) => {
        
            // you can modify status with response.status(202);

            resolve({
                id: id,
                name: "test"
            });
        });

    }
}

```

### Custom middleware

`@Use()` decoratore let you to add custom middleware on a method. 

```typescript
import {Controller, Get, PathParams} from "ts-express-decorators";
import {BadRequest} from "httpexceptions";
import * as Express from "express";

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/:id")
    @Use(CalendarCtrl.middleware)
    public get(
        @PathParams("id") id: number
    ): any {
      
       
       return {id: id};
    }
    
    static middleware(request, response, next) {
    
        console.log(request.params.id); 
        next();
    }
}
```

**Note** : Middle can't use injectable service like the `CalendarCtrl.get()` method actually. 

### Controller depedencies

A controller can depend to other controllers. Depedencies let you manage each Controller as Express Router module.

```typescript

@Controller("/events")
export class EventCtrl {
 ...
}

@Controller("/calendars", EventCtrl)
export class CalendarCtrl {
 ...
}

@Controller("/rest")
export class RestCtrl{
    constructor(
        routeService: RouteService
    ){
        routeService.printRoutes();
    }
}
```

In this example, CalendarCtrl has EventCtrl as depedencies. When all Controllers are built, the recorded routes will be as follows :

* /rest
* /rest/calendars
* /rest/calendars/events

## Services

> Since v1.1.0, TsExpessDecorators support the service injection (IOC). 

The decorator `@Service()` declare a new service can be injected in other service or controller on there `constructor()`.
All services annotated with `@Service()` are constructed one time.

`@Service()` use the `reflect-metadata` to collect and inject service on controller or other service. 

### Settings Server

In first place, you must adding the `services` folder in your server settings.
 
```typescript
import * as Express from "express";
import {ServerLoader} from "ts-express-decorators";
import Path = require("path");

export class Server extends ServerLoader {
    /**
     * In your constructor set the global endpoint and configure the folder to scan the controllers.
     * You can start the http and https server.
     */
    constructor() {
        super();

        let appPath: string = Path.resolve(__dirname);
        
        this.setEndpoint("/rest")                       // Declare your endpoint
            .scan(appPath + "/controllers/**/**.js")    // Declare the directory that contains your controllers
            .scan(appPath + "/services/**/**.js")    // Declare the directory that contains your services
            .createHttpServer(8000)
            .createHttpsServer({
                port: 8080
            });

    }
}       
```

### Declare a service and inject it to another class

```typescript

@Service()
export default class FooService {
    constructor() {
    
    }
}

@Service()
export default class MyService {
    constructor(private fooService: FooService) {
    
    }
}

@Controller('/rest') 
class MyController {
    constructor(private myService: MyService){
    
    }
}  
```


## Authentification

The `@Authentification` use a `ServerLoader.isAuthenticated()` method to check the authentification strategy.
You can configure this method by adding an isAuthenticated() method on your `Server` class.

```typescript
import * as Express from "express";
import {ServerLoader} from "ts-express-decorators";
import Path = require("path");

export class Server extends ServerLoader {

    /**
     * Set here your authentification strategy.
     * @param request
     * @param response
     * @param next
     * @returns {boolean}
     */
    public isAuthenticated(request: Express.Request, response: Express.Response, next: Express.NextFunction): boolean {


        return true;
    }
}
```

## Throw HTTP Exceptions

You can use (httpexceptions)[https://github.com/Romakita/httpexceptions] or similar module to throw an http exception.

```typescript
import {Controller, Get, PathParams} from "ts-express-decorators";
import {BadRequest} from "httpexceptions";
import * as Express from "express";

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/:id")
    public get(
        @PathParams("id") id: number
    ): any {
    
        if (!IsNaN(+id)) {
            throw(new BadRequest("Not a number"));
        }
       
       return {id: id};
    }
}
```

## Global Errors Handler

All errors are intercepted by the ServerLoader class. By default, all 
HTTP Exceptions are automatically sent to the client, and technical error are
sent as Internal Server Error. 

You can override the default method by adding `onError` method your `Server` class.

```typescript
import * as Express from "express";
import {ServerLoader} from "ts-express-decorators";
import Path = require("path");

export class Server extends ServerLoader {

    
    /**
     * Customize this method to manage all errors emitted by the server and controllers.
     * @param error
     * @param request
     * @param response
     * @param next
     */
    public onError(error: any, request: Express.Request, response: Express.Response, next: Function): void {

        console.error(error);

        return super.onError(error, request, response, next);
    }
}
```

## Decorators references
### Class decorators

* `@Controller(route: string, ...ctrlsNamesDepedencies?: string[])` : Declare a new controller with his Rest path. 
* `@Service()` : Declare a new Service that can be injected in other Service or Controller.

### Method decorators

* `@All(route)`: Intercept all request for a given route.
* `@Get(route)`: Intercept request with GET http verb for a given route.
* `@Post(route)`: Intercept request with POST http verb for a given route.
* `@Put(route)`: Intercept request with PUT http verb for a given route.
* `@Delete(route)`: Intercept request with DELETE http verb for a given route.
* `@Head(route)`: Intercept request with HEAD http verb for a given route.
* `@Patch(route)`: Intercept request with PATCH http verb for a given route.
* `@Authenticated()`: Call the `Server.isAuthenticated` method to check if the user is authenticated.
* `@Use(...middlewares: any[])`: Set a custom middleware.

### Parameter Decorators

* `@Response()`: Express.Response service.
* `@RequestService()`: Express.Request service.
* `@Next()`: Express.NextFunction service.
* `@PathParams(expression: string)`: Get a parameters on Express.Request.params attribut.
* `@BodyParams(expression: string)`: Get a parameters on Express.Request.body attribut.
* `@CookiesParams(expression: string)`: Get a parameters on Express.Request.cookies attribut.
* `@QueryParams(expression: string)`: Get a parameters on Express.Request.query attribut.
* `@Required()`: Set a required flag on parameters.

## License

The MIT License (MIT)

Copyright (c) 2016 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis]: https://travis-ci.org/

