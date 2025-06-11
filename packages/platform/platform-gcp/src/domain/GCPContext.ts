import {DIContext, DIContextOptions} from "@tsed/di";
import {JsonEntityStore} from "@tsed/schema";

import {GCPEvent, isHttpEvent} from "./GCPEvent.js";
import {GCPRequest} from "./GCPRequest.js";
import {GCPResponse} from "./GCPResponse.js";
import type {GCPResponseStream} from "./GCPResponseStream.js";

export interface GCPContextOptions extends DIContextOptions {
  event: GCPEvent;
  responseStream?: GCPResponseStream;
  endpoint: JsonEntityStore;
  id: string;
}

export class GCPContext extends DIContext {
  readonly response: GCPResponse;
  readonly request: GCPRequest;
  readonly event: GCPEvent;
  readonly responseStream: GCPResponseStream | undefined;
  readonly endpoint: JsonEntityStore;
  readonly PLATFORM = "GCP";

  constructor({event, endpoint, responseStream, id, ...options}: GCPContextOptions) {
    super({
      ...options,
      maxStackSize: 0
    });

    this.event = event;
    this.responseStream = responseStream;
    this.request = new GCPRequest(this);
    this.response = new GCPResponse(this);
    this.endpoint = endpoint;
  }

  isHttpEvent() {
    return isHttpEvent(this.event);
  }

  isBackgroundEvent() {
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
