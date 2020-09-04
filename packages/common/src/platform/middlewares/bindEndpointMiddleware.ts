import {EndpointMetadata} from "../../mvc";

export function bindEndpointMiddleware(endpoint: EndpointMetadata) {
  return (request: TsED.Request, response: TsED.Response, next: any) => {
    request.$ctx.endpoint = endpoint;
    next();
  };
}
