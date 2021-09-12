import type {EndpointMetadata, PlatformContext} from "../domain";

/**
 * @ignore
 */
export function bindEndpointMiddleware(endpoint: EndpointMetadata) {
  return (ctx: PlatformContext) => {
    ctx.endpoint = endpoint;
  };
}
