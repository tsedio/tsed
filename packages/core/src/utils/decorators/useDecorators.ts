import {DecoratorParameters} from "../../interfaces/DecoratorParameters.js";
import {AnyDecorator} from "../../interfaces/AnyDecorator.js";

export function useDecorators(...decorators: AnyDecorator[]): any {
  return (...args: DecoratorParameters) => {
    decorators
      .filter((o: any) => !!o)
      .forEach((decorator: Function) => {
        decorator(...args);
      });
  };
}
