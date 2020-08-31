import {UseParam} from "./useParam";
import {EndpointMetadata} from "../../models/EndpointMetadata";
import {ParamTypes} from "../../models/ParamTypes";

export type EndpointInfo = EndpointMetadata;

/**
 * Get the current endpoint metadata.
 * @decorator
 * @operation
 * @input
 */
export function EndpointInfo(): Function {
  return UseParam(ParamTypes.ENDPOINT_INFO, {
    useConverter: false,
    useValidation: false
  });
}
