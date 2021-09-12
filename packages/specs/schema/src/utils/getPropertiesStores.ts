import {Type} from "@tsed/core";
import type {JsonEntityStore} from "../domain/JsonEntityStore";
import {alterIgnore} from "../hooks/alterIgnore";
import {getInheritedStores} from "./getInheritedStores";
import {getJsonEntityStore} from "./getJsonEntityStore";

/**
 * Return the list of properties including properties from inherited classes
 * @param target
 * @ignore
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

/**
 * @ignore
 */
export interface GetPropertiesOptions {
  withIgnoredProps?: boolean;
  groups?: string[] | false;

  [type: string]: any;
}

/**
 * @ignore
 */
export function getProperties<T extends JsonEntityStore = JsonEntityStore>(target: Type<any> | any, options: GetPropertiesOptions = {}) {
  const stores = getPropertiesStores<T>(target);
  const map: Map<string | symbol | number, T> = new Map();

  stores.forEach((store, key) => {
    if (!options.withIgnoredProps) {
      if (alterIgnore(store.itemSchema, options)) {
        return;
      }
    }

    map.set(key, store);
  });

  return map;
}
