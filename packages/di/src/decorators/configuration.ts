import {DecoratorParameters, decoratorTypeOf, DecoratorTypes, StoreSet} from "@tsed/core";
import {Inject} from "../decorators/inject";
import {DIConfiguration} from "../services/DIConfiguration";

/**
 * Get or set Configuration on a class.
 *
 * @decorator
 */
export function Configuration(configuration: Partial<TsED.Configuration> = {}): Function {
  return (...args: DecoratorParameters) => {
    switch (decoratorTypeOf(args)) {
      case DecoratorTypes.CLASS:
        StoreSet("configuration", configuration)(args[0]);

        break;
      default:
      case DecoratorTypes.PARAM_CTOR:
        return Inject(Configuration)(...args);
    }
  };
}

export type Configuration = TsED.Configuration & DIConfiguration;
