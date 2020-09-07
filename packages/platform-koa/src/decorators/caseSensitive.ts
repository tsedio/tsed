import {RouterSettings} from "./routerSettings";

/**
 * Specify the behavior of the router controller.
 *
 * ```typescript
 * @Controller("/")
 * @CaseSensitive(true)
 * class MyCtrl {
 *
 * }
 * ```
 *
 * Property | Description | Default
 * ---|---|---
 * CaseSensitive | Enable case sensitivity. | Disabled by default, treating “/Foo” and “/foo” as the same.
 * Strict | Enable strict routing. | Disabled by default, “/foo” and “/foo/” are treated the same by the router.
 *
 * @returns {Function}
 * @decorator
 * @koa
 * @param sensitive
 */
export function CaseSensitive(sensitive: boolean) {
  return RouterSettings({sensitive});
}
