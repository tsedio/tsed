import {JsonSchema} from "../domain/JsonSchema.js";
import {from} from "./from.js";

/**
 * Declare a new object model.
 *
 *  * See @@JsonSchema@@ to discover available methods.
 */
export function object(properties: {[key: string]: JsonSchema} = {}): JsonSchema {
  return from(Object).properties(properties);
}
