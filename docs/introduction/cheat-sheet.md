# Cheat Sheet

## 🚀 Server & Configuration

```ts
import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import * as controllers from "./controllers/index.js";

@Configuration({
  port: 3000,
  logger: true,
  mount: [...Object.values(controllers)]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;
}
```

## 🎯 Simple Controller

```ts
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/hello")
export class HelloController {
  @Get("/")
  get() {
    return {message: "Hello world"};
  }
}
```

## 🧩 Service Injection

```ts
import {Injectable} from "@tsed/di";

@Injectable()
export class MyService {
  greet(name: string): string {
    return `Hello, ${name}!`;
  }
}
```

```ts
import {Get} from "@tsed/schema";
import {Controller, Inject} from "@tsed/di";

@Controller("/hello")
export class HelloController {
  @Inject()
  protected myService: MyService;

  @Get("/")
  get() {
    return {message: this.myService.greet("World")};
  }
}
```

## 📥 Retrieving Parameters

```ts
import {Controller} from "@tsed/di";
import {Get, Post} from "@tsed/schema";
import {PathParams, QueryParams, BodyParams, HeaderParams} from "@tsed/platform-params";

@Controller("/users")
export class UserController {
  @Get("/:id")
  getById(@PathParams("id") id: string, @QueryParams("expand") expand?: boolean) {
    // ...
  }

  @Post("/")
  create(@BodyParams() user: any, @HeaderParams("x-api-key") apiKey: string) {
    // ...
  }
}
```

## 🛡️ Custom middleware

```ts
import {Middleware} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";
import {Unauthorized} from "@tsed/exceptions";

@Middleware()
export class AuthMiddleware {
  async use(@Context() ctx: Context): Promise<void> {
    const token = ctx.request.headers["authorization"];
    if (!token) {
      throw new Unauthorized("Token required");
    }
  }
}
```

## 🧪 Validating with @tsed/schema

### Using decorators

```ts
import {Property, Required} from "@tsed/schema";

class UserModel {
  @Required()
  @Property()
  name: string;

  @Property()
  email?: string;
}

@Controller("/")
class MyController {
  @Post("/")
  create(@BodyParams() user: UserModel) {
    // validation automatique
  }
}
```

### Using a schema

```ts
import {object, string} from "@tsed/schema";

const UserSchema = object({
  name: string().required().description("User's name"),
  email: string().description("User's email")
}).label("UserSchema");

interface User {
  name: string;
  email?: string;
}

@Controller("/")
class MyController {
  @Post("/")
  create(@BodyParams() @Schema(UserSchema) user: User) {
    // validation automatique
  }
}
```

### Run validation manually

```ts
import {validate} from "@tsed/ajv";

// Shortcut to inject(AjvService).validate()
await validate(
  {
    name: "John Doe",
    email: "email@tsed.dev"
  },
  {type: UserModel}
);
```

or:

```ts
import {validate} from "@tsed/ajv";

await validate(
  {
    name: "John Doe",
    email: "email@tsed.dev"
  },
  UserSchema
);
```

## 🔄 Lifecycle hooks in services

### Listen to service lifecycle events

```ts
import {Injectable, OnInit, OnDestroy} from "@tsed/di";

@Injectable()
export class MyService implements OnInit, OnDestroy {
  $onInit() {
    console.log("Service initialized");
  }

  $onDestroy() {
    console.log("Service destroyed");
  }
}
```

### Emit custom events

```ts
import {$emit} from "@tsed/di";

@Injectable()
export class MyService {
  async doSomething() {
    // Do some work...

    // Emit a custom event
    $emit("myCustomEvent", {data: "Hello World"});
  }
}
```

| Method        | Description                                                            | Sync/Async | Example usage                                                    |
| ------------- | ---------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------- |
| `$emit`       | Emits an event synchronously to all listeners.                         | Sync       | `$emit("eventName", data);`                                      |
| `$asyncEmit`  | Emits an event asynchronously, waits for all listeners to complete.    | Async      | `await $asyncEmit("eventName", data);`                           |
| `$alter`      | Passes a value through all listeners, each can alter the value (sync). | Sync       | `const result = $alter("eventName", value, ...args);`            |
| `$asyncAlter` | Like `$alter`, but listeners can be async and the result is awaited.   | Async      | `const result = await $asyncAlter("eventName", value, ...args);` |

## 📚 Documentation Swagger

```ts
import {Returns, Summary} from "@tsed/schema";

class MyController {
  @Get("/")
  @Summary("Return all users")
  @(Returns(200, Array).Of(UserModel))
  getAll() {
    return [];
  }
}
```

Enable in the server config:

```ts
import "@tsed/swagger";

@Configuration({
  swagger: [
    {
      path: "/docs"
    }
  ]
})
```

## 🧑‍💻 Use context

In controllers:

```ts
import {Context} from "@tsed/platform-params";

@Controller("/users")
export class UserController {
  @Get("/:id")
  getById(@PathParams("id") id: string, @Context() ctx: Context) {
    // Access request/response via ctx.request and ctx.response
    return {id, userAgent: ctx.request.headers["user-agent"]};
  }
}
```

In services:

```ts
import {Injectable, InjectContext} from "@tsed/di";
import type {PlatformContext} from "@tsed/platform-http";

@Injectable()
export class MyService {
  @InjectContext()
  protected ctx: PlatformContext;

  async doSomething() {
    const userId = this.ctx.request.headers["user-id"];

    this.ctx.logger.info(`User ID: ${userId}`);

    // Use userId for some logic
    return `User ID is ${userId}`;
  }
}
```

## 🧪 Unit tests with PlatformTest

```ts
import {PlatformTest} from "@tsed/platform-http/testing";

beforeEach(() => PlatformTest.create());
afterEach(() => PlatformTest.reset());

it("should inject service", () => {
  const service = PlatformTest.get<MyService>(MyService);
  expect(service).toBeInstanceOf(MyService);
});
```

## 📦 Packages Overview

| Package                       | Main purpose                                                                           | Node.js/Bun.js | Browser |
| ----------------------------- | -------------------------------------------------------------------------------------- | -------------- | ------- |
| `@tsed/core`                  | Provides utilities, helpers, and internal decorators used by other packages.           | ✔️             | ✔️      |
| `@tsed/di`                    | Dependency injection (IoC), service lifecycle management, injection decorators.        | ✔️             | ✔️      |
| `@tsed/hooks`                 | Adds hooks/callbacks on the lifecycle of services and middlewares.                     | ✔️             | ✔️      |
| `@tsed/json-mapper`           | Serialization/deserialization of JSON objects, data transformation.                    | ✔️             | ✔️      |
| `@tsed/exceptions`            | Provides custom HTTP exception classes for error handling.                             | ✔️             | ✔️      |
| `@tsed/schema`                | Schema declaration, validation, and model documentation (OpenAPI/Swagger).             | ✔️             | ✔️      |
| `@tsed/ajv`                   | Consume json-schema to validate payload (based on Ajv)                                 | ✔️             | ✔️      |
| `@tsed/platform-http`         | Generic HTTP implementation, platform abstraction (Express, Koa, etc.).                | ✔️             | ❌      |
| `@tsed/platform-express`      | Express.js specific integration to start the server and handle requests.               | ✔️             | ❌      |
| `@tsed/platform-koa`          | Koa.js specific integration to start the server and handle requests.                   | ✔️             | ❌      |
| `@tsed/platform-fastify`      | Fastify.js specific integration to start the server and handle requests.               | ✔️             | ❌      |
| `@tsed/platform-http/testing` | Utilities for unit and integration testing with PlatformTest.                          | ✔️             | ❌      |
| `@tsed/platform-params`       | Decorators and logic to extract request parameters (body, query, path, headers, etc.). | ✔️             | ❌      |
| `@tsed/platform-router`       | Routing management, controller mounting, and route resolution.                         | ✔️             | ❌      |
| `@tsed/platform-middlewares`  | Management, registration, and execution of middlewares in the request lifecycle.       | ✔️             | ❌      |
| `@tsed/engines`               | Integrates template engines (EJS, Pug, Handlebars…) for server-side rendering.         | ✔️             | ❌      |
| `@tsed/platform-views`        | Adds support for view rendering in controllers/responses via configured engines.       | ✔️             | ❌      |

## 📝 Notes

::: tip

- In TS.ED v8, always prefer `@tsed/di` for injection, `@tsed/schema` for schema declaration and HTTP decorators.
- `@tsed/common` is being deprecated in v8.
- Asynchronous middleware without `next()`. Ts.ED automatically handles promises.
- Use `@tsed/platform-express` (or another platform) to start the server.

:::
