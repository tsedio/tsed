## Context

cache-manager 7 (`createCache`) is a thin layer over one or more [Keyv](https://keyv.org) instances (`stores: Keyv[]`). Keyv owns serialization (`{"value", "expires"}` JSON), expiry checks and key prefixing (`namespace`, default `keyv`), and delegates storage to a `KeyvStoreAdapter` (`get/set/delete/clear`, optional `getMany/setMany/deleteMany/has/iterator`, plus `on()`). TTLs are milliseconds. `cache.ttl(key)` returns the **expiry timestamp**, not the remaining time. There is no `keys()` and no `store` property any more; key iteration is a Keyv feature (`keyv.iterator`), only enabled for a `Map` store or for adapters whose `opts.dialect` is in Keyv's iterable list (`redis`, `valkey`, `sqlite`, ...).

Today:

- `PlatformCache` calls `caching(store, {...settings})` or `multiCaching(caches)`, reads `cache.store.ttl()` / `cache.store.keys()` and types its settings with v5 `CachingConfig`, `Store` and `FactoryStore` (imported from the internal path `cache-manager/dist/caching.js`).
- `@tsed/redis` / `@tsed/ioredis` ship v5 stores (`RedisStore`, `IORedisStore`) implementing v5 `Store`. With `cache: true` on a connection, `createConnection()` sets `cache.redisInstance = connection` and `cache.store = redisStore` (factory), and the factory picks up `redisInstance` from the forwarded settings.
- Known v5 inconsistencies: the Redis stores return `TTL` in seconds (memory returns milliseconds) and `set()` passes the millisecond TTL to `SETEX` (seconds), while `mset()` divides by 1000. `PlatformCacheRefreshService` compares the store TTL with the configured TTL in milliseconds. The memory store ignores the `keys()` pattern.

## Goals / Non-Goals

**Goals:**

- Run on cache-manager 7 with Keyv stores, keeping the `PlatformCache` / `@UseCache` behaviour (keys, prefixes, TTL, background refresh, `$onCreateCacheManager`).
- Keep `cache: true` on a Ts.ED Redis/IORedis connection working with no extra package.
- Published declarations type-check with `skipLibCheck: false` under pnpm strict `node_modules`.
- Small, documented breaking surface.

**Non-Goals:**

- No compatibility layer for cache-manager v5 stores (v5 is not installed any more; wrapping its stores with `KeyvAdapter` is left to apps that need it and documented).
- No reading of entries written by v5 (it is a cache: entries become misses).
- No new Redis features (pub/sub invalidation, client-side caching).

## Decisions

### 1. `@tsed/platform-cache` builds `createCache({stores})` from normalized Keyv instances

Settings (own types, no v5 types):

```ts
type PlatformCacheStore = "memory" | Keyv | KeyvStoreAdapter;

interface PlatformCacheSettings {
  ttl?: Ttl; // ms, number or (result) => number
  refreshThreshold?: number; // ms
  nonBlocking?: boolean;
  cacheId?: string;
  store?: PlatformCacheStore; // single store (default "memory")
  stores?: PlatformCacheStore[]; // multi-tier, first = primary; wins over `store`
  max?: number; // LRU bound of the memory store
  keyResolver?;
  prefix?;
  ignoreHeaders?; // unchanged
}
```

Normalization: a `Keyv` instance is used as is; an adapter is wrapped with `new Keyv({store: adapter, useKeyPrefix: false})`, so Ts.ED keys keep their current layout in Redis (`<prefix>:<Class>:<method>:<args>`, no `keyv:` prefix) and `cache.prefix` stays the only namespacing knob; `"memory"` becomes `new Keyv({store: new LruMap(max)})` when `max` is set, or a plain `Map` otherwise. Only a numeric `ttl` is forwarded to `createCache` (a function TTL is resolved per call by `PlatformCache`, as today).

`LruMap` is a ~20-line `Map` subclass (evicts the least recently used entry above `max`). Being a `Map`, Keyv enables its iterator, so `keys()` keeps working on the memory store. Alternative considered: `@cacheable/memory` (`lruSize`): adds a dependency and its Keyv adapter has no iterator, so `keys()` would break on the memory store.

Removed: `caches` (v5 `multiCaching`, replaced by `stores`), store factories (`store: redisStore`, `{create}`), and the `[key: string]: any` index signature that existed only to forward arguments to a store factory.

### 2. `PlatformCache` method contract on v7

- `cache`: v7 `Cache` (`CacheManager` stays as a type alias of it).
- `ttl(key)`: `(expires - Date.now()) / 1000` (clamped at 0) or `undefined` when the key is missing or has no TTL.
- `set(key, value, {ttl})`, `get`, `del`, `wrap`: forwarded to v7. `reset()` → `cache.clear()`.
- `keys(pattern?)`, on the primary store (`cache.stores[0]`): if its adapter exposes `keys(pattern)` (Ts.ED Redis adapters), use it; else if the Keyv instance has an `iterator`, collect the keys and filter them with `micromatch` when a pattern is given; else return `[]`. `deleteKeys`, `getMatchingKeys`, `deleteMatchingKeys` keep their current signatures on top of it.

### 2b. TTL unit: seconds in the whole Ts.ED API

The Ts.ED API has always meant seconds: `@UseCache` documents `ttl` "in seconds", `PlatformCacheInterceptor` emits `cache-control: max-age=${ttl}`, the refresh queue uses `ttl: 120`, and the docs explain `ttl: 3600` as one hour. cache-manager v5 and v7 and Keyv count milliseconds (the JavaScript convention of `Date.now()` / `setTimeout`; cache-manager switched from seconds to milliseconds in v5), so v5 silently read the Ts.ED value as milliseconds in memory, while the Ts.ED Redis stores passed it to `SETEX` (seconds).

v9 keeps seconds for every Ts.ED TTL (`cache.ttl`, `cache.refreshThreshold`, `@UseCache` `ttl` / `refreshThreshold`, `PlatformCache.set/wrap/ttl`) and converts at the cache-manager boundary (`× 1000`). `undefined` keeps the default TTL, `null` disables the expiration (Keyv `0`). Only `PlatformCache.cache` (raw cache-manager) and the Keyv adapters work in milliseconds, as their own contracts require. Effects: Redis users keep their values; memory users' entries now live what the docs always said (1000× longer than v5 actually kept them).

### 3. Ts.ED Keyv adapters in `@tsed/redis` and `@tsed/ioredis`

`RedisKeyvAdapter` (node-redis client or cluster) and `IORedisKeyvAdapter` (ioredis `Redis` or `Cluster`) wrap the connection created by the package; they never create or close it. They implement: `get`, `set` (`PX` when a TTL is given), `delete`, `clear`, `has`, `getMany`, `setMany`, `deleteMany`, `keys(pattern = "*")` (non-blocking `SCAN ... MATCH`, on every master node for a cluster), `on()` (`EventEmitter`), with `opts = {dialect: "redis"}` and the `namespace` set by Keyv. When Keyv sets a namespace (an app wrapping the adapter in its own `new Keyv(adapter)`), keys and patterns are prefixed with `<namespace>:` and `keys()` strips it; `clear()` deletes the namespace keys only. Without a namespace (the Ts.ED default), `clear()` runs `FLUSHDB` (v5 ran `FLUSHALL`).

`createConnection()` with `cache: true` sets `cache.store = new RedisKeyvAdapter(connection)` (resp. `IORedisKeyvAdapter`); `cache.redisInstance` is no longer set.

Alternatives considered:

- `@keyv/redis`: fits node-redis only, ships its own `@redis/client` (v5 for Keyv 5, v6 for Keyv 6) which can differ from the app's `redis` version, and has no ioredis counterpart (`@keyv/valkey` uses `iovalkey`). Apps can still pass it as `cache.store`, and `keys()` works with it through the Keyv iterator.
- Keeping the v5 classes and wrapping them with cache-manager's `KeyvAdapter`: keeps the v5 surface but hides `keys()` behind a private field and keeps the TTL unit bugs.

Names change (`RedisStore` → `RedisKeyvAdapter`, ...) because the contract changes completely; keeping the old names would hide the break.

### 4. Type ownership and dependencies

- `@tsed/platform-cache` declarations reference `Cache` (cache-manager) and `Keyv` / `KeyvStoreAdapter` (keyv): both become `dependencies` (`cache-manager@^7.2.9`, `keyv@^5.6.0`, the range cache-manager itself uses, so pnpm dedupes them). Not peers: apps don't need to install them, and a dependency never blocks an install.
- `@tsed/redis` / `@tsed/ioredis` declare their adapter types locally (a structural subset of `KeyvStoreAdapter`), so their declarations import neither `cache-manager` nor `keyv`. A spec assigns each adapter to Keyv's `KeyvStoreAdapter` type (dev dependency `keyv`) and wraps it in a real `Keyv` + `createCache`, so a Keyv contract change fails the type check / tests.

### 5. Release

Part of Ts.ED v9 (epic tsedio/tsed#3069). Shipped as `feat(platform-cache,redis,ioredis)!: ...` with a `BREAKING CHANGE` footer. No legacy support: no alias for the v5 stores, no v5 settings accepted. The breaking changes are listed in the PR and in the v8 → v9 migration note (`docs/introduction/migrate-from-v8.md`).

## Risks / Trade-offs

- [Cold cache after upgrade: v5 entries are read as misses] → documented; entries are overwritten on the next write; an optional `FLUSHDB` is suggested.
- [Apps with third-party v5 stores or `cache.caches` break at type check / boot] → migration note with the Keyv replacement for each case.
- [`clear()` semantics change (`FLUSHALL` → `FLUSHDB`, or namespace only)] → documented; narrower than before.
- [`SCAN` on a large keyspace is slower than `KEYS` for a single call but does not block Redis] → acceptable; `keys()` is used for invalidation, not on the request path.
- [Silent TTL change for memory-store users: v5 read `ttl: 300` as 300 ms in memory (300 s on Redis); v9 reads seconds everywhere, so memory entries live 1000× longer] → first item of the migration note; apps that relied on milliseconds divide their values by 1000.

## Migration Plan

1. Bump dependencies, migrate `PlatformCache` and its tests.
2. Add the adapters, wire `createConnection()`, remove the v5 stores and their specs.
3. Update `platform-test-sdk` cache tests and run them on the platforms.
4. Docs and migration note.
5. Build, type-check a consumer project with `skipLibCheck: false`.

Rollback: revert the PR; no persisted data to migrate back (cache only).

## Open Questions

- Target branch of the PR: no v9 branch exists yet (`alpha` is stale at 8.3.0), and merging a breaking commit into `production` publishes v9 at once.
