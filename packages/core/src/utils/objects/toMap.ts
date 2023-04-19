import {isArray} from "./isArray";
import {isString} from "./isString";

export type ToMapIdentityCB<V> = (item: V, index: string | number) => string | string[];
export type ToMapIdentity<V> = string | ToMapIdentityCB<V>;

function createIdentityFn<V>(keyOrFn?: ToMapIdentity<V>): ToMapIdentityCB<V> {
  if (!keyOrFn) {
    return (v, k) => String(k);
  }

  if (isString(keyOrFn)) {
    return (item: any) => {
      return item[keyOrFn as string];
    };
  }

  return keyOrFn;
}

export function toMap<K extends keyof any = any, V = any>(input: Record<K, V> | V[], keyOrFn?: ToMapIdentity<V>): Map<K, V> {
  if (isArray<V>(input)) {
    const identity = createIdentityFn<V>(keyOrFn || "id");
    return input.reduce((map, value, index) => {
      const ids = ([] as string[]).concat(identity(value, index));

      ids.forEach((id) => {
        const item = map.get(id);

        value = item?.merge?.(value) || value;

        map.set(id, value);
      });

      return map;
    }, new Map());
  }

  const identity = createIdentityFn<V>(keyOrFn);

  return Object.entries(input).reduce((map, [key, value]) => {
    return map.set(identity(value as V, key), value);
  }, new Map());
}
