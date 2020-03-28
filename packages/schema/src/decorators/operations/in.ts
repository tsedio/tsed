import {DecoratorTypes, UnsupportedDecoratorType} from "@tsed/core";
import {JsonParameterTypes} from "../../domain/JsonParameterTypes";
import {JsonEntityFn} from "../common/jsonEntityFn";

/**
 *
 * @param inType
 * @decorator
 */
export function In(inType: JsonParameterTypes | string) {
  return JsonEntityFn((store, args) => {
    if (store.decoratorType !== DecoratorTypes.PARAM) {
      throw new UnsupportedDecoratorType(In, args);
    }

    store.parameter!.in(inType);
  });
}
