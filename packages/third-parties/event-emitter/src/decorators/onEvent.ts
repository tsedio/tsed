import {OnOptions, event, eventNS} from "eventemitter2";
import {EventEmitterStore} from "../interfaces/EventEmitterStore.js";
import {Store} from "@tsed/core";

export function OnEvent(event: event | eventNS, options?: boolean | OnOptions): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const store: EventEmitterStore = {
      onEvent: {
        [propertyKey]: {event, options}
      }
    };

    Store.from(target).merge("eventEmitter", store);
  };
}
