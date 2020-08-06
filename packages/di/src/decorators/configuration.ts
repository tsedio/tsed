import {DecoratorParameters, getDecoratorType, StoreSet} from "@tsed/core";
import {Inject} from "../decorators/inject";
import {DIConfiguration} from "../services/DIConfiguration";

export type Configuration = TsED.Configuration & DIConfiguration;

/**
 * Get or set Configuration on a class.
 *
 * @decorator
 */
export function Configuration(configuration: Partial<TsED.Configuration> = {}): Function {
  return (...args: DecoratorParameters) => {
    switch (getDecoratorType(args, true)) {
      case "class":
        StoreSet("configuration", configuration)(args[0]);

        break;
      default:
      case "parameter.constructor":
        return Inject(Configuration)(...args);
    }
  };
}
