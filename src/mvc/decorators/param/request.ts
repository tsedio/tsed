/**
 * @module common/mvc
 */
/** */
import {EXPRESS_REQUEST} from "../../constants/index";
import {ParamRegistry} from "../../registries/ParamRegistry";
/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Request(): Function {
    return Req();
}
/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 * @alias Request
 */
export function Req() {
    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamRegistry.useService(EXPRESS_REQUEST, {
                target,
                propertyKey,
                parameterIndex
            });

        }
    };
}