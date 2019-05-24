import {Store, StoreFn} from "@tsed/core";

export function StoreMerge(key: any, value: any): Function {
  return StoreFn((store: Store) => {
    store.merge(key, value);
  });
}
