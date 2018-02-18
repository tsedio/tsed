import {ParamRegistry} from "../registries/ParamRegistry";
import {EXPRESS_ERR} from "../constants";

/**
 *
 * @returns {Function}
 * @decorators
 */
export function Err(): Function {
    return ParamRegistry.decorate(EXPRESS_ERR);
}
