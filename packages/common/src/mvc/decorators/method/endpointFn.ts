import {DecoratorParameters, getDecoratorType, Type} from "@tsed/core";
import {EndpointMetadata} from "../../models/EndpointMetadata";

/**
 *
 * @param fn
 * @decorator
 */
export function EndpointFn(fn: (endpoint: EndpointMetadata, parameters: DecoratorParameters) => void): MethodDecorator {
  return <T>(target: Type<any>, property: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {
    if (getDecoratorType([target, property, descriptor]) === "method") {
      fn(EndpointMetadata.get(target, property!), [target, property, descriptor]);

      return descriptor;
    }
  };
}
