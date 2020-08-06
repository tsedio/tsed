import {DecoratorParameters, getDecoratorType, Type} from "@tsed/core";
import {ParamMetadata} from "../../models/ParamMetadata";

/**
 * Get the Param metdata. Use this decorator to compose your own decorator.
 *
 * @param fn
 * @decorator
 * @operation
 * @input
 */
export function ParamFn(fn: (param: ParamMetadata, parameters: DecoratorParameters) => void) {
  return <T>(target: Type<any>, propertyKey: string, index: number): void => {
    if (getDecoratorType([target, propertyKey, index]) === "parameter") {
      fn(ParamMetadata.get(target!, propertyKey!, index), [target, propertyKey, index]);
    }
  };
}
