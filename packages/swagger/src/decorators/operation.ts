import {decorateMethodsOf, DecoratorParameters, getDecoratorType, StoreMerge, UnsupportedDecoratorType} from "@tsed/core";
import {Operation as IOperation} from "swagger-schema-official";

/**
 *
 * @param {Operation | any} operation
 * @returns {Function}
 * @decorator
 * @swagger
 */
export function Operation(operation: IOperation | any): Function {
  return (...args: DecoratorParameters) => {
    const type = getDecoratorType(args, true);

    switch (type) {
      case "method":
        return StoreMerge("operation", operation)(...args);

      case "class":
        decorateMethodsOf(args[0], Operation(operation));
        break;

      default:
        throw new UnsupportedDecoratorType(Operation, args);
    }
  };
}
