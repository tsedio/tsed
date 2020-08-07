import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonParameterTypes} from "../../domain/JsonParameterTypes";
import {JsonEntityFn} from "../common/jsonEntityFn";

/**
 * Add a input parameter.
 *
 * ::: warning
 * Don't use decorator with Ts.ED application. Use @@BodyParams@@, @@PathParams@@, etc... instead.
 * :::
 *
 * @param inType
 * @decorator
 * @swagger
 * @schema
 * @input
 * @operation
 */
export function In(inType: JsonParameterTypes | string) {
  return JsonEntityFn((store, args) => {
    if (store.decoratorType !== DecoratorTypes.PARAM) {
      throw new UnsupportedDecoratorType(In, args);
    }

    store.parameter!.in(inType);
  });
}
