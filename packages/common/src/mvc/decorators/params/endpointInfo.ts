import {UseFilter} from "./useFilter";
import {EndpointMetadata} from "../../models/EndpointMetadata";
import {ParamTypes} from "../../models/ParamTypes";

export type EndpointInfo = EndpointMetadata;

/**
 *
 * @returns {Function}
 * @decorator
 */
export function EndpointInfo(): Function {
  return UseFilter(ParamTypes.ENDPOINT_INFO, {
    useConverter: false,
    useValidation: false
  });
}
