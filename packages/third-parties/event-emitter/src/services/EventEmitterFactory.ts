import {Configuration, registerProvider} from "@tsed/di";
import {ConstructorOptions, EventEmitter2} from "eventemitter2";

export const EventEmitterService = EventEmitter2;
export type EventEmitterService = EventEmitter2;

registerProvider({
  provide: EventEmitter2,
  deps: [Configuration],
  useFactory(settings: Configuration) {
    const opts = settings.get<ConstructorOptions & {enabled: boolean}>("eventEmitter", {enabled: false});
    return opts.enabled ? new EventEmitter2(opts) : {};
  }
});
