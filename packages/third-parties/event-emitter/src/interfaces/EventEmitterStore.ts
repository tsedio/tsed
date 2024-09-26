import type {event, eventNS, OnOptions} from "eventemitter2";

export interface EventEmitterStore {
  onEvent?: {[propertyKey: string]: {event: event | eventNS; options?: boolean | OnOptions}};
  onAny?: {[propertyKey: string]: {}};
}
