import {Store} from "@tsed/core";

import type {ActivityOptions, TemporalStore} from "../interfaces/TemporalStore.js";
import {TEMPORAL_STORE_KEY} from "../interfaces/TemporalStore.js";

export function Activity(options: ActivityOptions = {}): MethodDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const store: TemporalStore = {
      activities: {
        [propertyKey]: options
      }
    };

    Store.from(target).merge(TEMPORAL_STORE_KEY, store);
  };
}
