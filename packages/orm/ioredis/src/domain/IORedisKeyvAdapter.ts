import {EventEmitter} from "node:events";
import type {Cluster, Redis} from "ioredis";

/**
 * Keyv store adapter backed by an ioredis connection (`Redis` or `Cluster`).
 *
 * It reuses the connection created by `@tsed/ioredis` and never opens or closes it.
 * Compatible with Keyv's `KeyvStoreAdapter` contract: use it as `cache.store` of `@tsed/platform-cache`,
 * or with `new Keyv({store: new IORedisKeyvAdapter(connection)})`.
 *
 * TTLs are in milliseconds (Keyv contract).
 */
export class IORedisKeyvAdapter extends EventEmitter {
  readonly opts: {dialect: "redis"} = {dialect: "redis"};
  /**
   * Set by Keyv. When defined, `keys()` and `clear()` are scoped to `<namespace>:*`.
   */
  namespace?: string;

  constructor(readonly client: Redis | Cluster) {
    super();
  }

  private get isCluster() {
    return (this.client as Cluster).isCluster === true;
  }

  async get<Value = string>(key: string): Promise<Value | undefined> {
    const value = await this.client.get(key);

    return (value ?? undefined) as Value | undefined;
  }

  async getMany<Value = string>(keys: string[]): Promise<Array<Value | undefined>> {
    if (!keys.length) {
      return [];
    }

    const values = this.isCluster ? await Promise.all(keys.map((key) => this.client.get(key))) : await this.client.mget(keys);

    return values.map((value) => (value ?? undefined) as Value | undefined);
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    if (ttl) {
      await this.client.set(key, value, "PX", ttl);
    } else {
      await this.client.set(key, value);
    }

    return true;
  }

  async setMany(entries: Array<{key: string; value: any; ttl?: number}>): Promise<void> {
    await Promise.all(entries.map(({key, value, ttl}) => this.set(key, value, ttl)));
  }

  async has(key: string): Promise<boolean> {
    return (await this.client.exists(key)) > 0;
  }

  async delete(key: string): Promise<boolean> {
    return (await this.client.del(key)) > 0;
  }

  async deleteMany(keys: string[]): Promise<boolean> {
    if (!keys.length) {
      return false;
    }

    const counts = this.isCluster ? await Promise.all(keys.map((key) => this.client.del(key))) : [await this.client.del(keys)];

    return counts.reduce((total, count) => total + count, 0) > 0;
  }

  /**
   * Removes the keys of the namespace, or flushes the current database when no namespace is set.
   */
  async clear(): Promise<void> {
    if (this.namespace) {
      await this.deleteMany(await this.scan(`${this.namespace}:*`));
      return;
    }

    await Promise.all(this.nodes().map((node) => node.flushdb()));
  }

  /**
   * Lists the keys matching the glob `pattern` with `SCAN` (on every master node for a cluster).
   * Keys are returned without the namespace prefix.
   */
  async keys(pattern: string = "*"): Promise<string[]> {
    const prefix = this.namespace ? `${this.namespace}:` : "";
    const keys = await this.scan(prefix + pattern);

    return prefix ? keys.map((key) => key.slice(prefix.length)) : keys;
  }

  private async scan(pattern: string): Promise<string[]> {
    const keys = new Set<string>();

    for (const node of this.nodes()) {
      for await (const batch of node.scanStream({match: pattern, count: 100})) {
        for (const key of batch as string[]) {
          keys.add(key);
        }
      }
    }

    return [...keys];
  }

  private nodes(): Redis[] {
    return this.isCluster ? (this.client as Cluster).nodes("master") : [this.client as Redis];
  }
}
