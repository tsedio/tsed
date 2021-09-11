import {ParamTypes, UseParam} from "@tsed/platform-params";
import {EndpointMetadata} from "../../models/EndpointMetadata";

export type EndpointInfo = EndpointMetadata;

/**
 * Get the current endpoint metadata.
 * @decorator
 * @operation
 * @input
 * @deprecated Use `@Context() $ctx: Context` then `$ctx.endpoint` instead.
 */
export function EndpointInfo(): Function {
  return UseParam({
    paramType: ParamTypes.$CTX,
    dataPath: "$ctx.endpoint",
    useConverter: false,
    useValidation: false
  });
}
