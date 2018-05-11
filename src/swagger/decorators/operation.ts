import {DecoratorParameters, Store} from "@tsed/core";
import {Operation} from "swagger-schema-official";

/**
 *
 * @param {Operation | any} operation
 * @returns {Function}
 * @decorator
 * @swagger
 */
export function Operation(operation: Operation | any) {
  return Store.decorate((store: Store, parameters: DecoratorParameters) => {
    store.merge("operation", operation);
  });
}
