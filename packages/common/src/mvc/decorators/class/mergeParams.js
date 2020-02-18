"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routerSettings_1 = require("./routerSettings");
/**
 * Specify the behavior of the router controller.
 *
 * ```typescript
 * @Controller("/")
 * @MergeParams(true)
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
 * @param mergeParams
 * @returns {Function}
 * @decorator
 * @express
 */
function MergeParams(mergeParams = true) {
    return routerSettings_1.RouterSettings({ mergeParams });
}
exports.MergeParams = MergeParams;
//# sourceMappingURL=mergeParams.js.map