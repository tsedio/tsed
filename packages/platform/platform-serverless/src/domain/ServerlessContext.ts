import {DIContext, DIContextOptions} from "@tsed/di";
import {JsonEntityStore} from "@tsed/schema";
import {APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, Context} from "aws-lambda";
import {ServerlessRequest} from "./ServerlessRequest.js";
import {ServerlessResponse} from "./ServerlessResponse.js";

export interface ServerlessContextOptions extends DIContextOptions {
  event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;
  context: Context;
  endpoint: JsonEntityStore;
}

export class ServerlessContext extends DIContext {
  readonly response: ServerlessResponse;
  readonly request: ServerlessRequest;
  readonly context: Context;
  readonly event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;
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
      headers: Object.fromEntries(Object.entries(event.headers || {}).map(([key, value]) => [key.toLowerCase(), value]))
    };
    this.request = new ServerlessRequest(this);
    this.response = new ServerlessResponse(this);
    this.endpoint = endpoint;
  }

  async destroy() {
    await super.destroy();
    this.response.destroy();
  }

  isDone() {
    return this.response.isDone();
  }
}
