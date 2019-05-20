import {Store} from "@tsed/core";

export function StoreMerge(key: any, value: any): Function {
  return Store.decorate((store: Store) => {
    store.merge(key, value);
  });
}
