import {Store} from "@tsed/core";
import {DefineOptions, JobOptions} from "agenda";
import {Define} from "./define";
import {AgendaStore} from "../interfaces/AgendaStore";

export interface EveryOptions {
  interval: string;
  name?: string;
  options?: JobOptions & DefineOptions;
}

export function Every(options: EveryOptions): MethodDecorator {
  const define = Define({name: options.name, options: options.options});

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    define(target, propertyKey, descriptor);

    const store: AgendaStore = {
      every: {
        [propertyKey]: {
          options
        }
      }
    };

    Store.from(target).merge("agenda", store);
  };
}
