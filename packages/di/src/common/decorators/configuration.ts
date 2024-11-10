import {DecoratorParameters, decoratorTypeOf, DecoratorTypes} from "@tsed/core";

import {configuration} from "../fn/configuration.js";
import {DIConfiguration} from "../services/DIConfiguration.js";
import {Inject} from "./inject.js";

/**
 * Get or set Configuration on a class.
 *
 * @decorator
 */
export function Configuration(): any;
export function Configuration(settings: Partial<TsED.Configuration>): ClassDecorator;
export function Configuration(settings: Partial<TsED.Configuration> = {}): Function {
  return (...args: DecoratorParameters) => {
    switch (decoratorTypeOf(args)) {
      case DecoratorTypes.CLASS:
        configuration(args[0], settings);

        break;
      default:
      case DecoratorTypes.PARAM_CTOR:
        return Inject(Configuration)(args[0], args[1], args[2] as number);
    }
  };
}

export type Configuration = TsED.DIConfiguration & DIConfiguration;
