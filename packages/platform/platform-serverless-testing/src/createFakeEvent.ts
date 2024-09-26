import type {APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase} from "aws-lambda";

export function createFakeEvent(event: Partial<APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>> = {}) {
  return {
    body: "",
    headers: {},
    httpMethod: "",
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path: event.path || "/",
    pathParameters: {},
    queryStringParameters: {},
    resource: "",
    stageVariables: {},
    ...event,
    requestContext: {
      ...event?.requestContext,
      accountId: "",
      apiId: "",
      protocol: "https",
      httpMethod: "",
      identity: {} as any,
      path: event.path || "/",
      stage: "",
      requestId: "requestId",
      requestTimeEpoch: 0,
      resourceId: 1,
      resourcePath: event.path || "/"
    } as any
  } as APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;
}
