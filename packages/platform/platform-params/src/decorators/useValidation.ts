import {ValidationPipe} from "../pipes/ValidationPipe";
import {ParamFn} from "./paramFn";

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
