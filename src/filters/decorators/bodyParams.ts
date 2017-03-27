/**
 * @module filters
 */
/** */
import {BodyParamsFilter} from "../components/BodyParamsFilter";
import {Type} from "../../core/interfaces/Type";
import {ParamsRegistry} from "../../mvc/registries/ParamsRegistry";
/**
 *
 * @param expression
 * @param useType
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function BodyParams(expression?: string | any, useType?: any): Function {

    return <T>(target: Type<T>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamsRegistry.useFilter(BodyParamsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}