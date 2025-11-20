import {classOf} from "@tsed/core/utils/classOf.js";

import {DI_USE_PARAM_OPTIONS} from "../constants/constants.js";
import {ProviderScope} from "../domain/ProviderScope.js";
import {Inject} from "./inject.js";
import {Scope} from "./scope.js";

/**
 * Inject custom options passed to a provider instance.
 *
 * Used in configurable providers to receive options from the injection context.
 * Automatically changes the provider scope to `INSTANCE` since each invocation may have different options.
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
 *     console.log("Hello", options.source);
 *     this.source = options.source;
 *   }
 * }
 *
 * @Injectable()
 * class MyService1 {
 *   constructor(@UseOpts({source: 'Service1'}) service: MyConfigurableService) {
 *     console.log(service.source); // "Service1"
 *   }
 * }
 *
 * @Injectable()
 * class MyService2 {
 *   constructor(@UseOpts({source: 'Service2'}) service: MyConfigurableService) {
 *     console.log(service.source); // "Service2"
 *   }
 * }
 * ```
 *
 * ### Warning
 *
 * Using `@Opts` changes the provider scope to `ProviderScope.INSTANCE`,
 * meaning a new instance is created for each injection.
 *
 * @param target The target class
 * @param propertyKey The constructor method name
 * @param index The parameter index
 * @returns Parameter decorator
 * @public
 * @decorator
 */
export function Opts(target: any, propertyKey: string | symbol | undefined, index: number) {
  Scope(ProviderScope.INSTANCE)(classOf(target));
  Inject(DI_USE_PARAM_OPTIONS)(target, propertyKey, index);
}
