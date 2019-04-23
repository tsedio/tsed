import {EndpointMetadata} from "../../mvc/class/EndpointMetadata";
import {ENDPOINT_INFO} from "../constants";
import {ParamRegistry} from "../registries/ParamRegistry";

export type EndpointInfo = EndpointMetadata;

/**
 *
 * @returns {Function}
 * @decorator
 */
export function EndpointInfo(): Function {
  return ParamRegistry.decorate(ENDPOINT_INFO);
}
