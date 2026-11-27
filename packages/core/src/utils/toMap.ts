import {isArray} from "./isArray.js";
import {isString} from "./isString.js";

/**
 * Callback function type for generating map keys from items.
 *
 * @public
 * @since v7.0.0
 */
export type ToMapIdentityCB<V> = (item: V, index: string | number) => string | string[];

/**
 * Identity type for map key generation, either a property name or callback function.
 *
 * @public
 * @since v7.0.0
 */
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

/**
 * Converts an array or object to a Map using a key extraction strategy.
 *
 * @public
 * @since v7.0.0
 */
function setItem(map: Map<any, any>, id: any, value: any) {
  const item = map.get(id);

  value = item?.merge?.(value) || value;
  map.set(id, value);

  return value;
}

export function toMap<K extends keyof any = any, V = any>(input: Record<K, V> | V[], keyOrFn?: ToMapIdentity<V>): Map<K, V> {
  if (isArray<V>(input)) {
    const identity = createIdentityFn<V>(keyOrFn || "id");
    const map = new Map();

    // plain loops: no array per item for the ids and no closure per item. Holes are skipped, as reduce() did
    for (let index = 0; index < input.length; index++) {
      if (!(index in input)) {
        continue;
      }

      let value: any = input[index];
      const ids = identity(value, index);

      if (Array.isArray(ids)) {
        for (let i = 0; i < ids.length; i++) {
          // holes are skipped, as forEach() did
          if (i in ids) {
            value = setItem(map, ids[i], value);
          }
        }
      } else {
        setItem(map, ids, value);
      }
    }

    return map;
  }

  const identity = createIdentityFn<V>(keyOrFn);
  const map = new Map();
  const keys = Object.keys(input);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = (input as any)[key];

    map.set(identity(value as V, key), value);
  }

  return map;
}
