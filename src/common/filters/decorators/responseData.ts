import {RESPONSE_DATA} from "../constants";
import {ParamRegistry} from "../registries/ParamRegistry";

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function ResponseData(): Function {
    return ParamRegistry.decorate(RESPONSE_DATA);
}