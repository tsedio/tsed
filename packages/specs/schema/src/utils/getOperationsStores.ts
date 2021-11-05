import {Type} from "@tsed/core";
import type {JsonEntityStore} from "../domain/JsonEntityStore";
import {JsonOperationPathsMap} from "../domain/JsonOperationPathsMap";
import {getInheritedStores} from "./getInheritedStores";
import {getJsonEntityStore} from "./getJsonEntityStore";

/**
 * @ignore
 */
export function getOperationsStores<T extends JsonEntityStore = JsonEntityStore>(target: Type<any> | any): Map<string, T> {
  const store: any = target.isStore ? target : getJsonEntityStore(target);

  if (!store.$operations) {
    const stores = getInheritedStores(store);
    const operationPaths = new JsonOperationPathsMap();
    store.$operations = new Map<string, T>();

    stores.forEach((currentStore) => {
      currentStore.children.forEach((propStore) => {
        if (propStore.operation && !store.$operations.has(propStore.propertyKey)) {
          store.$operations.set(propStore.propertyKey, propStore);
        }
      });
    });

    store.$operations.forEach((store: JsonEntityStore) => {
      store.operation?.operationPaths.forEach((operationPath) => {
        operationPaths.setOperationPath(operationPath);
      });
    });

    operationPaths.clear();
  }

  return store.$operations;
}
