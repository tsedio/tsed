import {DecoratorParameters} from "@tsed/core/types/DecoratorParameters.js";
import {DecoratorTypes} from "@tsed/core/types/DecoratorTypes.js";
import {decoratorTypeOf} from "@tsed/core/utils/decoratorTypeOf.js";

import {configuration} from "../fn/configuration.js";
import {injectable} from "../fn/injectable.js";
import {injector} from "../fn/injector.js";
import {DIConfiguration} from "../services/DIConfiguration.js";
import {Inject} from "./inject.js";

/**
 * Associate configuration with a class or inject configuration into a constructor parameter.
 *
 * When used as a class decorator, stores configuration metadata on the provider.
 * When used as a parameter decorator, injects the `DIConfiguration` instance.
 *
 * ### Usage
 *
 * ```typescript
 * import {Configuration, Module} from "@tsed/di";
 *
 * // As class decorator
 * @Configuration({
 *   rootDir: __dirname,
 *   port: 3000,
 *   mount: {
 *     "/api": []
 *   }
 * })
 * @Module({})
 * export class Server {}
 *
 * // As parameter decorator
 * @Injectable()
 * export class MyService {
 *   constructor(@Configuration() config: Configuration) {
 *     console.log(config.get("port"));
 *   }
 * }
 * ```
 *
 * @param settings Optional configuration object to associate with the class
 * @returns Decorator function (class or parameter)
 * @public
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
        return Inject(DIConfiguration)(args[0], args[1], args[2] as number);
    }
  };
}

export type Configuration = TsED.Configuration & DIConfiguration;

// To maintain compatibility with the previous implementation, we need to declare Configuration as
// injectable token.
injectable(Configuration).factory(() => injector().settings);
