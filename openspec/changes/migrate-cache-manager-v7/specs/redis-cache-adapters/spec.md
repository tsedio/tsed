## ADDED Requirements

### Requirement: Keyv store adapters for Ts.ED Redis connections

`@tsed/redis` SHALL export `RedisKeyvAdapter` (node-redis) and `@tsed/ioredis` SHALL export `IORedisKeyvAdapter` (ioredis), from their main and `./cache` entries. Each adapter SHALL wrap an existing connection, client or cluster, without opening or closing it, and SHALL implement the Keyv store adapter contract with TTLs in milliseconds. The v5 stores (`RedisStore`, `redisStore`, `IORedisStore`, `ioRedisStore`) SHALL be removed.

#### Scenario: Use with Keyv and cache-manager v7

- **WHEN** an adapter wrapping a connection is passed to `new Keyv({store: adapter})` and to `createCache({stores: [keyv]})`
- **THEN** `set`, `get`, `del`, `mget`, `mset` and `ttl` of the cache work against the connection

#### Scenario: TTL in milliseconds

- **WHEN** the adapter receives `set("key", value, 1500)`
- **THEN** the key is written with a 1500 ms expiry (`PX 1500`)

#### Scenario: Connection kept open

- **WHEN** the cache is disconnected or the adapter is garbage collected
- **THEN** the Ts.ED connection is not closed by the adapter

### Requirement: Key listing and namespace

Each adapter SHALL provide `keys(pattern = "*")` using `SCAN ... MATCH` (on every master node for a cluster). When Keyv sets a namespace on the adapter, keys and patterns SHALL be prefixed with `<namespace>:` and `keys()` SHALL return keys without the prefix, and `clear()` SHALL delete the namespace keys only. Without a namespace, `clear()` SHALL flush the current database.

#### Scenario: Keys by pattern

- **WHEN** the database holds `a:1`, `a:2` and `b:1` and `keys("a:*")` is called
- **THEN** it returns `a:1` and `a:2`

#### Scenario: Namespaced keys

- **WHEN** the adapter is used by `new Keyv({store: adapter, namespace: "app"})` that sets `k`
- **THEN** Redis holds `app:k`, `adapter.keys()` returns `k`, and `clear()` removes `app:*` keys only

### Requirement: Cache store registration from the connection

When a `@tsed/redis` or `@tsed/ioredis` connection declares `cache: true` and the app enables the `cache` setting, the connection SHALL register its adapter as `cache.store`, so `@tsed/platform-cache` stores its entries in that connection.

#### Scenario: Connection used as cache store

- **WHEN** an app declares a Redis connection with `cache: true` and `cache: {ttl: 1000}`
- **THEN** after boot `PlatformCache` writes its entries through the adapter of that connection

#### Scenario: Cache setting disabled

- **WHEN** a connection declares `cache: true` but the app has no `cache` setting
- **THEN** no cache store is registered

### Requirement: Self-contained published declarations

The published declarations of `@tsed/redis` and `@tsed/ioredis` SHALL NOT import `cache-manager` or `keyv`; the adapter types SHALL be declared by the package and SHALL stay assignable to Keyv's `KeyvStoreAdapter`.

#### Scenario: Consumer without cache libraries

- **WHEN** a consumer project installed with pnpm and `skipLibCheck: false` imports `@tsed/redis` or `@tsed/ioredis` without installing `cache-manager` or `keyv`
- **THEN** `tsc --noEmit` reports no error

#### Scenario: Keyv contract check

- **WHEN** the package type-checks its specs
- **THEN** assigning an adapter to Keyv's `KeyvStoreAdapter` type compiles
