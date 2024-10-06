import type {Config, FactoryConfig, Store} from "cache-manager";
import {Cluster, ClusterNode, ClusterOptions, Redis, RedisOptions} from "ioredis";

export interface RedisClusterConfig {
  nodes: ClusterNode[];
  options?: ClusterOptions;
}

const getVal = (value: unknown) => JSON.stringify(value) || '"undefined"';

export type IORedisStoreCtrOptions = (RedisOptions | {clusterConfig: RedisClusterConfig}) & Config & {redisInstance?: Redis | Cluster};

export class IORedisStore implements Store {
  public name = "redis";
  /**
   * @deprecated
   */
  public isCacheableValue;
  public isCacheable;
  private redisCache: Redis | Cluster;
  private storeArgs: any;

  constructor(options?: IORedisStoreCtrOptions) {
    options = options || {};

    this.redisCache =
      options.redisInstance ||
      ("clusterConfig" in options ? new Redis.Cluster(options.clusterConfig.nodes, options.clusterConfig.options) : new Redis(options));

    this.storeArgs = this.redisCache.options;
    this.isCacheable = this.isCacheableValue =
      this.storeArgs.isCacheable || this.storeArgs.isCacheableValue || ((value: any) => value !== undefined && value !== null);
  }

  get client() {
    return this.redisCache;
  }

  getClient() {
    return this.redisCache;
  }

  async set(key: string, value: any, ttl?: number) {
    this.assertCacheable(value);

    ttl = this.getTtl(ttl);

    const val = getVal(value);

    if (ttl) {
      await this.redisCache.setex(key, ttl, val);
      return;
    }

    await this.redisCache.set(key, val);
  }

  async get<T = any>(key: string, options?: any) {
    const val = await this.redisCache.get(key);

    if (val === undefined || val === null) {
      return undefined;
    }

    return JSON.parse(val) as T;
  }

  async del(key: string) {
    await this.redisCache.del(key);
  }

  async mset(args: [string, unknown][], ttl?: number) {
    ttl = this.getTtl(ttl);

    if (ttl) {
      const multi = this.redisCache.multi();

      for (const [key, value] of args) {
        this.assertCacheable(value);

        multi.setex(key, ttl / 1000, getVal(value));
      }

      await multi.exec();
    } else
      await this.redisCache.mset(
        args.flatMap(([key, value]) => {
          this.assertCacheable(value);

          return [key, getVal(value)] as [string, string];
        })
      );
  }

  async mget(...args: string[]) {
    const x = await this.redisCache.mget(args);

    return x.map((x) => (x === null || x === undefined ? undefined : (JSON.parse(x) as unknown)));
  }

  async mdel(...args: string[]) {
    await this.redisCache.del(args);
  }

  async reset() {
    await this.redisCache.flushall();
  }

  keys(pattern: string = "*") {
    return this.redisCache.keys(pattern);
  }

  ttl(key: string) {
    return this.redisCache.ttl(key);
  }

  private getTtl(ttl?: number) {
    return ttl === undefined ? this.storeArgs.ttl : ttl;
  }

  private assertCacheable(value: any) {
    if (!this.isCacheable(value)) {
      throw new Error(`"${getVal(value)}" is not a cacheable value`);
    }
  }
}

export const ioRedisStore = (config?: FactoryConfig<any>) => new IORedisStore(config);
