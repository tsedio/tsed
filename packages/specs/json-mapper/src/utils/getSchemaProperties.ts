import {objectKeys} from "@tsed/core";
import {getPropertiesStores, JsonEntityStore} from "@tsed/schema";

export function getSchemaProperties(storedJson: JsonEntityStore, obj: any) {
  const stores = Array.from(getPropertiesStores(storedJson).entries());

  if (!stores.length) {
    // fallback to auto discovering field from obj
    objectKeys(obj).forEach((key) => {
      const propStore = JsonEntityStore.from(storedJson.target, key);
      stores.push([key, propStore]);
    });
  }

  return stores;
}
