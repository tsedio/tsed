import {APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, Context} from "aws-lambda";
import {v4} from "uuid";

export function getRequestId(event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>, context: Context) {
  if (event?.headers && event.headers["x-request-id"]) {
    return event.headers["x-request-id"];
  }

  return event?.requestContext?.requestId || context?.awsRequestId || v4().replace(/-/gi, "");
}
