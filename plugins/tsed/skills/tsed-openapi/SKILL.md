---
name: tsed-openapi
description: Document a Ts.ED v8 API with OpenAPI. Configures @tsed/swagger (Swagger UI) and @tsed/scalar, annotates operations and models with @tsed/schema decorators, splits controllers across several documents, and exports the spec to a file. Use when adding or fixing the `swagger` or `scalar` configuration, writing @Returns, @Summary, @Description, @Tags, @Security, @OperationId, @Hidden, @Docs, @Consumes, @Produces or @Example, generating swagger.json/openapi.json in CI, or when a route, model, property or response schema is missing or wrong in the generated spec.
---

# Ts.ED OpenAPI

Ts.ED generates the OpenAPI document from the same `@tsed/schema` metadata that drives validation and serialization. Fix the metadata, never hand-edit the generated JSON.

Read [the configuration reference](references/configuration.md) for every `swagger` / `scalar` option and [the decorator reference](references/decorators.md) for operation and response patterns. Model decorators belong to the sibling skill `tsed-models`; routes and parameters to `tsed-controllers`.

## 1. Install and register a UI

1. Install one or both UIs: `npm install @tsed/swagger` and/or `npm install @tsed/scalar`.
2. Import the package once in `Server.ts` for its side effect. Without the import the module is not registered and neither the UI nor the JSON route exists.
3. Declare `swagger` and/or `scalar` as an **array** of documents.

```typescript
import "@tsed/platform-express";
import "@tsed/swagger";
import "@tsed/scalar";
import {Configuration} from "@tsed/di";
import * as rest from "./controllers/rest/index.js";

@Configuration({
  mount: {"/rest": [...Object.values(rest)]},
  swagger: [{path: "/doc", specVersion: "3.0.3"}],
  scalar: [{path: "/scalar", specVersion: "3.1.0"}]
})
export class Server {}
```

- `mount` takes controller classes only (imported one by one or through a barrel as above). Do not pass glob strings: they are silently dropped, so the server and the spec expose no route.

- The UI is served on `path`; the JSON on `<path>/<fileName>` (`swagger.json` for Swagger, `openapi.json` for Scalar).
- `specVersion` accepts `"2.0"`, `"3.0.1"`, `"3.0.2"`, `"3.0.3"`, `"3.1.0"`. Always set it: when omitted (and `spec.openapi` is absent) Ts.ED emits Swagger `2.0`.
- Do not give two documents the same `path`: the generated spec is cached by `path`.

## 2. Describe the document

Put static metadata in `spec` and let controllers contribute paths and schemas.

```typescript
swagger: [
  {
    path: "/doc",
    specVersion: "3.0.3",
    spec: {
      info: {title: "Orders API", version: "1.2.0"},
      components: {
        securitySchemes: {bearer: {type: "http", scheme: "bearer", bearerFormat: "JWT"}}
      }
    },
    operationIdPattern: "%c_%m",
    sortPaths: true
  }
];
```

- `info.version` falls back to the root `version` configuration key.
- Use `operationIdPattern` (`%c` class name, `%m` method name) or `operationIdFormatter: (name, propertyKey, path) => string`. The default is camelCase of `%c.%m`; duplicates get a suffix.
- Use `specPath` to merge a base JSON file, and the `$alterOpenSpec(spec, conf)` hook on `Server` for last-mile edits.

## 3. Document operations

Import every decorator below from `@tsed/schema`.

```typescript
import {Controller} from "@tsed/di";
import {NotFound} from "@tsed/exceptions";
import {PathParams} from "@tsed/platform-params";
import {Description, Get, Returns, Security, Summary, Tags} from "@tsed/schema";
import {Order} from "../models/Order.js";

@Controller("/orders")
@Tags("Orders")
export class OrdersController {
  @Get("/:id")
  @Summary("Get an order")
  @Description("Returns one order by its identifier")
  @Security("bearer")
  @(Returns(200, Order).Description("The order").Groups("read"))
  @(Returns(404, NotFound).Description("Order not found"))
  get(@PathParams("id") id: string) {}
}
```

1. Declare one `@Returns(status, Model)` per status code. Wrap chained calls in parentheses: `@(Returns(...).X())`.
2. Describe collections with `@(Returns(200, Array).Of(Order))`; a TypeScript `Promise<Order[]>` return type is not read.
3. Describe generics with `@Generics("T")` on the model and `.Of(Model)` / `.Nested(Model)` on the response.
4. Add `@Deprecated()`, `@OperationId("name")`, `@Consumes(...)`, `@Produces(...)` or `.ContentType(...)` only when the default is wrong.
5. Add examples on models with `@Example(value)`; on responses with `.Examples({...})`.
6. Every `@Security(name)` must match a key of `spec.components.securitySchemes` (OS3) or `spec.securityDefinitions` (OS2).

## 4. Split controllers across documents

- By decorator: set `doc: "admin"` on a document and `@Docs("admin")` on controllers. Import `Docs` from `@tsed/swagger` or `@tsed/scalar`.
- By route: set `pathPatterns: ["/rest/admin/**"]` (micromatch, negation with `!`). Patterns are tested against the controller's mounted route, not individual method paths.
- A document with neither `doc` nor `pathPatterns` includes every non-hidden controller. A document with either one includes only matching controllers.
- Use `@Hidden()` on a controller or a method to remove it from every document.

## 5. Export the spec without serving it

Pick one; details and a full script in [the configuration reference](references/configuration.md#export-the-spec).

1. `outFile: "./spec/openapi.json"` on a document: written at `$onReady` on every start.
2. A script that calls `PlatformExpress.bootstrap(Server)` (no `listen()`), resolves `SwaggerService` from `@tsed/swagger` and calls `getOpenAPISpec(conf)`.
3. The Ts.ED CLI plugin `@tsed/cli-generate-swagger` (`tsed run generate-swagger --output <dir>`); see the sibling skill `tsed-cli`.
4. `getSpec(Controller)` or `generateSpec({tokens, ...})` from `@tsed/schema` for a DI-free unit test.

## 6. Diagnose a missing route or model

Check in this order:

1. The UI package is imported in `Server.ts` and the configuration key is an array.
2. The controller is reachable from `mount` (or `imports`); the spec is built from mounted controllers only.
3. No `@Hidden()` on the class or method.
4. The document's `doc` / `pathPatterns` filter matches the controller (step 4).
5. The response has `@Returns(status, Model)`; without it the operation has no response schema.
6. Each model property carries a schema decorator (`@Property()`, `@Required()`, ...); undecorated properties are absent.
7. `.Groups(...)` on `@Returns` or `@Groups` on properties is not filtering the field out.
8. `disableSpec: true` removes the JSON route; `viewPath: false` removes the UI.

## Do not

- Do not import decorators from `@tsed/common`; use `@tsed/schema`, `@tsed/di`, `@tsed/platform-params`.
- Do not write `swagger: {...}` as an object; it must be an array.
- Do not add `@Docs()` to some controllers and expect the others to stay in a document that sets `doc`.
- Do not hand-write `paths` in `spec` for routes Ts.ED already serves; decorate the controller.
- Do not expose the UI publicly by accident: gate the configuration by environment when the API is private.

## Pitfalls

- A blank Swagger UI or Scalar page behind `helmet` is a CSP problem, not a spec problem. See https://tsed.dev/tutorials/swagger.md.
- `hidden: true` on a Swagger document only hides it from the UI dropdown; the route stays served.
- `outFile` is written after the server is ready, not at build time; a CI job needs option 2 or 3 of step 5.
- `@Returns(Model)` without a status documents `200`. The second argument must be a class: write `@(Returns(404).Description("Not found"))`, not `@Returns(404, {description: "Not found"})`.
- Scalar UI options go under `options`; `cdn` overrides the default jsDelivr bundle URL.
- `SwaggerService` is an alias of `OpenAPIService` from `@tsed/openapi-utils`; `@tsed/scalar` does not re-export it.

## Checklist

- The UI package is imported and `swagger` / `scalar` is an array with unique `path` values.
- `spec.info` and security schemes are declared; every `@Security` name resolves.
- Every operation has `@Summary`, and one `@Returns` per status code with a model.
- Arrays and generics use `.Of()`; no response relies on the TypeScript return type.
- Multi-document filters (`doc` + `@Docs`, or `pathPatterns`) were checked against the served JSON.
- The exported spec was regenerated and diffed after the change.

Further reading: https://tsed.dev/tutorials/swagger.md, https://tsed.dev/tutorials/scalar.md, https://tsed.dev/docs/controllers.md, https://tsed.dev/docs/model.md.
