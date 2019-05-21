import {decorateMethodsOf, DecoratorParameters, getDecoratorType, StoreMerge, UnsupportedDecoratorType} from "@tsed/core";
import {Response} from "swagger-schema-official";

/**
 *
 * @param {string | number} status
 * @param {Response} response
 * @returns {Function}
 * @decorator
 * @swagger
 */
export function Responses(status: string | number, response: Response): Function {
  return (...args: DecoratorParameters) => {
    const type = getDecoratorType(args, true);

    switch (type) {
      case "method":
        return StoreMerge("responses", {[status]: response})(...args);

      case "class":
        decorateMethodsOf(args[0], Responses(status, response));
        break;

      default:
        throw new UnsupportedDecoratorType(Responses, args);
    }
  };
}
