import {Store} from "@tsed/core";

export function StoreSet(key: any, value: any): Function {
  return Store.decorate((store: Store) => {
    store.set(key, value);
  });
}
