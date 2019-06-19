import {EndpointMetadata} from "../../mvc/class/EndpointMetadata";
import {ENDPOINT_INFO} from "../constants";
import {UseFilter} from "./useFilter";

export type EndpointInfo = EndpointMetadata;

/**
 *
 * @returns {Function}
 * @decorator
 */
export function EndpointInfo(): Function {
  return UseFilter(ENDPOINT_INFO);
}
