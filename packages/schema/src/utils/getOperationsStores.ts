import {Type} from "@tsed/core";
import {JsonSchemaStore} from "@tsed/schema";
import {getInheritedStores} from "./getInheritedStores";
import {getJsonSchemaStore} from "./getJsonSchemaStore";

export function getOperationStores(target: Type<any> | any): Map<string, JsonSchemaStore> {
  const store: any = target.isStore ? target : getJsonSchemaStore(target);

  if (!store.$operations) {
    const stores = getInheritedStores(store);
    store.$operations = new Map();

    stores.forEach(currentStore => {
      currentStore.children.forEach(propStore => {
        if (propStore.operation) {
          store.$operations.set(propStore.propertyKey, propStore);
        }
      });
    });
  }

  return store.$operations;
}
