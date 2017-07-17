/**
 * @module common/mvc
 */ /** */

import {Type} from "../../../core/interfaces/Type";
import {EXPRESS_NEXT_FN} from "../../constants/index";
import {ParamRegistry} from "../../registries/ParamRegistry";
/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Next(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamRegistry.useService(EXPRESS_NEXT_FN, {
                target,
                propertyKey,
                parameterIndex
            });

        }
    };
}
