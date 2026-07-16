import {JsonClassStore, JsonMethodStore} from "../components/index.js";
import {JsonOperationPathsMap} from "../domain/index.js";
import {Type} from "@tsed/core";
import {getInheritedStores} from "./getInheritedStores.js";
import {getJsonEntityStore} from "../registries/JsonEntitiesContainer.js";

/**
 * @ignore
 */
export function getOperationsStores<T extends JsonMethodStore = JsonMethodStore>(target: Type<any> | any): Map<string, T> {
  const store: JsonClassStore = getJsonEntityStore(target);

  if (!store.$operations) {
    const operationPaths = new JsonOperationPathsMap();
    store.$operations = new Map<string, T>();

    getInheritedStores(store).forEach((currentStore) => {
      currentStore.children.forEach((propStore) => {
        if (propStore instanceof JsonMethodStore && !store.$operations.has(propStore.propertyKey)) {
          store.$operations.set(propStore.propertyKey, propStore);
        }
      });
    });

    store.$operations.forEach((store: JsonMethodStore) => {
      store.operation.operationPaths.forEach((operationPath) => {
        operationPaths.setOperationPath(operationPath);
      });
    });

    operationPaths.clear();
  }

  return store.$operations;
}
