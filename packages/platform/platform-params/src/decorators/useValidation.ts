import {ValidationPipe} from "../pipes/ValidationPipe.js";
import {ParamFn} from "./paramFn.js";

/**
 * Enable validation on the decoratored parameter.
 *
 * @decorator
 * @operation
 * @input
 * @pipe
 */
export function UseValidation() {
  return ParamFn((param) => {
    if (param.type || param.collectionType) {
      param.pipes.push(ValidationPipe);
    }
  });
}
