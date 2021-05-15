import {DecoratorParameters} from "../../interfaces/DecoratorParameters";
import {AnyDecorator} from "../../interfaces/AnyDecorator";

export function useDecorators(...decorators: AnyDecorator[]): any {
  return (...args: DecoratorParameters) => {
    decorators
      .filter((o: any) => !!o)
      .forEach((decorator: Function) => {
        decorator(...args);
      });
  };
}
