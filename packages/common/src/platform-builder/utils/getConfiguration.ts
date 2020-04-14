import {Store, Type} from "@tsed/core";

export function getConfiguration(module: Type<any>, configuration: any = {}) {
  const store = Store.from(module).get("configuration") || {};

  return {...store, ...configuration};
}
