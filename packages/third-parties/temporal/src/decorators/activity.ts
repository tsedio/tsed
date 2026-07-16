import {ActivityOptions, TEMPORAL_STORE_KEY, TemporalStore} from "../interfaces/TemporalStore.js";
import {Store} from "@tsed/core";

export function Activity(options: ActivityOptions = {}): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const store: TemporalStore = {
      activities: {
        [propertyKey]: options
      }
    };

    Store.from(target).merge(TEMPORAL_STORE_KEY, store);
  };
}
