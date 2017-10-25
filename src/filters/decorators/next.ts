import {EXPRESS_NEXT_FN} from "../constants";
import {ParamRegistry} from "../registries/ParamRegistry";

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Next(): Function {
    return ParamRegistry.decorate(EXPRESS_NEXT_FN);
}
