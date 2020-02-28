import {DeserializerPipe} from "../../pipes/DeserializerPipe";
import {UsePipe} from "./usePipe";

/**
 *
 * @constructor
 */
export function UseDeserialization() {
  return UsePipe(DeserializerPipe, {});
}
