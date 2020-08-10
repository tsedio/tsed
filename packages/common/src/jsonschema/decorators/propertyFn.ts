import {DecoratorParameters} from "@tsed/core";
import {PropertyMetadata} from "../../mvc/models/PropertyMetadata";

/**
 * Decorator builder. Call your function with `propertyMetadata` and `DecoratorParameters` a input parameters
 * @decorator
 * @schema
 */
export function PropertyFn(fn: (propertyMetadata: PropertyMetadata, parameters: DecoratorParameters) => void): Function {
  return (...parameters: any[]): any => {
    const propertyMetadata = PropertyMetadata.get(parameters[0], parameters[1]);
    const result: any = fn(propertyMetadata, parameters as DecoratorParameters);
    if (typeof result === "function") {
      result(...parameters);
    }
  };
}
