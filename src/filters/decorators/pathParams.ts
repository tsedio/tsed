/**
 * @module filters
 */ /** */

import {PathParamsFilter} from "../components/PathParamsFilter";
import {Type} from "../../core/interfaces/Type";
import {ParamRegistry} from "../../mvc/registries/ParamRegistry";
/**
 *
 * @param expression
 * @param useType
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function PathParams(expression?: string | any, useType?: any): Function {

    return <T>(target: Type<T>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamRegistry.useFilter(PathParamsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}