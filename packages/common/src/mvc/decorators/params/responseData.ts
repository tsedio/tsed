import {ParamTypes} from "@tsed/platform-params";
import {UseParam} from "@tsed/platform-params";

/**
 * Return the current response data. Prefer the @@Context@@ decorator to get or set data.
 *
 * @decorator
 * @operation
 * @input
 * @deprecated Use `@Context() $ctx: Context` then $ctx.data.
 */
export function ResponseData(): ParameterDecorator {
  return UseParam({
    paramType: ParamTypes.$CTX,
    dataPath: "$ctx.data"
  });
}
