<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>@tsed/di</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.dev/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.dev/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://slack.tsed.dev">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

A powerful and flexible Dependency Injection (DI) toolkit inspired by Angular, designed for both TypeScript and pure JavaScript applications. Use it standalone or as the foundation of Ts.ED. Supports both decorator-based and functional (decorator-less) APIs for maximum compatibility, even in non-TypeScript or pure JS projects.

---

## Installation

Install the latest release and required peer dependencies:

```bash
npm install --save @tsed/di @tsed/core @tsed/hooks @tsed/logger @tsed/schema
```

> **Important!**
>
> - @tsed/di v8+ supports **only ESM** (ECMAScript Modules).
> - Requires Node >= 20,
> - TypeScript >= 5.0 if you use decorators.
> - For TypeScript, enable `emitDecoratorMetadata` and `experimentalDecorators` in your `tsconfig.json`.

---

## Features

- **[Providers](https://tsed.dev/docs/providers.html):** Register and manage services, factories, values, interceptors, and more.
- **[Functional API](https://tsed.dev/docs/providers.html#injectable):** Register providers and factories without decorators (for pure JS or decorator-less code).
- **[Async Factories](https://tsed.dev/docs/custom-providers.html#register-async-factory):** Create providers that resolve asynchronously (e.g., database connections).
- **[Constants Injection](https://tsed.dev/docs/providers.html#constant):** Use `@Constant()` or `constant()` to inject configuration or static values.
- **[Value Injection](https://tsed.dev/docs/providers.html#value-refvalue):** Use `@Value()` or `refValue()` to inject resolved provider values.
- **[InjectContext](https://tsed.dev/docs/providers.html#inject-context):** Access the injection context and advanced DI features.
- **[Config Sources](https://tsed.dev/docs/configuration/configuration-sources.html):** Load and merge configuration from multiple sources (files, env, remote, etc.).
- **[Lifecycle hooks](https://tsed.dev/docs/hooks.html):** Manage provider lifecycle with hooks like `$onInit`, `$onDestroy`.
- **[Lazy loading](https://tsed.dev/docs/providers.html#lazy-load-provider):** Lazily load Node.js ESM modules. The lazy loading feature allows you to declare a provider that is only instantiated when it is first injected. The DI system will dynamically import the ESM module, discover injectable services within it, and instantiate them on demand—enabling efficient code splitting and reducing startup time.
- **Full TypeScript support:** Type inference with `inject()` and advanced tooling for type-safe DI.

---

## Basic Usage (Decorator API)

Declare injectable services:

```typescript
import {Injectable} from "@tsed/di";

@Injectable()
export class UserRepository {
  getUsers() {
    return [{id: 1, name: "Alice"}];
  }
}

@Injectable()
export class UserService {
  constructor(private repo: UserRepository) {}

  listUsers() {
    return this.repo.getUsers();
  }
}
```

Use the dependency injector:

```typescript
import {inject} from "@tsed/di";
import {UserService} from "./UserService.js";

const userService = inject(UserService);

console.log(userService.listUsers());
```

---

## Usage Outside Ts.ED

`@tsed/di` is completely standalone.  
You can use it in any JS/TS project (web, CLI, backend, etc) without Ts.ED.

---

## Stable & Recommended Initialization Example

This is the recommended and most stable way to initialize and use the injector, especially when working with advanced scenarios (settings, async providers, custom loggers, etc):

```typescript
import {injector, attachLogger, inject} from "@tsed/di";
import {$log} from "@tsed/logger";
import {CalendarCtrl} from "./CalendarCtrl.js";

// Create a new InjectorService instance
const inj = injector();

// Register your configuration provider
inj.addProvider(PlatformConfiguration);

// Optionally invoke and set configuration
inj.settings = inj.invoke(PlatformConfiguration);
inj.settings.set(settings);

// Attach a custom logger (optional)
attachLogger($log); // Overriding the default logger is not recommended
// You can use @tsed/logger-connect to bind Ts.ED logger with any other logger

// If you have async providers or use the ConfigSource feature, ensure to await load()
await inj.load();

// Retrieve your controller (or any provider)
const calendarCtrl = inject(CalendarCtrl);

// Use your controller/service as needed
calendarCtrl.create({name: "My calendar"});
```

---

## Functional API (Decorator-less / Pure JS, v8+)

If you can't or don't want to use decorators (e.g. in pure JavaScript), use the **Functional API** introduced in v8+.

For exemple, we can register a provider like this:

```js
import {injectable, inject} from "@tsed/di";

// Define a class as injectable
export class UserRepository {
  getUsers() {
    return [{id: 1, name: "Alice"}];
  }
}

injectable(UserRepository);
```

Then, you can use the `inject()` function to retrieve the instance of the class or any other provider:

```js
import {injectable, inject} from "@tsed/di";

// Define a factory function
export const GET_ALLOWED_USERS = injectable(Symbol.for("GET_ALLOWED_USERS"))
  .factory(() => {
    const userRepository = inject(UserRepository);
    /// do something with userRepository
    const users = userRepository.getAll();
    const allowedRoles = constant("allowedRoles");

    return userRepository.getUsers().filter((user) => allowedRoles.includes(user.role));
  })
  .token();
```

After that, we have to initialize the injector and load all providers:

```js
import {injector, attachLogger, inject} from "@tsed/di";
import {$log} from "@tsed/logger";
import "./services/GetAllowerUsers.js"; // just add import is enough to discover the providers

// Create a new InjectorService instance
const inj = injector();

// Register your configuration provider
inj.addProvider(PlatformConfiguration);

// Optionally invoke and set configuration
inj.settings = inj.invoke(PlatformConfiguration);
inj.settings.set(settings);

// Attach a custom logger (optional)
attachLogger($log); // Overriding the default logger is not recommended
// You can use @tsed/logger-connect to bind Ts.ED logger with any other logger

// If you have async providers or use the ConfigSource feature, ensure to await load()
await inj.load();
```

The example above is the main point to start the DI system. It should be placed in the main entry file of your application.

Now, you can use the `inject()` function to retrieve the instance of the class, injectable provider, or pure JavaScript function.

For example, if you want to use the `GET_ALLOWED_USERS` factory in your application, you can do it like this:

```js
import {injectable, inject} from "@tsed/di";
import {GET_ALLOWED_USERS} from "./services/GetAllowerUsers.js";

// use any framework you want like express.js, hapi.js, etc.
app.get("/", async (req, res) => {
  const getAllowedUser = inject(GET_ALLOWED_USERS);
  const users = await getAllowedUser();

  res.json(users);
});
```

Here we use the `inject()` function in a pure JavaScript function to retrieve the `GET_ALLOWED_USERS` factory.
This factory will be executed when the route is called, and it will return the allowed users.

In summary:

- **No decorators required.**
- Use `injectable()` to register functions or classes as providers.
- Use `factory()` or `asyncFactory()` to register (async) factories for advanced usage or for custom tokens.
- Prefer this approach over `registerProvider` in v8+.

---

## Async Factories

You can register **async factories** to provide values/services that require asynchronous initialization (e.g., database connections):

```typescript
import {injectable, inject} from "@tsed/di";

const DATABASE = injectable(Symbol.for("DATABASE"))
  .asyncFactory(async () => {
    const db = await connectToDatabase(); // your async init logic
    return db;
  })
  .token();

const db = await inject(DATABASE); // Await the async factory
db.query("SELECT * FROM users");
```

- Use `.asyncFactory()` for asynchronous initialization.
- When injecting, **await** the result if the provider is async.

---

## Injecting Constants with `@Constant()` and `@Value()`

You can inject constant values or configuration using the `@Constant()` decorator (or `constant()` function in the Functional API):

```typescript
import {Injectable, Constant} from "@tsed/di";

@Injectable()
export class MyService {
  @Constant("app.token") private token: string;

  printToken() {
    console.log(this.token); // Value from config
  }
}
```

You can also use `@Value()` to inject the resolved value of a provider (by token), or `refValue()` for the functional API:

```typescript
import {Injectable, Value} from "@tsed/di";

@Injectable()
export class MyService {
  @Value("MY_TOKEN") private value: string;

  printValue() {
    console.log(this.value); // Value from MY_TOKEN provider
  }
}
```

**Functional API for constants and values:**

```js
import {constant, refValue, inject} from "@tsed/di";

const appToken = constant("app.token", "my-api-token"); // frozen value
const refAppToken = refValue(); // reference to the app.token value. not frozen
```

- Use `@Constant()`/`constant()` for static configuration values.
- Use `@Value()`/`refValue()` for dynamic values.

Learn more: [Constants and Value Injection](https://tsed.dev/docs/providers.html#constant)

---

## Providers

`@tsed/di` supports multiple provider types:

- **@Injectable:** Basic class providers.
- **@Service:** Same as `@Injectable`, for semantic clarity.
- **@Interceptor:** For registering interceptors.
- **Functional API:** Use `injectable()`, `.factory()`, `.asyncFactory()`, `.value()` for manual/advanced registration.
- **Constants:** With `@Constant()`/`constant()`.
- **Values:** With `@Value()`/`refValue()`.
- **Scoped providers:** Support for singleton, request, and custom scopes.

See [Providers documentation](https://tsed.dev/docs/providers.html).

---

## Documentation & Resources

- **[Providers](https://tsed.dev/docs/providers.html)**
- **[Custom Providers](https://tsed.dev/docs/custom-providers.html)**
- **[Constants & Value Injection](https://tsed.dev/docs/providers.html#c)**
- **[Config Sources](https://tsed.dev/docs/configuration/configuration-sources.html)**
- **[Functional API](https://tsed.dev/docs/di-functional-api.html)**
- **[InjectContext](https://tsed.dev/docs/di-injectcontext.html)**

---

## Contributors

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2022 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
