import {DecoratorParameters, getDecoratorType, Type} from "@tsed/core";
import {ParamMetadata} from "../../models/ParamMetadata";
import {ParamRegistry} from "../../registries/ParamRegistry";

/**
 * Return the paramMetadata
 * @param fn
 * @decorator
 */
export function ParamFn(fn: (param: ParamMetadata, parameters: DecoratorParameters) => void) {
  return <T>(target: Type<any>, propertyKey: string, index: number): void => {
    if (getDecoratorType([target, propertyKey, index]) === "parameter") {
      fn(ParamRegistry.get(target!, propertyKey!, index), [target, propertyKey, index]);
    }
  };
}
