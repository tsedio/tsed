import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonSchemaStoreFn} from "../common/jsonSchemaStoreFn";

/**
 *
 * @decorator
 * @param operationId
 */
export function OperationId(operationId: string) {
  return JsonSchemaStoreFn((store, args) => {
    if (store.decoratorType !== DecoratorTypes.METHOD) {
      throw new UnsupportedDecoratorType(OperationId, args);
    }

    store.operation!.operationId(operationId);
  });
}
