/**
 * `Map` bounded to `max` entries: once full, setting a new key evicts the least recently used entry.
 * Used as the `"memory"` store of `@tsed/platform-cache` when the `max` setting is given.
 * Being a `Map`, Keyv can iterate on it (`PlatformCache.keys()`).
 */
export class LruMap<K = string, V = unknown> extends Map<K, V> {
  constructor(readonly max: number) {
    super();
  }

  get(key: K): V | undefined {
    if (!super.has(key)) {
      return undefined;
    }

    const value = super.get(key) as V;

    // move the key to the most recently used position
    super.delete(key);
    super.set(key, value);

    return value;
  }

  set(key: K, value: V): this {
    if (super.has(key)) {
      super.delete(key);
    } else if (this.max > 0 && this.size >= this.max) {
      super.delete(super.keys().next().value as K);
    }

    return super.set(key, value);
  }
}
