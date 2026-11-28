## Why

Ts.ED still depends on cache-manager v5 (`^5.7.6`), while the current major is v7 (7.2.x). cache-manager 6 and 7 moved the store model to [Keyv](https://keyv.org) and no longer export the types Ts.ED uses (`Config`, `FactoryConfig`, `Store`, `Cache` v5 shape, `CachingConfig`, `MultiCache`).

Since the pnpm migration (tsedio/tsed#3549), the published declarations of `@tsed/redis` and `@tsed/ioredis` import these v5 types from `cache-manager`, which is only a development dependency. An app on cache-manager 6/7, or without cache-manager, cannot type-check them with `skipLibCheck: false`. A required `cache-manager@^5` peer was tried and reverted because it blocks installs for apps already on v6/v7. Tracked in tsedio/tsed#3556.

## What Changes

- `@tsed/platform-cache` depends on `cache-manager@^7` and `keyv@^5` and builds its cache with `createCache({stores: Keyv[]})`.
  - `cache.store` accepts `"memory"`, a `Keyv` instance or a Keyv store adapter; new `cache.stores` accepts several of them (multi-tier cache). **BREAKING**: `cache.caches` (v5 `multiCaching`) and v5 store factories (`store: redisStore`, `{create}`) are removed, and extra settings are no longer forwarded to a store factory.
  - `cache.max` keeps bounding the default memory store (LRU, without a new dependency).
  - `PlatformCache.cache` is the v7 `Cache`. `PlatformCache.ttl(key)` returns the remaining time to live in milliseconds for every store (v5 returned seconds for Redis, milliseconds for memory). `reset()` calls `cache.clear()`. `keys(pattern)` works with Ts.ED Redis adapters (native `SCAN`) and with any Keyv store that supports iteration (memory, `@keyv/redis`, ...), filtering with the glob pattern.
  - `set()` options are typed `{ttl?: number}` instead of the v5 `CachingConfig`.
- `@tsed/redis` and `@tsed/ioredis` replace their v5 stores with Keyv store adapters that reuse the Ts.ED connection: `RedisKeyvAdapter` (node-redis) and `IORedisKeyvAdapter` (ioredis). **BREAKING**: `RedisStore`, `redisStore`, `IORedisStore`, `ioRedisStore` and the `RedisStoreCtrOptions` / `IORedisStoreCtrOptions` types are removed. With `cache: true` on a connection, the connection registers its adapter as `cache.store`, as before.
- The adapters declare their own structural types, compatible with Keyv's `KeyvStoreAdapter`, so the published declarations of `@tsed/redis` and `@tsed/ioredis` no longer reference `cache-manager` or `keyv`, and neither package needs them installed.
- Cache entries are stored in the Keyv format (`{"value": ..., "expires": ...}`): entries written by v5 are read as misses and overwritten.
- Migration note in the docs (cache page, Redis/IORedis tutorials, migration guide).

## Capabilities

### New Capabilities

- `platform-cache`: cache-manager v7 cache built from Keyv stores, store settings, TTL and key listing contract of `PlatformCache`.
- `redis-cache-adapters`: Keyv store adapters of `@tsed/redis` and `@tsed/ioredis` and their published type contract.

## Impact

- Packages: `@tsed/platform-cache`, `@tsed/redis`, `@tsed/ioredis`; docs (`docs/docs/cache.md`, `docs/tutorials/redis.md`, `docs/tutorials/ioredis.md`, package readmes); the shared cache tests of `@tsed/platform-test-sdk`.
- Dependencies: `@tsed/platform-cache` moves `cache-manager` from `^5.7.6` to `^7.2.9` and adds `keyv@^5.6.0`. `@tsed/redis` and `@tsed/ioredis` drop the `cache-manager` dev dependency (and keep `keyv` as a dev dependency only, to check type compatibility in tests).
- Apps using a third-party cache-manager v5 store (`cache-manager-redis-store`, ...) must switch to a Keyv adapter.
- Release: shipped as a `feat` in v8 (same approach as the MCP SDK v2 migration), with the breaking changes listed in the migration note.
