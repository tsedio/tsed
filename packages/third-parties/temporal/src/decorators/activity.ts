import {Store} from "@tsed/core";

import {ActivityOptions, TEMPORAL_STORE_KEY, TemporalStore} from "../interfaces/TemporalStore.js";

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
