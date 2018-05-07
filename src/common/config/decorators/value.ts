import {getClass} from "@tsed/core";
import {globalServerSettings} from "../services/GlobalSettings";

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
 * @param expression
 * @returns {(targetClass: any, attributeName: string) => any}
 * @decorator
 */
export function Value(expression: any) {

    return (target: any, propertyKey: string) => {

        if (delete target[propertyKey]) {

            let value: any;

            const descriptor = {

                get: () => value !== undefined ? value : globalServerSettings.get(expression),

                set: (v: any) => {
                    value = v;
                },

                enumerable: true,
                configurable: true
            };
            Object.defineProperty(getClass(target).prototype, propertyKey, descriptor);
        }

    };
}