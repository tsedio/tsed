import {PlatformContext} from "@tsed/common";
import {EndpointMetadata} from "../../mvc";

/**
 * @ignore
 */
export function bindEndpointMiddleware(endpoint: EndpointMetadata) {
  return (ctx: PlatformContext) => {
    ctx.endpoint = endpoint;
  };
}
