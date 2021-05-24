import {DefineOptions as AgendaDefineOptions} from "agenda";
import {Store} from "@tsed/core";
import {AgendaStore} from "../interfaces/AgendaStore";

export interface DefineOptions {
  name?: string;
  options?: AgendaDefineOptions;
}

export function Define(options?: DefineOptions): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const store: AgendaStore = {
      define: {
        [propertyKey]: {
          descriptor,
          options
        }
      }
    };

    Store.from(target).merge("agenda", store);
  };
}
