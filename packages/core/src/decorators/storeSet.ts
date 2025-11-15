import {Store} from "../types/Store.js";
import {StoreFn} from "./storeFn.js";

/**
 * Creates a decorator that sets a key-value pair in the target's Store metadata.
 *
 * Uses {@link Store.set} internally to directly set the provided value (no merging).
 *
 * @public
 * @since v7.0.0
 * @see StoreFn
 * @see Store
 */
export function StoreSet(key: any, value: any): Function {
  return StoreFn((store: Store) => {
    store.set(key, value);
  });
}
