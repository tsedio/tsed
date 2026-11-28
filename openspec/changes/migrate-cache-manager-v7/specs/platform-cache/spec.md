## ADDED Requirements

### Requirement: Cache built with cache-manager v7 from Keyv stores

`@tsed/platform-cache` SHALL create its cache with cache-manager v7 `createCache()` when the `cache` setting is enabled, expose it as `PlatformCache.cache` and pass it to `$onCreateCacheManager` listeners. `store` SHALL accept `"memory"` (default), a `Keyv` or a Keyv store adapter; `stores` SHALL accept a list of them (multi-tier, precedence over `store`). An adapter SHALL be wrapped in a `Keyv` without key prefix. Numeric cache options (`ttl`, `refreshThreshold`, ...) SHALL be forwarded.

#### Scenario: Default memory store

- **WHEN** an app sets `cache: {ttl: 1000}` without `store`
- **THEN** `PlatformCache.cache` is a cache-manager v7 cache with one in-memory Keyv store, and a value set without TTL expires after 1000 ms

#### Scenario: Bounded memory store

- **WHEN** an app sets `cache: {max: 2}` and sets three keys in a row
- **THEN** the least recently used key is evicted and `PlatformCache.keys()` returns the two remaining keys

#### Scenario: Keyv store adapter given as store

- **WHEN** an app sets `cache.store` to a Keyv store adapter
- **THEN** `PlatformCache.set("prefix:key", value)` calls the adapter with the key `prefix:key`, without a `keyv:` namespace

#### Scenario: Multi-tier stores

- **WHEN** an app sets `cache.stores` to a memory store and a Keyv store adapter
- **THEN** a value set through `PlatformCache` is written to both stores and a read is served by the first store that holds the key

#### Scenario: Hook receives the v7 cache

- **WHEN** a provider implements `$onCreateCacheManager(cache)`
- **THEN** it is called once at init with the cache-manager v7 `Cache` instance

#### Scenario: Cache disabled

- **WHEN** the `cache` setting is `false` or missing
- **THEN** `PlatformCache.cache` is `undefined`, `wrap()` calls the fetch function directly and `@UseCache` methods are not cached

### Requirement: Uniform TTL in milliseconds

`PlatformCache.ttl(key)` SHALL return the remaining time to live of the key in milliseconds (never negative), or `undefined` when the key is missing or has no expiry, whatever the store. `PlatformCacheRefreshService` SHALL compare this value with the TTL in milliseconds used to cache the entry.

#### Scenario: Remaining TTL of a key

- **WHEN** a key was set with a TTL of 10000 ms, 4000 ms ago
- **THEN** `PlatformCache.ttl(key)` returns a value close to 6000

#### Scenario: Key without expiry

- **WHEN** a key was set without TTL and without default TTL
- **THEN** `PlatformCache.ttl(key)` returns `undefined`

#### Scenario: Background refresh with a Redis adapter

- **WHEN** a `@UseCache({ttl: 10000, refreshThreshold: 2000})` entry stored through a Ts.ED Redis adapter has 1500 ms left and is read
- **THEN** the cached value is returned and the method is called once in background to refresh the entry

### Requirement: Key listing and deletion by pattern

`PlatformCache.keys(pattern?)` SHALL list the keys of the first store: through the adapter `keys(pattern)` when provided, otherwise through the Keyv iterator filtered by the glob `pattern`, otherwise as an empty list. `deleteKeys(pattern)` SHALL delete the keys of `keys(pattern)`; `getMatchingKeys` / `deleteMatchingKeys` SHALL keep matching with `micromatch`. `reset()` SHALL clear every store.

#### Scenario: Pattern on the memory store

- **WHEN** the memory store holds `a:1`, `a:2` and `b:1`
- **THEN** `PlatformCache.keys("a:*")` returns `a:1` and `a:2`, and `deleteKeys("a:*")` leaves only `b:1`

#### Scenario: Store without key listing

- **WHEN** the primary store adapter has neither `keys()` nor a Keyv iterator
- **THEN** `PlatformCache.keys()` returns an empty list

#### Scenario: Reset

- **WHEN** `PlatformCache.reset()` is called
- **THEN** every configured store is cleared

### Requirement: Published declarations type-check

The published declarations of `@tsed/platform-cache` SHALL only reference types from its declared `dependencies` and peer dependencies (`cache-manager@^7`, `keyv@^5`), and SHALL NOT import cache-manager internal paths.

#### Scenario: Consumer with strict lib check

- **WHEN** a consumer project installed with pnpm and `skipLibCheck: false` imports `@tsed/platform-cache`
- **THEN** `tsc --noEmit` reports no error, without installing `cache-manager` or `keyv` in the consumer
