"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routerSettings_1 = require("./routerSettings");
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
 * MergeParams | Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence. | false
 * Strict | Enable strict routing. | Disabled by default, “/foo” and “/foo/” are treated the same by the router.
 *
 * @param caseSensitive
 * @returns {Function}
 * @decorator
 * @express
 */
function CaseSensitive(caseSensitive) {
    return routerSettings_1.RouterSettings({ caseSensitive });
}
exports.CaseSensitive = CaseSensitive;
//# sourceMappingURL=caseSensitive.js.map