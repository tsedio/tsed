# Controllers
## Installation
You can add the `controllers` folder on `mount` attribute in your server settings as follow :
```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import Path = require("path");
const rootDir = Path.resolve(__dirname);

@ServerSettings({
   rootDir,
   mount: {
      '/rest': `${rootDir}/controllers/*.js`
   }
})
export class Server extends ServerLoader {
    $onMountingMiddlewares(): void|Promise<any> {

        const cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override');


        this
            .use(ServerLoader.AcceptMime("application/json"))

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

## Versioning your API

As you have seen in the previous example, the `mount` attribute is an object that let you to provide the global endpoint for your all controllers under the `controllers` folder.

You can add more configuration to mount different endpoint associated to a folder. Here is another configuration example:
```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import Path = require("path");

@ServerSettings({
   rootDir: Path.resolve(__dirname),
   mount: {
     "/rest": "${rootDir}/controllers/current/**/*.js",
     "/rest/v1": "${rootDir}/controllers/v1/**/*.js"
   }
})
export class Server extends ServerLoader {
    
}
```

## Async and Promise

Ts.ED support Promise API and async instruction to send a response. Just return a promise
in your method and the controller will be waiting for your promised response before 
sending a response to the client.

```typescript
import {Controller, Get, PathParams} from "ts-express-decorators";

interface Calendar{
    id: string;
    name: string;
}

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/:id")
    public get(
        @PathParams("id") id: string
    ): Promise<Calendar> {
    
        return new Promise<Calendar>((resolve: Function, reject: Function) => {
            resolve({
                id,
                name: "test"
            });
        });

    }
    // or
    @Get("/:id")
    async get(
        @PathParams("id") id: string

    ): Promise<Calendar> {
 
        return {
            id,
            name: "test"
        };
    }
}

```

## Input parameters

`@PathParams` decorator provide quick access to an attribute `Express.request.params`.

```typescript
import {Controller, Get, PathParams} from "ts-express-decorators";

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/:id")
    async get(
        @PathParams("id") id: number    
    ): void {
    
        return {id: id, name: "test"}

    }
}
```

Same decorator is available to get other params. Use `BodyParams` 
(with the right HTTP verb `@Post`, `@Put`, etc...), `QueryParams` or `CookiesParams` 
to get parameters send by the client. 

## HeaderParams

`@HeaderParams` decorator provide you a quick access to the `Express.request.get()`

```typescript
import {Controller, Get, Header, PathParams} from "ts-express-decorators";

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/:id")
    async get(
        @HeaderParams("x-token") token: string,
        @PathParams("id") id: number
    ): any {
        console.log("token", token);
        return {id: id};
    }
}
```

## Status

You can change the status of the response with the `@Status()` decorator.
```typescript
import {Controller, Get, BodyParams, Status} from "ts-express-decorators";

interface Calendar{
    id: string;
    name: string;
}

@Controller("/calendars")
export class CalendarCtrl {
    @Put("/")
    @Status(201)
    async create(
        @BodyParams("name") id: string
    ): Promise<Calendar> {
        return {
            id: 2,
            name: "test"
        };
    }
}
```


## Response and Request

You can use a decorator to inject `Express.Request`, `Express.Response` and 
`Express.NextFunction` services instead of the classic call provided by Express API.
Just use decorator `Request` (or `Req`), `Response` (or `Res`) and `Next` on your method parameters like this :

```typescript
import {Controller, Get, Res, Req, Next} from "ts-express-decorators";
import * as Express from "express";

interface ICalendar{
    id: string;
    name: string;
}

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/:id")
    get(
        @Req() request: Express.Request, 
        @Res() response: Express.Response,
        @Next() next: Express.NextFunction
    ): void {
    
        setTimeout(() => {
            response.send(200, {id: request.params.id, name: "test"});
            next();
        });

    }
}
```

## Custom middleware

`@Use()`, `@UseBefore()`, `@UseAfter()` decorators lets you add custom middleware on a method or on controller. 

### Example
```typescript
import {Controller, Get, PathParams, Use, UseBefore, UseAfter} from "ts-express-decorators";
import {BadRequest} from "httpexceptions";
import {CustomMiddleware, CustomBeforeMdlw} from "../middlewares/middlewares"

@Controller("/calendars")
@UseBefore(CustomBeforeMdlw)
export class CalendarCtrl {

    @Get("/:id")
    @Use(CustomMiddleware)
    async get(
        @PathParams("id") id: number
    ): any {
       return {id: id};
    }
    
    @Get("/:id")
    @UseBefore(CustomMiddleware)
    async get(
        @PathParams("id") id: number
    ): any {
       return {id: id};
    }
    
    @Get("/:id")
    @UseAfter(CustomMiddleware)
    async get(
        @PathParams("id") id: number
    ): any {
       return {id: id};
    }
}
```
> For more information about the `CustomMiddleware` see the [Middlewares](docs/middlewares/overview.md) section.

### Middleware call sequence

When a request is sent to the server all middlewares added in the ServerLoader, Controller or Endpoint with decorators
 will be called while a response isn't sent by one of the middleware in the stack.

<img src="_media/middleware-call-sequence.png" style="max-width:400px">

> See [middleware call sequence](docs/middlewares/call-sequence.md) for more information.

## Dependencies

A controller can depend to an other controllers. Dependencies lets you manage each `Controller` as Express Router module.

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
        console.log(routeService.printRoutes());
    }
}
```

In this example, `CalendarCtrl` have `EventCtrl` as dependencies. When all Controllers are built, the recorded routes will be as follows :

* /rest
* /rest/calendars
* /rest/calendars/events

## Merge Params

In some case you need to have a complex routes like this `rest/calendars/:calendarId/events/:eventId`. 
This route can be written with Ts.ED like this :

```typescript
@Controller("/:calendarId/events")
class EventCtrl {
    @Get("/:eventId")
    async get(
        @PathParams("calendarId") calendarId: string,
        @PathParams("eventId") eventId: string
    ) {
        console.log("calendarId =>", calendarId);
        console.log("eventId =>", eventId);
    }
}
```
In this case, the calendarId will be `undefined` because `Express.Router` didn't merge params by 
default from the parent `Router` (see [Express documentation](http://expressjs.com/fr/api.html#express.router)).

To solve it you can use the `@MergeParams()` decorator. See example:

```typescript
@Controller("/:calendarId/events")
@MergeParams()
class EventCtrl {
    @Get("/:eventId")
    async get(
        @PathParams("calendarId") calendarId: string,
        @PathParams("eventId") eventId: string
    ) {
        console.log("calendarId =>", calendarId);
        console.log("eventId =>", eventId);
    }
}
```
> Now, calendarId will have the value given in the context path.

> CaseSensitive and Strict options are also supported.

## Inheritance

Ts.ED support the ES6 inheritance class. So you can declare a controller that implement some generic method
and use it on a children class.


To do that just declare a parent controller without the `@Controller` decorator.
```typescript
export abstract class BaseController {
    constructor(private someService: SomeService) {}
    
    @Get('/list')
    async list(@QueryParams("search") search: any) {
        return someService.list(search)
    }
}
```

Then, on your children controller:

```typescript
@Controller('/children')
export abstract class ChildrenCtrl extends BaseController {
    @Get('/:id')
    async get(@PathParams("id") id: string): Promise<any> {
      return {id: id}  
    }
}
```

<div class="guide-links">
<a href="#/configuration">Configuration</a>
<a href="#/docs/services/overview">Services</a>
</div>
