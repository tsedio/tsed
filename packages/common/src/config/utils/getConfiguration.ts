import {deepExtends, Store, Type} from "@tsed/core";

export function getConfiguration(module: Type<any>, configuration: any = {}) {
  return deepExtends(Store.from(module).get("PLATFORM_SETTINGS") || {}, configuration);
}
