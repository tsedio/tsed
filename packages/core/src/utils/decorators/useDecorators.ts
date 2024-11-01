import {AnyDecorator} from "../../interfaces/AnyDecorator.js";
import {DecoratorParameters} from "../../interfaces/DecoratorParameters.js";

export function useDecorators(...decorators: AnyDecorator[]): any {
  return (...args: DecoratorParameters) => {
    const isMethod = typeof args[2] === "object";
    decorators
      .filter((o: any) => !!o)
      .forEach((decorator: Function) => {
        const descriptor = decorator(...args);

        if (isMethod && typeof descriptor === "object") {
          args[2] = descriptor;
        }
      });

    if (isMethod) {
      return args[2];
    }
  };
}
