import {EventEmitterStore} from "../interfaces/EventEmitterStore.js";
import {Store} from "@tsed/core";

export function OnAny(): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const store: EventEmitterStore = {
      onAny: {
        [propertyKey]: {}
      }
    };

    Store.from(target).merge("eventEmitter", store);
  };
}
