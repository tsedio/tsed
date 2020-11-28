import {Store} from "../domain/Store";
import {StoreFn} from "./storeFn";

export function StoreSet(key: any, value: any): Function {
  return StoreFn((store: Store) => {
    store.set(key, value);
  });
}
