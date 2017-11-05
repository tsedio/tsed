import {globalServerSettings} from "../";
import {getClass} from "../../core/utils";

/**
 * Return value from ServerSettingsService.
 *
 * ## Example
 *
 * ```typescript
 * import {Env} from "ts-express-decorators";
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
 * @param expression
 * @returns {(targetClass: any, attributeName: string) => any}
 * @decorator
 */
export function Value(expression: any) {

    return (target: any, propertyKey: string) => {

        if (delete target[propertyKey]) {

            let value: any;

            const descriptor = {

                get: function () {
                    value = value !== undefined ? value : globalServerSettings.get(expression);
                    return value;
                },

                set: function (v: any) {
                    value = v;
                },

                enumerable: true,
                configurable: true
            };
            Object.defineProperty(getClass(target).prototype, propertyKey, descriptor);
        }

    };
}