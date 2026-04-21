import {BaseContext, inject, injectable, ProviderScope, ProviderType, runInContext} from "@tsed/di";

import {PlatformCache} from "./PlatformCache.js";

/**
 * @platform
 */
export class PlatformCacheRefreshService {
  static #refreshLocks = new Map<string, Promise<void>>();

  protected cache = inject(PlatformCache);

  async hasKeyInQueue(key: string) {
    return !!(await this.cache.get(this.cache.buildInternalKey("queue", key)));
  }

  async addKeyToQueue(key: string) {
    await this.cache.set(this.cache.buildInternalKey("queue", key), true, {ttl: 120});
  }

  async deleteKeyFromQueue(key: string) {
    await this.cache.del(this.cache.buildInternalKey("queue", key));
  }

  getRefreshThresholdWithJitter(key: string, refreshThreshold: number) {
    const maxJitter = Math.max(1, Math.floor(refreshThreshold * 0.1));
    const hash = key.split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
    const jitter = Math.abs(hash) % (maxJitter + 1);

    return Math.max(1, refreshThreshold - jitter);
  }

  async hasRefreshCooldown(key: string) {
    return !!(await this.cache.get(this.getRefreshCooldownKey(key)));
  }

  async addRefreshCooldown(key: string, refreshThreshold: number) {
    const cooldownTTL = Math.max(1, Math.floor(refreshThreshold / 2));

    await this.cache.set(this.getRefreshCooldownKey(key), true, {ttl: cooldownTTL});
  }

  async refreshInBackground(
    key: string,
    {
      refreshThreshold,
      ttl,
      cachedTTL
    }: {
      refreshThreshold?: number;
      ttl: any;
      cachedTTL?: number;
    },
    next: Function,
    $ctx?: BaseContext
  ) {
    if (!refreshThreshold) {
      return;
    }

    const release = await this.acquireRefreshLock(key);

    try {
      const inQueue = await this.hasKeyInQueue(key);
      const inCooldown = await this.hasRefreshCooldown(key);

      if (inQueue || inCooldown) {
        return;
      }

      await this.addKeyToQueue(key);

      const currentTTL = await this.cache.ttl(key);
      const calculatedTTL = cachedTTL ?? (typeof ttl === "number" ? ttl : undefined);
      const refreshThresholdWithJitter = this.getRefreshThresholdWithJitter(key, refreshThreshold);

      try {
        if (calculatedTTL !== undefined && (currentTTL === undefined || currentTTL < calculatedTTL - refreshThresholdWithJitter)) {
          await this.addRefreshCooldown(key, refreshThresholdWithJitter);

          if ($ctx) {
            await runInContext($ctx, () => next());
          } else {
            await next();
          }
        }
      } finally {
        await this.deleteKeyFromQueue(key);
      }
    } finally {
      release();
    }
  }

  async acquireRefreshLock(key: string) {
    for (;;) {
      const lock = PlatformCacheRefreshService.#refreshLocks.get(key);

      if (!lock) {
        let releaseFn: (() => void) | undefined;
        const currentLock = new Promise<void>((resolve) => {
          releaseFn = resolve;
        });

        PlatformCacheRefreshService.#refreshLocks.set(key, currentLock);

        return () => {
          if (PlatformCacheRefreshService.#refreshLocks.get(key) === currentLock) {
            PlatformCacheRefreshService.#refreshLocks.delete(key);
          }

          releaseFn?.();
        };
      }

      await lock;
    }
  }

  protected getRefreshCooldownKey(key: string) {
    return this.cache.buildInternalKey("refresh-cooldown", key);
  }
}

injectable(PlatformCacheRefreshService).type(ProviderType.MODULE).scope(ProviderScope.SINGLETON);
