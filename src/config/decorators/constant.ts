import {globalServerSettings} from "../";
import {getClass} from "../../core/utils";

const clone = (o: any) => JSON.parse(JSON.stringify(o));

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
 * @param {string} expression
 * @returns {(targetClass: any, attributeName: string) => any}
 * @decorator
 */
export function Constant(expression: string) {

    return (target: any, propertyKey: string) => {

        if (delete target[propertyKey]) {

            let constant: any;

            const descriptor = {

                get: function () {
                    constant = constant !== undefined ? constant : Object.freeze(clone(globalServerSettings.get(expression)));
                    return constant;
                },

                enumerable: true,
                configurable: true
            };
            Object.defineProperty(getClass(target).prototype, propertyKey, descriptor);
            return descriptor;
        }

    };
}