---
description: "Documentation over Cache management provided by Ts.ED framework."
head:
  - - meta
    - name: description
      content: Documentation over Cache management provided by Ts.ED framework. Use decorator to cache Response or returned value by a service.
  - - meta
    - name: keywords
      content: cache ts.ed express koa typescript node.js javascript decorators cache-manager class controller service
---

# Cache

Caching is a great and simple technique that helps improve your app's performance.
It acts as a temporary data store providing high-performance data access.

Ts.ED provides a unified system for caching by using the
popular [`cache-manager`](https://www.npmjs.com/package/cache-manager) Node.js module (v7).
Cache-manager stores its entries with [Keyv](https://keyv.org) adapters (memory, Redis, Valkey, MongoDB, SQLite, etc...) and supports multi-tier caching!

By using the @@UseCache@@ on endpoint methods or on service methods, you'll be able to cache the response returned by
the Ts.ED server
or the result returned by a Service.

## Installation

::: code-group

```sh [npm]
npm install @tsed/platform-cache
```

```sh [yarn]
yarn add @tsed/platform-cache
```

```sh [pnpm]
pnpm add @tsed/platform-cache
```

```sh [bun]
bun add @tsed/platform-cache
```

:::

## Configuration

You just to configure cache options and use the decorator to enable cache.

```typescript
import {Configuration} from "@tsed/di";

@Configuration({
  cache: {
    ttl: 300, // default TTL, in seconds
    store: "memory",
    max: 1000, // optional, maximum number of entries of the memory store
    prefix: "myPrefix" // to namespace all keys related to the cache
  }
})
export class Server {}
```

::: tip TTL unit
Every TTL of the Ts.ED cache API is expressed in **seconds**: the `ttl` and `refreshThreshold` settings, the options of @@UseCache@@,
`PlatformCache.set()`, `PlatformCache.wrap()` and `PlatformCache.ttl()`. Ts.ED converts them to milliseconds for cache-manager and Keyv.
:::

| Option             | Description                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `ttl`              | Default time to live, in seconds (number or `(result) => number`).                                            |
| `refreshThreshold` | Remaining time to live (seconds) under which `wrap()` refreshes the entry in background.                     |
| `store`            | `"memory"` (default), a `Keyv` instance or a Keyv store adapter.                                              |
| `stores`           | List of stores for a multi-tier cache (see [Multi caching](#multi-caching)). Takes precedence over `store`.   |
| `max`              | Maximum number of entries of the `"memory"` store. The least recently used entries are evicted first.        |
| `nonBlocking`      | Don't wait for the secondary stores to answer (cache-manager option).                                         |
| `cacheId`          | Identifier of the cache instance (cache-manager option).                                                      |
| `prefix`           | Prefix added to every key built by @@UseCache@@.                                                              |
| `keyResolver`      | Function building the key from the method arguments.                                                          |
| `ignoreHeaders`    | Headers not stored when caching a response.                                                                   |

### Store engines

Any [Keyv storage adapter](https://keyv.org/docs/#official-storage-adapters) can be used as a store: give the adapter, or a `Keyv` instance
when you need Keyv options (namespace, serialization, compression...).

- `RedisKeyvAdapter` from [@tsed/redis](/tutorials/redis.md) and `IORedisKeyvAdapter` from [@tsed/ioredis](/tutorials/ioredis.md) reuse the Ts.ED Redis connection,
- [@keyv/redis](https://www.npmjs.com/package/@keyv/redis), [@keyv/valkey](https://www.npmjs.com/package/@keyv/valkey),
- [@keyv/mongo](https://www.npmjs.com/package/@keyv/mongo), [@keyv/postgres](https://www.npmjs.com/package/@keyv/postgres), [@keyv/sqlite](https://www.npmjs.com/package/@keyv/sqlite),
- [cacheable](https://www.npmjs.com/package/cacheable) `KeyvCacheableMemory`, and more.

::: warning
Stores written for cache-manager v5 and older (`cache-manager-redis-store`, `cache-manager-ioredis`, `cache-manager-mongoose`...) are not supported anymore.
:::

### Example with a Keyv adapter

```typescript
import {Configuration} from "@tsed/di";
import KeyvRedis from "@keyv/redis";

@Configuration({
  cache: {
    ttl: 300,
    store: new KeyvRedis("redis://localhost:6379")
  }
})
export class Server {}
```

A store adapter given directly is wrapped by Ts.ED in a `Keyv` instance without key prefix, so the keys stored in the backend are the keys built by Ts.ED.
Give a `Keyv` instance to choose the namespace or other Keyv options:

```typescript
import {Keyv} from "keyv";
import KeyvRedis from "@keyv/redis";

@Configuration({
  cache: {
    store: new Keyv({store: new KeyvRedis("redis://localhost:6379"), namespace: "my-app"})
  }
})
export class Server {}
```

### Sharing the Ts.ED Redis connection

[@tsed/redis](/tutorials/redis.md) and [@tsed/ioredis](/tutorials/ioredis.md) register their connection as cache store when the connection declares `cache: true`:

```typescript
import {Configuration} from "@tsed/di";
import "@tsed/ioredis";

@Configuration({
  cache: {
    ttl: 300
  },
  ioredis: [
    {
      name: "default",
      cache: true
    }
  ]
})
export class Server {}
```

You can also give the adapter yourself, for instance from an existing connection:

```typescript
import {IORedisKeyvAdapter} from "@tsed/ioredis";
import Redis from "ioredis";

const connection = new Redis();

@Configuration({
  cache: {
    store: new IORedisKeyvAdapter(connection)
  }
})
export class Server {}
```

## Interacting with the cache store

To interact with the cache manager instance, inject it to your class using the @@PlatformCache@@ token, as follows:

```typescript
@Injectable()
export class MyService {
  @Inject()
  cache: PlatformCache;
}
```

The `get` method on the @@PlatformCache@@ instance is used to retrieve items from the cache.

```typescript
const value = await this.cache.get("key");
```

To add an item to the cache, use the `set` method:

```typescript
await this.cache.set("key", "value");
```

The default expiration time of the cache depends on the configured TTL on Server configuration level.

You can manually specify a TTL (expiration time, in seconds) for this specific key, as follows:

```typescript
await this.cache.set("key", "value", {ttl: 1000});
```

To get the remaining time to live of a key, in seconds (`undefined` when the key is missing or never expires):

```typescript
const ttl = await this.cache.ttl("key");
```

To disable the expiration of the cache, set the `ttl` property to `null`:

```typescript
await this.cache.set("key", "value", {ttl: null});
```

To remove an item from the cache, use the `del` method:

```typescript
await this.cache.del("key");
```

To clear the entire cache (every store), use the `reset` method:

```typescript
await this.cache.reset();
```

The underlying cache-manager v7 `Cache` is available with `this.cache.cache`. Its TTLs are in milliseconds.

## Cache response

To enable cache on endpoint, use @@UseCache@@ decorator on a method as follows:

```typescript
import {UseCache} from "@tsed/platform-cache";
import {Controller} from "@tsed/di";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";

@Controller("/my-path")
export class MyController {
  @Get("/:id")
  @UseCache()
  get(@PathParams("id") id: string) {
    return "something with  " + id;
  }
}
```

::: tip Note
UseCache will generate automatically a key based on the Verb and Uri of your route. If @@QueryParams@@ and/or
@@PathParams@@ are used on the method, the key will be generated with them.
According to our previous example, the generated key will be:

```
GET:my-path:1  // if the id is 1
GET:my-path:2  // etc...
```

:::

::: warning
Only `GET` endpoints are cached. Also, HTTP server routes that use the native response object (@@Res@@) cannot use the
@@PlatformCacheInterceptor@@.
:::

::: tip Force refresh
Send the `Cache-Control: no-cache` header with your request (or set the same header on the @@PlatformContext@@) to
bypass @@PlatformCacheInterceptor@@ temporarily. This lets you fetch a fresh response without clearing the cache and is
useful for debugging, warm-up scripts, or administrative tooling. You can override this behavior via the `byPass`
option on @@UseCache@@:

- Services/methods that aren't tied to HTTP default to `byPass: false`, meaning caching is always considered unless you opt out.
- Controllers/endpoints default to `byPass: "no-cache"`, so sending `Cache-Control: no-cache` skips both the lookup and write for that request without touching existing entries.
- Supply a predicate `byPass: (args, $ctx) => boolean` when you need finer control (tenant-based bypass, admin flag, etc.).
  :::

## Cache a value

Because @@UseCache@@ uses @@PlatformCacheInterceptor@@ and not a middleware, you can also apply the decorator on any
Service/Provider.

```typescript
import {Injectable} from "@tsed/di";
import {UseCache} from "@tsed/platform-cache";

@Injectable()
export class MyService {
  @UseCache()
  get(id: string) {
    return "something with " + id;
  }
}
```

::: warning
node-cache-manager serialize all data as JSON object. It means, if you want to cache a complex data like an instance of
class, you have to give extra parameters
to the UseCache decorator. Ts.ED will use @@deserialize@@ function based on the given `type` (and `collectionType`) to
return the expected instance.

```typescript
import {Injectable} from "@tsed/di";
import {UseCache} from "@tsed/platform-cache";

@Injectable()
export class MyService {
  @UseCache({type: MyClass})
  get(id: string): MyClass {
    return new MyClass({id});
  }

  @UseCache({type: MyClass, collectionType: Array})
  getAll(): MyClass[] {
    return [new MyClass({id: 1})];
  }
}
```

:::

## Configure key resolver

By default, Ts.ED uses the request VERB & URL (in an HTTP app) or cache key (for other Service and Provider) to
associate cache records with your endpoints.
Nevertheless, sometimes you might want to set up the generated key based on different factors, for example, using HTTP
headers (e.g. Authorization to properly identify profile endpoints).

There are two ways to do that. The first one is to configure it globally on the Server:

```typescript
import {Configuration} from "@tsed/di";
import {PlatformContext} from "@tsed/platform-http";

@Configuration({
  cache: {
    keyResolver(args: any[], $ctx?: PlatformContext): string {
      // NOTE $ctx is only available for endpoints
      return "key"
    }
  }
})
```

The second way is to use the `key` option with @@UseCache@@ decorator:

```typescript
import {PlatformContext} from "@tsed/platform-http";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/my-path")
export class MyController {
  @Get("/:id")
  @UseCache({key: "key"})
  get(@PathParams("id") id: string) {
    return "something with  " + id;
  }

  @Get("/:id")
  @UseCache({key: (args: any[], $ctx?: PlatformContext) => "key"})
  get(@PathParams("id") id: string) {
    return "something with  " + id;
  }
}
```

## Configure TTL

TTL (in seconds) can be defined per endpoint with @@UseCache@@:

```typescript
import {PlatformContext} from "@tsed/platform-http";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/my-path")
export class MyController {
  @Get("/:id")
  @UseCache({ttl: 500})
  get(@PathParams("id") id: string) {
    return "something with  " + id;
  }
}
```

## Define when a value can be cached <Badge text="7.6.0+" />

Sometimes, you don't want to store in cache a value because it isn't consistent to store it.
For example, you can avoid caching data when the result is nullish:

```typescript
import {PlatformContext} from "@tsed/platform-http";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/my-path")
export class MyController {
  @Get("/:id")
  @UseCache({ttl: 500, canCache: "non-nullish"})
  get(@PathParams("id") id: string) {
    return null;
  }
}
```

In this case, the UseCache interceptor will ignore result that `undefined` or `null`.

You can also provide a custom function to ignore result:

```typescript
import {PlatformContext} from "@tsed/platform-http";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Controller("/my-path")
export class MyController {
  @Get("/:id")
  @UseCache({ttl: 500, canCache: (item: any) => item !== null})
  get(@PathParams("id") id: string) {
    return null;
  }
}
```

## Refresh cache keys in background <Badge text="6.103.0+" />

The `caching` module support a mechanism to refresh expiring cache `keys` in background is you use `UseCache` on a
Service method (not on controller method).
This is done by adding a `refreshThreshold` option to the @@UseCache@@ decorator.

If `refreshThreshold` is set and if the `ttl` method is available for the used store,
after retrieving a value from cache TTL will be checked. If the remaining current `ttl` key is under the
configured `ttl` - `refreshThreshold`, the system will spawn a background worker to update the value, following same
rules as standard fetching.

```typescript
const currentTTL = cache.ttl(key);

if (currentTTL < ttl - refreshThreshold) {
  refresh();
}
```

Meanwhile, the system will return the old value until expiration.
In the meantime, the system will return the old value until expiration.

```typescript
import {PlatformContext} from "@tsed/platform-http";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";
import {Controller} from "@tsed/di";

@Injectable()
export class MyService {
  @UseCache({ttl: 3600, refreshThreshold: 900})
  get(id: string) {
    return "something with " + id;
  }
}
```

In this example, the configured `ttl` is 1 hour and the threshold is 15 minutes. So, the key will be refreshed in
background if current `ttl` is under 45 minutes.

## Refresh cached value <Badge text="7.9.0+" />

A service method response can be cached by using the `@UseCache` decorator. Sometimes, we need to explicitly refresh the
cached data because the consumed data backend state has changed. By implementing a notifications service, the backend
data can trigger an event to tell your API that the data has changed.

Here is a simple refresh example based on the centralized key helpers from `PlatformCache`:

```typescript
import {Inject, Injectable} from "@tsed/di";
import {PlatformCache, UseCache} from "@tsed/platform-cache";

@Injectable()
export class ProductsService {
  @Inject()
  protected pimClient: PimClient;

  @UseCache({prefix: "products", ttl: 3600})
  async getById(id: string) {
    return this.pimClient.get("/products/" + id);
  }
}

@Injectable()
export class CacheRefreshService {
  @Inject()
  protected cache: PlatformCache;

  @Inject()
  protected productsService: ProductsService;

  async refreshProduct(id: string) {
    // Includes the global `cache.prefix` automatically, if configured.
    const keys = await this.cache.getKeysOf(ProductsService, "getById");
    let refreshed = 0;

    for (const key of keys) {
      const cached = await this.cache.getCachedObject(key);
      const [cachedId] = Array.isArray(cached?.args) ? cached.args : [];

      if (cachedId !== id) {
        continue;
      }

      await this.cache.refresh(() => this.productsService.getById(id));
      refreshed++;
    }

    // Optional fallback to warm cache when no existing key was found.
    if (!refreshed) {
      await this.cache.refresh(() => this.productsService.getById(id));
    }
  }
}
```

This example refreshes only matching cached entries and keeps key format concerns centralized in `PlatformCache`.

::: tip
You can also build patterns explicitly with `cache.buildEntryPattern(Target, "method")` when using
`getMatchingKeys(...)` or `deleteMatchingKeys(...)`, without hardcoding key formats.
:::

## Multi caching

Cache-manager can use several stores, the first one being the primary store (for instance a memory store in front of Redis).
Use the `stores` option instead of `store`:

```typescript
import {Configuration} from "@tsed/di";
import {Keyv} from "keyv";
import KeyvRedis from "@keyv/redis";

@Configuration({
  cache: {
    ttl: 300, // default TTL, in seconds
    stores: ["memory", new KeyvRedis("redis://localhost:6379")]
  }
})
export class Server {}
```

Values are written to every store and read from the first store holding the key. `PlatformCache.keys()` lists the keys of the primary store.

## Disable cache for test

It can sometimes be useful during unit tests to disable the cache. You can do this by setting the `cache` option
to `false`:

```typescript
describe("MyCtrl", () => {
  let request: SuperTest.Agent;
  beforeAll(
    TestMongooseContext.bootstrap(Server, {
      cache: false,
      mount: {
        "/rest": [MyCtrl]
      }
    })
  );
});
```
