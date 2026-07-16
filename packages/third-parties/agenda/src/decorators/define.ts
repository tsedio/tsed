import {AgendaStore, DefineOptions} from "../interfaces/AgendaStore.js";
import {Store} from "@tsed/core";

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
