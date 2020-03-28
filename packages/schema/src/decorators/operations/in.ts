import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonParameterTypes} from "../../domain/JsonParameterTypes";
import {JsonSchemaStoreFn} from "../common/jsonSchemaStoreFn";

/**
 *
 * @param inType
 * @decorator
 */
export function In(inType: JsonParameterTypes | string) {
  return JsonSchemaStoreFn((store, args) => {
    if (store.decoratorType !== DecoratorTypes.PARAM) {
      throw new UnsupportedDecoratorType(In, args);
    }

    store.parameter!.in(inType);
  });
}
