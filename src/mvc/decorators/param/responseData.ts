/**
 * @module common/mvc
 */ /** */

import {Type} from "../../../core/interfaces/Type";
import {RESPONSE_DATA} from "../../constants/index";
import {ParamRegistry} from "../../registries/ParamRegistry";
/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function ResponseData(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamRegistry.useService(RESPONSE_DATA, {
                propertyKey,
                parameterIndex,
                target
            });

        }

    };
}