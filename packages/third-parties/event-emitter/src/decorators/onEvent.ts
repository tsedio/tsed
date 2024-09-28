import {Store} from "@tsed/core";
import {event, eventNS, OnOptions} from "eventemitter2";

import {EventEmitterStore} from "../interfaces/EventEmitterStore.js";

export function OnEvent(event: event | eventNS, options?: boolean | OnOptions): MethodDecorator {
  return (target: any, propertyKey: string) => {
    const store: EventEmitterStore = {
      onEvent: {
        [propertyKey]: {event, options}
      }
    };

    Store.from(target).merge("eventEmitter", store);
  };
}
