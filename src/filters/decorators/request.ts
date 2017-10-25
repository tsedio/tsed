/**
 * @module common/mvc
 */
/** */
import {ParamRegistry} from "../registries/ParamRegistry";
import {EXPRESS_REQUEST} from "../constants";

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
    return ParamRegistry.decorate(EXPRESS_REQUEST);
}