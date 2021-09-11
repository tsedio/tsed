import {DecoratorParameters, decoratorTypeOf, DecoratorTypes, Type} from "@tsed/core";
import {ParamMetadata} from "../domain/ParamMetadata";

/**
 * Get the Param metadata. Use this decorator to compose your own decorator.
 *
 * @param fn
 * @decorator
 * @operation
 * @input
 */
export function ParamFn(fn: (param: ParamMetadata, parameters: DecoratorParameters) => void): ParameterDecorator {
  return <T>(target: Type<any>, propertyKey: string, index: number): void => {
    if (decoratorTypeOf([target, propertyKey, index]) === DecoratorTypes.PARAM) {
      fn(ParamMetadata.get(target!, propertyKey!, index), [target, propertyKey, index]);
    }
  };
}
