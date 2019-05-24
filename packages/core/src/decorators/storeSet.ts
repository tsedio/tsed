import {Store, StoreFn} from "@tsed/core";

export function StoreSet(key: any, value: any): Function {
  return StoreFn((store: Store) => {
    store.set(key, value);
  });
}
