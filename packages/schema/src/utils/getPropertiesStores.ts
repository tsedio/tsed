import {Type} from "@tsed/core";
import {JsonEntityStore} from "../domain/JsonEntityStore";
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

    stores.forEach(currentStore => {
      currentStore.children.forEach(propStore => {
        if (!store.$properties.has(propStore.propertyKey)) {
          store.$properties.set(propStore.propertyKey, propStore);
        }
      });
    });
  }

  return store.$properties;
}
