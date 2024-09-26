import type {AnyDecorator} from "../../interfaces/AnyDecorator.js";
import type {DecoratorParameters} from "../../interfaces/DecoratorParameters.js";

export function useDecorators(...decorators: AnyDecorator[]): any {
  return (...args: DecoratorParameters) => {
    decorators
      .filter((o: any) => !!o)
      .forEach((decorator: Function) => {
        decorator(...args);
      });
  };
}
