import {DecoratorParameters, getDecoratorType, Type} from "@tsed/core";
import {EndpointMetadata} from "../../models/EndpointMetadata";
import {EndpointRegistry} from "../../registries/EndpointRegistry";

/**
 *
 * @param fn
 * @decorator
 */
export function EndpointFn(fn: (endpoint: EndpointMetadata, parameters: DecoratorParameters) => void) {
  return <T>(target: Type<any>, property: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
    if (getDecoratorType([target, property, descriptor]) === "method") {
      fn(EndpointRegistry.get(target, property!), [target, property, descriptor]);

      return descriptor;
    }
  };
}
