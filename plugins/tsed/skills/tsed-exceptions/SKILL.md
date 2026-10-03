---
name: tsed-exceptions
description: Handle errors and shape responses in a Ts.ED v8 application with @tsed/exceptions, exception filters from @tsed/platform-exceptions and response filters from @tsed/platform-response-filter. Use when throwing BadRequest/NotFound/Unauthorized or a custom exception, customizing the JSON error payload, writing a @Catch filter, customizing the 404 ResourceNotFound page, wrapping all responses in an envelope with @ResponseFilter, documenting errors with @Returns(404, NotFound), or debugging responses such as "InternalServerError", AJV_VALIDATION_ERROR or a response filter that is never called.
---

# Ts.ED Exceptions and Response Filters

Throw typed exceptions anywhere in the request flow. `PlatformExceptions` routes each error to one exception filter, which writes the response. Response filters shape successful responses only.

Package map (never import from `@tsed/common`):

| Symbol                                                                                                                                               | Package                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `Exception`, `BadRequest`, `Unauthorized`, `Forbidden`, `NotFound`, `Conflict`, `UnprocessableEntity`, `TooManyRequests`, `InternalServerError`, ... | `@tsed/exceptions`               |
| `Catch`, `ExceptionFilterMethods`, `ResourceNotFound`, `PlatformExceptions`                                                                          | `@tsed/platform-exceptions`      |
| `ResponseFilter`, `ResponseFilterMethods`                                                                                                            | `@tsed/platform-response-filter` |
| `PlatformContext`                                                                                                                                    | `@tsed/platform-http`            |
| `ValidationError`, `ParamValidationError`                                                                                                            | `@tsed/platform-params`          |

## 1. Throw exceptions

```typescript
import {BadRequest, NotFound} from "@tsed/exceptions";

throw new NotFound("Calendar not found");
throw new BadRequest("Invalid import file", cause); // cause: Error | string | object
const error = new BadRequest("Invalid payload");
error.errors = [{path: "/email", message: "already used"}];
error.setHeaders({"x-reason": "duplicate"});
throw error;
```

1. Signature: `new Xxx(message, origin?)`. Base class: `new Exception(status, message, origin?)`. `error.name` is derived from the status (`NOT_FOUND`, `BAD_REQUEST`); `error.status` holds the code.
2. `origin` as `Error` or string is stored in `error.origin` and appended to the message as `, innerException: <message>`. `origin` as a plain object is stored in `error.body`.
3. `headers` (via `setHeader`/`setHeaders`) are copied to the response; an `errors` array is copied to the payload. Both are also read from `error.origin`.
4. Throw from controllers, services, middlewares, pipes and interceptors alike. Do not catch and call `response.status(...)` manually in handlers. Do not throw strings or plain objects.

## 2. Create domain exceptions

```typescript
import {Conflict} from "@tsed/exceptions";

export class EmailAlreadyUsed extends Conflict {
  constructor(email: string) {
    super(`Email ${email} is already used`);
    this.errors = [{code: "EMAIL_ALREADY_USED", email}];
  }
}
```

Extend the built-in class matching the status. Alternatively keep domain errors HTTP-free (plain `Error` subclasses) and translate them in an exception filter.

## 3. Know the default payload

Any `Exception` subclass is sent with its status as `application/json`:

```json
{"name": "NOT_FOUND", "message": "Calendar not found", "status": 404, "errors": []}
```

1. `stack` is added only when `env` is `development`. Any other `Error` is sent with `error.status || error.statusCode || 500`; in `production` its body is the string `"InternalServerError"`, otherwise the same object shape.
2. Validation failures are a 400 with `name: "AJV_VALIDATION_ERROR"`, a message starting with `Bad request on parameter "request.body"`, and `errors[]` holding the AJV entries (`keyword`, `dataPath`, `message`, `modelName`, `requestPath`). A missing required parameter gives `REQUIRED_VALIDATION_ERROR`. Rules that produce them: tsed-models.
3. An unmatched route throws `ResourceNotFound` (a `NotFound` with `url`), message `Resource "<url>" not found`.

## 4. Write an exception filter

```typescript
import {Exception} from "@tsed/exceptions";
import {Catch, type ExceptionFilterMethods} from "@tsed/platform-exceptions";
import type {PlatformContext} from "@tsed/platform-http";

@Catch(Exception)
export class HttpExceptionFilter implements ExceptionFilterMethods<Exception> {
  catch(error: Exception, ctx: PlatformContext) {
    ctx.logger.error({event: "HTTP_ERROR", status: error.status, message: error.message});
    ctx.response
      .setHeaders(error.headers)
      .status(error.status)
      .body({code: error.name, detail: error.message, errors: error.errors || []});
  }
}
```

1. `@Catch(...types)` accepts classes or class-name strings (for third-party errors that cannot be imported, e.g. `@Catch("MongooseError")`).
2. Registration: `@Catch` registers the class when the file is evaluated. Import the file from the server entry point (`import "./filters/HttpExceptionFilter.js";`) or list the class in `imports`. There is no configuration key for exception filters.
3. Resolution: exact class-name match, then the nearest ancestor class with a filter, then the `Error` filter. One filter handles one error.
4. A filter declared for an already handled type replaces the built-in one. Built-ins: `Error`, `Exception`, Mongoose errors and thrown strings.
5. `catch` must write the response: `ctx.response.status(...).body(...)`. It may be `async`. Filters are injectable; use `inject()` or `@Inject()` for services.
6. Catch narrow types first (`@Catch(EmailAlreadyUsed)`), keep one generic `@Catch(Exception)` and, if needed, one `@Catch(Error)`.
7. Do not leak `error.stack` or raw third-party messages in a custom `@Catch(Error)` filter.

Custom 404:

```typescript
import {Catch, type ExceptionFilterMethods, ResourceNotFound} from "@tsed/platform-exceptions";
import type {PlatformContext} from "@tsed/platform-http";

@Catch(ResourceNotFound)
export class ResourceNotFoundFilter implements ExceptionFilterMethods<ResourceNotFound> {
  catch(error: ResourceNotFound, ctx: PlatformContext) {
    ctx.response.status(404).body({status: 404, message: error.message, url: error.url});
  }
}
```

## 5. Shape successful responses with a response filter

```typescript
import type {Context} from "@tsed/platform-params";
import {ResponseFilter, type ResponseFilterMethods} from "@tsed/platform-response-filter";

@ResponseFilter("application/json")
export class EnvelopeFilter implements ResponseFilterMethods {
  transform(data: unknown, ctx: Context) {
    return {data, errors: [], links: []};
  }
}

// Server.ts
@Configuration({responseFilters: [EnvelopeFilter]})
export class Server {}
```

1. List every filter in `responseFilters`. Decorating and importing is not enough: unlisted filters are ignored.
2. One filter per content type; `"*/*"` is the fallback for all types.
3. Selection uses the response content type (`@ContentType`, `@(Returns(200, Model).ContentType("text/xml"))`, or JSON for objects), negotiated against the request `Accept` header when present.
4. The filter receives data already serialized by the json-mapper and runs only for controller endpoints.
5. Exception filters write the body directly, so the envelope is not applied to errors. Produce the same envelope in the exception filter.
6. Update `@Returns` schemas to describe the envelope (generic wrapper model: tsed-models, tsed-openapi).

## 6. Document error responses

```typescript
@Get("/:id")
@Returns(200, Calendar)
@(Returns(404, NotFound).Description("Calendar not found"))
get(@PathParams("id") id: string) {}
```

Built-in exception classes ship with a schema (`name`, `message`, `status`, `errors`, `stack`). If a custom filter changes the payload, pass a model describing the new shape instead.

## Pitfalls

- Production responds `InternalServerError` for an expected error: a plain `Error` was thrown instead of an `Exception` subclass.
- Custom filter never called: its file is not imported at startup, or a more specific filter matched first.
- Response filter never called: missing from `responseFilters`, or the negotiated content type differs from the filter's.
- Message contains `, innerException: ...`: an `Error` or string was passed as second constructor argument. Pass details through `errors` instead.
- `ResourceNotFound` imported from `@tsed/platform-http` (as older doc snippets show) fails; import it from `@tsed/platform-exceptions`.
- Double response or hanging request: the filter did not call `ctx.response.body(...)`, or also rethrew.

## Checklist

- Expected failures throw `@tsed/exceptions` classes or subclasses; nothing throws strings.
- Filters decorated with `@Catch`, implement `catch(error, ctx)`, and are imported at startup.
- Response filters listed in `responseFilters`.
- Success and error payload shapes are consistent and documented with `@Returns`.
- 4xx, 5xx and 404 paths covered by integration tests (see tsed-testing).
- No `@tsed/common` import; relative imports end with `.js`.

Depth: https://tsed.dev/docs/exceptions.md, https://tsed.dev/docs/response-filter.md, https://tsed.dev/docs/not-found-page.md.
