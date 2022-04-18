import {Store, Type} from "@tsed/core";

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

  const config = {
    ...store,
    ...configuration
  };

  if (store.mount && configuration.mount) {
    config.mount = mergeMount(store.mount, configuration.mount);
  }

  if (store.componentsScan && configuration.componentsScan) {
    config.componentsScan = [...store.componentsScan, ...configuration.componentsScan];
  }

  return config;
}
