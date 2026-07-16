import {Type, ancestorsOf} from "@tsed/core";
import type {JsonClassStore} from "../components/stores/JsonClassStore.js";
import {getJsonEntityStore} from "../registries/JsonEntitiesContainer.js";

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
        return context.set(model, getJsonEntityStore(model));
      }, new Map());
  }

  return store.$inherited;
}
