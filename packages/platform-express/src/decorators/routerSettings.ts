import {StoreMerge} from "@tsed/core";
import {PlatformExpressRouterSettings} from "../interfaces/PlatformExpressSettings";

/**
 * Specify the behavior of the router controller.
 *
 * ```typescript
 * @Controller("/")
 * @RouterSettings({mergeParams: true})
 * class MyCtrl {
 *
 * }
 * ```
 *
 * Property | Description | Default
 * ---|---|---
 * caseSensitive | Enable case sensitivity. | Disabled by default, treating “/Foo” and “/foo” as the same.
 * mergeParams | Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence. | false
 * strict | Enable strict routing. | Disabled by default, “/foo” and “/foo/” are treated the same by the router.
 *
 * @returns {(target:any)=>void}
 * @decorator
 * @param routerOptions
 * @express
 */
export function RouterSettings(routerOptions: PlatformExpressRouterSettings): Function {
  return StoreMerge("routerOptions", routerOptions);
}
