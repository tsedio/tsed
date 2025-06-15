import {DIContext, DIContextOptions} from "@tsed/di";
import {JsonEntityStore} from "@tsed/schema";

import {type GCPBackgroundEvent, GCPEvent, type GCPHttpEvent, isHttpEvent} from "./GCPEvent.js";
import {GCPRequest} from "./GCPRequest.js";
import {GCPResponse} from "./GCPResponse.js";

export interface GCPContextOptions extends DIContextOptions {
  event: GCPEvent;
  endpoint: JsonEntityStore;
  id: string;
}

export class GCPContext extends DIContext {
  readonly response: GCPResponse;
  readonly request: GCPRequest;
  readonly event: GCPEvent;
  readonly endpoint: JsonEntityStore;
  readonly PLATFORM = "GCP";

  constructor({event, endpoint, ...options}: GCPContextOptions) {
    super({
      ...options,
      maxStackSize: 0
    });

    this.event = event;
    this.request = new GCPRequest(this);
    this.response = new GCPResponse(this);
    this.endpoint = endpoint;
  }

  isHttpEvent(): this is GCPContext & {event: GCPHttpEvent} {
    return isHttpEvent(this.event);
  }

  isBackgroundEvent(): this is GCPContext & {event: GCPBackgroundEvent} {
    return !this.isHttpEvent();
  }

  async destroy() {
    await super.destroy();
    this.response.destroy();
  }

  isDone() {
    return this.response.isDone();
  }
}
