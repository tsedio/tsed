import {decoratorTypeOf, DecoratorTypes, Store, UnsupportedDecoratorType} from "@tsed/core";

import {DI_USE_OPTIONS, DI_USE_PARAM_OPTIONS} from "../constants/constants.js";

/**
 * Add options to invoke the Service.
 *
 * ```typescript
 * import {Injectable, Opts, UseOpts} from "@tsed/di";
 *
 * @Injectable()
 * class MyConfigurableService {
 *   source: string;
 *   constructor(@Opts options: any = {}) {
 *      console.log("Hello ", options.source); // log: Hello Service1 then Hello Service2
 *
 *      this.source = options.source;
 *   }
 * }
 *
 * @Injectable()
 * class MyService1 {
 *   constructor(@UseOpts({source: 'Service1'}) service: MyConfigurableService) {
 *     console.log(service.source) // log: Service1
 *   }
 * }
 *
 * @Injectable()
 * class MyService2 {
 *   constructor(@UseOpts({source: 'Service2'}) service: MyConfigurableService) {
 *     console.log(service.source) // log: Service2
 *   }
 * }
 * ```
 *
 * ::: warning
 * Using @@Opts@@ decorator on a constructor parameter change the Scope of the provider to `ProviderScope.INSTANCE`.
 * :::
 *
 * @returns {Function}
 * @decorator
 * @param options
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
