import {DefineOptions, PulseStore} from "../interfaces/PulseStore.js";
import {Store} from "@tsed/core";

export function Define(options: DefineOptions = {}): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const store: PulseStore = {
      define: {
        [propertyKey]: options
      }
    };

    Store.from(target).merge("pulse", store);
  };
}
