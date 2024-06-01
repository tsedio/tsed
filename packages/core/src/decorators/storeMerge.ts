import {Store} from "../domain/Store.js";
import {StoreFn} from "./storeFn.js";

export function StoreMerge(key: any, value: any): Function {
  return StoreFn((store: Store) => {
    store.merge(key, value);
  });
}
