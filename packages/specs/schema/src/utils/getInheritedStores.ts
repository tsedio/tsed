import {ancestorsOf, Store, Type} from "@tsed/core";
import type {JsonClassStore} from "../domain/JsonClassStore";
import {getJsonEntityStore} from "./getJsonEntityStore";

/**
 * Return store and his inherited stores
 * @param target
 * @ignore
 */
export function getInheritedStores(target: Type<any> | any): Map<Type<any>, JsonClassStore> {
  const store: JsonClassStore = target.isStore ? target : getJsonEntityStore<JsonClassStore>(target);

  if (!store.$inherited) {
    store.$inherited = ancestorsOf(store.target)
      .reverse()
      .reduce((context, model) => {
        if (Store.has(model)) {
          return context.set(model, getJsonEntityStore(model));
        }
        return context;
      }, new Map());
  }

  return store.$inherited;
}
