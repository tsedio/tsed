import {ParamRegistry} from "../registries/ParamRegistry";
import {EXPRESS_RESPONSE} from "../constants";

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
    return ParamRegistry.decorate(EXPRESS_RESPONSE);
}