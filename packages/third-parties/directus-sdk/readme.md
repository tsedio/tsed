<p style="text-align: center" align="center">
 <a href="https://tsed.dev" target="_blank"><img src="https://tsed.dev/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>Ts.ED Directus SDK</h1>

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

A package that integrates [Ts.ED](https://tsed.dev/) dependency injection with [Directus](https://directus.io/)
extensions (endpoints, hooks, and operations).

---

## ✨ Features

- 🎯 **Dependency Injection** - Use Ts.ED's DI container in Directus extensions
- 🪝 **Hooks Support** - Create hooks with service injection and error handling
- 🌐 **Endpoints** - Build API endpoints with automatic DI context management
- ⚙️ **Operations** - Create flow operations with full DI support
- 💾 **Cache Decorator** - Built-in caching using Directus cache infrastructure
- 📦 **Repository Pattern** - Type-safe repository base class for collections
- 🔌 **Context Service** - Access Directus context from anywhere in your code

---

## 📦 Installation

Install with your favorite package manager:

```sh npm
npm install @tsed/directus-sdk
```

```sh yarn
yarn add @tsed/directus-sdk
```

```sh pnpm
pnpm add @tsed/directus-sdk
```

```sh bun
bun add @tsed/directus-sdk
```

---

## 🚀 Quick Start

### Creating an Endpoint

```ts
import {defineEndpoint} from "@tsed/directus-sdk";
import {inject} from "@tsed/di";

export default defineEndpoint({
  id: "my-api",
  handler: (router) => {
    router.get("/hello", async (req, res) => {
      const myService = inject(MyService);

      const result = await myService.doSomething();
      return res.json(result);
    });
  }
});
```

### Creating a Hook

```ts
import {defineHook} from "@tsed/directus-sdk";
import {inject} from "@tsed/di";

export default defineHook(({filter, action}) => {
  const validationService = inject(ValidationService);

  filter("items.create", async (payload, meta) => {
    await validationService.validate(payload);
    return payload;
  });

  action("items.create", async (meta) => {
    console.log("Item created:", meta.key);
  });
});
```

### Creating an Operation

```ts
import {defineOperationApi} from "@tsed/directus-sdk";
import {inject} from "@tsed/di";

type SendEmailOptions = {
  to: string;
  subject: string;
  body: string;
};

export default defineOperationApi<SendEmailOptions>({
  id: "send-email",
  handler: async (options, context) => {
    const emailService = inject(EmailService);

    await emailService.send({
      to: options.to,
      subject: options.subject,
      body: options.body
    });

    return {
      success: true,
      sentAt: new Date().toISOString()
    };
  }
});
```

---

## 📚 Core Features

### Dependency Injection

Use Ts.ED's dependency injection in all your Directus extensions:

```ts
import {injectable} from "@tsed/di";

export class MyService {
  async doSomething() {
    return "Hello from MyService";
  }
}

injectable(MyService);
```

Then inject it using `inject()`:

```ts
import {inject} from "@tsed/di";

const myService = inject(MyService);
```

### Directus Context Service

Access Directus context from anywhere in your code:

```ts
import {injectable} from "@tsed/di";
import {DirectusContextService} from "@tsed/directus-sdk";

export class MyService {
  directusContext = inject(DirectusContextService);

  async doSomething() {
    const context = this.directusContext.get();
    const schema = await context.getSchema();
    // Use schema...
  }

  async getUsersService() {
    // Convenience method to get ItemsService
    return this.directusContext.getItemsService("users");
  }
}

injectable(MyService);
```

**Methods:**

- `set(context)` - Set the Directus context (internal use)
- `get()` - Get the current Directus context
- `getItemsService(collection, options?)` - Create an ItemsService for a collection

---

### Repository Pattern

Create type-safe repositories for your collections:

```ts
import {injectable} from "@tsed/di";
import {DirectusItemsRepository} from "@tsed/directus-sdk";
import type {Item} from "@directus/types";

type Release = Item & {
  id: string;
  title: string;
  status: "draft" | "published";
  publishedAt?: string;
};

export class ReleasesRepository extends DirectusItemsRepository<Release, "releases"> {
  protected collection = "releases" as const;

  async getPublishedReleases() {
    const collection = await this.getCollection();

    return collection.readByQuery({
      filter: {
        status: {
          _eq: "published"
        }
      },
      sort: ["-publishedAt"]
    });
  }

  async publishRelease(id: string) {
    return this.update({
      id,
      status: "published",
      publishedAt: new Date().toISOString()
    });
  }
}

injectable(ReleasesRepository);
```

**Built-in Methods:**

- `getCollection()` - Get the Directus ItemsService for the collection
- `create(data, opts?)` - Create a new item
- `update(data, opts?)` - Update an existing item
- `listAll()` - Get all items without pagination

Use the repository in your endpoints:

```ts
import {defineEndpoint} from "@tsed/directus-sdk";
import {inject} from "@tsed/di";

export default defineEndpoint({
  id: "releases-api",
  handler: (router) => {
    const releasesRepo = inject(ReleasesRepository);

    router.get("/releases", async (req, res) => {
      const releases = await releasesRepo.getPublishedReleases();
      res.json(releases);
    });

    router.post("/releases/:id/publish", async (req, res) => {
      const release = await releasesRepo.publishRelease(req.params.id);
      res.json(release);
    });
  }
});
```

### Cache

Because `@directus/api/cache` isn't declared as external dependency to build the extension you have to configure the
rollup bundler to
exclude it from the build.

So for each extension you have to add the following to the `extension.config.js`, if your extension build fail:

```js
function externals() {
  return {
    name: "external-plus", // this name will show up in logs and errors
    version: "1.0.0",
    options(rawOptions) {
      if (rawOptions.external?.includes("directus:api")) {
        rawOptions.external.push("@directus/api/cache");
      }

      return rawOptions;
    }
  };
}

export default {
  plugins: [externals()]
};
```

#### Cache Decorator

Cache method results using Directus cache infrastructure:

```ts
import {Injectable} from "@tsed/di";
import {Cache} from "@tsed/directus-sdk/cache";

@Injectable()
export class ApiClient {
  @Cache({ttl: 900000})
  async search(query: string) {
    // Expensive operation
    return this.performSearch(query);
  }

  @Cache({
    ttl: 60000,
    keyGenerator: (userId: string) => `user:${userId}`
  })
  async getUserById(userId: string) {
    return this.fetchUser(userId);
  }
}
```

**Options:**

- `ttl` - Time to live in milliseconds (default: 900000ms = 15 minutes)
- `keyGenerator` - Custom function to generate cache keys
- `namespace` - Custom namespace for cache keys
- `useSystemCache` - Use system cache (true) or regular cache (false). Default: true

> Important: to use decorator you have to configure your tsconfig with the appropriate options (
> `"experimentalDecorators": true`, `"emitDecoratorMetadata": true`)

#### Programmatic Cache Binding

Apply cache programmatically using `useDirectusCache`:

```ts
import {injectable} from "@tsed/di";
import {useDirectusCache} from "@tsed/directus-sdk/cache";

export class JiraIssueClient {
  search(query: string) {
    return this.performSearch(query);
  }
}

injectable(JiraIssueClient).directusCache("search", {ttl: 900000});
```

## 🔧 Advanced Usage

### Custom Endpoints with Multiple Routes

```ts
import {defineEndpoint} from "@tsed/directus-sdk";
import {inject} from "@tsed/di";

export default defineEndpoint({
  id: "api-v1",
  handler: (router) => {
    router.get("/users", async (req, res) => {
      const userService = inject(UserService);
      const users = await userService.findAll();
      res.json(users);
    });

    router.post("/auth/login", async (req, res) => {
      const authService = inject(AuthService);
      const token = await authService.authenticate(req.body);
      res.json({token});
    });
  }
});
```

### Hooks with Service Injection

```ts
import {defineHook} from "@tsed/directus-sdk";
import {inject} from "@tsed/di";
import {logger} from "@tsed/logger";

export default defineHook(({filter, action}) => {
  const productService = inject(ProductService);
  const notificationService = inject(NotificationService);

  logger().info("Product hooks loaded");

  filter("product_rankings.items.create", async (payload) => {
    return productService.ensureUniqueRanking(payload);
  });

  filter("product_rankings.items.update", async (payload) => {
    return productService.ensureUniqueRanking(payload);
  });

  action("products.items.update", async (meta, context) => {
    if (context.payload.status === "published") {
      await notificationService.sendPublishedNotification(meta.key);
    }
  });
});
```

### Operations with Database Access

```ts
import {defineOperationApi} from "@tsed/directus-sdk";
import {inject} from "@tsed/di";

type CalculateStatsOptions = {
  collection: string;
  field: string;
};

export default defineOperationApi<CalculateStatsOptions>({
  id: "calculate-stats",
  handler: async (options, context) => {
    const statsService = inject(StatsService);
    const directusContext = inject(DirectusContextService);

    const itemsService = await directusContext.getItemsService(options.collection);
    const items = await itemsService.readByQuery({limit: -1});

    const stats = statsService.calculate(items, options.field);

    return {
      count: items.length,
      average: stats.avg,
      min: stats.min,
      max: stats.max
    };
  }
});
```

---

## 🎯 API Reference

### Functions

- **`defineEndpoint(config)`** - Define a Directus endpoint with DI support
- **`defineHook(callback)`** - Define a Directus hook with DI support
- **`defineOperationApi(config)`** - Define a Directus operation with DI support
- **`wrapEndpoint(callback)`** - Internal wrapper for endpoints
- **`wrapOperation(callback)`** - Internal wrapper for operations
- **`useDirectusCache(token, propertyKey, opts)`** - Apply cache programmatically

### Decorators

- **`@Cache(options)`** - Cache method results using Directus cache

### Classes

- **`DirectusContextService`** - Service to access Directus context
- **`DirectusItemsRepository<T, Collection>`** - Base class for collection repositories
- **`DirectusCacheInterceptor`** - Interceptor for caching functionality

### Types

- **`DirectusCacheOptions`** - Cache configuration options
- **`DirectusContext`** - Union of Directus extension contexts

---

## 📖 Documentation

For more information about Directus extensions, see:

- [Directus Endpoints Documentation](https://docs.directus.io/extensions/endpoints.html)
- [Directus Hooks Documentation](https://docs.directus.io/extensions/hooks.html)
- [Directus Operations Documentation](https://docs.directus.io/extensions/operations.html)

For more information about Ts.ED, see:

- [Ts.ED Documentation](https://tsed.dev/)
- [Ts.ED Dependency Injection](https://tsed.dev/docs/injection.html)

---

## Contributors

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your
website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2025 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
