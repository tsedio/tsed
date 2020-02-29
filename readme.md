# Ts.ED

[![Build Status](https://travis-ci.org/TypedProject/tsed.svg?branch=master)](https://travis-ci.org/TypedProject/tsed)
[![Coverage Status](https://coveralls.io/repos/github/TypedProject/tsed/badge.svg?branch=production)](https://coveralls.io/github/TypedProject/tsed?branch=production)
![npm](https://img.shields.io/npm/dm/@tsed/common.svg)
[![Package Quality](https://npm.packagequality.com/badge/@tsed/common.png)](https://packagequality.com/#?package=@tsed/common)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![Dependencies](https://david-dm.org/TypedProject/tsed.svg)](https://david-dm.org/TypedProject/tsed#info=dependencies)
[![img](https://david-dm.org/TypedProject/tsed/dev-status.svg)](https://david-dm.org/TypedProject/tsed/#info=devDependencies)
[![img](https://david-dm.org/TypedProject/tsed/peer-status.svg)](https://david-dm.org/TypedProject/tsed/#info=peerDependenciess)
[![Known Vulnerabilities](https://snyk.io/test/github/TypedProject/tsed/badge.svg)](https://snyk.io/test/github/TypedProject/tsed)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![backers](https://opencollective.com/tsed/tiers/backer/badge.svg?label=backer&color=brightgreen)](https://opencollective.com/tsed/tiers/backer/badge.svg?label=backer&color=brightgreen)

> A Node.js and TypeScript Framework on top of Express. It provides a lot of decorators and guidelines to write your code.

## What it is

Ts.ED is a framework on top of Express that helps you write your application in TypeScript (or in ES6). It provides a lot of decorators 
to make your code more readable and less error-prone.

## Features

* Define class as Controller,
* Define class as Service (IoC),
* Define class as Middleware and MiddlewareError,
* Define class as Converter (POJ to Model and Model to POJ),
* Define root path for an entire controller and versioning your Rest API,
* Define as sub-route path for a method,
* Define routes on GET, POST, PUT, DELETE and HEAD verbs,
* Define middlewares on routes,
* Define required parameters,
* Inject data from query string, path parameters, entire body, cookies, session or header,
* Inject Request, Response, Next object from Express request,
* Template (View),
* Swagger documentation and Swagger-ui,
* Testing.

## Documentation

Documentation is available on [https://tsed.io](https://tsed.io)

## Examples

Examples are available on [https://tsed.io/#/tutorials/overview](https://tsed.io/#/tutorials/overview)

## Installation

You can get the latest release using npm:

```batch
$ npm install --save @tsed/core @tsed/common express@4 @types/express
```

> **Important!** TsExpressDecorators requires Node >= 6, Express >= 4, TypeScript >= 2.0 and 
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

## Quick start
#### Create your express server

TsExpressDecorators provides a [`ServerLoader`](docs/server-loader.md) class to configure your 
express quickly. Just create a `server.ts` in your root project, declare 
a new `Server` class that extends [`ServerLoader`](docs/server-loader.md).

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import * as Path from "path";                              

const rootDir = Path.resolve(__dirname);

@ServerSettings({
    rootDir,
    acceptMimes: ["application/json"]
})
export class Server extends ServerLoader {
  /**
   * This method lets you configure the middleware required for your application to work.
   * @returns {Server}
   */
  public $beforeRoutesInit(): void|Promise<any> {
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
}
```
> By default ServerLoader loads controllers in `${rootDir}/controllers` and mounts them on the `/rest` endpoint.

And finally:

```typescript
import {$log, ServerLoader} from "@tsed/common";
import {Server} from "./Server";

async function bootstrap() {
  try {
    $log.debug("Start server...");
    const server = await ServerLoader.bootstrap(Server);

    await server.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
```

To customize the server settings see [Configure server with decorator](https://tsed.io/configuration.html)

#### Create your first controller

Create a new `calendarCtrl.ts` in your controllers directory, as previously configured with `ServerLoader.mount()`. All controllers declared with `@Controller` 
decorators are considered Express routers. An Express router requires a path 
(here, the path is `/calendars`) to expose an url on your server. 
More precisely, it is part of a path, and the entire exposed url depends on 
the Server configuration (see `ServerLoader.setEndpoint()`) and the controller's 
dependencies. In this case, we don't have dependencies and the root endpoint is set to `/rest`. 
So the controller's url will be `http://host/rest/calendars`.

```typescript
import {Controller, Get} from "@tsed/common";
import * as Express from "express";

export interface Calendar{
    id: string;
    name: string;
}

@Controller("/calendars")
export class CalendarCtrl {
    /**
     * Example of classic call. Use `@Get` for routing a request to your method.
     * In this case, this route "/calendars/:id" is mounted on the "rest/" path.
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
    @ResponseView("calendars/index") // Render "calendars/index" file using Express.Response.render internal
    async renderCalendars(request: Express.Request, response: Express.Response): Promise<Array<Calendar>> {

        return [{id: '1', name: "test"}];
    }
    
    @Post("/")
    @Authenticated()
    async post(
        @Required() @BodyParams("calendar") calendar: Calendar
    ): Promise<ICalendar> {
    
        return new Promise((resolve: Function, reject: Function) => {
        
            calendar.id = 1;
            
            resolve(calendar);
            
        });
    }
    
    @Delete("/")
    @Authenticated()
    async post(
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

> **Note** : Decorators `@Get` support dynamic pathParams (see `/:id`) and `RegExp` like Express API. 

## Contributors
Please read [contributing guidelines here](./CONTRIBUTING.md).

<a href="https://github.com/TypedProject/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2018 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis]: https://travis-ci.org/

