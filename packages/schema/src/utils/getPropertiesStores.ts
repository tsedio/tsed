import {Type} from "@tsed/core";
import {JsonSchemaStore} from "../domain/JsonSchemaStore";
import {getInheritedStores} from "./getInheritedStores";
import {getJsonSchemaStore} from "./getJsonSchemaStore";

/**
 * Return the list of properties including properties from inherited classes
 * @param target
 */
export function getPropertiesStores(target: Type<any> | any): Map<string | symbol | number, JsonSchemaStore> {
  const store: any = target.isStore ? target : getJsonSchemaStore(target);

  if (!store.$properties) {
    const stores = getInheritedStores(store);
    store.$properties = new Map();

    stores.forEach(currentStore => {
      currentStore.children.forEach(propStore => {
        store.$properties.set(propStore.propertyKey, propStore);
      });
    });
  }

  return store.$properties;
}
