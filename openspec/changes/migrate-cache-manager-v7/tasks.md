## 1. `@tsed/platform-cache` on cache-manager v7

- [x] 1.1 Bump `cache-manager` to `^7.2.9`, add `keyv@^5.6.0` to `dependencies`, update the lockfile.
- [x] 1.2 Replace the v5 types of `interfaces.ts` with Ts.ED settings types (`PlatformCacheStore`, `store`, `stores`, `max`, numeric settings); drop `caches`, store factories and the index signature.
- [x] 1.3 Add `LruMap` (memory store bounded by `max`) with unit tests.
- [x] 1.4 Migrate `PlatformCache`: `createCache({stores})` with normalized Keyv stores, `ttl()` in remaining ms, `reset()` → `clear()`, `keys()` (adapter `keys()`, Keyv iterator + micromatch, else `[]`), `set()` options type.
- [x] 1.5 Check `PlatformCacheRefreshService` / `PlatformCacheInterceptor` against the ms TTL and update their specs.
- [x] 1.6 Update `PlatformCache.spec.ts` to cover the scenarios of `specs/platform-cache`.

## 2. Redis adapters

- [x] 2.1 `@tsed/redis`: add `RedisKeyvAdapter` (+ local adapter types), remove `RedisStore` / `redisStore`, wire `createConnection()` to `cache.store`, regenerate barrels.
- [x] 2.2 `@tsed/ioredis`: same with `IORedisKeyvAdapter`.
- [x] 2.3 Specs: adapter contract (PX TTL, getMany/setMany/deleteMany, SCAN keys, namespace, clear, cluster scan), use through `Keyv` + `createCache`, assignability to `KeyvStoreAdapter`, `createConnection()` registration.
- [x] 2.4 Drop the `cache-manager` dev dependency of both packages; add `keyv` (and `cache-manager` if the specs use `createCache`) as dev dependencies only.

## 3. Shared tests and docs

- [x] 3.1 Update `platform-test-sdk` cache tests if needed and run them through `pnpm test:platform`.
- [x] 3.2 Update `docs/docs/cache.md`, `docs/tutorials/redis.md`, `docs/tutorials/ioredis.md` and the package readmes for v7 / Keyv stores.
- [x] 3.3 Write the v8 → v9 migration note (`docs/introduction/migrate-from-v8.md`, TTL unit first) (breaking changes and replacements: `caches` → `stores`, v5 stores → Keyv adapters, `RedisStore` → `RedisKeyvAdapter`, TTL unit, cold cache, `clear()`).

## 4. Verification

- [x] 4.1 `pnpm test:platform`, `pnpm test:orm`, `pnpm test:lint`, `pnpm exec tsc --build` on Node 24.
- [x] 4.2 Build the packages and type-check a consumer project (pnpm, `skipLibCheck: false`) importing `@tsed/platform-cache`, `@tsed/redis`, `@tsed/ioredis` without `cache-manager` / `keyv` installed.
- [x] 4.3 `openspec validate migrate-cache-manager-v7`.
