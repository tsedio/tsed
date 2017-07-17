# Controllers
## Installation
You can adding the `controllers` folder on `mount` attribute in your server settings as follow :
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

## Versioning yours API

As you seen in the previous example, the `mount` attribute is an object that let you to provide the global endpoint for your all controllers under the `controllers` folder.

You can add more configuration to mount different endpoint associated to a folder. Here an other configuration example:
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
in your method and the controller will be waiting your promised response before 
send a response to the client.

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

`@PathParams` decorator provide you a quick access to an attribute `Express.request.params`.

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

Same decorator are available to get other params. Use `BodyParams` 
(with the right HTTP verb `@Post`, `@Put`, etc...), `QueryParams` or `CookiesParams` 
to get parameters send by the client. 

## Header

`@Header` decorator provide you a quick access to the `Express.request.get()`

```typescript
import {Controller, Get, Header, PathParams} from "ts-express-decorators";

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/:id")
    async get(
        @Header("x-token") token: string,
        @PathParams("id") id: number
    ): any {
        console.log("token", token);
        return {id: id};
    }
}
```

## Status

You can change de status of the response with the `@Status()` decorator.
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

You can use decorator to inject `Express.Request`, `Express.Response` and 
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

`@Use()` decorator let you to add custom middleware on a method. 

```typescript
import {Controller, Get, PathParams, Use, UseBefore, UseAfter} from "ts-express-decorators";
import {BadRequest} from "httpexceptions";
import {CustomMiddleware} from "../middlewares/CustomMiddleware"

@Controller("/calendars")
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
> For more information about the `CustomMiddleware` see the [Middlewares](docs/middlewares.md) section.

## Dependencies

A controller can depend to an other controllers. Dependencies let you manage each `Controller` as Express Router module.

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

