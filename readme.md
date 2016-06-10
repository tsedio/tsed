# TS-express-decorators

[![Build Status](https://travis-ci.org/Romakita/ts-express-decorators.svg?branch=master)](https://travis-ci.org/Romakita/ts-express-decorators)
[![Coverage Status](https://coveralls.io/repos/github/Romakita/ts-express-decorators/badge.svg?branch=master)](https://coveralls.io/github/Romakita/ts-express-decorators?branch=master)
[![TypeScript](https://badges.frapsoft.com/typescript/love/typescript.svg?v=100)](https://github.com/ellerbrock/typescript-badges/) 
[![TypeScript](https://badges.frapsoft.com/typescript/version/typescript-v18.svg?v=100)](https://github.com/ellerbrock/typescript-badges/)

> Build your Typescript application with Express route decorators !

Actually this npm package are flagged in beta !

## Prerequisites

ts-route-decorator require Typescript 1.8 and "experimentalDecorators" must be to set at true.

## Features

* Define classe as Controller,
* Define root path for an entire controller,
* Define as sub-route path for a method,
* Define routes on GET, POST, PUT and DELETE verbs,
* Define middlewares on routes,
* Define required parameters,
* Inject data from query string, path parameters, entire body or cookies,
* Inject Request, Response, Next object from Express request.

## Installation

Run `npm install -g typescript typings` and `npm install ts-express-decorators`.

## Example

```typescript
import {Controller, Get, Authenticated, BodyParamsRequired, Post} from "ts-express-decorators";
import * as Express from "express";

interface ICalendar{
    id: string;
    name: string;
}

@Controller("/test")
export class CalendarCtrl {

    @Get("/:id")
    public get(request: Express.Request, response: Express.Response): ICalendar {

        return <ICalendar> {id: request.params.id, name: "test"};
    }
    
    
    @Authenticated()
    @BodyParamsRequired("calendar.name")  // Throw Bad Request (400) if the req.request.calendar.name isn't provided 
    @Post("/")
    public post(
        @BodyParams("calendar") calendar: ICalendar
    ): Promise<ICalendar> {
    
        return new Promise((resolve: Function, reject: Function) => {
        
            calendar.id = 1;
            
            resolve(calendar);
            
        });
    }
}
```

## Configuration
### Create your express server

`ts-express-decorators` provide a `ServerLoad` class to configure your express quickly. Just create a `server.ts` in your root project, declare a new `Server` class that extends `ServerLoader`.

```typescript
import * as Express from "express";
import {ServerLoader} from "ts-express-decorators/server-loader";
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
     * Customize this method to manage all errors emitted by the server and controllers.
     * @param error
     * @param request
     * @param response
     * @param next
     */
    public onError(error: any, request: Express.Request, response: Express.Response, next: Function): void {

        console.error(error);

        response
            .status(500)
            .send("Internal Server error");
        
        next();
    }

    /**
     * Set here your check authentification strategy.
     * @param request
     * @param response
     * @param next
     * @returns {boolean}
     */
    public isAuthenticated(request: Express.Request, response: Express.Response, next: Function): boolean {


        return true;
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

### Create your first controller

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
}
```

To test your method, just run your `server.ts` and send a http request on `/rest/calendars/1`.

**Note** : Decorators Get support dynamic pathParams (see `/:id`) and RegExp like Express API. 

## Injection
### Inject Response and Request services

You can use decorator to inject `Express.Request`, `Express.Response` and 
`Express.NextFunction` services instead of the classic call provided by Express API.
Just use decorator `Request`, `Response` and `Next` on your method parameters like this :

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

### Inject PathParams service

PathParams decorator provide you a quick access to an attribute `Express.response.params`.

```typescript

import {Controller, Get, Response, PathParams} from "ts-express-decorators";
import * as Express from "express";

interface ICalendar{
    id: string;
    name: string;
}

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
(with the right HTTP verb @Post, @PUT, etc...), `QueryParams` or `CookiesParams` 
to get parameters send by the client. 

## Use promise to send response

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

## Decorators references
### Class decorators

* @Controller(route: string, ...ctrlsNamesDepedencies?: string[]) : Declare a new controller with his Rest path. 

### Method decorators

* @All(route)
* @Get(route)
* @Post(route)
* @Put(route)
* @Delete(route)
* @Head(route)
* @Patch(route)
* @Authenticated() : Call the Server.isAuthenticated method to check if the user is authenticated. (see setting How to configure authentification Strategy)
* @Use(...middlewares: any[])

### Parameter Decorators

* @Response() : Express.Response service.
* @Request() : Express.Request service.
* @Next() : Express.NextFunction service.
* @PathParams(expression: string): Get a parameters on Express.Request.params attribut.
* @BodyParams(expression: string): Get a parameters on Express.Request.body attribut.
* @CookiesParams(expression: string): Get a parameters on Express.Request.cookies attribut.
* @QueryParams(expression: string): Get a parameters on Express.Request.query attribut.
* @PathParamsRequired(...expression: string[]): Throw bad request if the parameter(s) isn't provided.
* @BodyParamsRequired(...expression: string[]): Throw bad request if the parameter(s) isn't provided.
* @CookiesParamsRequired(...expression: string[]): Throw bad request if the parameter(s) isn't provided.
* @QueryParamsRequired(...expression: string[]): Throw bad request if the parameter(s) isn't provided.

## License

The MIT License (MIT)

Copyright (c) 2016 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis]: https://travis-ci.org/

