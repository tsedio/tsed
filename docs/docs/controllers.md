# Controllers
## Installation

You can add the `controllers` folder on `mount` attribute in your server settings as follow :

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
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
import {ServerLoader, ServerSettings} from "@tsed/common";
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

## Decorators

<ul class="api-list"><li class="api-item" data-symbol="common/mvc;AcceptMime;decorator;@;false;false;false;true"><a href="#/api/common/mvc/acceptmime"class="symbol-container symbol-type-decorator symbol-name-commonmvc-AcceptMime"title="AcceptMime"><span class="symbol decorator"></span>AcceptMime</a></li><li class="api-item" data-symbol="common/mvc;All;decorator;@;false;false;false;false"><a href="#/api/common/mvc/all"class="symbol-container symbol-type-decorator symbol-name-commonmvc-All"title="All"><span class="symbol decorator"></span>All</a></li><li class="api-item" data-symbol="common/mvc;Allow;decorator;@;false;false;false;false"><a href="#/api/common/mvc/allow"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Allow"title="Allow"><span class="symbol decorator"></span>Allow</a></li><li class="api-item" data-symbol="common/mvc;Authenticated;decorator;@;false;false;false;false"><a href="#/api/common/mvc/authenticated"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Authenticated"title="Authenticated"><span class="symbol decorator"></span>Authenticated</a></li><li class="api-item" data-symbol="common/mvc;CaseSensitive;decorator;@;false;false;false;false"><a href="#/api/common/mvc/casesensitive"class="symbol-container symbol-type-decorator symbol-name-commonmvc-CaseSensitive"title="CaseSensitive"><span class="symbol decorator"></span>CaseSensitive</a></li><li class="api-item" data-symbol="common/mvc;ContentType;decorator;@;false;false;false;false"><a href="#/api/common/mvc/contenttype"class="symbol-container symbol-type-decorator symbol-name-commonmvc-ContentType"title="ContentType"><span class="symbol decorator"></span>ContentType</a></li><li class="api-item" data-symbol="common/mvc;Controller;decorator;@;false;false;false;false"><a href="#/api/common/mvc/controller"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Controller"title="Controller"><span class="symbol decorator"></span>Controller</a></li><li class="api-item" data-symbol="common/mvc;Delete;decorator;@;false;false;false;false"><a href="#/api/common/mvc/delete"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Delete"title="Delete"><span class="symbol decorator"></span>Delete</a></li><li class="api-item" data-symbol="common/mvc;ExpressApplication;decorator;@;false;false;false;false"><a href="#/api/common/mvc/expressapplication"class="symbol-container symbol-type-decorator symbol-name-commonmvc-ExpressApplication"title="ExpressApplication"><span class="symbol decorator"></span>ExpressApplication</a></li><li class="api-item" data-symbol="common/mvc;Get;decorator;@;false;false;false;false"><a href="#/api/common/mvc/get"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Get"title="Get"><span class="symbol decorator"></span>Get</a></li><li class="api-item" data-symbol="common/mvc;Head;decorator;@;false;false;false;false"><a href="#/api/common/mvc/head"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Head"title="Head"><span class="symbol decorator"></span>Head</a></li><li class="api-item" data-symbol="common/mvc;Header;decorator;@;false;false;false;false"><a href="#/api/common/mvc/header"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Header"title="Header"><span class="symbol decorator"></span>Header</a></li><li class="api-item" data-symbol="common/mvc;Location;decorator;@;false;false;false;false"><a href="#/api/common/mvc/location"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Location"title="Location"><span class="symbol decorator"></span>Location</a></li><li class="api-item" data-symbol="common/mvc;MergeParams;decorator;@;false;false;false;false"><a href="#/api/common/mvc/mergeparams"class="symbol-container symbol-type-decorator symbol-name-commonmvc-MergeParams"title="MergeParams"><span class="symbol decorator"></span>MergeParams</a></li><li class="api-item" data-symbol="common/mvc;Middleware;decorator;@;false;false;false;false"><a href="#/api/common/mvc/middleware"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Middleware"title="Middleware"><span class="symbol decorator"></span>Middleware</a></li><li class="api-item" data-symbol="common/mvc;MiddlewareError;decorator;@;false;false;false;false"><a href="#/api/common/mvc/middlewareerror"class="symbol-container symbol-type-decorator symbol-name-commonmvc-MiddlewareError"title="MiddlewareError"><span class="symbol decorator"></span>MiddlewareError</a></li><li class="api-item" data-symbol="common/mvc;OverrideMiddleware;decorator;@;false;false;false;false"><a href="#/api/common/mvc/overridemiddleware"class="symbol-container symbol-type-decorator symbol-name-commonmvc-OverrideMiddleware"title="OverrideMiddleware"><span class="symbol decorator"></span>OverrideMiddleware</a></li><li class="api-item" data-symbol="common/mvc;Patch;decorator;@;false;false;false;false"><a href="#/api/common/mvc/patch"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Patch"title="Patch"><span class="symbol decorator"></span>Patch</a></li><li class="api-item" data-symbol="common/mvc;Post;decorator;@;false;false;false;false"><a href="#/api/common/mvc/post"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Post"title="Post"><span class="symbol decorator"></span>Post</a></li><li class="api-item" data-symbol="common/mvc;Put;decorator;@;false;false;false;false"><a href="#/api/common/mvc/put"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Put"title="Put"><span class="symbol decorator"></span>Put</a></li><li class="api-item" data-symbol="common/mvc;Redirect;decorator;@;false;false;false;false"><a href="#/api/common/mvc/redirect"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Redirect"title="Redirect"><span class="symbol decorator"></span>Redirect</a></li><li class="api-item" data-symbol="common/mvc;Render;decorator;@;false;false;false;false"><a href="#/api/common/mvc/render"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Render"title="Render"><span class="symbol decorator"></span>Render</a></li><li class="api-item" data-symbol="common/mvc;Required;decorator;@;false;false;false;false"><a href="#/api/common/mvc/required"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Required"title="Required"><span class="symbol decorator"></span>Required</a></li><li class="api-item" data-symbol="common/mvc;ResponseView;decorator;@;false;false;false;false"><a href="#/api/common/mvc/responseview"class="symbol-container symbol-type-decorator symbol-name-commonmvc-ResponseView"title="ResponseView"><span class="symbol decorator"></span>ResponseView</a></li><li class="api-item" data-symbol="common/mvc;RouterSettings;decorator;@;false;false;false;false"><a href="#/api/common/mvc/routersettings"class="symbol-container symbol-type-decorator symbol-name-commonmvc-RouterSettings"title="RouterSettings"><span class="symbol decorator"></span>RouterSettings</a></li><li class="api-item" data-symbol="common/mvc;Scope;decorator;@;false;false;false;false"><a href="#/api/common/mvc/scope"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Scope"title="Scope"><span class="symbol decorator"></span>Scope</a></li><li class="api-item" data-symbol="common/mvc;Status;decorator;@;false;false;false;false"><a href="#/api/common/mvc/status"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Status"title="Status"><span class="symbol decorator"></span>Status</a></li><li class="api-item" data-symbol="common/mvc;Strict;decorator;@;false;false;false;false"><a href="#/api/common/mvc/strict"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Strict"title="Strict"><span class="symbol decorator"></span>Strict</a></li><li class="api-item" data-symbol="common/mvc;Use;decorator;@;false;false;false;false"><a href="#/api/common/mvc/use"class="symbol-container symbol-type-decorator symbol-name-commonmvc-Use"title="Use"><span class="symbol decorator"></span>Use</a></li><li class="api-item" data-symbol="common/mvc;UseAfter;decorator;@;false;false;false;false"><a href="#/api/common/mvc/useafter"class="symbol-container symbol-type-decorator symbol-name-commonmvc-UseAfter"title="UseAfter"><span class="symbol decorator"></span>UseAfter</a></li><li class="api-item" data-symbol="common/mvc;UseBefore;decorator;@;false;false;false;false"><a href="#/api/common/mvc/usebefore"class="symbol-container symbol-type-decorator symbol-name-commonmvc-UseBefore"title="UseBefore"><span class="symbol decorator"></span>UseBefore</a></li></ul>

## Async and Promise

Ts.ED support Promise API and async instruction to send a response. Just return a promise
in your method and the controller will be waiting for your promised response before
sending a response to the client.

```typescript
import {Controller, Get, PathParams} from "@tsed/common";

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

## Multiple routes (Alias)

Ts.ED let you define multiple routes on the same method controller, with same verb like `GET` or `POST`, or with another
verb like this:

```typescript
import {Controller, Get, Post, PathParams} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/:id")
    @Get("/alias/:id")
    @Post("/:id/complexAlias")
    async get(
        @PathParams("id") id: string
    ): Promise<any> {
        return {};
    }    
}
```

## Input parameters

`@PathParams` decorator provide quick access to an attribute `Express.request.params`.

```typescript
import {Controller, Get, PathParams} from "@tsed/common";

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
import {Controller, Get, HeaderParams, PathParams} from "@tsed/common";

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
import {Controller, Get, BodyParams, Status} from "@tsed/common";

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
import {Controller, Get, Res, Req, Next} from "@tsed/common";
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

## Router

Each controller has an [Express.Router](http://expressjs.com/en/guide/routing.html) instance associated with it.
The [ExpressRouter](/api/common/mvc/expressrouter.md) decorator is here to inject this instance to your controller.

```typescript
import {Controller, Get, ExpressRouter} from "@tsed/common";

@Controller("/calendars")
export class CalendarCtrl {
    
    constructor(@ExpressRouter router: ExpressRouter) {
        router.get('/', this.myMethod)
    }
    
    myMethod(req, res, next){
        
    }
}
```
> In this case, injection on the method isn't available.

## Custom middleware

`@Use()`, `@UseBefore()`, `@UseAfter()` decorators lets you add custom middleware on a method or on controller.

### Example
```typescript
import {Controller, Get, PathParams, Use, UseBefore, UseAfter} from "@tsed/common";
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
