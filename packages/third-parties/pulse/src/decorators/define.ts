import {Store} from "@tsed/core";

import {DefineOptions, PulseStore} from "../interfaces/PulseStore.js";

export function Define(options: DefineOptions = {}): MethodDecorator {
  return (target: any, propertyKey: string) => {
    const store: PulseStore = {
      define: {
        [propertyKey]: options
      }
    };

    Store.from(target).merge("pulse", store);
  };
}
