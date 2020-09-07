import {ROUTER_OPTIONS} from "@tsed/common";
import {StoreMerge} from "@tsed/core";
import {RouterOptions} from "@koa/router";

/**
 * Specify the behavior of the router controller.
 *
 * ```typescript
 * @Controller("/")
 * @RouterSettings({sensitive: true})
 * class MyCtrl {
 *
 * }
 * ```
 *
 * Property | Description | Default
 * ---|---|---
 * sensitive | Enable case sensitivity. | Disabled by default, treating “/Foo” and “/foo” as the same.
 * strict | Enable strict routing. | Disabled by default, “/foo” and “/foo/” are treated the same by the router.
 *
 * @returns {(target:any)=>void}
 * @decorator
 * @param routerOptions
 * @koa
 */
export function RouterSettings(routerOptions: RouterOptions): Function {
  return StoreMerge(ROUTER_OPTIONS, routerOptions);
}
