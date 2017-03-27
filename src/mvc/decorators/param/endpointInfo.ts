/**
 * @module mvc
 */ /** */

import {Type} from "../../../core/interfaces/Type";
import {ENDPOINT_INFO} from "../../constants/index";
import {ParamsRegistry} from "../../registries/ParamsRegistry";
/**
 *
 * @returns {Function}
 * @decorator
 */
export function EndpointInfo(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamsRegistry.useService(ENDPOINT_INFO, {
                propertyKey,
                parameterIndex,
                target
            });

        }

    };
}