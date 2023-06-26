import {classOf} from "@tsed/core";
import {DI_PARAM_OPTIONS} from "../constants/constants";
import {ProviderScope} from "../domain/ProviderScope";
import {Inject} from "./inject";
import {Scope} from "./scope";

/**
 * Get instance options. This options depending on his invocation context.
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
 * @param target
 * @param propertyKey
 * @param index
 * @decorator
 */
export function Opts(target: any, propertyKey: string | symbol, index: number) {
  Scope(ProviderScope.INSTANCE)(classOf(target));
  Inject(DI_PARAM_OPTIONS)(target, propertyKey, index);
}
