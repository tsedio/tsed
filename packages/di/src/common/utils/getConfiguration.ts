import type {Type} from "@tsed/core";
import {Store} from "@tsed/core";

export function mergeMount(m1: any = {}, m2: any = {}) {
  return Object.entries(m2).reduce((mount, [key, controllers]) => {
    return {
      ...mount,
      [key]: (mount[key] || []).concat(controllers)
    };
  }, m1);
}

export function getConfiguration(module: Type<any>, configuration: any = {}) {
  const store = Store.from(module).get("configuration") || {};

  return {
    ...store,
    ...configuration,
    mount: mergeMount(store.mount, configuration.mount)
  };
}
