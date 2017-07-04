/**
 * @module mvc
 */ /** */

import {Type} from "../../../core/interfaces/Type";
import {EXPRESS_ERR} from "../../constants/index";
import {ParamRegistry} from "../../registries/ParamRegistry";
/**
 *
 * @returns {Function}
 * @decorator
 */
export function Err(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamRegistry.useService(EXPRESS_ERR, {
                propertyKey,
                parameterIndex,
                target
            });

        }
    };
}
