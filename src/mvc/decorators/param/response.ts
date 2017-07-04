/**
 * @module mvc
 */ /** */

import {EXPRESS_RESPONSE} from "../../constants/index";
import {ParamRegistry} from "../../registries/ParamRegistry";
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

            ParamRegistry.useService(EXPRESS_RESPONSE, {
                target,
                propertyKey,
                parameterIndex
            });

        }
    };
}