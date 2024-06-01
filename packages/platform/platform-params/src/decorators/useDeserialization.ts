import {DeserializerPipe} from "../pipes/DeserializerPipe.js";
import {UsePipe} from "./usePipe.js";

/**
 * Use JsonMapper to deserialize the data.
 *
 * @decorator
 * @operation
 * @input
 * @pipe
 */
export function UseDeserialization(options: any = {}) {
  return UsePipe(DeserializerPipe, options);
}
