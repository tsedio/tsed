import {getClass} from "@tsed/core";
import {globalServerSettings} from "../services/GlobalSerttings";

const clone = (o: any) => {
    if (o) {
        return Object.freeze(JSON.parse(JSON.stringify(o)));
    }
    return undefined;
};

/**
 * Return value from ServerSettingsService.
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
 * }
 * ```
 *
 * @param {string} expression
 * @returns {(targetClass: any, attributeName: string) => any}
 * @decorator
 */
export function Constant(expression: string): any {

    return (target: any, propertyKey: string) => {

        if (delete target[propertyKey]) {
            const descriptor = {

                get: function () {
                    return clone(globalServerSettings.get(expression));
                },

                enumerable: true,
                configurable: true
            };
            Object.defineProperty(getClass(target).prototype, propertyKey, descriptor);
            return descriptor;
        }

    };
}