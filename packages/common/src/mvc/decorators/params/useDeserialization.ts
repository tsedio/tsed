import {DeserializerPipe} from "../../pipes/DeserializerPipe";
import {UsePipe} from "./usePipe";

/**
 * Use JsonMapper to deserialize the data.
 *
 * @decorator
 * @operation
 * @input
 * @pipe
 */
export function UseDeserialization() {
  return UsePipe(DeserializerPipe, {});
}
