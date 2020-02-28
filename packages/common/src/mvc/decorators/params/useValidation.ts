import {ValidationPipe} from "../../pipes/ValidationPipe";
import {ParamFn} from "./paramFn";

/**
 *
 * @constructor
 */
export function UseValidation() {
  return ParamFn(param => {
    if (param.type || param.collectionType) {
      param.pipes.push(ValidationPipe);
    }
  });
}
