import {DecoratorParameters, decoratorTypeOf, DecoratorTypes, StoreSet} from "@tsed/core";

import {DIConfiguration} from "../services/DIConfiguration.js";
import {Inject} from "./inject.js";

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
        return Inject(Configuration)(args[0], args[1], args[2] as number);
    }
  };
}

export type Configuration = TsED.DIConfiguration & DIConfiguration;
