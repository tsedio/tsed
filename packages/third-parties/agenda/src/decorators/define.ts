import {Store} from "@tsed/core";

import {AgendaStore, DefineOptions} from "../interfaces/AgendaStore.js";

export function Define(options: DefineOptions = {}): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const store: AgendaStore = {
      define: {
        [propertyKey]: options
      }
    };

    Store.from(target).merge("agenda", store);
  };
}
