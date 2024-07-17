import {DIContext, DIContextOptions} from "@tsed/di";
import {JsonEntityStore} from "@tsed/schema";
import {type APIGatewayProxyEvent, Context} from "aws-lambda";
import type {ServerlessEvent} from "./ServerlessEvent";
import {ServerlessRequest} from "./ServerlessRequest.js";
import {ServerlessResponse} from "./ServerlessResponse.js";

export interface ServerlessContextOptions extends DIContextOptions {
  event: ServerlessEvent;
  context: Context;
  endpoint: JsonEntityStore;
}

export class ServerlessContext<Event = APIGatewayProxyEvent> extends DIContext {
  readonly response: ServerlessResponse<Event>;
  readonly request: ServerlessRequest<Event>;
  readonly context: Context;
  readonly event: ServerlessEvent;
  readonly endpoint: JsonEntityStore;
  readonly PLATFORM = "SERVERLESS";

  constructor({event, context, endpoint, ...options}: ServerlessContextOptions) {
    super({
      ...options,
      maxStackSize: 0
    });
    this.context = context;
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

  async destroy() {
    await super.destroy();
    this.response.destroy();
  }

  isDone() {
    return this.response.isDone();
  }
}
