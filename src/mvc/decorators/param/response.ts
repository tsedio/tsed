/**
 * @module mvc
 */ /** */

import {EXPRESS_RESPONSE} from "../../constants/index";
import {ParamsRegistry} from "../../registries/ParamsRegistry";
/**
 * Response service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Response(): Function {
    return Res();
}
/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 * @alias Request
 */
export function Res() {
    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamsRegistry.useService(EXPRESS_RESPONSE, {
                target,
                propertyKey,
                parameterIndex
            });

        }
    };
}