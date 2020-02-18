"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const InjectablePropertyType_1 = require("../interfaces/InjectablePropertyType");
/**
 * Return value from Configuration.
 *
 * ## Example
 *
 * ```typescript
 * import {Env} from "@tsed/core";
 * import {Constant, Value} from "@tsed/common";
 *
 * export class MyClass {
 *
 *    @Constant("env")
 *    env: Env;
 *
 *    @Value("swagger.path")
 *    swaggerPath: string;
 *
 *    @Value("swagger.path", "defaultValue")
 *    swaggerPath: string;
 *
 *    constructor() {
 *       console.log(this.swaggerPath) // undefined. Not available on constructor
 *    }
 *
 *    $onInit() {
 *      console.log(this.swaggerPath)  // something
 *    }
 * }
 * ```
 *
 * @param expression
 * @param defaultValue
 * @returns {(targetClass: any, attributeName: string) => any}
 * @decorator
 */
function Value(expression, defaultValue) {
    return (target, propertyKey) => {
        core_1.Store.from(target).merge("injectableProperties", {
            [propertyKey]: {
                bindingType: InjectablePropertyType_1.InjectablePropertyType.VALUE,
                propertyKey,
                expression,
                defaultValue
            }
        });
    };
}
exports.Value = Value;
//# sourceMappingURL=value.js.map