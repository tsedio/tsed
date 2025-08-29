# Migration Guide for @tsed/platform-http

This document provides guidance for migrating to the latest version of the `@tsed/platform-http` package.

## What's New in @tsed/platform-http

The latest version of `@tsed/platform-http` introduces several important changes:

- **Configuration Management**: Improved configuration handling with the new `defineConfiguration` function
- **Host Management**: New utilities for HTTP/HTTPS host configuration with `getBestHost`, `getHttpPort`, and
  `getHttpsPort`
- **DIConfiguration Integration**: Alignment with the new `@tsed/di` configuration system

## Migration Steps

### 1. Update Configuration Access

Use the `get()` method to access configuration properties:

```diff
- console.log(settings.prop);
+ console.log(settings.get("prop"));
```

### 2. Use New Configuration API

The `PlatformConfiguration` class is now deprecated. Use `DIConfiguration` or the functional API instead:

```diff
- import {PlatformConfiguration} from "@tsed/platform-http";
+ import {DIConfiguration} from "@tsed/di";
+ import {configuration} from "@tsed/di";

// When accessing configuration
- const config = injector.get(PlatformConfiguration);
+ const config = injector.get(DIConfiguration);
// OR
+ const config = configuration();
```

### 3. Use New Host Utilities

Take advantage of the new host utilities for better HTTP/HTTPS configuration:

```typescript
import {configuration} from "@tsed/di";

// Get the best available host (HTTPS preferred)
const host = configuration().getBestHost();

// Get HTTP port information
const httpInfo = configuration().getHttpPort();

// Get HTTPS port information
const httpsInfo = configuration().getHttpsPort();

// Set HTTP port with address
configuration().setHttpPort({address: "127.0.0.1", port: 8080});

// Set HTTPS port with address
configuration().setHttpsPort({address: "127.0.0.1", port: 8443});
```

### 4. Update Injector Access

Use the functional API to access the injector:

```diff
- const inj = platform.injector;
+ import {injector} from "@tsed/di";
+ const inj = injector();
```

## Breaking Changes

- `PlatformConfiguration` is deprecated in favor of `DIConfiguration` from `@tsed/di`
- Configuration properties are no longer directly accessible (use `get()` method instead)
- The `injector` property on `PlatformBuilder` is deprecated (use `injector()` function instead)
- Configuration files have been reorganized:
  - `interfaces/PlatformStaticsSettings.ts` moved to `config/PlatformStaticsSettings.ts`
  - Several interface files have been removed and consolidated

## Recommended Initialization Pattern

```typescript
import {PlatformBuilder} from "@tsed/platform-http";
import {injector, configuration} from "@tsed/di";

// Create a platform instance
const platform = PlatformBuilder.create({
  httpPort: 8080,
  httpsPort: false
});

// Access configuration
const config = configuration();
console.log(config.get("httpPort"));

// Access injector
const inj = injector();

// Bootstrap the application
await platform.bootstrap();
```

## Additional Resources

For more detailed information, refer to:

- [Platform HTTP documentation](https://tsed.dev/docs/platform-http.html)
- [Configuration documentation](https://tsed.dev/docs/configuration.html)
- [DI documentation](https://tsed.dev/docs/di.html)
