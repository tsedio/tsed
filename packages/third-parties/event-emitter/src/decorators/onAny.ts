import {Store} from "@tsed/core";

import {EventEmitterStore} from "../interfaces/EventEmitterStore.js";

export function OnAny(): MethodDecorator {
  return (target: any, propertyKey: string) => {
    const store: EventEmitterStore = {
      onAny: {
        [propertyKey]: {}
      }
    };

    Store.from(target).merge("eventEmitter", store);
  };
}
