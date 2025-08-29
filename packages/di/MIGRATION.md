# Migration Guide for @tsed/di

This document provides guidance for migrating to the latest version of the `@tsed/di` package.

## What's New in @tsed/di v8

The latest version of `@tsed/di` introduces several important changes:

- **Functional API**: Enhanced support for decorator-less dependency injection
- **Injector Instance Everywhere**: Access the injector from anywhere in your code
- **Lazy Loading**: Support for lazy loading of modules

## Migration Steps

### 1. Update Configuration Access

Use the `get()` method to access configuration properties:

```diff
- console.log(settings.prop);
+ console.log(settings.get("prop"));
```

### 4. Use New Injector API

Take advantage of the new injector API that allows accessing the DI container from anywhere:

```typescript
import {injector, inject} from "@tsed/di";
import {MyService} from "./services/MyService";

// Get the injector instance
const inj = injector();

// Get a service instance
const myService = inject(MyService);
```

### 3. Consider Using Functional API

The functional API provides a decorator-less approach to dependency injection:

```typescript
import {injectable, inject, configuration, constant} from "@tsed/di";

export class UserRepository {
  getUsers() {
    return [{id: 1, name: "Alice"}];
  }
}

// Register the class as injectable
injectable(UserRepository);

// Create a factory
export const GET_ALLOWED_USERS = injectable(Symbol.for("GET_ALLOWED_USERS"))
  .factory(() => {
    const userRepository = inject(UserRepository);
    const allowedRoles = constant("allowedRoles");

    return userRepository.getUsers().filter((user) => allowedRoles.includes(user.role));
  })
  .token();
```

### 4. Update Async Initialization

For asynchronous initialization, use the async factory pattern:

```typescript
const DATABASE = injectable(Symbol.for("DATABASE"))
  .asyncFactory(async () => {
    const db = await connectToDatabase();
    return db;
  })
  .token();

// When using:
const db = await inject(DATABASE);
```

## Breaking Changes

- Proxy on DI Configuration has been removed (use `get()` method instead)

## Recommended Initialization Pattern

```typescript
import {injector, attachLogger, inject} from "@tsed/di";
import {$log} from "@tsed/logger";

// Create a new InjectorService instance
const inj = injector();
inj.settings.set(settings);

// Attach a custom logger (optional)
attachLogger($log);

// If you have async providers or use the ConfigSource feature
await inj.load();

// Retrieve your services
const myService = inject(MyService);
```

## Additional Resources

For more detailed information, refer to:

- [Providers documentation](https://tsed.dev/docs/providers.html)
- [Custom Providers](https://tsed.dev/docs/custom-providers.html)
- [Constants & Value Injection](https://tsed.dev/docs/providers.html#constant)
- [Functional API](https://tsed.dev/docs/di-functional-api.html)
