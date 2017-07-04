/**
 * @module filters
 */
/** */
import {Type} from "../../core/interfaces/Type";
import {QueryParamsFilter} from "../components/QueryParamsFilter";
import {ParamRegistry} from "../../mvc/registries/ParamRegistry";
/**
 *
 * @param expression
 * @param useType
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function QueryParams(expression?: string | any, useType?: any): Function {

    return <T>(target: Type<T>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamRegistry.useFilter(QueryParamsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}
