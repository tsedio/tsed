import {DIContext, DIContextOptions} from "@tsed/di";
import {JsonEntityStore} from "@tsed/schema";
import type {APIGatewayProxyEvent, Context} from "aws-lambda";

import {ServerlessRequest} from "./ServerlessRequest.js";
import {ServerlessResponse} from "./ServerlessResponse.js";
import type {ServerlessResponseStream} from "./ServerlessResponseStream.js";

export interface ServerlessContextOptions<Event = APIGatewayProxyEvent> extends DIContextOptions {
  event: Event;
  context: Context;
  responseStream?: ServerlessResponseStream;
  endpoint: JsonEntityStore;
}

export class ServerlessContext<Event extends object = APIGatewayProxyEvent> extends DIContext {
  readonly response: ServerlessResponse<Event>;
  readonly request: ServerlessRequest<Event>;
  readonly context: Context;
  readonly event: Event;
  readonly responseStream: ServerlessResponseStream | undefined;
  readonly endpoint: JsonEntityStore;
  readonly PLATFORM = "SERVERLESS";

  constructor({event, context, endpoint, responseStream, ...options}: ServerlessContextOptions<Event>) {
    super({
      ...options,
      maxStackSize: 0
    });
    this.context = context;
    this.responseStream = responseStream;
    this.event = {
      ...event,
      headers:
        "headers" in event && event.headers
          ? Object.fromEntries(Object.entries(event.headers).map(([key, value]) => [key.toLowerCase(), value]))
          : {}
    };
    this.request = new ServerlessRequest<Event>(this);
    this.response = new ServerlessResponse<Event>(this);
    this.endpoint = endpoint;
  }

  isHttpEvent() {
    return "httpMethod" in this.event;
  }

  isAuthorizerEvent() {
    return "type" in this.event && ["TOKEN", "REQUEST"].includes(this.event.type as string);
  }

  async destroy() {
    await super.destroy();
    this.response.destroy();
  }

  isDone() {
    return this.response.isDone();
  }
}
