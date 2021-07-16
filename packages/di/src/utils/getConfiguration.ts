import {deepMerge, Store, Type} from "@tsed/core";

export function getConfiguration(module: Type<any>, configuration: any = {}) {
  const store = Store.from(module).get("configuration") || {};

  const config = {
    ...store,
    ...configuration
  };

  if (store.mount && configuration.mount) {
    config.mount = deepMerge(store.mount, configuration.mount);
  }

  if (store.componentsScan && configuration.componentsScan) {
    config.componentsScan = [...store.componentsScan, ...configuration.componentsScan];
  }

  return config;
}
