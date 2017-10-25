import {ParamRegistry} from "../registries/ParamRegistry";
import {ENDPOINT_INFO} from "../constants";

/**
 *
 * @returns {Function}
 * @decorator
 */
export function EndpointInfo(): Function {
    return ParamRegistry.decorate(ENDPOINT_INFO);
}