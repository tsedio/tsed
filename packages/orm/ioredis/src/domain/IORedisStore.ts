import {Store} from "cache-manager";
import Redis, {Cluster} from "ioredis";
import {Callback} from "ioredis/built/types";

async function handle<Response = any>(next: () => Promise<Response>, parse: boolean, cb?: Callback<Response | null>) {
  try {
    let result = await next();

    if (parse) {
      result = result && JSON.parse(result as any);
    }

    if (!cb) {
      return result;
    }

    cb(null, result);
  } catch (er) {
    if (!cb) {
      throw er;
    }

    cb(er, null);
  }
}

export class IORedisStore implements Store {
  public name = "redis";
  public isCacheableValue;
  private redisCache: Redis | Cluster;
  private storeArgs: any;

  constructor(...args: any[]) {
    if (args.length > 0 && args[0].redisInstance) {
      this.redisCache = args[0].redisInstance;
    } else if (args.length > 0 && args[0].clusterConfig) {
      const {nodes, options} = args[0].clusterConfig;

      this.redisCache = new Redis.Cluster(nodes, options || {});
    } else {
      this.redisCache = new (Redis as any)(...args);
    }

    this.storeArgs = this.redisCache.options;
    this.isCacheableValue = this.storeArgs.isCacheableValue || ((value: any) => value !== undefined && value !== null);
  }

  getClient() {
    return this.redisCache;
  }

  set(key: string, value: any, options: any, cb?: Callback<"OK">) {
    if (typeof options === "function") {
      cb = options;
      options = {};
    }

    options = options || {};

    return handle<"OK">(
      async () => {
        if (!this.isCacheableValue(value)) {
          throw new Error(`"${value}" is not a cacheable value`);
        }

        const ttl = options.ttl || options.ttl === 0 ? options.ttl : this.storeArgs.ttl;
        const val = JSON.stringify(value) || '"undefined"';

        if (ttl) {
          return this.redisCache.setex(key, ttl, val);
        }

        return this.redisCache.set(key, val);
      },
      false,
      cb
    );
  }

  get(key: string, options?: any, cb?: Callback<string | null>) {
    if (typeof options === "function") {
      cb = options;
    }

    return handle(() => this.redisCache.get(key), true, cb);
  }

  del(key: string, options: any, cb?: Callback<number>) {
    if (typeof options === "function") {
      cb = options;
    }

    return handle(() => this.redisCache.del(key), false, cb);
  }

  reset(cb?: Callback<"OK">) {
    return handle(() => this.redisCache.flushdb(), false, cb);
  }

  keys(pattern: string, cb: Callback<string[]>) {
    if (typeof pattern === "function") {
      cb = pattern;
      pattern = "*";
    }

    return handle<string[]>(() => this.redisCache.keys(pattern), false, cb);
  }

  ttl(key: string, cb?: Callback<number>) {
    return handle<number>(() => this.redisCache.ttl(key), false, cb);
  }
}

export const ioRedisStore = {create: (...args: any[]) => new IORedisStore(...args)};
