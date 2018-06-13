import {getDecoratorType} from "@tsed/core";
import {Operation} from "./operation";

/**
 * Add produces metadata on the decorated element.
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * class Model {
 *    @Produces("text/html")
 *    id: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @swagger
 * @param produces
 */
export function Produces(...produces: string[]) {
  return (...args: any[]) => {
    const type = getDecoratorType(args);
    switch (type) {
      case "method":
        return Operation({produces})(...args);
      default:
        throw new Error("Produces is only supported on method");
    }
  };
}
