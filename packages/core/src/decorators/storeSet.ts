import {Store} from "../domain/Store.js";
import {StoreFn} from "./storeFn.js";

export function StoreSet(key: any, value: any): Function {
  return StoreFn((store: Store) => {
    store.set(key, value);
  });
}
