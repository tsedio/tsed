---
description: "Migrate Ts.ED application from v8 to v9."
head:
  - - meta
    - name: description
      content: Migrate Ts.ED application from v8 to v9. Ts.ED is built on top of Express and uses TypeScript language.
  - - meta
    - name: keywords
      content: migration v8 v9 cache-manager keyv redis ioredis ts.ed express typescript node.js javascript decorators
---

# Migrate from v8 to v9

::: warning
Ts.ED v9 is in progress. This page lists the breaking changes already merged. See the [v9 roadmap](https://github.com/tsedio/tsed/issues/3069).
:::

| Topics                                                  | Migration note                         | Issue                                               |
| ------------------------------------------------------- | -------------------------------------- | --------------------------------------------------- |
| `@tsed/platform-cache` uses cache-manager v7 and Keyv   | [See](#cache-manager-v7)               | [#3556](https://github.com/tsedio/tsed/issues/3556) |
| Cache TTLs are in seconds everywhere                    | [See](#ttl-unit)                       | [#3556](https://github.com/tsedio/tsed/issues/3556) |
| `RedisStore` / `IORedisStore` replaced by Keyv adapters | [See](#redis-and-ioredis-cache-stores) | [#3556](https://github.com/tsedio/tsed/issues/3556) |

## Cache-manager v7

`@tsed/platform-cache` moves from [cache-manager](https://www.npmjs.com/package/cache-manager) v5 to v7. Cache-manager v7 stores its entries
with [Keyv](https://keyv.org) storage adapters. `cache-manager` and `keyv` are dependencies of `@tsed/platform-cache`: you don't need to install them.

### TTL unit

Every TTL of the Ts.ED cache API is in **seconds**: the `cache.ttl` and `cache.refreshThreshold` settings, the `ttl` and `refreshThreshold`
options of `@UseCache`, `PlatformCache.set(key, value, {ttl})`, `PlatformCache.wrap(key, fn, ttl)`, and the value returned by
`PlatformCache.ttl(key)` (remaining seconds).

This was already the documented unit, but cache-manager v5 counted milliseconds: with the default memory store, `ttl: 300` kept an entry
**300 ms**, while the v8 Redis stores kept it 300 s. In v9, `ttl: 300` means 300 seconds for every store.

- If you use Redis (`@tsed/redis`, `@tsed/ioredis`), nothing changes.
- If you use the memory store and relied on milliseconds, divide your TTLs by 1000 (`ttl: 5000` → `ttl: 5`).
- `PlatformCache.ttl(key)` returns seconds for every store (v8 returned seconds with Redis and milliseconds with memory), or `undefined`
  when the key is missing or never expires.
- `{ttl: null}` still disables the expiration.

The raw cache-manager instance (`PlatformCache.cache`) and the Keyv adapters keep the cache-manager / Keyv unit: milliseconds.

### Stores

The `store` option accepts `"memory"` (default), a `Keyv` instance, or a Keyv storage adapter. Stores written for cache-manager v5 and older
(`cache-manager-redis-store`, `cache-manager-ioredis`, `cache-manager-mongoose`, `cache-manager-fs`...) and store factories (`{create}`) are
not supported anymore. Use a Keyv adapter instead:

```diff
- import redisStore from "cache-manager-redis-store";
+ import KeyvRedis from "@keyv/redis";

@Configuration({
  cache: {
    ttl: 300,
-   store: redisStore,
-   host: "localhost",
-   port: 6379
+   store: new KeyvRedis("redis://localhost:6379")
  }
})
```

Extra settings are no longer forwarded to the store: configure the adapter itself. The `max` option still bounds the memory store.

### Multi caching

`caches` (v5 `multiCaching`) is replaced by `stores`:

```diff
@Configuration({
  cache: {
-   caches: [memoryCache, redisCache]
+   stores: ["memory", new KeyvRedis("redis://localhost:6379")]
  }
})
```

### PlatformCache API

| v8                                                            | v9                                                                       |
| ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `PlatformCache.cache`: cache-manager v5 `Cache \| MultiCache` | cache-manager v7 `Cache` (`stores: Keyv[]`, no `store` property)         |
| `$onCreateCacheManager(cache)` receives the v5 cache          | receives the v7 cache                                                    |
| `set(key, value, options?: CachingConfig)`                    | `set(key, value, options?: {ttl?: number \| null})` (seconds)            |
| `ttl(key)` from `cache.store.ttl()`                           | remaining seconds, for every store                                       |
| `keys(...args)` from `cache.store.keys()`                     | `keys(pattern?)`: adapter `keys()` or Keyv iterator, filtered by pattern |
| `reset()` → `cache.reset()`                                   | `reset()` → `cache.clear()` (every store)                                |

With the memory store, `keys(pattern)` now applies the pattern (v8 returned every key).

### Cached entries

Entries are stored in the Keyv format (`{"value": ..., "expires": ...}`). Entries written by v8 are read as misses and overwritten on the next
write: expect a cold cache after the upgrade. You can flush the cache database before deploying.

## Redis and IORedis cache stores

`@tsed/redis` and `@tsed/ioredis` don't provide cache-manager v5 stores anymore. They provide Keyv storage adapters reusing the Ts.ED connection:

| v8                                                                         | v9                               |
| -------------------------------------------------------------------------- | -------------------------------- |
| `RedisStore`, `redisStore`, `RedisStoreCtrOptions` (`@tsed/redis`)         | `RedisKeyvAdapter`               |
| `IORedisStore`, `ioRedisStore`, `IORedisStoreCtrOptions` (`@tsed/ioredis`) | `IORedisKeyvAdapter`             |
| `cache.redisInstance` set by the connection                                | `cache.store` set to the adapter |

If your connection declares `cache: true`, nothing changes in your configuration. If you used the store directly:

```diff
- import {ioRedisStore} from "@tsed/ioredis";
+ import {IORedisKeyvAdapter} from "@tsed/ioredis";

@Configuration({
  cache: {
-   store: ioRedisStore,
-   redisInstance: connection
+   store: new IORedisKeyvAdapter(connection)
  }
})
```

Other changes:

- The adapters don't create connections: give them a connected client or cluster.
- `PlatformCache.keys()` uses `SCAN` (non-blocking) instead of `KEYS`, on every master node of a cluster.
- `PlatformCache.reset()` runs `FLUSHDB` (v8 ran `FLUSHALL`). When the adapter is used in a `Keyv` instance with a namespace, only the keys of
  the namespace are removed.
- `@tsed/redis` and `@tsed/ioredis` don't need `cache-manager` anymore.
