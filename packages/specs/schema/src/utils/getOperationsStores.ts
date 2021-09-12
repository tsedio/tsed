import {Type} from "@tsed/core";
import type {JsonEntityStore} from "../domain/JsonEntityStore";
import {getInheritedStores} from "./getInheritedStores";
import {getJsonEntityStore} from "./getJsonEntityStore";

/**
 * @ignore
 */
export function getOperationsStores<T = JsonEntityStore>(target: Type<any> | any): Map<string, T> {
  const store: any = target.isStore ? target : getJsonEntityStore(target);

  if (!store.$operations) {
    const stores = getInheritedStores(store);
    store.$operations = new Map();

    stores.forEach((currentStore) => {
      currentStore.children.forEach((propStore) => {
        if (propStore.operation && !store.$operations.has(propStore.propertyKey)) {
          store.$operations.set(propStore.propertyKey, propStore);
        }
      });
    });
  }

  return store.$operations;
}
