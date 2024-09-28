import {Store, useDecorators} from "@tsed/core";

import {AgendaStore, EveryOptions} from "../interfaces/AgendaStore.js";
import {Define} from "./define.js";

export function Every(interval: string, options: EveryOptions = {}): MethodDecorator {
  return useDecorators(Define(options), (target: any, propertyKey: string) => {
    const store: AgendaStore = {
      every: {
        [propertyKey]: {...options, interval}
      }
    };
    Store.from(target).merge("agenda", store);
  });
}
