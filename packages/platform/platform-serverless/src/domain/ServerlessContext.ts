import {DIContext, DIContextOptions} from "@tsed/di";
import {JsonEntityStore} from "@tsed/schema";
import {APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, Context} from "aws-lambda";
import {ServerlessRequest} from "./ServerlessRequest";
import {ServerlessResponse} from "./ServerlessResponse";

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

  constructor({event, context, endpoint, ...options}: ServerlessContextOptions) {
    super({
      ...options,
      maxStackSize: 0
    });
    this.context = context;
    this.event = event;
    this.request = new ServerlessRequest({event, context});
    this.response = new ServerlessResponse({event, context, request: this.request});
    this.endpoint = endpoint;
  }

  async destroy() {
    await super.destroy();

    this.request.destroy();
    this.response.destroy();
  }
}
