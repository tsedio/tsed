import {s} from "../../fn/index.js";

/**
 * Define generics list. This list is used by @@GenericOf@@ and the @@compile@@ function to build the correct JsonSchema.
 *
 * See @@GenericOf@@ decorator for more details.
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @generics
 * @param genericLabels
 */
export function Generics(...genericLabels: string[]): ClassDecorator {
  return (target: any) => {
    s.get(target).genericLabels(genericLabels);
  };
}
