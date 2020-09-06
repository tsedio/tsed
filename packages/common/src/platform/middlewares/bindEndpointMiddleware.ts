import {EndpointMetadata} from "../../mvc";
import type {PlatformContext} from "../domain/PlatformContext";

/**
 * @ignore
 */
export function bindEndpointMiddleware(endpoint: EndpointMetadata) {
  return (ctx: PlatformContext) => {
    ctx.endpoint = endpoint;
  };
}
