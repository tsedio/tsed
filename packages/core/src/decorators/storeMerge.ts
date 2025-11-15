import {Store} from "../types/Store.js";
import {StoreFn} from "./storeFn.js";

/**
 * Creates a decorator that merges a key-value pair into the target's Store metadata.
 *
 * Uses {@link Store.merge} internally to deep-merge the provided value with existing metadata.
 *
 * @public
 * @since v7.0.0
 * @see StoreFn
 * @see Store
 */
export function StoreMerge(key: any, value: any): Function {
  return StoreFn((store: Store) => {
    store.merge(key, value);
  });
}
