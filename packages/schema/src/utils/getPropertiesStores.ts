import {Type} from "@tsed/core";
import {JsonEntityStore} from "../domain/JsonEntityStore";
import {alterIgnore} from "../hooks/ignoreHook";
import {getInheritedStores} from "./getInheritedStores";
import {getJsonEntityStore} from "./getJsonEntityStore";

/**
 * Return the list of properties including properties from inherited classes
 * @param target
 */
export function getPropertiesStores<T extends JsonEntityStore = JsonEntityStore>(
  target: Type<any> | any
): Map<string | symbol | number, T> {
  const store: any = target.isStore ? target : getJsonEntityStore(target);

  if (!store.$properties) {
    const stores = getInheritedStores(store);
    store.$properties = new Map();

    stores.forEach((currentStore) => {
      currentStore.children.forEach((propStore) => {
        if (!store.$properties.has(propStore.propertyKey)) {
          store.$properties.set(propStore.propertyKey, propStore);
        }
      });
    });
  }

  return store.$properties;
}

export interface GetPropertiesOptions {
  withIgnoredProps?: boolean;

  [type: string]: any;
}

export function getProperties(target: Type<any>, options: GetPropertiesOptions = {}) {
  const stores = getPropertiesStores(target);

  stores.forEach((store, key) => {
    if (!options.withIgnoredProps) {
      if (alterIgnore(store.itemSchema, {})) {
        stores.delete(key);
      }
    }
  });

  return stores;
}
