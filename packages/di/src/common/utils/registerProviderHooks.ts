import {$on} from "@tsed/hooks";

import {Provider} from "../domain/Provider.js";

export function registerHooks(provider: Provider, instance: any) {
  if (provider.hooks) {
    Object.entries(provider.hooks).forEach(([event, cb]) => {
      const callback = (...args: any[]) => cb(instance, ...args);

      $on(event, provider.token, callback);
    });
  }
}
