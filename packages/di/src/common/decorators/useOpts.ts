import {UnsupportedDecoratorType} from "@tsed/core/errors/UnsupportedDecoratorType.js";
import {DecoratorTypes} from "@tsed/core/types/DecoratorTypes.js";
import {Store} from "@tsed/core/types/Store.js";
import {decoratorTypeOf} from "@tsed/core/utils/decoratorTypeOf.js";

import {DI_USE_OPTIONS, DI_USE_PARAM_OPTIONS} from "../constants/constants.js";

/**
 * Pass custom options to an injected provider.
 *
 * Supplies configuration options when injecting a provider that accepts `@Opts`.
 * Works with constructor parameters and property injection.
 *
 * ### Usage
 *
 * ```typescript
 * import {Injectable, Opts, UseOpts} from "@tsed/di";
 *
 * @Injectable()
 * class MyConfigurableService {
 *   source: string;
 *
 *   constructor(@Opts options: any = {}) {
 *     this.source = options.source;
 *   }
 * }
 *
 * @Injectable()
 * class MyService1 {
 *   // Constructor parameter with options
 *   constructor(@UseOpts({source: 'Service1'}) service: MyConfigurableService) {
 *     console.log(service.source); // "Service1"
 *   }
 * }
 *
 * @Injectable()
 * class MyService2 {
 *   // Property injection with options
 *   @Inject(MyConfigurableService)
 *   @UseOpts({source: 'Service2'})
 *   service: MyConfigurableService;
 * }
 * ```
 *
 * ### Warning
 *
 * The injected provider must use `@Opts` to receive these options.
 * Using `@Opts` automatically sets the provider scope to `INSTANCE`.
 *
 * @param options Configuration object to pass to the provider
 * @returns Decorator function (parameter or property)
 * @public
 * @decorator
 */
export function UseOpts(options: {[key: string]: any}): Function {
  return (target: Object, propertyKey: string | symbol, index?: number): any => {
    const bindingType = decoratorTypeOf([target, propertyKey, index]);

    switch (bindingType) {
      case DecoratorTypes.PARAM_CTOR:
        Store.from(target).merge(`${DI_USE_PARAM_OPTIONS}:${index}`, options);
        break;

      case DecoratorTypes.PROP:
        Store.from(target, propertyKey).set(DI_USE_OPTIONS, options);
        break;

      default:
        throw new UnsupportedDecoratorType(UseOpts, [target, propertyKey, index]);
    }
  };
}
