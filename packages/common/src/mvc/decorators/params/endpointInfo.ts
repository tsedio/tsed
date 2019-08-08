import {EndpointMetadata} from "@tsed/common";
import {ENDPOINT_INFO} from "../../../filters/constants";
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
