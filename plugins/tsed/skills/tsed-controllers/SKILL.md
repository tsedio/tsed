---
name: tsed-controllers
description: Write Ts.ED v8 HTTP controllers and routes - @Controller paths and nested children, mounting through the `mount` configuration, verb decorators from @tsed/schema, parameter decorators from @tsed/platform-params, typed inputs, response decorators and custom endpoint decorators. Use when adding or fixing a REST endpoint, when a route returns 404 or is shadowed by another route, when @BodyParams/@QueryParams/@PathParams receive a plain object or the wrong type, or when working with @Returns, @Status, @Redirect, @View, @Hidden, @Req/@Res or useDecorators.
---

# Ts.ED Controllers and Routing

Declare endpoints with decorators and let Ts.ED map, validate and serialize. Keep controllers thin: inputs in, service call, value out.

Package map (never import from `@tsed/common`):

| Symbol                                                                                                                                                              | Package                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `Controller`, `Configuration`, `Inject`                                                                                                                             | `@tsed/di`              |
| `Get`, `Post`, `Put`, `Patch`, `Delete`, `Head`, `Options`, `All`, `Returns`, `Status`, `Redirect`, `Location`, `ContentType`, `Header`, `View`, `Hidden`           | `@tsed/schema`          |
| `PathParams`, `QueryParams`, `BodyParams`, `HeaderParams`, `Cookies`, `Session`, `Locals`, `Context`, `RawBodyParams`, `RawPathParams`, `RawQueryParams`, `UsePipe` | `@tsed/platform-params` |
| `Req`, `Res`, `Next`, `PlatformRequest`, `PlatformResponse`, `PlatformContext`                                                                                      | `@tsed/platform-http`   |
| `useDecorators`, `StoreSet`                                                                                                                                         | `@tsed/core`            |

## 1. Declare and mount the controller

```typescript
import {Controller, Inject} from "@tsed/di";
import {NotFound} from "@tsed/exceptions";
import {BodyParams, PathParams, QueryParams} from "@tsed/platform-params";
import {Get, Post, Returns} from "@tsed/schema";
import {Calendar} from "../models/Calendar.js";
import {CalendarsService} from "../services/CalendarsService.js";

@Controller("/calendars")
export class CalendarsController {
  @Inject()
  protected service: CalendarsService;

  @Get("/")
  @(Returns(200, Array).Of(Calendar))
  list(@QueryParams("limit") limit: number = 20) {
    return this.service.list(limit);
  }

  @Get("/:id")
  @Returns(200, Calendar)
  @Returns(404, NotFound)
  async get(@PathParams("id") id: string) {
    const calendar = await this.service.get(id);
    if (!calendar) throw new NotFound("Calendar not found");
    return calendar;
  }

  @Post("/")
  @Returns(201, Calendar)
  create(@BodyParams() payload: Calendar) {
    return this.service.create(payload);
  }
}
```

1. Mount it explicitly in the server configuration. A controller that is neither mounted nor listed as a child is never routed.

```typescript
import {Configuration} from "@tsed/di";
import {CalendarsController} from "./controllers/CalendarsController.js";

@Configuration({mount: {"/rest": [CalendarsController]}})
export class Server {}
```

2. Pass controller classes (or `Object.values()` of a barrel). Do not pass glob strings to `mount`.
3. Version an API by mounting different class lists on `/rest/v1`, `/rest/v2`.
4. Nest with `@Controller({path: "/rest", children: [CalendarsController, EventsController]})`; mount only the parent. A child can be reused under several parents.
5. Share handlers through class inheritance: put endpoints on an undecorated base class and add `@Controller` on the subclass only.

## 2. Bind inputs

1. Give every parameter a decorator: `@PathParams("id")`, `@QueryParams("q")`, `@BodyParams()`, `@BodyParams("field")`, `@HeaderParams("x-token")`, `@Cookies("sid")`, `@Session("user")`, `@Locals("key")`, `@Context() $ctx`.
2. Type parameters with model classes, not interfaces or type aliases. An interface, a union or `any` is emitted as `Object`: no mapping, no property validation. Use `@Any()` from `@tsed/schema` when any type must be accepted.
3. Pass the item class for collections, because TypeScript erases generics: `@BodyParams(Product) products: Product[]`, `@QueryParams("ids", String) ids: string[]`.
4. Use a class for a whole query string: `@QueryParams() query: SearchQuery`.
5. Add inline constraints with schema decorators on the parameter: `@PathParams("id") @Pattern(/^[0-9a-f]{24}$/) id: string`.
6. Only `@BodyParams`, `@PathParams` and `@QueryParams` run the json-mapper and validation by default. `@HeaderParams`, `@Cookies`, `@Session`, `@Locals` do not; opt in with the options form `@HeaderParams({expression: "x-id", useValidation: true, useMapper: true})`.
7. Use the `Raw*` variants to bypass mapping and validation (for example before `@UsePipe`, see tsed-middlewares).
8. Prefer `@Context() $ctx: PlatformContext` (`$ctx.request`, `$ctx.response`, `$ctx.logger`, `$ctx.endpoint`) over `@Req()`/`@Res()`. Do not type `@Req()`/`@Res()` as Express objects in portable code; use `PlatformRequest`/`PlatformResponse`.

Model, validation and group rules belong to tsed-models.

## 3. Shape the response

1. Return the value. Promises, `Observable`, `Buffer` and readable streams are resolved and sent by the platform. Do not call `res.send()`/`res.json()` and also return a value.
2. Declare each status with `@Returns(status, Model)`. It drives OpenAPI and the serialization options of that status: `.Of(Item)`, `.Nested(Sub)`, `.Groups("read")`, `.ContentType("text/xml")`, `.Header("x-total", ...)`, `.Description("...")`, `.Binary()`.
3. Wrap chained decorators in parentheses: `@(Returns(200, Pagination).Of(Product))`.
4. Set a fixed status and headers with `@Status(201, Model)`, `@Header("x-version", "1")`, `@ContentType("text/csv")`. Use `$ctx.response.status(...)`, `.setHeaders(...)`, `.attachment(...)` for dynamic values.
5. Redirect with `@Redirect("/new")` or `@Redirect(301, "/new")`; add a `Location` header with `@Location("/items/1")`.
6. Render templates with `@View("calendar.ejs")` and return the view data (engine setup: https://tsed.dev/docs/templating.md).
7. Hide an endpoint or controller from OpenAPI with `@Hidden()`. Documentation details belong to tsed-openapi.

## 4. Order and write paths

1. Routes register in method declaration order. Put static paths (`/search`) above parametric ones (`/:id`).
2. Stack verb decorators to alias one handler: `@Get("/:id") @Get("/alias/:id")`.
3. Supported path tokens: `/:id`, optional `/:id?` or Express 5 `/{:id}`, named wildcard `/:path*` read with `@PathParams("path")`. Adapters convert these for Express 4/5, Koa and Fastify.
4. Do not embed RegExp groups in string paths (`/:id(\\d+)`); Express 5 rejects them and Ts.ED does not convert them. Validate with `@Pattern` instead.

## 5. Build a custom endpoint decorator

Compose existing decorators with `useDecorators`; store options with `StoreSet` and read them through `$ctx.endpoint.get(Key)`.

```typescript
import {StoreSet, useDecorators} from "@tsed/core";
import {UseBefore} from "@tsed/platform-middlewares";
import {Returns} from "@tsed/schema";
import {QuotaMiddleware} from "../middlewares/QuotaMiddleware.js";

export function Quota(limit: number) {
  return useDecorators(StoreSet(QuotaMiddleware, {limit}), UseBefore(QuotaMiddleware), Returns(429));
}
```

Middlewares, auth decorators, interceptors and pipes: tsed-middlewares. Thrown errors and error payloads: tsed-exceptions.

## Pitfalls

- 404 on every route: the controller is not in `mount`, or the mount prefix was forgotten in the URL.
- `/calendars/search` hits `get(":id")`: reorder the methods.
- Body arrives as a plain object: the parameter type is an interface, or the collection item type was not given.
- Model properties missing from input or output: the property has no schema decorator (see tsed-models).
- `@Returns` does not convert the returned value to another class; it selects serialization options (groups, generics) and documents the response.
- Relative imports without the `.js` extension fail at runtime in ESM projects.
- Routes added through an injected `PlatformRouter` are not part of the OpenAPI document.

## Checklist

- Controller decorated, exported, and mounted or listed in a parent's `children`.
- Every parameter decorated and typed with a class or primitive; collections pass the item class.
- Each success and error status declared with `@Returns`.
- Static routes declared before parametric routes; no RegExp in string paths.
- No `@tsed/common` import; relative imports end with `.js`.
- Endpoint covered by a test (see tsed-testing).

Depth: https://tsed.dev/docs/controllers.md, https://tsed.dev/docs/routing.md, https://tsed.dev/docs/custom-endpoint-decorators.md, https://tsed.dev/docs/request-context.md.
