import {EndpointMetadata} from "../../mvc";

export function bindEndpointMiddleware(endpoint: EndpointMetadata) {
  return (request: any, response: any, next: any) => {
    request.ctx.endpoint = endpoint;
    next();
  };
}
