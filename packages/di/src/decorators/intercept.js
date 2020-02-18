"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const interfaces_1 = require("../interfaces");
/**
 * Attaches interceptor to method call and executes the before and after methods
 *
 * @param interceptor
 * @param options
 * @decorator
 */
function Intercept(interceptor, options) {
    return (target, propertyKey, descriptor) => {
        core_1.Store.from(target).merge("injectableProperties", {
            [propertyKey]: {
                bindingType: interfaces_1.InjectablePropertyType.INTERCEPTOR,
                propertyKey,
                useType: interceptor,
                options
            }
        });
        return descriptor;
    };
}
exports.Intercept = Intercept;
//# sourceMappingURL=intercept.js.map