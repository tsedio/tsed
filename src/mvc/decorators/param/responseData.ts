/**
 * @module mvc
 */ /** */

import {Type} from "../../../core/interfaces/Type";
import {RESPONSE_DATA} from "../../constants/index";
import {ParamsRegistry} from "../../registries/ParamsRegistry";
/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function ResponseData(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamsRegistry.useService(RESPONSE_DATA, {
                propertyKey,
                parameterIndex,
                target
            });

        }

    };
}