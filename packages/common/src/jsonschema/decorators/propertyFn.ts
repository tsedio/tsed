import {DecoratorParameters} from "@tsed/core";
import {JsonEntityFn} from "@tsed/schema";
import {PropertyMetadata} from "../../mvc/models/PropertyMetadata";

/**
 * Decorator builder. Call your function with `propertyMetadata` and `DecoratorParameters` a input parameters
 * @decorator
 * @schema
 */
export function PropertyFn(fn: (propertyMetadata: PropertyMetadata, parameters: DecoratorParameters) => void): Function {
  return JsonEntityFn(fn);
}
