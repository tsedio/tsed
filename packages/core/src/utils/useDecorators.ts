import {AnyDecorator} from "../types/AnyDecorator.js";
import {DecoratorParameters} from "../types/DecoratorParameters.js";

/**
 * Combines multiple decorators into a single decorator function.
 *
 * @public
 * @since v7.0.0
 */
export function useDecorators(...decorators: AnyDecorator[]): any {
  // filtered once, when the decorators are combined, instead of on each application (startup cost, cold starts)
  const list = decorators.filter((o: any) => !!o);

  return (...args: DecoratorParameters) => {
    const isMethod = typeof args[2] === "object";
    list.forEach((decorator: Function) => {
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
