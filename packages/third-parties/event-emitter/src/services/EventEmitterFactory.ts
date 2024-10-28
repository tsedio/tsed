import {Configuration, registerProvider} from "@tsed/di";
import type {ConstructorOptions} from "eventemitter2";
import eventEmitter2 from "eventemitter2";

export const EventEmitterService = eventEmitter2.EventEmitter2;
export type EventEmitterService = eventEmitter2.EventEmitter2;

registerProvider({
  provide: eventEmitter2.EventEmitter2,
  deps: [Configuration],
  useFactory(settings: Configuration) {
    const opts = settings.get<ConstructorOptions & {enabled: boolean}>("eventEmitter", {enabled: false});
    return opts.enabled ? new eventEmitter2.EventEmitter2(opts) : {};
  }
});
