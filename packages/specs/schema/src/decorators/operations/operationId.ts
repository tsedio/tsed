import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";

import {JsonEntityFn} from "../common/jsonEntityFn.js";

/**
 * Set a swagger operationId explicitly.
 *
 * @param operationId
 * @decorator
 * @swagger
 * @schema
 * @operation
 */
export function OperationId(operationId: string) {
  return JsonEntityFn((store, args) => {
    if (store.decoratorType !== DecoratorTypes.METHOD) {
      throw new UnsupportedDecoratorType(OperationId, args);
    }

    store.operation!.operationId(operationId);
  });
}
