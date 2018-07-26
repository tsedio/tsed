import {getDecoratorType} from "@tsed/core";
import {Operation} from "./operation";

/**
 * Add consumes metadata on the decorated element.
 *
 * ## Examples
 * ### On method
 *
 * ```typescript
 * class Model {
 *    @Consumes("application/x-www-form-urlencoded")
 *    id: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @swagger
 * @param consumes
 */
export function Consumes(...consumes: string[]) {
  return (...args: any[]) => {
    const type = getDecoratorType(args, true);
    switch (type) {
      case "method":
        return Operation({consumes})(...args);
      default:
        throw new Error("Consumes is only supported on method");
    }
  };
}
