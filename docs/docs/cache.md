---
meta:
  - name: description
    content: Documentation over Cache management provided by Ts.ED framework. Use decorator to cache Response or returned value by a service.
  - name: keywords
    content: cache ts.ed express koa typescript node.js javascript decorators cache-manager class controller service
---

# Cache

Caching is a great and simple technique that helps improve your app's performance.
It acts as a temporary data store providing high-performance data access.

Ts.ED provides a unified system for caching by using the
popular [`cache-manager`](https://www.npmjs.com/package/cache-manager) Node.js module.
Cache-manager provides various storage to cache content like Redis, MongoDB, etc... and multi caching!

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
    ttl: 300, // default TTL
    store: "memory",
    prefix: "myPrefix" // to namespace all keys related to the cache
    // options options depending on the choosen storage type
  }
})
export class Server {}
```

### Store Engines

- [node-cache-manager-redis](https://github.com/dial-once/node-cache-manager-redis) (
  uses [sol-redis-pool](https://github.com/joshuah/sol-redis-pool))
- [node-cache-manager-redis-store](https://github.com/dabroek/node-cache-manager-redis-store) (
  uses [node_redis](https://github.com/NodeRedis/node_redis))
- [node-cache-manager-ioredis](https://github.com/dabroek/node-cache-manager-ioredis) (
  uses [ioredis](https://github.com/luin/ioredis))
- [node-cache-manager-mongodb](https://github.com/v4l3r10/node-cache-manager-mongodb)
- [node-cache-manager-mongoose](https://github.com/disjunction/node-cache-manager-mongoose)
- [node-cache-manager-fs](https://github.com/hotelde/node-cache-manager-fs)
- [node-cache-manager-fs-binary](https://github.com/sheershoff/node-cache-manager-fs-binary)
- [node-cache-manager-fs-hash](https://github.com/rolandstarke/node-cache-manager-fs-hash)
- [node-cache-manager-hazelcast](https://github.com/marudor/node-cache-manager-hazelcast)
- [node-cache-manager-memcached-store](https://github.com/theogravity/node-cache-manager-memcached-store)
- [node-cache-manager-memory-store](https://github.com/theogravity/node-cache-manager-memory-store)

### Example with mongoose

```typescript
import {Configuration} from "@tsed/di";
import mongoose from "mongoose";

const mongooseStore = require("cache-manager-mongoose");

@Configuration({
  cache: {
    ttl: 300, // default TTL
    store: mongooseStore,
    mongoose,
    modelOptions: {
      collection: "caches",
      versionKey: false
    }
  }
})
export class Server {}
```

### Sharing IORedis instance

```typescript
import {Configuration, registerProvider} from "@tsed/di";
import {Logger} from "@tsed/logger";
import Redis from "ioredis";

export const REDIS_CONNECTION = Symbol("redis:connection");
export type REDIS_CONNECTION = Redis;

registerProvider({
  provide: REDIS_CONNECTION,
  deps: [Configuration, Logger],
  async useAsyncFactory(configuration: Configuration, logger: Logger) {
    const cacheSettings = configuration.get("cache");
    const redisSettings = configuration.get("redis");
    const connection = new Redis({...redisSettings, lazyConnect: true});

    cacheSettings.redisInstance = connection;

    try {
      await connection.connect();
      logger.info("Connected to redis database...");
    } catch (error) {
      logger.error({
        event: "REDIS_ERROR",
        error
      });
    }

    return connection;
  },
  hooks: {
    $onDestroy(connection: Redis) {
      return connection.disconnect();
    }
  }
});
```

Then:

```typescript
import {Configuration} from "@tsed/di";
import redisStore from "cache-manager-ioredis";

@Configuration({
  cache: {
    ttl: 300, // default TTL
    store: redisStore
  },
  redis: {
    port: 6379
  }
})
export class Server {}
```

::: tip

This example works for a single redis connection. If you look for a complete example with Redis Cluster and Redis single
connection, go to this example:

```sh
https://gist.github.com/Romakita/432b1a8afaa726b41d0baf2456b205aa
```

:::

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

You can manually specify a TTL (expiration time) for this specific key, as follows:

```typescript
await this.cache.set("key", "value", {ttl: 1000});
```

To disable the expiration of the cache, set the `ttl` configuration property to `null`:

```typescript
await this.cache.set("key", "value", {ttl: null});
```

To remove an item from the cache, use the `del` method:

```typescript
await this.cache.del("key");
```

To clear the entire cache, use the `reset` method:

```typescript
await this.cache.reset();
```

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

TTL can be defined per endpoint with @@UseCache@@:

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

Sometimes, you don't want to store in cache a value because isn't consistant to have it.
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

A service method response can be cached by using the `@UseCache` decorator. Sometimes, we need to explicitly refresh the cached data because the consumed data backend state has changed.
because the consumed data backend state has changed. By implementing a notifications service, the backend data can trigger an event to tell your API that
the data has changed.

Here is short example:

```typescript
import {Controller, Injectable} from "@tsed/di";
import {PlatformCache, UseCache} from "@tsed/platform-cache";
import {PlatformContext} from "@tsed/platform-http";
import {PathParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";

@Injectable()
export class ProductsService {
  @Inject()
  protected pimClient: PimClient;

  @UseCache({ttl: 3600})
  async get(id: string) {
    return this.pimClient.get("/products/" + id);
  }
}

@Injectable()
export class NotificationsService {
  @Inject()
  protected cache: PlatformCache;

  @Inject()
  protected productsService: ProductsService;

  refreshProductId(id: string) {
    return this.cache.refresh(() => this.productsService.get(id));
  }
}
```

This small example will force the data refresh.

::: tip
If you have several cached method calls, then the refresh will also be done on all of these methods called by the function passed to `PlatformCache.refresh()`.
:::

## Multi caching

Cache-manager provides a way to use multiple caches. To use it, remove `store` option and use `caches` instead:

```typescript
import {Configuration} from "@tsed/di";

@Configuration({
  cache: {
    ttl: 300, // default TTL
    caches: [memoryCache, someOtherCache]
    // options options depending on the choosen storage type
  }
})
export class Server {}
```

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
