import {DecoratorParameters} from "../../interfaces/DecoratorParameters";
import {AnyDecorator} from "../../interfaces/AnyDecorator";

/**
 * @deprecated Since 2020-11-28. Use useDecorators function.
 * @param decorators
 */
export function applyDecorators(...decorators: (any | ClassDecorator | MethodDecorator | PropertyDescriptor | ParameterDecorator)[]): any {
  return useDecorators(...decorators);
}

export function useDecorators(...decorators: AnyDecorator[]): any {
  return (...args: DecoratorParameters) => {
    decorators
      .filter((o: any) => !!o)
      .forEach((decorator: Function) => {
        decorator(...args);
      });
  };
}
